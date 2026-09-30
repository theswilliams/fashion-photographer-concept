import data from './series.json';
import { getLight, lightPos, onLight } from './light';

// Concept imagery: cloth and light studies authored in a WebGL fragment shader. One offscreen GL canvas renders
// every frame and is copied into each visible 2D canvas, so a page can hold many studies with a single context.

const VS = `attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }`;

const FS = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform int uMode; uniform vec2 uOff; uniform float uScale; uniform float uRot;
uniform vec3 uBase; uniform float uSpec; uniform float uShin; uniform float uRelief; uniform vec3 uLight; uniform float uSeed;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++){ s += a * noise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; } return s; }
vec2 warp(vec2 p, float k){ return p + k * vec2(fbm(p + vec2(3.2, 1.7)), fbm(p + vec2(8.3, 2.8))) - vec2(k * 0.5); }

float height(vec2 p){
  if (uMode == 0){
    vec2 q = warp(p * 0.9, 0.9);
    float d = dot(q, vec2(0.82, 0.57));
    return sin(d * 5.5 + fbm(q * 1.3) * 4.0) * 0.22 + sin(d * 2.3 + 1.7 + q.y * 0.6) * 0.35;
  }
  if (uMode == 1){
    vec2 q = p; q.x += 0.25 * sin(p.y * 1.3) + 0.15 * fbm(p * 0.8);
    float w = 7.0 + 1.5 * p.y;
    float tri = abs(fract(q.x * w) - 0.5) * 2.0;
    return tri * 0.28 + 0.1 * fbm(p * 2.0);
  }
  if (uMode == 2){
    vec2 q = warp(p, 0.8);
    return fbm(q * 1.6) + 0.3 * sin(q.x * 3.0 + q.y * 1.5);
  }
  if (uMode == 3){
    vec2 q = warp(p * 0.8, 0.6);
    float col = q.x * 18.0;
    float rib = pow(abs(sin(3.14159 * col)), 0.7);
    float st = sin(6.28318 * q.y * 14.0 + abs(fract(col) - 0.5) * 6.0) * 0.25;
    return rib * 0.06 + st * 0.02 + fbm(q * 1.2) * 0.9;
  }
  vec2 q = warp(p * 1.1, 1.4);
  float r = 1.0 - abs(fbm(q * 2.0) * 2.0 - 1.0);
  float r2 = 1.0 - abs(fbm(q * 4.0 + 5.0) * 2.0 - 1.0);
  return r * 0.9 + r2 * 0.35;
}

float dots(vec2 p, float f, float ang){
  float c = cos(ang), s = sin(ang);
  vec2 q = mat2(c, -s, s, c) * p * f;
  q.x += 0.5 * mod(floor(q.y), 2.0);
  return smoothstep(0.52, 0.16, length(fract(q) - 0.5));
}

void main(){
  float asp = uRes.x / uRes.y;
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec2 s = (uv - 0.5) * 2.0 * vec2(asp, 1.0);
  float c = cos(uRot), sn = sin(uRot);
  mat2 R = mat2(c, -sn, sn, c);
  vec2 p = R * s * uScale + uOff;
  float e = 0.003 * uScale;
  float h0 = height(p), hx = height(p + vec2(e, 0.0)), hy = height(p + vec2(0.0, e));
  vec2 g = vec2(hx - h0, hy - h0) / e * uRelief * uScale;
  g = g * R;
  vec3 n = normalize(vec3(-g.x, -g.y, 1.0));

  vec3 Lp = vec3(uLight.x * asp, uLight.y, uLight.z);
  vec3 L = Lp - vec3(s, 0.0);
  float dist = length(L); L /= dist;
  float diff = max(dot(n, L), 0.0);
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(n, H), 0.0), uShin) * uSpec;
  float att = 1.0 / (1.0 + 0.28 * dist * dist);

  vec3 base = pow(uBase, vec3(2.2)) * (0.9 + 0.2 * fbm(p * 9.0));
  vec3 col = base * (0.04 + 1.9 * att * diff) + spec * att * vec3(1.0, 0.96, 0.9) * 1.2;

  if (uMode == 2){
    float m = dots(p, 70.0, 0.0) * 0.6 + dots(p, 66.0, 0.26) * 0.45;
    vec3 tint = vec3(0.72, 0.76, 0.86);
    col = base * 0.3 + tint * (att * diff * 1.2 + spec * att * 0.9) * m * 0.9;
  }

  col = col / (1.0 + col * 0.35);
  col = pow(col, vec3(1.0 / 2.2));
  col *= 1.0 - 0.3 * dot(uv - 0.5, uv - 0.5);
  col += (hash(gl_FragCoord.xy + uSeed) - 0.5) * 0.022;
  gl_FragColor = vec4(col, 1.0);
}`;

type Series = (typeof data.series)[number];
type Entry = {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  s: Series;
  f: (typeof data.series)[number]['frames'][number];
  w: number;
  h: number;
  visible: boolean;
  drawn: boolean;
};

let glc: HTMLCanvasElement | null = null;
let gl: WebGLRenderingContext | null = null;
const U: Record<string, WebGLUniformLocation | null> = {};
export let hasGL = false;

function initGL() {
  try {
    glc = document.createElement('canvas');
    // A busy or software GPU can drop the context; keep what is on screen and redraw once it returns.
    glc.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      gl = null;
    });
    glc.addEventListener('webglcontextrestored', () => {
      initGL();
      entries.forEach((en) => {
        if (en.visible) paint(en);
      });
    });
    gl = glc.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
    if (!gl) return;
    const mk = (type: number, src: string) => {
      const sh = gl!.createShader(type)!;
      gl!.shaderSource(sh, src);
      gl!.compileShader(sh);
      if (!gl!.getShaderParameter(sh, gl!.COMPILE_STATUS)) throw new Error(gl!.getShaderInfoLog(sh) || 'shader');
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mk(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    for (const n of ['uRes', 'uMode', 'uOff', 'uScale', 'uRot', 'uBase', 'uSpec', 'uShin', 'uRelief', 'uLight', 'uSeed']) U[n] = gl.getUniformLocation(prog, n);
    hasGL = true;
  } catch {
    hasGL = false;
    gl = null;
  }
}

function paint(en: Entry, quality = 1) {
  if (!gl || !glc) return;
  const rw = Math.max(2, Math.round(en.w * quality));
  const rh = Math.max(2, Math.round(en.h * quality));
  if (glc.width !== rw || glc.height !== rh) {
    glc.width = rw;
    glc.height = rh;
  }
  gl.viewport(0, 0, rw, rh);
  const { s, f } = en;
  const [lx, ly, lz] = lightPos(getLight());
  gl.uniform2f(U.uRes, rw, rh);
  gl.uniform1i(U.uMode, s.mode);
  gl.uniform2f(U.uOff, f.ox, f.oy);
  gl.uniform1f(U.uScale, s.scale * f.z);
  gl.uniform1f(U.uRot, f.rot);
  gl.uniform3f(U.uBase, s.base[0], s.base[1], s.base[2]);
  gl.uniform1f(U.uSpec, s.spec);
  gl.uniform1f(U.uShin, s.shin);
  gl.uniform1f(U.uRelief, s.relief);
  gl.uniform3f(U.uLight, lx, ly, lz);
  gl.uniform1f(U.uSeed, f.ox * 7.3 + f.oy * 3.1);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  en.ctx.drawImage(glc, 0, 0, rw, rh, 0, 0, en.w, en.h);
  en.drawn = true;
}

const entries = new Set<Entry>();
let queued = false;
let dragging = false;

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    const q = dragging ? 0.45 : 1;
    entries.forEach((en) => {
      if (en.visible) paint(en, q);
    });
  });
}

function measure(en: Entry) {
  const r = en.el.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = Math.max(2, Math.round(r.width * dpr));
  let h = Math.max(2, Math.round(r.height * dpr));
  const big = Math.max(w, h);
  if (big > 1500) {
    w = Math.round((w * 1500) / big);
    h = Math.round((h * 1500) / big);
  }
  if (w !== en.w || h !== en.h) {
    en.w = w;
    en.h = h;
    en.el.width = w;
    en.el.height = h;
    return true;
  }
  return false;
}

/** Register a canvas as a study. Returns a function that renders it now at full quality. */
export function mountStudy(el: HTMLCanvasElement, si: number, fi: number) {
  const s = data.series[si];
  const f = s.frames[fi] ?? s.frames[0];
  const ctx = el.getContext('2d')!;
  const en: Entry = { el, ctx, s, f, w: 0, h: 0, visible: false, drawn: false };
  entries.add(en);
  if (!hasGL) {
    const [r, g, b] = s.base.map((v) => Math.round(v * 255));
    el.style.background = `linear-gradient(135deg, rgb(${r},${g},${b}), rgb(${Math.round(r * 0.35)},${Math.round(g * 0.35)},${Math.round(b * 0.35)}))`;
    return () => {};
  }
  measure(en);
  new ResizeObserver(() => {
    if (measure(en) && en.visible) paint(en);
  }).observe(el);
  new IntersectionObserver(
    (ios) => {
      en.visible = ios[0].isIntersecting;
      if (en.visible) paint(en);
    },
    { rootMargin: '300px' }
  ).observe(el);
  return () => {
    measure(en);
    paint(en);
  };
}

/** Swap which frame a canvas shows (used by the full-size viewer). */
export function retarget(el: HTMLCanvasElement, si: number, fi: number) {
  for (const en of entries) {
    if (en.el === el) {
      en.s = data.series[si];
      en.f = data.series[si].frames[fi];
      measure(en);
      en.visible = true;
      paint(en);
    }
  }
}

export function initStudies() {
  initGL();
  if (!hasGL) document.documentElement.classList.add('no-gl');
  document.querySelectorAll<HTMLCanvasElement>('canvas.study').forEach((c) => {
    mountStudy(c, Number(c.dataset.series), Number(c.dataset.i));
  });
  onLight((_l, drag) => {
    const wasDragging = dragging;
    dragging = drag;
    schedule();
    if (wasDragging && !drag) schedule();
  });
}
