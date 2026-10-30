import * as THREE from "three";

// Contact scout — a small quadcopter that springs toward a target point (canvas px),
// banks into its motion, tracks the cursor with its sensor eye and docks on a pad.

const AMBER = 0xf59e0b;

export type DroneHandle = {
  setTarget: (x: number, y: number) => void;
  setHome: (x: number, y: number) => void;
  setLook: (x: number, y: number) => void;
  setActive: (on: boolean) => void;
  resize: () => void;
  dispose: () => void;
};

export function mountDrone(
  canvas: HTMLCanvasElement,
  opts: { size: () => number; engaged: () => boolean; onFrame?: (x: number, y: number, settled: boolean) => void }
): DroneHandle | null {
  let R: THREE.WebGLRenderer;
  try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return null; }
  const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  R.setClearColor(0x000000, 0);

  const S = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100); cam.position.set(0, 0, 20);
  S.add(new THREE.HemisphereLight(0xe2e8f0, 0x0f172a, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-3, 6, 8); S.add(key);
  const warm = new THREE.DirectionalLight(AMBER, 1.2); warm.position.set(5, -2, 4); S.add(warm);

  const shell = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.35, metalness: 0.2 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.3 });
  const amber = new THREE.MeshBasicMaterial({ color: AMBER, transparent: true });
  const blade = new THREE.MeshBasicMaterial({ color: 0xcbd5e1, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false });

  const root = new THREE.Group(); S.add(root);
  const bank = new THREE.Group(); root.add(bank);
  const yaw = new THREE.Group(); bank.add(yaw);

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 20), shell); body.scale.set(1.25, 0.55, 1); yaw.add(body);
  const belly = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.18, 0.5), dark); belly.position.y = -0.32; yaw.add(belly);
  const eyeMount = new THREE.Group(); eyeMount.position.set(0, -0.12, 0.6); yaw.add(eyeMount);
  eyeMount.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), dark));
  const eye = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), amber.clone()); eye.position.z = 0.19; eyeMount.add(eye);
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6), dark); antenna.position.set(-0.3, 0.45, -0.3); yaw.add(antenna);
  const tipLed = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), amber.clone()); tipLed.position.set(-0.3, 0.7, -0.3); yaw.add(tipLed);

  const rotors: THREE.Group[] = [];
  const glows: THREE.Mesh[] = [];
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sz], i) => {
    const ax = sx * 0.95, az = sz * 0.75;
    const arm = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(ax, az), 0.08, 0.12), dark);
    arm.position.set(ax / 2, 0.05, az / 2); arm.rotation.y = -Math.atan2(az, ax); yaw.add(arm);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.18, 12), dark); motor.position.set(ax, 0.12, az); yaw.add(motor);
    const guard = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.035, 8, 32), shell); guard.rotation.x = Math.PI / 2; guard.position.set(ax, 0.2, az); yaw.add(guard);
    const rot = new THREE.Group(); rot.position.set(ax, 0.24, az); rot.userData.dir = i % 3 === 0 ? 1 : -1; yaw.add(rot);
    for (let b = 0; b < 2; b++) {
      const bl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.09), blade); bl.rotation.x = -Math.PI / 2; bl.rotation.z = (b * Math.PI) / 2; rot.add(bl);
    }
    rotors.push(rot);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), amber.clone()); led.position.set(ax, 0.02, az + sz * 0.5); yaw.add(led); glows.push(led);
  });

  // docking pad
  const pad = new THREE.Group(); pad.rotation.x = 0.35; S.add(pad);
  pad.add(new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.08, 40), dark));
  const padRing = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.03, 6, 48), amber.clone()); padRing.rotation.x = Math.PI / 2; padRing.position.y = 0.05; pad.add(padRing);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.05; pad.add(shadow);

  let W = 1, H = 1, visW = 1, visH = 1, run = true, dead = false, raf = 0, last = 0, t = 0, point = 0;
  const pos = { x: -1, y: -1 }, vel = { x: 0, y: 0 }, tgt = { x: 0, y: 0 }, home = { x: -1, y: -1 }, look = { x: 0, y: 0 };

  function resize() {
    const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); R.setSize(W, H, false);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    visH = 2 * cam.position.z * Math.tan((cam.fov * Math.PI) / 360); visW = visH * cam.aspect;
  }
  const toWorld = (x: number, y: number, out: THREE.Vector3) => out.set((x / W - 0.5) * visW, (0.5 - y / H) * visH, 0);
  const ease = (cur: number, k: number, goal: number, f: number) => cur + (goal - cur) * (1 - Math.pow(1 - k, f));
  const op = (m: THREE.Mesh, v: number) => { (m.material as THREE.MeshBasicMaterial).opacity = v; };

  function frame(ts: number) {
    raf = requestAnimationFrame(frame);
    const dtMs = Math.min(48, ts - (last || ts)); last = ts;
    if (!run || dead) return;
    const r = canvas.getBoundingClientRect();
    if (r.bottom < -40 || r.top > window.innerHeight + 40) return;
    if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) resize();
    const dt = dtMs / 1000, f = dtMs / 16.67; t += reduce ? 0 : dt;

    if (pos.x < 0 || reduce) { pos.x = tgt.x; pos.y = tgt.y; vel.x = vel.y = 0; }
    else {
      // under-damped spring: overshoots slightly, then settles
      vel.x = (vel.x + (tgt.x - pos.x) * 0.02 * f) * Math.pow(0.86, f);
      vel.y = (vel.y + (tgt.y - pos.y) * 0.02 * f) * Math.pow(0.86, f);
      pos.x += vel.x * f; pos.y += vel.y * f;
    }
    const size = opts.size(), sc = ((size / H) * visH) / 2.6;
    const bob = reduce ? 0 : (Math.sin(t * 1.8) * 0.02 + Math.sin(t * 3.1 + 1) * 0.006) * size;
    toWorld(pos.x, pos.y + bob, root.position); root.scale.setScalar(sc);

    bank.rotation.z = ease(bank.rotation.z, 0.1, Math.max(-0.4, Math.min(0.4, -vel.x * 0.015)) + Math.sin(t * 1.3) * 0.02, f);
    bank.rotation.x = ease(bank.rotation.x, 0.1, 0.25 + Math.max(-0.3, Math.min(0.3, vel.y * 0.01)), f);
    point = ease(point, 0.07, opts.engaged() ? 1 : 0, f);
    const lx = Math.max(-1, Math.min(1, (look.x - pos.x) / 500)), ly = Math.max(-1, Math.min(1, (look.y - pos.y) / 500));
    yaw.rotation.y = ease(yaw.rotation.y, 0.05, lx * 0.6 * (1 - point) + Math.sin(t * 0.4) * 0.06, f);
    eyeMount.rotation.x = ease(eyeMount.rotation.x, 0.08, ly * 0.45 + point * 0.3, f);

    const spin = (reduce ? 0 : 1) * (18 + Math.min(20, Math.hypot(vel.x, vel.y) * 1.2)) * dt;
    rotors.forEach(rt => { rt.rotation.y += rt.userData.dir * spin; });
    const pulse = 0.5 + 0.5 * Math.sin(t * 3.4);
    glows.forEach(g => op(g, 0.55 + 0.45 * pulse));
    op(eye, Math.min(1, 0.75 + 0.25 * pulse + point * 0.2));
    op(tipLed, Math.sin(t * 6) > 0.6 ? 1 : 0.25);

    const hx = home.x < 0 ? tgt.x : home.x, hy = home.y < 0 ? tgt.y : home.y;
    toWorld(hx, hy + size * 0.55, pad.position); pad.scale.setScalar(sc);
    const dock = Math.max(0, 1 - Math.hypot(pos.x - hx, pos.y - hy) / (size * 0.8));
    shadow.position.x = ((pos.x - hx) / size) * 2.6;
    op(shadow, dock * (0.45 - Math.sin(t * 1.8) * 0.06));
    op(padRing, 0.25 + dock * (0.5 + pulse * 0.25));

    opts.onFrame?.(pos.x, pos.y + bob, Math.hypot(tgt.x - pos.x, tgt.y - pos.y) < size * 0.5);
    R.render(S, cam);
  }

  resize(); raf = requestAnimationFrame(frame);
  return {
    setTarget(x, y) { tgt.x = x; tgt.y = y; },
    setHome(x, y) { home.x = x; home.y = y; },
    setLook(x, y) { look.x = x; look.y = y; },
    setActive(on) { run = on; },
    resize,
    dispose() {
      dead = true; cancelAnimationFrame(raf);
      S.traverse(o => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mm) ? mm : mm ? [mm] : []).forEach(x => x.dispose());
      });
      R.dispose();
    },
  };
}
