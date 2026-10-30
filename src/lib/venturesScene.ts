import * as THREE from "three";

// Ventures island — a daylight isometric diorama with one living site per venture.
// select(i) focuses a site; -1 returns to the overview.

const C = {
  grass: 0x9ccc65, grassDark: 0x7cb342, earth: 0x8d5a3b, earthDark: 0x5d3a26,
  road: 0x56606e, dash: 0xf5f5f0, water: 0x4fc3f7, waterDeep: 0x29b6f6,
  white: 0xf7f5ef, cream: 0xefe6d2, orange: 0xf26b1d, amber: 0xf59e0b,
  glass: 0x8fd3ff, wood: 0x9c6b43, brick: 0xc0563b, leaf: 0x43a047, leafDark: 0x2e7d32, trunk: 0x6d4c41, dark: 0x37404c,
};

type Site = { root: THREE.Group; anchorY: number; update: (t: number, on: number) => void };

function cl(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function ss(a: number, b: number, v: number) { const t = cl((v - a) / (b - a)); return t * t * (3 - 2 * t); }
function backOut(t: number) { const s = 1.70158; t -= 1; return t * t * ((s + 1) * t + s) + 1; }

const matCache = new Map<number, THREE.MeshLambertMaterial>();
function M(color: number) {
  let m = matCache.get(color);
  if (!m) { m = new THREE.MeshLambertMaterial({ color }); matCache.set(color, m); }
  return m;
}
function glowM(color: number, opacity = 1) { return new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }); }
function box(w: number, h: number, d: number, m: THREE.Material, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y + h / 2, z); o.castShadow = o.receiveShadow = true; return o;
}
function cyl(rt: number, rb: number, h: number, m: THREE.Material, x = 0, y = 0, z = 0, seg = 12) {
  const o = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m); o.position.set(x, y + h / 2, z); o.castShadow = o.receiveShadow = true; return o;
}
function ball(r: number, m: THREE.Material, x = 0, y = 0, z = 0) { const o = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), m); o.position.set(x, y, z); return o; }
function windows(g: THREE.Group, w: number, h: number, z: number, rows: number, cols: number, y0: number, x0 = 0) {
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.6 / cols, h * 0.5 / rows), M(C.glass));
    p.position.set(x0 - w / 2 + (c + 0.5) * (w / cols), y0 + (r + 0.5) * (h / rows), z); g.add(p);
  }
}
function person(color: number) {
  const g = new THREE.Group();
  g.add(cyl(0.12, 0.14, 0.4, M(color), 0, 0, 0, 6));
  g.add(ball(0.11, M(0xf1c27d), 0, 0.52, 0));
  return g;
}

// 01 · Beantree Foods — factory, silos, steam, conveyor of crates
function beantree(): Site {
  const g = new THREE.Group();
  g.add(box(5, 2.2, 3.4, M(C.white)));
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(1.25, 0); s.lineTo(1.25, 0.8); s.lineTo(0, 0);
    const t = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 3.4, bevelEnabled: false }), M(C.orange));
    t.position.set(-2.5 + i * 1.25, 2.2, -1.7); t.castShadow = true; g.add(t);
  }
  windows(g, 5, 1.6, 1.71, 1, 5, 0.3);
  [-0.6, 0.6].forEach(z => { g.add(cyl(0.6, 0.6, 3.4, M(C.white), 3.4, 0, z, 16)); g.add(cyl(0.05, 0.62, 0.5, M(C.orange), 3.4, 3.4, z, 16)); });
  g.add(cyl(0.22, 0.28, 3.6, M(C.dark), -2, 0, -1, 10));
  g.add(box(1.6, 0.9, 0.2, M(C.dark), -1.2, 0, 1.75));
  const belt = box(4, 0.12, 0.6, M(C.dark), 0, 0.25, 2.6); g.add(belt);
  const crates = [0, 1, 2, 3].map(() => { const c = box(0.4, 0.35, 0.4, M(C.wood)); g.add(c); return c; });
  const steam = [0, 1, 2, 3].map(i => { const p = ball(0.28, glowM(0xffffff, 0.6)); g.add(p); return { p, o: i / 4 }; });
  return {
    root: g, anchorY: 4.2,
    update(t, on) {
      crates.forEach((c, i) => { const u = (t * (0.2 + 0.15 * on) + i / 4) % 1; c.position.set(-2 + 4 * u, 0.37, 2.6); });
      steam.forEach(({ p, o }) => { const k = (t * 0.3 + o) % 1; p.position.set(-2 + k * 0.8, 3.8 + k * 2.2, -1); p.scale.setScalar(0.6 + k * 1.5); (p.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k); });
    },
  };
}

// 02 · KK Store — shop with striped awning, shoppers walking in and out
function kkStore(): Site {
  const g = new THREE.Group();
  g.add(box(4, 2, 2.8, M(C.cream)));
  g.add(box(4.2, 0.25, 3, M(C.dark), 0, 2));
  g.add(box(2.6, 0.55, 0.12, M(C.orange), 0, 2.3, 1.45));
  const front = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.1), M(C.glass)); front.position.set(0, 0.75, 1.41); g.add(front);
  for (let i = 0; i < 8; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 1), M(i % 2 ? C.white : C.orange));
    s.position.set(-1.75 + i * 0.5, 1.7, 1.85); s.rotation.x = 0.42; s.castShadow = true; g.add(s);
  }
  const cart = new THREE.Group(); cart.add(box(0.5, 0.35, 0.35, M(0xb0bec5), 0, 0.15)); cart.position.set(1.6, 0, 2.6); g.add(cart);
  const shoppers = [C.orange, 0x5c6bc0, 0x26a69a, 0xec407a].map((c, i) => { const p = person(c); g.add(p); return { p, o: i / 4, side: i % 2 ? 1 : -1 }; });
  return {
    root: g, anchorY: 3.2,
    update(t) {
      shoppers.forEach(({ p, o, side }) => {
        const k = (t * 0.12 + o) % 1, u = k < 0.5 ? k * 2 : 2 - k * 2;
        p.position.set(side * (0.4 + 2.2 * u), 0, 1.6 + 1.6 * u); p.rotation.y = k < 0.5 ? 0 : Math.PI;
        p.position.y = Math.abs(Math.sin(t * 8 + o * 10)) * 0.05;
      });
    },
  };
}

// 03 · Bite Me — pop-up tents, food truck, twinkling string lights
function biteMe(): Site {
  const g = new THREE.Group();
  [[-1.4, 0], [1.4, 0.3]].forEach(([x, z]) => {
    g.add(box(2.2, 1.2, 2.2, M(C.white), x, 0, z));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.75, 1.2, 4), M(C.orange)); roof.rotation.y = Math.PI / 4; roof.position.set(x, 1.8, z); roof.castShadow = true; g.add(roof);
  });
  const truck = new THREE.Group(); truck.position.set(0, 0, 2.6);
  truck.add(box(2.4, 1.2, 1.2, M(C.amber))); truck.add(box(0.8, 0.9, 1.2, M(C.white), 1.6, 0));
  const hatch = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.5), M(C.dark)); hatch.position.set(-0.2, 0.75, 0.61); truck.add(hatch);
  [-0.8, 0.8, 1.6].forEach(x => { const w = cyl(0.22, 0.22, 0.15, M(C.dark), x, 0, 0.62); w.rotation.x = Math.PI / 2; w.position.y = 0.2; truck.add(w); });
  g.add(truck);
  const bulbs: THREE.Mesh[] = [];
  for (let i = 0; i <= 12; i++) {
    const u = i / 12, b = ball(0.08, glowM(i % 3 ? 0xfff59d : C.orange), -3 + 6 * u, 2.6 - Math.sin(u * Math.PI) * 0.5, 1.6); g.add(b); bulbs.push(b);
  }
  g.add(cyl(0.05, 0.05, 2.7, M(C.dark), -3, 0, 1.6, 6)); g.add(cyl(0.05, 0.05, 2.7, M(C.dark), 3, 0, 1.6, 6));
  return {
    root: g, anchorY: 3.2,
    update(t, on) { bulbs.forEach((b, i) => { (b.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * (2 + 2 * on) + i * 1.3)); }); },
  };
}

// 04 · The Supper Club — riverside pergola, long table, flickering candles
function supperClub(): Site {
  const g = new THREE.Group();
  g.add(box(5, 0.2, 3, M(C.wood)));
  [[-2.2, -1.2], [2.2, -1.2], [-2.2, 1.2], [2.2, 1.2]].forEach(([x, z]) => g.add(box(0.16, 2.2, 0.16, M(C.white), x, 0.2, z)));
  for (let i = 0; i < 7; i++) g.add(box(0.12, 0.12, 2.7, M(C.white), -2.1 + i * 0.7, 2.4, 0));
  for (let i = 0; i < 6; i++) g.add(ball(0.35, M(i % 2 ? C.leaf : C.leafDark), -2 + i * 0.8, 2.6, (i % 2 ? 0.8 : -0.8)));
  g.add(box(3.4, 0.08, 0.8, M(C.white), 0, 0.85));
  [-1.4, 1.4].forEach(x => g.add(box(0.1, 0.65, 0.6, M(C.wood), x, 0.2, 0)));
  for (let i = 0; i < 5; i++) [-0.75, 0.75].forEach(z => g.add(box(0.35, 0.45, 0.35, M(C.orange), -1.4 + i * 0.7, 0.2, z)));
  const flames = [-1.2, -0.4, 0.4, 1.2].map(x => { g.add(cyl(0.04, 0.04, 0.2, M(C.white), x, 0.93, 0, 6)); const f = ball(0.06, glowM(0xffca28), x, 1.2, 0); g.add(f); return f; });
  return {
    root: g, anchorY: 3.3,
    update(t) { flames.forEach((f, i) => { const k = 0.8 + 0.3 * Math.sin(t * 9 + i * 2) + 0.1 * Math.sin(t * 23 + i); f.scale.set(k, k * 1.4, k); }); },
  };
}

// 05 · The Back Alley Bodega — brick corner shop, blinking neon, alley lamp
function bodega(): Site {
  const g = new THREE.Group();
  g.add(box(3, 3.2, 2.6, M(C.brick)));
  g.add(box(3.1, 0.2, 2.7, M(C.dark), 0, 3.2));
  windows(g, 3, 1.4, 1.31, 1, 2, 1.7);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.3), M(C.dark)); door.position.set(-0.7, 0.65, 1.31); g.add(door);
  const shop = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.9), M(C.glass)); shop.position.set(0.6, 0.75, 1.31); g.add(shop);
  const neon = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.1), glowM(0xff4081)); neon.position.set(0, 2.05, 1.38); g.add(neon);
  const neon2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.12), glowM(C.amber)); neon2.position.set(0, 1.75, 1.38); g.add(neon2);
  const mural = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshLambertMaterial({ color: 0xffb74d }));
  mural.position.set(1.51, 1.4, 0); mural.rotation.y = Math.PI / 2; g.add(mural);
  [[0.3, 0x7e57c2], [-0.4, 0x26c6da], [0.1, C.orange]].forEach(([z, c], i) => {
    const d = new THREE.Mesh(new THREE.CircleGeometry(0.35 - i * 0.05, 16), M(c)); d.position.set(1.52, 1 + i * 0.5, z); d.rotation.y = Math.PI / 2; g.add(d);
  });
  g.add(cyl(0.05, 0.05, 2.6, M(C.dark), -2, 0, 1.6, 6));
  const lamp = ball(0.16, glowM(0xfff59d), -2, 2.65, 1.6); g.add(lamp);
  const bike = new THREE.Group(); bike.position.set(1, 0, 2.1);
  [-0.35, 0.35].forEach(x => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 6, 16), M(C.dark)); w.position.set(x, 0.24, 0); bike.add(w); });
  bike.add(box(0.7, 0.04, 0.04, M(C.orange), 0, 0.4)); g.add(bike);
  return {
    root: g, anchorY: 4,
    update(t) {
      const flick = Math.sin(t * 13) > 0.92 || (t % 5 > 4.6 && t % 5 < 4.7) ? 0.2 : 1;
      (neon.material as THREE.MeshBasicMaterial).opacity = flick;
      (neon2.material as THREE.MeshBasicMaterial).opacity = 0.6 + 0.4 * Math.sin(t * 2);
      (lamp.material as THREE.MeshBasicMaterial).opacity = 0.7 + 0.3 * Math.sin(t * 1.5);
    },
  };
}

// 06 · Enterprise HQ — glass tower, rotating data ring, annex
function hq(): Site {
  const g = new THREE.Group();
  g.add(box(2.6, 7, 2.6, M(C.white)));
  for (let i = 0; i < 9; i++) g.add(box(2.64, 0.4, 2.64, M(C.glass), 0, 0.6 + i * 0.7));
  g.add(box(2.8, 0.3, 2.8, M(C.orange), 0, 7));
  g.add(cyl(0.05, 0.05, 1.2, M(C.dark), 0.8, 7.3, 0.8, 6));
  const tip = ball(0.1, glowM(0xff5252), 0.8, 8.55, 0.8); g.add(tip);
  g.add(box(3, 2.2, 2, M(C.cream), -2.6, 0, 0.4));
  windows(g, 3, 2, 1.41, 1, 4, 0.2, -2.6);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.07, 8, 48), glowM(C.orange, 0.85)); ring.rotation.x = Math.PI / 2; ring.position.y = 5; g.add(ring);
  const nodes = [0, 1, 2, 3].map(() => { const n = ball(0.12, glowM(C.amber)); g.add(n); return n; });
  return {
    root: g, anchorY: 8.6,
    update(t, on) {
      ring.position.y = 5 + 0.25 * Math.sin(t * 0.8); ring.rotation.z = t * 0.6;
      nodes.forEach((n, i) => { const a = t * (0.8 + 0.6 * on) + (i * Math.PI) / 2; n.position.set(Math.cos(a) * 2.2, ring.position.y, Math.sin(a) * 2.2); });
      (tip.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * 4) > 0 ? 1 : 0.2;
    },
  };
}

const SITES: { make: () => Site; x: number; z: number; ry: number }[] = [
  { make: beantree, x: -10.5, z: -6.5, ry: 0 },
  { make: kkStore, x: -1.5, z: -6.5, ry: 0 },
  { make: biteMe, x: 1.5, z: 10, ry: 0 },
  { make: supperClub, x: -9.5, z: 9.6, ry: 0 },
  { make: bodega, x: 11, z: 10, ry: 0 },
  { make: hq, x: 10.5, z: -7, ry: 0 },
];

export type VenturesHandle = {
  select: (i: number) => void;
  setActive: (on: boolean) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  dispose: () => void;
};

export function mountVentures(
  canvas: HTMLCanvasElement, labels: HTMLElement, names: string[], onPick: (i: number) => void
): VenturesHandle | null {
  let R: THREE.WebGLRenderer;
  try { R = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch { return null; }
  const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  R.setClearColor(0x000000, 0);
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;

  const S = new THREE.Scene();
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 300);
  S.add(new THREE.HemisphereLight(0xffffff, 0x6d8a5a, 2.1));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.4); sun.position.set(-18, 34, 22); sun.castShadow = true;
  sun.shadow.mapSize.set(1536, 1536);
  Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 30, bottom: -30, near: 1, far: 100 });
  sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02; S.add(sun);

  const world = new THREE.Group(); S.add(world);
  const W0 = 40, D0 = 30;
  // island: grass top, earth sides
  const top = box(W0, 0.6, D0, M(C.grass), 0, -0.6, 0); world.add(top);
  world.add(box(W0, 2.2, D0, M(C.earth), 0, -2.8, 0));
  world.add(box(W0 - 0.4, 0.6, D0 - 0.4, M(C.earthDark), 0, -3.4, 0));

  // river along x, with animated shimmer strips
  const river = box(W0, 0.5, 4.4, M(C.water), 0, -0.55, 2.6); river.receiveShadow = true; world.add(river);
  const ripples = Array.from({ length: 14 }, (_, i) => {
    const r = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.08), glowM(0xffffff, 0.5)); r.rotation.x = -Math.PI / 2;
    r.position.set(-19 + i * 2.8, 0.0, 1 + (i % 3) * 1.3); world.add(r); return r;
  });
  [-1, 1].forEach(s => world.add(box(W0, 0.25, 0.3, M(C.grassDark), 0, -0.25, 2.6 + s * 2.35)));

  // roads: north loop + south avenue, joined by two bridges
  const road = (x0: number, z0: number, x1: number, z1: number) => {
    const w = Math.abs(x1 - x0) || 1.6, d = Math.abs(z1 - z0) || 1.6;
    world.add(box(w, 0.06, d, M(C.road), (x0 + x1) / 2, 0, (z0 + z1) / 2));
  };
  road(-17, -12, 17, -12); road(-17, -1.6, 17, -1.6); road(-17.8, -12, -17.8, -1.6); road(17.8, -12, 17.8, -1.6);
  road(-17, 13, 17, 13);
  [-5, 6].forEach(x => {
    road(x, -1.6, x, 0.4); road(x, 4.8, x, 13);
    world.add(box(2.2, 0.35, 4.6, M(C.white), x, 0.05, 2.6));
    [-1.05, 1.05].forEach(o => world.add(box(0.12, 0.45, 4.6, M(C.orange), x + o, 0.4, 2.6)));
  });
  for (let x = -16; x <= 16; x += 2) [-12, -1.6, 13].forEach(z => world.add(box(0.8, 0.07, 0.12, M(C.dash), x, 0.01, z)));

  // trees, scattered away from roads, river and sites
  const free = (x: number, z: number) => {
    if (Math.abs(z - 2.6) < 3.2 || Math.abs(z + 12) < 1.4 || Math.abs(z + 1.6) < 1.4 || Math.abs(z - 13) < 1.4) return false;
    if (Math.abs(Math.abs(x) - 17.8) < 1.2 && z < 0) return false;
    if ((Math.abs(x + 5) < 1.5 || Math.abs(x - 6) < 1.5) && z > -2) return false;
    return SITES.every(s => Math.hypot(x - s.x, z - s.z) > 4.6);
  };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const trees: THREE.Group[] = [];
  for (let n = 0, tries = 0; n < 70 && tries < 900; tries++) {
    const x = -19 + rnd() * 38, z = -14 + rnd() * 28;
    if (!free(x, z)) continue;
    const t = new THREE.Group(), s = 0.7 + rnd() * 0.6;
    t.add(cyl(0.1, 0.14, 0.6, M(C.trunk), 0, 0, 0, 5));
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.5, 6), M(rnd() > 0.5 ? C.leaf : C.leafDark)); crown.position.y = 1.2; crown.castShadow = true; t.add(crown);
    t.position.set(x, 0, z); t.scale.setScalar(s); world.add(t); trees.push(t); n++;
  }

  // vehicles on the north loop, boats on the river
  const loop = [new THREE.Vector3(-17.8, 0, -12), new THREE.Vector3(17.8, 0, -12), new THREE.Vector3(17.8, 0, -1.6), new THREE.Vector3(-17.8, 0, -1.6)];
  const perim = 2 * (35.6 + 10.4);
  const along = (s: number, out: THREE.Vector3) => {
    s = ((s % perim) + perim) % perim;
    const segs = [35.6, 10.4, 35.6, 10.4];
    for (let i = 0; i < 4; i++) { if (s <= segs[i]) return out.copy(loop[i]).lerp(loop[(i + 1) % 4], s / segs[i]); s -= segs[i]; }
    return out.copy(loop[0]);
  };
  const vehicles = [0, 1, 2, 3, 4].map(i => {
    const v = new THREE.Group(), truck = i % 2 === 0;
    v.add(box(truck ? 1.3 : 0.9, truck ? 0.7 : 0.45, 0.6, M(truck ? C.white : [0xe53935, 0x1e88e5][i % 2]), truck ? -0.2 : 0, 0.15));
    v.add(box(0.45, 0.5, 0.58, M(truck ? C.orange : C.glass), truck ? 0.6 : 0.1, 0.15));
    world.add(v); return { v, s: i * (perim / 5), sp: truck ? 3 : 4 };
  });
  const boats = [0, 1].map(i => { const b = new THREE.Group(); b.add(box(1.4, 0.3, 0.6, M(i ? C.orange : C.white))); b.add(box(0.5, 0.35, 0.4, M(C.white), -0.2, 0.3)); b.position.set(i ? 8 : -12, -0.1, i ? 3.6 : 1.8); world.add(b); return { b, d: i ? -1 : 1 }; });

  // venture sites + pinned labels
  const sites = SITES.map((s, i) => {
    const site = s.make(); site.root.position.set(s.x, 0, s.z); site.root.rotation.y = s.ry; world.add(site.root);
    const ring = new THREE.Mesh(new THREE.RingGeometry(3.5, 3.75, 48), glowM(C.orange, 0)); ring.rotation.x = -Math.PI / 2; ring.position.set(s.x, 0.08, s.z); world.add(ring);
    const tag = document.createElement("button");
    tag.type = "button";
    tag.innerHTML = `<span style="color:#f26b1d">${String(i + 1).padStart(2, "0")}</span>&nbsp;&nbsp;${names[i]}`;
    tag.style.cssText = "position:absolute;left:0;top:0;font:500 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:#f8fafc;padding:8px 12px;border:1px solid rgba(255,255,255,.18);background:rgba(10,15,40,.82);backdrop-filter:blur(6px);border-radius:999px;white-space:nowrap;cursor:pointer;opacity:0;transition:background .3s,border-color .3s,box-shadow .3s;";
    tag.addEventListener("click", () => onPick(i));
    labels.appendChild(tag);
    return { s, site, ring, tag, on: 0, rise: 0 };
  });

  let W = 1, H = 1, run = false, dead = false, raf = 0, last = performance.now(), t = 0, intro = reduce ? 99 : -1, sel = -1, focus = 0;
  const ptr = { x: 0, y: 0 }, ps = { x: 0, y: 0 };
  const center = new THREE.Vector3(1, 0, 0.5), goal = new THREE.Vector3(), tmp = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  const DIR = new THREE.Vector3(1, 1.05, 1.2).normalize();

  function resize() {
    const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    R.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1)); R.setSize(W, H, false);
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!run || dead) return;
    const r = canvas.getBoundingClientRect();
    if (!r.width || r.bottom < -60 || r.top > window.innerHeight + 60) return;
    if (Math.abs(r.width - W) > 1 || Math.abs(r.height - H) > 1) resize();
    const mdt = reduce ? 0 : dt; t += mdt;
    if (intro < 0) intro = 0;
    if (intro < 4) intro += dt;

    // camera eases toward the selected site
    const fGoal = sel >= 0 ? 1 : 0;
    focus += (fGoal - focus) * (reduce ? 1 : 1 - Math.exp(-dt * 2.4));
    if (sel >= 0) goal.set(1 + (SITES[sel].x - 1) * 0.45, 0.6, 0.5 + (SITES[sel].z - 0.5) * 0.45); else goal.set(1, 0, 0.5);
    center.lerp(goal, reduce ? 1 : 1 - Math.exp(-dt * 2.4));
    ps.x += (ptr.x - ps.x) * (1 - Math.exp(-dt * 3)); ps.y += (ptr.y - ps.y) * (1 - Math.exp(-dt * 3));
    const dir = tmp.copy(DIR).applyAxisAngle(Y, (reduce ? 0 : 0.05 * Math.sin(t * 0.1)) + ps.x * 0.07);
    dir.y += -ps.y * 0.04; dir.normalize();
    cam.position.copy(center).addScaledVector(dir, 90); cam.lookAt(center); cam.updateMatrixWorld();
    const narrow = W < 640, aspect = W / H, fitW = narrow ? 26.5 : 25.5 / aspect > 17 ? 25.5 : 17 * aspect;
    const halfH = (fitW / aspect) * (1 - 0.24 * focus);
    cam.left = -halfH * aspect; cam.right = halfH * aspect; cam.top = halfH; cam.bottom = -halfH; cam.updateProjectionMatrix();

    // intro: island rises, sites and trees pop in
    world.position.y = -3 * (1 - ss(0, 1, intro));
    trees.forEach((tr, i) => { const k = cl((intro - 0.6 - (i % 20) * 0.04) / 0.5); tr.visible = k > 0; tr.scale.y = Math.max(0.001, backOut(k)) * tr.scale.x; });
    vehicles.forEach(({ v }) => { v.visible = intro > 1.4; });

    // ambient life
    vehicles.forEach(o => { o.s += o.sp * mdt; along(o.s, v1); along(o.s + 0.5, v2); o.v.position.set(v1.x, 0.06, v1.z); o.v.rotation.y = Math.atan2(-(v2.z - v1.z), v2.x - v1.x); });
    boats.forEach(o => { o.b.position.x += o.d * 1.2 * mdt; if (o.b.position.x > 19) o.b.position.x = -19; if (o.b.position.x < -19) o.b.position.x = 19; o.b.rotation.y = o.d > 0 ? 0 : Math.PI; o.b.position.y = -0.1 + Math.sin(t * 2 + o.d) * 0.04; });
    ripples.forEach((rp, i) => { rp.position.x = ((-19 + i * 2.8 + t * 0.8) % 38 + 38) % 38 - 19; (rp.material as THREE.MeshBasicMaterial).opacity = 0.25 + 0.25 * Math.sin(t * 2 + i); });

    const rect = labels.getBoundingClientRect();
    sites.forEach((o, i) => {
      const k = cl((intro - 1 - i * 0.18) / 0.7);
      o.site.root.scale.set(1, Math.max(0.001, k >= 1 ? 1 : backOut(k)), 1); o.site.root.visible = k > 0;
      const act = sel === i ? 1 : 0;
      o.on += (act - o.on) * (1 - Math.exp(-dt * 5));
      (o.ring.material as THREE.MeshBasicMaterial).opacity = o.on * (0.6 + 0.3 * Math.sin(t * 3));
      o.site.update(t, o.on);
      tmp.set(o.s.x, o.site.anchorY + 0.8 + world.position.y, o.s.z).project(cam);
      const x = (tmp.x * 0.5 + 0.5) * W, y = (-tmp.y * 0.5 + 0.5) * H;
      o.tag.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-100%) scale(${(1 + 0.08 * o.on).toFixed(3)})`;
      const inside = x > 40 && x < W - 40 && y > 30 && y < H - 10;
      const dim = (sel >= 0 && sel !== i ? (narrow ? 0 : 0.55) : 1) * (inside ? 1 : 0);
      o.tag.style.fontSize = narrow ? "9px" : "11px";
      o.tag.style.padding = narrow ? "6px 9px" : "8px 12px";
      o.tag.style.opacity = (cl((intro - 2.2) / 0.6) * dim).toFixed(3);
      o.tag.style.background = o.on > 0.5 ? "rgba(242,107,29,.95)" : "rgba(10,15,40,.82)";
      o.tag.style.borderColor = o.on > 0.5 ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.18)";
      o.tag.style.zIndex = o.on > 0.5 ? "2" : "1";
      (o.tag.firstElementChild as HTMLElement).style.color = o.on > 0.5 ? "#fff" : "#f26b1d";
      void rect;
    });
    R.render(S, cam);
  }
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3();

  resize();
  raf = requestAnimationFrame(frame);
  return {
    select(i) { sel = i; },
    setActive(on) { run = on; },
    setPointer(x, y) { ptr.x = Math.max(-1, Math.min(1, x)); ptr.y = Math.max(-1, Math.min(1, y)); },
    resize,
    dispose() {
      dead = true; cancelAnimationFrame(raf);
      sites.forEach(o => o.tag.remove());
      S.traverse(o => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mm) ? mm : mm ? [mm] : []).forEach(x => { if (!(x instanceof THREE.MeshLambertMaterial)) x.dispose(); });
      });
      matCache.forEach(m => m.dispose()); matCache.clear();
      R.dispose();
    },
  };
}
