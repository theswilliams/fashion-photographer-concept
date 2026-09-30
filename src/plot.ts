import { getLight, onLight, readout, setLight } from './light';

// A top-down lighting plot. The handle is the key light; moving it relights every study on the page.
export function mountPlot(root: HTMLElement) {
  root.innerHTML = `
    <div class="plot-head"><span>Lighting plot</span><span>Plan view</span></div>
    <div class="plot-pad" data-pad>
      <svg class="plot-svg" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
        <circle r="99" class="p-ring"/>
        <circle r="66" class="p-ring p-dash"/>
        <circle r="33" class="p-ring p-dash"/>
        <path d="M-100 0H100M0 -100V100" class="p-axis"/>
        <rect x="-27" y="-36" width="54" height="72" class="p-subject"/>
        <path d="M-8 96L8 96L0 82Z" class="p-cam"/>
        <line class="p-beam" x1="0" y1="0" x2="0" y2="0" data-beam/>
      </svg>
      <span class="p-lab p-subj" aria-hidden="true">Subject</span>
      <span class="p-lab p-camera" aria-hidden="true">Camera</span>
      <div class="plot-handle" data-handle role="slider" tabindex="0" aria-label="Key light position. Drag, or use the arrow keys"
        aria-valuemin="0" aria-valuemax="359" aria-valuenow="0"></div>
    </div>
    <dl class="plot-read">
      <div><dt>Key</dt><dd data-az>0°</dd></div>
      <div><dt>Dist</dt><dd data-dist>0 m</dd></div>
      <div><dt>Elev</dt><dd data-elev>0°</dd></div>
    </dl>`;
  const pad = root.querySelector<HTMLElement>('[data-pad]')!;
  const handle = root.querySelector<HTMLElement>('[data-handle]')!;
  const beam = root.querySelector<SVGLineElement>('[data-beam]')!;
  const az = root.querySelector('[data-az]')!;
  const dist = root.querySelector('[data-dist]')!;
  const elev = root.querySelector('[data-elev]')!;

  const show = () => {
    const l = getLight();
    handle.style.left = `${50 + l.x * 49.5}%`;
    handle.style.top = `${50 + l.y * 49.5}%`;
    beam.setAttribute('x2', String(l.x * 99));
    beam.setAttribute('y2', String(l.y * 99));
    const r = readout(l);
    az.textContent = `${r.az}°`;
    dist.textContent = `${r.dist} m`;
    elev.textContent = `${r.elev}°`;
    handle.setAttribute('aria-valuenow', String(r.az));
    handle.setAttribute('aria-valuetext', `${r.az} degrees, ${r.dist} metres away, ${r.elev} degrees up`);
  };
  onLight(show);
  show();

  const fromEvent = (e: PointerEvent) => {
    const b = pad.getBoundingClientRect();
    return { x: ((e.clientX - b.left) / b.width) * 2 - 1, y: ((e.clientY - b.top) / b.height) * 2 - 1 };
  };
  let active = false;
  pad.addEventListener('pointerdown', (e) => {
    active = true;
    pad.setPointerCapture(e.pointerId);
    handle.classList.add('is-drag');
    setLight(fromEvent(e), true);
  });
  pad.addEventListener('pointermove', (e) => {
    if (active) setLight(fromEvent(e), true);
  });
  const end = (e: PointerEvent) => {
    if (!active) return;
    active = false;
    handle.classList.remove('is-drag');
    setLight(fromEvent(e), false);
  };
  pad.addEventListener('pointerup', end);
  pad.addEventListener('pointercancel', end);

  handle.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 0.15 : 0.05;
    const l = getLight();
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = d[e.key];
    if (!m) return;
    e.preventDefault();
    setLight({ x: l.x + m[0], y: l.y + m[1] });
  });
}
