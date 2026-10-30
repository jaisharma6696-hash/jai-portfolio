import * as THREE from "three";

// Build Lab — isometric map of builds. The page drives it with setProgress(p):
// p = 0 overview, 1..N focuses build N, N+1 overview again.

const AMBER = 0xf59e0b;
const PAPER = 0xf7f5ef;
// per-build palette: walls, roof/accent, base trim — set before each builder runs
const PALETTES: [number, number, number][] = [
  [0x7c4dff, 0xffffff, 0x5e35b1], // Halo — violet tower
  [0xf7f5ef, 0x29b6f6, 0x0277bd], // Beacon — white hall, blue dome
  [0xf8bbd0, 0xec407a, 0xffffff], // Vows — pink pavilion
  [0xeceff1, 0x90a4ae, 0x546e7a], // Railgrid — concrete viaduct
  [0x26c6da, 0x00838f, 0xe0f7fa], // Blueprint — teal
  [0xe53935, 0xffffff, 0x37474f], // Compass — red & white lighthouse
  [0x8d6e63, 0xffcc80, 0x6d4c41], // Brew — café
  [0xffca28, 0xf57c00, 0x455a64], // Forge — yellow factory
];
let SLATE_HI = PALETTES[0][0], SLATE_TOP = PALETTES[0][1], SLATE = PALETTES[0][2];

const PADS: [number, number][] = [
  [-15, 2.5], [-10.5, -2.5], [-6, 2], [-1.5, -3], [3, 1.5], [7.5, -2.5], [12, 2], [16, -1.5],
];

type Build = { root: THREE.Group; update: (t: number, dt: number, on: number) => void };

function cl(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function ss(a: number, b: number, v: number) { const t = cl((v - a) / (b - a)); return t * t * (3 - 2 * t); }
function backOut(t: number) { const s = 1.70158; t -= 1; return t * t * ((s + 1) * t + s) + 1; }

function mat(color: number, emissive = 0, ei = 0) {
  return new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: ei, roughness: 0.75, metalness: 0.1 });
}
function glow(color = AMBER, opacity = 1) {
  return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
}
function box(w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  o.position.set(x, y + h / 2, z); o.castShadow = o.receiveShadow = true; return o;
}
function cyl(rt: number, rb: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0, seg = 16) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m);
  o.position.set(x, y + h / 2, z); o.castShadow = o.receiveShadow = true; return o;
}
function ball(r: number, m: THREE.Material) { return new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), m); }

// A · Halo — tower, spinning halo, message packets flying in
function halo(): Build {
  const g = new THREE.Group();
  g.add(box(1.4, 5.2, 1.4, mat(SLATE_HI)));
  g.add(box(1.5, 0.15, 1.5, mat(SLATE_TOP), 0, 5.2));
  g.add(cyl(0.05, 0.05, 1.4, mat(PAPER), 0, 5.35, 0, 6));
  const tip = ball(0.13, glow()); tip.position.y = 6.85; g.add(tip);
  for (let i = 0; i < 6; i++) g.add(box(1.42, 0.08, 1.42, mat(SLATE, PAPER, 0.25), 0, 0.8 + i * 0.7));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.06, 8, 48), glow(AMBER, 0.9));
  ring.rotation.x = Math.PI / 2; ring.position.y = 4.4; g.add(ring);
  const packets = Array.from({ length: 5 }, (_, i) => { const p = ball(0.12, glow(PAPER)); g.add(p); return { p, o: i / 5 }; });
  return {
    root: g,
    update(t, _dt, on) {
      ring.rotation.z = t * 0.9; ring.position.y = 4.4 + 0.15 * Math.sin(t * 1.3);
      (tip.material as THREE.MeshBasicMaterial).opacity = 0.5 + 0.5 * Math.sin(t * 4);
      packets.forEach(({ p, o }, i) => {
        const k = (t * 0.35 + o) % 1, a = i * 1.26;
        p.position.set(Math.cos(a) * 4 * (1 - k), 0.4 + 4 * k * k, Math.sin(a) * 4 * (1 - k));
        (p.material as THREE.MeshBasicMaterial).opacity = Math.sin(k * Math.PI) * (0.35 + 0.65 * on);
      });
    },
  };
}

// B · Beacon — domed control room, radar sweep, flickering screens
function beacon(): Build {
  const g = new THREE.Group();
  g.add(box(3.6, 1.1, 2.6, mat(SLATE_HI)));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat(SLATE_TOP));
  dome.position.set(-0.6, 1.1, 0); dome.castShadow = true; g.add(dome);
  const mast = cyl(0.06, 0.06, 1, mat(PAPER), 1.1, 1.1, 0, 6); g.add(mast);
  const dish = new THREE.Group(); dish.position.set(1.1, 2.15, 0);
  const d = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.15, 0.2, 16, 1, true), mat(PAPER));
  d.rotation.z = Math.PI / 2.6; dish.add(d); g.add(dish);
  const screens = [-1.2, -0.4, 0.4, 1.2].map(x => {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.4), glow(AMBER, 0.7)); s.position.set(x, 0.6, 1.31); g.add(s); return s;
  });
  const sweep = new THREE.Mesh(new THREE.RingGeometry(0.3, 3.2, 32, 1, 0, 0.6), glow(AMBER, 0.15));
  sweep.rotation.x = -Math.PI / 2; sweep.position.y = 0.04; g.add(sweep);
  return {
    root: g,
    update(t, _dt, on) {
      dish.rotation.y = t * 1.2; sweep.rotation.z = -t * 1.2;
      (sweep.material as THREE.MeshBasicMaterial).opacity = 0.05 + 0.15 * on;
      screens.forEach((s, i) => { (s.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * (3 + i) + i * 2)); });
    },
  };
}

// C · Vows — pavilion with twinkling string lights
function vows(): Build {
  const g = new THREE.Group();
  g.add(box(3.4, 0.25, 3.4, mat(SLATE_TOP)));
  const corners: [number, number][] = [[-1.4, -1.4], [1.4, -1.4], [1.4, 1.4], [-1.4, 1.4]];
  corners.forEach(([x, z]) => g.add(cyl(0.1, 0.12, 2.4, mat(PAPER), x, 0.25, z, 8)));
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.4, 1.3, 4), mat(SLATE_HI));
  roof.rotation.y = Math.PI / 4; roof.position.y = 3.3; roof.castShadow = true; g.add(roof);
  const finial = ball(0.12, glow()); finial.position.y = 4.05; g.add(finial);
  const lights: THREE.Mesh[] = [];
  corners.forEach(([x, z], i) => {
    const [nx, nz] = corners[(i + 1) % 4];
    for (let k = 1; k < 7; k++) {
      const u = k / 7, b = ball(0.07, glow(k % 2 ? AMBER : PAPER));
      b.position.set(x + (nx - x) * u, 2.6 - Math.sin(u * Math.PI) * 0.35, z + (nz - z) * u); g.add(b); lights.push(b);
    }
  });
  return {
    root: g,
    update(t) {
      lights.forEach((b, i) => { (b.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 3 + i * 1.7)); });
    },
  };
}

// D · Railgrid — viaduct, shuttling train, pulsing QR-tagged pillars
function railgrid(): Build {
  const g = new THREE.Group();
  const tags: THREE.Mesh[] = [];
  for (let i = -2; i <= 2; i++) {
    g.add(cyl(0.22, 0.28, 2, mat(SLATE_TOP), i * 1.3, 0, 0, 10));
    const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.28), glow(AMBER, 0.8));
    tag.position.set(i * 1.3, 0.9, 0.29); g.add(tag); tags.push(tag);
  }
  g.add(box(6.4, 0.3, 1.1, mat(SLATE_HI), 0, 2));
  const train = new THREE.Group(); train.position.y = 2.3; g.add(train);
  for (let c = 0; c < 3; c++) {
    train.add(box(0.95, 0.5, 0.75, mat(PAPER, PAPER, 0.15), c * 1.02 - 1.02, 0));
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.16), glow(AMBER, 0.85));
    win.position.set(c * 1.02 - 1.02, 0.3, 0.38); train.add(win);
  }
  return {
    root: g,
    update(t) {
      const cyc = (t * 0.22) % 2, u = cyc < 1 ? cyc : 2 - cyc;
      train.position.x = -1.7 + 3.4 * ss(0.1, 0.9, u);
      tags.forEach((tg, i) => { (tg.material as THREE.MeshBasicMaterial).opacity = 0.3 + 0.7 * Math.max(0, Math.sin(t * 2.4 - i * 0.9)); });
    },
  };
}

// E · Blueprint — floating blueprint layers with a scan plane
function blueprint(): Build {
  const g = new THREE.Group();
  g.add(box(3, 0.2, 3, mat(SLATE_HI)));
  const plates = [0, 1, 2, 3].map(i => {
    const p = new THREE.Group();
    const face = new THREE.Mesh(new THREE.BoxGeometry(2.6 - i * 0.35, 0.06, 2.6 - i * 0.35), glow(0x93c5fd, 0.12));
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(face.geometry), new THREE.LineBasicMaterial({ color: i === 3 ? AMBER : 0x93c5fd, transparent: true, opacity: 0.8 }));
    p.add(face, edges); g.add(p); return p;
  });
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(3, 3), glow(AMBER, 0.12)); scan.rotation.x = -Math.PI / 2; g.add(scan);
  return {
    root: g,
    update(t, _dt, on) {
      plates.forEach((p, i) => { p.position.y = 0.9 + i * (0.75 + 0.15 * on) + 0.1 * Math.sin(t * 1.2 + i); p.rotation.y = 0.08 * Math.sin(t * 0.5 + i); });
      scan.position.y = 0.5 + 3 * (0.5 + 0.5 * Math.sin(t * 0.9));
    },
  };
}

// F · Compass — lighthouse with a sweeping beam
function compass(): Build {
  const g = new THREE.Group();
  g.add(cyl(1.2, 1.4, 0.4, mat(SLATE_TOP), 0, 0, 0, 20));
  g.add(cyl(0.55, 0.85, 3.8, mat(PAPER), 0, 0.4, 0, 20));
  [1.3, 2.6].forEach(y => g.add(cyl(0.8 - y * 0.08, 0.82 - y * 0.08, 0.3, mat(SLATE_HI), 0, y, 0, 20)));
  g.add(cyl(0.65, 0.65, 0.1, mat(SLATE_HI), 0, 4.2, 0, 20));
  const lamp = ball(0.35, glow()); lamp.position.y = 4.65; g.add(lamp);
  g.add(cyl(0.05, 0.55, 0.5, mat(SLATE_HI), 0, 5, 0, 20));
  const beam = new THREE.Group(); beam.position.y = 4.65; g.add(beam);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6, 20, 1, true), glow(AMBER, 0.12));
  cone.rotation.z = Math.PI / 2; cone.position.x = 3; beam.add(cone);
  return {
    root: g,
    update(t, _dt, on) {
      beam.rotation.y = t * 0.8;
      (cone.material as THREE.MeshBasicMaterial).opacity = 0.06 + 0.12 * on;
      (lamp.material as THREE.MeshBasicMaterial).opacity = 0.7 + 0.3 * Math.sin(t * 5);
    },
  };
}

// G · Brew — café with awning and rising steam
function brew(): Build {
  const g = new THREE.Group();
  g.add(box(2.8, 1.8, 2.2, mat(SLATE_HI)));
  g.add(box(3, 0.15, 2.4, mat(SLATE_TOP), 0, 1.8));
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), glow(AMBER, 0.75)); win.position.set(-0.3, 0.8, 1.11); g.add(win);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 1), glow(PAPER, 0.5)); door.position.set(0.95, 0.5, 1.11); g.add(door);
  for (let i = 0; i < 6; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.8), mat(i % 2 ? PAPER : AMBER));
    s.position.set(-1.25 + i * 0.5, 1.5, 1.45); s.rotation.x = 0.45; g.add(s);
  }
  g.add(cyl(0.18, 0.18, 0.7, mat(SLATE_TOP), 0.8, 1.95, -0.5, 10));
  const puffs = Array.from({ length: 5 }, (_, i) => { const p = ball(0.22, glow(PAPER, 0.4)); g.add(p); return { p, o: i / 5 }; });
  return {
    root: g,
    update(t) {
      puffs.forEach(({ p, o }) => {
        const k = (t * 0.3 + o) % 1;
        p.position.set(0.8 + Math.sin(k * 6 + o * 9) * 0.25, 2.7 + k * 2.4, -0.5);
        p.scale.setScalar(0.6 + k * 1.4); (p.material as THREE.MeshBasicMaterial).opacity = 0.45 * (1 - k);
      });
    },
  };
}

// H · Forge — sawtooth factory, chimney smoke, conveyor of crates
function forge(): Build {
  const g = new THREE.Group();
  g.add(box(3.4, 1.3, 2.4, mat(SLATE_HI)));
  for (let i = 0; i < 3; i++) {
    const shape = new THREE.Shape(); shape.moveTo(0, 0); shape.lineTo(1.1, 0); shape.lineTo(1.1, 0.7); shape.lineTo(0, 0);
    const tooth = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 2.4, bevelEnabled: false }), mat(SLATE_TOP));
    tooth.position.set(-1.7 + i * 1.13, 1.3, -1.2); tooth.castShadow = true; g.add(tooth);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.6), glow(AMBER, 0.55));
    glass.position.set(-1.7 + i * 1.13 + 1.11, 1.63, 0); glass.rotation.y = Math.PI / 2; g.add(glass);
  }
  g.add(cyl(0.22, 0.3, 3.2, mat(SLATE_TOP), 1.3, 0, -0.8, 10));
  g.add(box(4.6, 0.12, 0.6, mat(SLATE), 0, 0.3, 1.7));
  const crates = [0, 1, 2, 3].map(() => { const c = box(0.4, 0.4, 0.4, mat(AMBER, AMBER, 0.2)); g.add(c); return c; });
  const smoke = Array.from({ length: 5 }, (_, i) => { const p = ball(0.25, glow(0x94a3b8, 0.4)); g.add(p); return { p, o: i / 5 }; });
  return {
    root: g,
    update(t) {
      crates.forEach((c, i) => { const u = (t * 0.25 + i / 4) % 1; c.position.set(-2.2 + 4.4 * u, 0.42, 1.7); c.visible = u > 0.03 && u < 0.97; });
      smoke.forEach(({ p, o }) => {
        const k = (t * 0.25 + o) % 1;
        p.position.set(1.3 + k * 1.2, 3.3 + k * 2.2, -0.8); p.scale.setScalar(0.6 + k * 1.6);
        (p.material as THREE.MeshBasicMaterial).opacity = 0.4 * (1 - k);
      });
    },
  };
}

const BUILDERS = [halo, beacon, vows, railgrid, blueprint, compass, brew, forge];

export type BuildLabHandle = {
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  setActive: (on: boolean) => void;
  setShift: (s: number) => void;
  resize: () => void;
  dispose: () => void;
};

export function mountBuildLab(canvas: HTMLCanvasElement, labels: HTMLElement, codes: string[], onPick?: (i: number) => void): BuildLabHandle | null {
  let R: THREE.WebGLRenderer;
  try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return null; }
  const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  R.setClearColor(0x000000, 0);
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;

  const S = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 200);
  const DIR = new THREE.Vector3(1, 1.15, 1.25).normalize(), D = 70;
  S.add(new THREE.HemisphereLight(0xffffff, 0x6d8a5a, 2.0));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.5); sun.position.set(-14, 30, 18); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 80 });
  sun.shadow.bias = -0.0005; S.add(sun);
  const rim = new THREE.DirectionalLight(AMBER, 0.6); rim.position.set(20, 8, -14); S.add(rim);

  // island: water rim, earth body, grass top, trees
  const water = new THREE.Mesh(new THREE.CylinderGeometry(27.5, 27.5, 0.4, 72), mat(0x4fc3f7));
  water.scale.z = 0.5; water.position.y = -1.1; water.receiveShadow = true; S.add(water);
  const earth = new THREE.Mesh(new THREE.CylinderGeometry(24.4, 23.6, 2.4, 72), mat(0x8d5a3b));
  earth.scale.z = 0.44; earth.position.y = -1.3; S.add(earth);
  const island = new THREE.Mesh(new THREE.CylinderGeometry(24.5, 24.5, 0.5, 72), mat(0x9ccc65));
  island.scale.z = 0.44; island.position.y = -0.25; island.receiveShadow = true; S.add(island);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let n = 0, tries = 0; n < 46 && tries < 800; tries++) {
    const x = -22 + rnd() * 44, z = -9.5 + rnd() * 19;
    if ((x * x) / 529 + (z * z) / 100 > 0.9) continue;
    if (PADS.some(([px, pz]) => Math.hypot(x - px, z - pz) < 3.6)) continue;
    const tr = new THREE.Group(), k = 0.6 + rnd() * 0.6;
    tr.add(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.6, 5), mat(0x6d4c41)));
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.5, 6), mat(rnd() > 0.5 ? 0x43a047 : 0x2e7d32)); crown.position.y = 1.1; crown.castShadow = true; tr.add(crown);
    tr.position.set(x, 0.3, z); tr.scale.setScalar(k); S.add(tr); n++;
  }

  // trail connecting pads in build order
  const curve = new THREE.CatmullRomCurve3(PADS.map(([x, z]) => new THREE.Vector3(x, 0.08, z)), false, "catmullrom", 0.4);
  const TSEG = 400;
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, TSEG, 0.09, 6), glow(AMBER, 0.85));
  const tubeIdx = tube.geometry.index ? tube.geometry.index.count : 0;
  S.add(tube);
  const ghost = new THREE.Mesh(new THREE.TubeGeometry(curve, TSEG, 0.42, 4), mat(0x56606e)); ghost.scale.y = 0.4; S.add(ghost);
  const beads = [0, 1, 2].map(() => { const b = ball(0.18, glow(0xfde68a)); S.add(b); return b; });

  // pads + builds
  const items = PADS.map(([x, z], i) => {
    const base = new THREE.Group(); base.position.set(x, 0, z); S.add(base);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.3, 2.3, 0.12, 40), mat(0xeceae4)); pad.position.y = 0.06; pad.receiveShadow = true; base.add(pad);
    const ring = new THREE.Mesh(new THREE.RingGeometry(2.35, 2.55, 48), glow(AMBER, 0)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.14; base.add(ring);
    [SLATE_HI, SLATE_TOP, SLATE] = PALETTES[i];
    const b = BUILDERS[i](); b.root.position.y = 0.12; b.root.scale.set(1, 0.001, 1); base.add(b.root);
    const tag = document.createElement("button");
    tag.type = "button";
    const [c0, ...rest] = (codes[i] ?? "").split(" · ");
    tag.innerHTML = `<span style="color:#f26b1d">${c0}</span>&nbsp;&nbsp;${rest.join(" · ")}`;
    tag.addEventListener("click", () => onPick?.(i));
    tag.style.cssText = "position:absolute;left:0;top:0;font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:#f8fafc;padding:7px 11px;border:1px solid rgba(255,255,255,.18);background:rgba(10,15,40,.82);backdrop-filter:blur(6px);border-radius:999px;white-space:nowrap;pointer-events:auto;cursor:pointer;opacity:0;transition:background .3s,border-color .3s;";
    labels.appendChild(tag);
    return { base, ring, b, tag, on: 0, top: new THREE.Vector3(x, 0, z) };
  });

  const N = PADS.length;
  let target = 0, p = 0, W = 0, H = 0, run = true, dead = false, raf = 0, last = performance.now(), t = 0, shift = 0;
  const ptr = { x: 0, y: 0 }, ps = { x: 0, y: 0 };
  const center = new THREE.Vector3(), tmp = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3();

  function resize() {
    const r = canvas.getBoundingClientRect(); W = r.width; H = r.height; if (!W || !H) return;
    R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); R.setSize(W, H, false);
  }

  function padAt(q: number, out: THREE.Vector3) {
    const k = Math.max(0, Math.min(N - 1, q - 1)), i = Math.floor(k), f = k - i, j = Math.min(N - 1, i + 1);
    const e = ss(0, 1, f);
    return out.set(PADS[i][0] + (PADS[j][0] - PADS[i][0]) * e, 1.6, PADS[i][1] + (PADS[j][1] - PADS[i][1]) * e);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!run || dead) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || r.bottom < -60 || r.top > window.innerHeight + 60) return;
    if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) resize();
    const mdt = reduce ? 0 : dt; t += mdt;

    // ease progress toward its step target (instant under reduced motion)
    const diff = target - p;
    if (reduce || Math.abs(diff) < 1e-3) p = target;
    else { const sp = Math.max(1.1, Math.abs(diff) / 1.1); p += Math.sign(diff) * Math.min(Math.abs(diff), sp * dt); }

    // camera: overview ↔ focus on the active build
    const w = ss(0.2, 1, p) * (1 - ss(N, N + 0.8, p));
    padAt(p, tmp); center.set(0.5, 1, -0.5).lerp(tmp, w);
    ps.x += (ptr.x - ps.x) * (1 - Math.exp(-dt * 3)); ps.y += (ptr.y - ps.y) * (1 - Math.exp(-dt * 3));
    const yaw = (reduce ? 0 : 0.05 * Math.sin(t * 0.12)) + ps.x * 0.06, pitch = -ps.y * 0.04;
    const dir = tmp.copy(DIR).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    dir.y += pitch; dir.normalize();
    cam.position.copy(center).addScaledVector(dir, D); cam.lookAt(center); cam.updateMatrixWorld();
    const aspect = W / Math.max(1, H), narrow = W < 760;
    const overviewHalfW = narrow ? 21 : 25, focusHalfH = narrow ? 9.5 : 11.5;
    const halfH = (overviewHalfW / aspect) * (1 - w) + focusHalfH * w;
    const halfW = halfH * aspect, sx = halfW * shift * (0.75 + 0.25 * w);
    cam.left = -halfW - sx; cam.right = halfW - sx; cam.top = halfH; cam.bottom = -halfH;
    cam.updateProjectionMatrix();

    // trail draws as builds are reached
    const reach = cl((p - 0.6) / (N - 1));
    tube.geometry.setDrawRange(0, Math.floor((tubeIdx * reach) / 6) * 6);
    beads.forEach((b, i) => {
      const u = ((t * 0.08 + i / 3) % 1) * reach; curve.getPoint(u, b.position); b.position.y = 0.2;
      b.visible = reach > 0.02; (b.material as THREE.MeshBasicMaterial).opacity = 0.9 * Math.sin(Math.PI * ((t * 0.08 + i / 3) % 1));
    });

    right.setFromMatrixColumn(cam.matrixWorld, 0); up.setFromMatrixColumn(cam.matrixWorld, 1);
    items.forEach((it, i) => {
      const rise = reduce ? (p >= i + 0.5 ? 1 : 0) : ss(i + 0.35, i + 1.05, p);
      it.b.root.scale.y = Math.max(0.001, rise >= 1 ? 1 : backOut(rise));
      it.b.root.visible = rise > 0.002;
      const act = 1 - ss(0.25, 0.7, Math.abs(p - (i + 1)));
      it.on += (act - it.on) * (1 - Math.exp(-dt * 5));
      (it.ring.material as THREE.MeshBasicMaterial).opacity = it.on * (0.55 + 0.3 * Math.sin(t * 3)) + rise * 0.12;
      if (rise > 0.002) it.b.update(t, mdt, it.on);

      it.top.set(PADS[i][0], 0, PADS[i][1]).addScaledVector(new THREE.Vector3(0, 1, 0), 0.4).project(cam);
      const x = (it.top.x * 0.5 + 0.5) * W, y = (-it.top.y * 0.5 + 0.5) * H + 18;
      it.tag.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translateX(-50%)`;
      it.tag.style.opacity = (rise * (0.45 + 0.55 * it.on)).toFixed(3);
      it.tag.style.background = it.on > 0.5 ? "rgba(242,107,29,.95)" : "rgba(10,15,40,.82)";
      it.tag.style.borderColor = it.on > 0.5 ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.18)";
      const num = it.tag.firstElementChild as HTMLElement | null; if (num) num.style.color = it.on > 0.5 ? "#fff" : "#f26b1d";
    });

    R.render(S, cam);
  }

  resize();
  raf = requestAnimationFrame(frame);
  return {
    setProgress(v) { target = Math.max(0, Math.min(N + 1, v)); },
    setPointer(x, y) { ptr.x = Math.max(-1, Math.min(1, x)); ptr.y = Math.max(-1, Math.min(1, y)); },
    setActive(on) { run = on; },
    setShift(s) { shift = s; },
    resize,
    dispose() {
      dead = true; cancelAnimationFrame(raf);
      items.forEach(it => it.tag.remove());
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
