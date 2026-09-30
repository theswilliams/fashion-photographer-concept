// The key light is one shared value. The plot controls write it; every study reads it.
export type Light = { x: number; y: number };

const KEY = 'mav-key-light';
export const DEFAULT_LIGHT: Light = { x: -0.55, y: -0.45 };
let cur: Light = { ...DEFAULT_LIGHT };

try {
  const raw = sessionStorage.getItem(KEY);
  if (raw) {
    const j = JSON.parse(raw);
    if (Number.isFinite(j.x) && Number.isFinite(j.y)) cur = { x: j.x, y: j.y };
  }
} catch {
  /* storage unavailable: the default light is fine */
}

type Sub = (l: Light, dragging: boolean) => void;
const subs = new Set<Sub>();

export const getLight = () => cur;

export function setLight(l: Light, dragging = false, save = true) {
  const r = Math.hypot(l.x, l.y);
  cur = r > 1 ? { x: l.x / r, y: l.y / r } : { x: l.x, y: l.y };
  subs.forEach((fn) => fn(cur, dragging));
  if (save && !dragging) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(cur));
    } catch {
      /* ignore */
    }
  }
}

export function onLight(fn: Sub) {
  subs.add(fn);
  return () => subs.delete(fn);
}

/** Shader light position: x right, y down, z toward the camera, in plate units. */
export function lightPos(l: Light): [number, number, number] {
  const r = Math.min(1, Math.hypot(l.x, l.y));
  return [l.x * 1.4, l.y * 1.4, 0.3 + 0.5 * (1 - r)];
}

export function readout(l: Light) {
  const r = Math.min(1, Math.hypot(l.x, l.y));
  const az = (Math.round((Math.atan2(l.x, -l.y) * 180) / Math.PI) + 360) % 360;
  const dist = 1.2 + r * 2.4;
  const elev = Math.round((Math.atan2(0.3 + 0.5 * (1 - r), r * 1.4 + 0.001) * 180) / Math.PI);
  return { az, dist: dist.toFixed(1), elev };
}
