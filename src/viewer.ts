import data from './series.json';
import photos from './photos.json';
import { mountPlot } from './plot';

// Full-size viewer on a native <dialog>: the browser supplies the focus trap, Escape and inert background.
type Photo = { w: number; h: number; alt: string };
const P = photos as Record<string, Photo>;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad = (n: number) => String(n).padStart(2, '0');

export function initViewer() {
  const opener = document.querySelectorAll<HTMLButtonElement>('.frame-open');
  if (!opener.length) return;
  const si = Number(document.body.dataset.series);
  const s = data.series[si];

  const dlg = document.createElement('dialog');
  dlg.className = 'viewer';
  dlg.setAttribute('aria-label', `${s.title}, full size`);
  dlg.innerHTML = `
    <div class="v-top">
      <p class="v-id"><b data-v-num></b><span data-v-note></span></p>
      <button class="v-close" type="button">Close <span aria-hidden="true">Esc</span></button>
    </div>
    <div class="v-stage">
      <div class="v-picture" data-stage><div class="ph v-fig"><img alt="" decoding="async"></div></div>
      <div class="plot plot-v" data-vplot></div>
    </div>
    <div class="v-bottom">
      <button class="v-step" type="button" data-dir="-1" aria-label="Previous frame">Prev <span aria-hidden="true">←</span></button>
      <button class="v-step" type="button" data-dir="1" aria-label="Next frame">Next <span aria-hidden="true">→</span></button>
    </div>
    <p class="v-live" aria-live="polite" data-v-live></p>`;
  document.body.appendChild(dlg);
  mountPlot(dlg.querySelector<HTMLElement>('[data-vplot]')!);

  const fig = dlg.querySelector<HTMLElement>('.v-fig')!;
  const img = fig.querySelector('img')!;
  const stage = dlg.querySelector<HTMLElement>('[data-stage]')!;
  const num = dlg.querySelector('[data-v-num]')!;
  const note = dlg.querySelector('[data-v-note]')!;
  const live = dlg.querySelector('[data-v-live]')!;

  let i = 0;
  let from: HTMLElement | null = null;

  const fit = () => {
    const p = P[s.frames[i].img];
    const ar = p.w / p.h;
    const b = stage.getBoundingClientRect();
    let w = b.width;
    let h = w / ar;
    if (h > b.height) {
      h = b.height;
      w = h * ar;
    }
    fig.style.width = `${Math.floor(w)}px`;
    fig.style.height = `${Math.floor(h)}px`;
  };

  const show = (n: number, dir = 0) => {
    i = (n + s.frames.length) % s.frames.length;
    const f = s.frames[i];
    num.textContent = `${s.n}.${pad(i + 1)}`;
    note.textContent = `${f.note} · ${f.lens} · ${f.t}`;
    live.textContent = `Frame ${s.n}.${pad(i + 1)} of ${s.n}.${pad(s.frames.length)}: ${f.note}`;
    const p = P[f.img];
    img.src = `../../img/${f.img}-1800.webp`;
    img.srcset = '';
    img.alt = `${p.alt}, ${f.note.toLowerCase()}`;
    img.style.objectPosition = '50% 50%';
    fit();
    if (!reduce && dir) {
      fig.animate(
        { clipPath: [dir > 0 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', 'inset(0 0 0 0)'] },
        { duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)' }
      );
    }
  };

  opener.forEach((b) =>
    b.addEventListener('click', () => {
      from = b;
      dlg.showModal();
      document.documentElement.classList.add('is-viewing');
      show(Number(b.dataset.open));
    })
  );
  dlg.querySelector('.v-close')!.addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => {
    document.documentElement.classList.remove('is-viewing');
    from?.focus();
  });
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close();
  });
  dlg.querySelectorAll<HTMLButtonElement>('.v-step').forEach((b) =>
    b.addEventListener('click', () => {
      const d = Number(b.dataset.dir);
      show(i + d, d);
    })
  );
  dlg.addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement).closest('.plot')) return;
    if (e.key === 'ArrowRight') show(i + 1, 1);
    if (e.key === 'ArrowLeft') show(i - 1, -1);
  });
  addEventListener('resize', () => {
    if (dlg.open) fit();
  });
}
