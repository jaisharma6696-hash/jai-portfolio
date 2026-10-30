import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Psychological Stack — six architectural slabs, matte white like a presentation model.
// Each carries a minimal form for its layer; select(i) draws one out and lights its edges.

const ACCENT = new THREE.Color(0xf26b1d);
const WHITE = new THREE.Color(0xffffff);

type Motif = { g: THREE.Group; update: (t: number, on: number) => void };

const slabMat = () => new THREE.MeshStandardMaterial({ color: 0xc9cdd4, roughness: 0.6, metalness: 0.05 });
const formMat = () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.38, metalness: 0.02 });
const lineMat = (o = 0.18) => new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: o });

function block(w: number, h: number, d: number, x = 0, z = 0, m = formMat()) {
  const o = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, Math.min(w, h, d) * 0.08), m);
  o.position.set(x, h / 2, z); o.castShadow = o.receiveShadow = true; return o;
}
function dot(r: number, color = ACCENT) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), new THREE.MeshBasicMaterial({ color, transparent: true }));
}

// 01 Debater — two monoliths in conversation, an idea crossing the gap
function debater(): Motif {
  const g = new THREE.Group();
  g.add(block(1.1, 3.4, 1.1, -1.5, -0.3)); g.add(block(1.1, 2.6, 1.1, 1.5, 0.3));
  const p = dot(0.09); g.add(p);
  return { g, update(t, on) { const u = (Math.sin(t * 0.9) + 1) / 2; p.position.set(-0.95 + 1.9 * u, 2.3 - 0.4 * u, -0.3 + 0.6 * u); (p.material as THREE.MeshBasicMaterial).opacity = 0.25 + 0.75 * on; } };
}
// 02 Big Five — five slender columns, a quiet bar chart
function bigFive(): Motif {
  const g = new THREE.Group();
  const hs = [3.2, 2.6, 1.3, 1.9, 2.9];
  const cols = hs.map((h, i) => { const c = block(0.42, h, 0.42, -1.8 + i * 0.9, 0); g.add(c); return c; });
  return { g, update(t, on) { cols.forEach((c, i) => { const k = 1 + 0.06 * on * Math.sin(t * 1.4 + i); c.scale.y = k; c.position.y = (hs[i] * k) / 2; }); } };
}
// 03 Vanguard — one spire out in front, the massing behind it
function vanguard(): Motif {
  const g = new THREE.Group();
  const spire = block(0.5, 4, 0.5, 1.6, 1.4); g.add(spire);
  [[-1.2, -1], [-0.2, -1.4], [-1.6, 0.3]].forEach(([x, z], i) => g.add(block(0.9, 0.8 + i * 0.25, 0.9, x, z)));
  const tip = dot(0.08); tip.position.set(1.6, 4.2, 1.4); g.add(tip);
  return { g, update(t, on) { (tip.material as THREE.MeshBasicMaterial).opacity = (0.4 + 0.6 * on) * (0.6 + 0.4 * Math.sin(t * 2)); } };
}
// 04 Systems — a grid of blocks with light travelling the streets
function systems(): Motif {
  const g = new THREE.Group();
  for (let x = -2; x <= 2; x++) for (let z = -2; z <= 2; z++) {
    if ((x + z) % 2 === 0 || Math.abs(x) + Math.abs(z) > 3) continue;
    g.add(block(0.55, 0.3 + ((x * 7 + z * 3 + 9) % 5) * 0.22, 0.55, x * 0.95, z * 0.95));
  }
  const pulses = [0, 1, 2].map(() => { const d = dot(0.06); g.add(d); return d; });
  return { g, update(t, on) {
    pulses.forEach((d, i) => {
      const u = (t * 0.25 + i / 3) % 1, s = u * 4, k = s % 1, e = 1.43;
      if (s < 1) d.position.set(-e + 2 * e * k, 0.05, -e); else if (s < 2) d.position.set(e, 0.05, -e + 2 * e * k);
      else if (s < 3) d.position.set(e - 2 * e * k, 0.05, e); else d.position.set(-e, 0.05, e - 2 * e * k);
      (d.material as THREE.MeshBasicMaterial).opacity = 0.2 + 0.8 * on;
    });
  } };
}
// 05 Velocity — fins stepping upward, a wave of momentum running through them
function velocity(): Motif {
  const g = new THREE.Group();
  const fins = Array.from({ length: 6 }, (_, i) => { const f = block(0.28, 0.6 + i * 0.5, 1.6, -2 + i * 0.8, 0); f.rotation.y = 0.35; g.add(f); return { f, h: 0.6 + i * 0.5 }; });
  return { g, update(t, on) { fins.forEach(({ f, h }, i) => { const k = 1 + 0.08 * on * Math.max(0, Math.sin(t * 2.2 - i * 0.7)); f.scale.y = k; f.position.y = (h * k) / 2; }); } };
}
// 06 AI-native — a core, an orbit, and agents connected back to it
function aiNative(): Motif {
  const g = new THREE.Group();
  g.add(block(1.2, 1.2, 1.2, 0, 0));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.025, 8, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 1.6; g.add(ring);
  const nodes = [0, 1, 2, 3].map(() => { const d = dot(0.07); g.add(d); return d; });
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(new Array(4 * 6).fill(0), 3));
  const links = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0xf26b1d, transparent: true, opacity: 0.4 })); g.add(links);
  return { g, update(t, on) {
    const pos = geo.attributes.position as THREE.BufferAttribute;
    nodes.forEach((d, i) => {
      const a = t * 0.35 + (i * Math.PI) / 2; d.position.set(Math.cos(a) * 1.9, 1.6, Math.sin(a) * 1.9);
      pos.setXYZ(i * 2, 0, 1.2, 0); pos.setXYZ(i * 2 + 1, d.position.x, d.position.y, d.position.z);
      (d.material as THREE.MeshBasicMaterial).opacity = 0.3 + 0.7 * on;
    });
    pos.needsUpdate = true; (links.material as THREE.LineBasicMaterial).opacity = 0.1 + 0.4 * on;
  } };
}

const MOTIFS = [debater, bigFive, vanguard, systems, velocity, aiNative];

export type StackHandle = { select: (i: number) => void; setActive: (on: boolean) => void; resize: () => void; dispose: () => void };

export function mountStack(canvas: HTMLCanvasElement): StackHandle | null {
  let R: THREE.WebGLRenderer;
  try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return null; }
  const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  R.setClearColor(0, 0);
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 0.72;

  const S = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(R);
  const env = pm.fromScene(new RoomEnvironment(), 0.04).texture; S.environment = env; S.environmentIntensity = 0.55;
  const cam = new THREE.PerspectiveCamera(26, 1, 1, 200);
  S.add(new THREE.AmbientLight(0xffffff, 0.15));
  const key = new THREE.DirectionalLight(0xffffff, 1.9); key.position.set(-12, 26, 16); key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536); Object.assign(key.shadow.camera, { left: -10, right: 10, top: 22, bottom: -22, near: 1, far: 80 });
  key.shadow.bias = -0.0004; key.shadow.radius = 4; S.add(key);
  const warm = new THREE.PointLight(0xf26b1d, 0, 18, 1.6); S.add(warm);

  const root = new THREE.Group(); S.add(root);
  const GAP = 5.1, N = MOTIFS.length;
  const layers = MOTIFS.map((mk, i) => {
    const holder = new THREE.Group(); root.add(holder);
    const slab = new THREE.Mesh(new RoundedBoxGeometry(6.4, 0.36, 6.4, 3, 0.12), slabMat());
    slab.position.y = -0.18; slab.receiveShadow = slab.castShadow = true; holder.add(slab);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6.5, 0.38, 6.5)), lineMat());
    edges.position.y = -0.18; holder.add(edges);
    const m = mk(); holder.add(m.g);
    return { holder, edges, m, on: 0, y: (N - 1 - i) * GAP - ((N - 1) * GAP) / 2 };
  });

  let W = 1, H = 1, run = false, dead = false, raf = 0, last = performance.now(), t = 0, sel = 0;
  const col = new THREE.Color();
  function resize() {
    const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); R.setSize(W, H, false);
    cam.aspect = W / H;
    const dist = Math.max(70, 52 / Math.min(1, cam.aspect));
    cam.position.set(dist * 0.62, dist * 0.42, dist * 0.66); cam.lookAt(0, 0, 0); cam.updateProjectionMatrix();
  }
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!run || dead) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || r.bottom < -60 || r.top > window.innerHeight + 60) return;
    if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) resize();
    t += reduce ? 0 : dt;
    root.rotation.y = reduce ? 0 : Math.sin(t * 0.12) * 0.1;
    layers.forEach((o, i) => {
      o.on += ((sel === i ? 1 : 0) - o.on) * (reduce ? 1 : 1 - Math.exp(-dt * 3.5));
      // the selected slab glides forward out of the stack
      o.holder.position.set(o.on * 4.4, o.y + o.on * 0.6, o.on * 4.4);
      const lm = o.edges.material as THREE.LineBasicMaterial;
      lm.color.copy(col.copy(WHITE).lerp(ACCENT, o.on)); lm.opacity = 0.14 + 0.7 * o.on;
      o.m.update(t, o.on);
      if (sel === i) warm.position.set(o.holder.position.x + 2, o.holder.position.y + 4, o.holder.position.z + 2);
    });
    warm.intensity = 30 * layers[sel].on;
    R.render(S, cam);
  }
  resize(); raf = requestAnimationFrame(frame);
  return {
    select(i) { sel = Math.max(0, Math.min(N - 1, i)); },
    setActive(on) { run = on; },
    resize,
    dispose() {
      dead = true; cancelAnimationFrame(raf);
      S.traverse(o => { const m = o as THREE.Mesh; m.geometry?.dispose(); const mm = m.material as THREE.Material | undefined; mm?.dispose(); });
      env.dispose(); pm.dispose(); R.dispose();
    },
  };
}
