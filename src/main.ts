import '@fontsource-variable/schibsted-grotesk';
import './style.css';
import { initStudies } from './studies';
import { mountPlot } from './plot';
import { initViewer } from './viewer';
import { initBook } from './book';
import { getLight, setLight } from './light';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sheet menu (phones): the same three links, presented as a full-screen call sheet.
const menuBtn = document.querySelector<HTMLButtonElement>('.bar-menu');
const bar = document.querySelector<HTMLElement>('.bar');
if (menuBtn && bar) {
  const set = (open: boolean) => {
    bar.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Sheet';
    document.documentElement.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => set(!bar.classList.contains('is-open')));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bar.classList.contains('is-open')) {
      set(false);
      menuBtn.focus();
    }
  });
  bar.querySelectorAll('.bar-nav a').forEach((a) => a.addEventListener('click', () => set(false)));
}

// Frame counter in the bar follows whichever frame or series block is nearest the middle of the screen.
const counter = document.querySelector<HTMLElement>('[data-count]');
if (counter) {
  const label = document.querySelector<HTMLElement>('.bar-count-l');
  const show = (t: string) => {
    const m = t.match(/^(Frame|Series|Page) (.*)$/);
    if (m) {
      if (label) label.textContent = m[1];
      counter.textContent = m[2];
    } else counter.textContent = t;
  };
  const init = document.body.dataset.countInit;
  if (init) show(init);
  const targets = [...document.querySelectorAll<HTMLElement>('[data-count-text]')];
  if (targets.length) {
    const tick = () => {
      const mid = innerHeight * 0.5;
      let best: HTMLElement | null = null;
      let bd = Infinity;
      for (const t of targets) {
        const r = t.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const d = Math.abs((r.top + r.bottom) / 2 - mid);
        if (d < bd) {
          bd = d;
          best = t;
        }
      }
      if (best) show(best.dataset.countText!);
      else if (init) show(init);
    };
    let q = false;
    addEventListener(
      'scroll',
      () => {
        if (q) return;
        q = true;
        requestAnimationFrame(() => {
          q = false;
          tick();
        });
      },
      { passive: true }
    );
    tick();
  }
}

initStudies();
document.querySelectorAll<HTMLElement>('[data-plot]').forEach((p) => mountPlot(p));
initViewer();
initBook();

// The one authored motion moment: on the home page the key light sweeps in from a hard rake and settles.
const hero = document.querySelector('.hero');
if (hero && !reduce) {
  const target = { ...getLight() };
  const start = { x: 0.95, y: -0.92 };
  const dur = 1700;
  const t0 = performance.now();
  setLight(start, true, false);
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    const l = { x: start.x + (target.x - start.x) * e, y: start.y + (target.y - start.y) * e };
    setLight(l, k < 1, k === 1);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame((n) => setTimeout(() => requestAnimationFrame(step), 250 + n * 0));
}
