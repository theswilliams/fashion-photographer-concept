// Generates the five real series pages (series/<slug>/index.html) and the running order on the home page
// from src/series.json, so the data lives in one place and every series is its own static page.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { series } = JSON.parse(readFileSync(resolve(root, 'src/series.json'), 'utf8'));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const photos = JSON.parse(readFileSync(resolve(root, 'src/photos.json'), 'utf8'));
// One responsive photo: srcset of the three WebP sizes, cropped with object-position, relit by the .ph overlay.
const pic = (id, pos, depth, sizes, label = true) => {
  const p = photos[id];
  const b = `${depth}img/${id}`;
  return `<img src="${b}-1100.webp" srcset="${b}-600.webp 600w, ${b}-1100.webp 1100w, ${b}-1800.webp 1800w" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${label ? esc(p.alt) : ''}" style="--pos:${pos}" loading="lazy" decoding="async">`;
};
const pad = (n) => String(n).padStart(2, '0');

const head = (title, desc, depth) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#ECEEEF" />
  <meta name="description" content="${esc(desc)}" />
  <title>${esc(title)}</title>
  <link rel="icon" type="image/svg+xml" href="${depth}favicon.svg" />
  <script type="module" src="/src/main.ts"></script>
</head>`;

series.forEach((s, si) => {
  const prev = series[(si + series.length - 1) % series.length];
  const next = series[(si + 1) % series.length];
  const count = s.frames.length;
  const frames = s.frames
    .map((f, i) => {
      const num = `${s.n}.${pad(i + 1)}`;
      return `      <figure class="frame l-${f.l}" data-count-text="Frame ${num} / ${s.n}.${pad(count)}">
        <button class="frame-open" type="button" data-open="${i}" aria-label="Open frame ${num} full size: ${esc(s.alt)}, ${esc(f.note.toLowerCase())}">
          <span class="plate ph">${pic(f.img, f.pos, '../../', '(max-width: 820px) 100vw, 60vw', false)}</span>
        </button>
        <figcaption><b>${num}</b><span>${esc(f.note)}</span></figcaption>
      </figure>`;
    })
    .join('\n');
  const log = s.frames
    .map(
      (f, i) =>
        `          <tr><th scope="row">${s.n}.${pad(i + 1)}</th><td data-label="Time">${f.t}</td><td data-label="Lens">${f.lens}</td><td data-label="Note">${esc(f.note)}</td></tr>`
    )
    .join('\n');
  const html = `${head(`${s.title} — Marlowe Adeyemi-Voss`, s.blurb, '../../')}
<body data-page="series" data-series="${si}" data-count-init="Series ${s.n} / ${pad(series.length)}">
<!--@nav-->
<main id="main" class="series">
  <header class="s-head">
    <p class="s-num" aria-hidden="true">${s.n}</p>
    <h1 class="s-title">${esc(s.title)}</h1>
    <dl class="fields s-fields">
      <div><dt>Call</dt><dd>${s.call}</dd></div>
      <div><dt>Location</dt><dd>${esc(s.place)}</dd></div>
      <div><dt>Garments</dt><dd>${esc(s.garments)}</dd></div>
      <div><dt>Light</dt><dd>${esc(s.lightNote)}</dd></div>
      <div><dt>Frames</dt><dd>${count}</dd></div>
      <div><dt>Status</dt><dd>Stock stand-in</dd></div>
    </dl>
    <div class="plot plot-s" data-plot></div>
  </header>

  <section class="s-brief" aria-labelledby="brief-h">
    <h2 id="brief-h" class="leg">The brief</h2>
    <p>${esc(s.brief)}</p>
    <p class="s-hint">Drag the key light in the plot to relight every frame on this page. Select a frame to open it full size.</p>
  </section>

  <section class="s-frames" aria-label="Frames">
${frames}
  </section>

  <section class="s-log" aria-labelledby="log-h">
    <h2 id="log-h" class="leg">Shot log</h2>
    <table>
      <thead><tr><th scope="col">Frame</th><th scope="col">Time</th><th scope="col">Lens</th><th scope="col">Note</th></tr></thead>
      <tbody>
${log}
      </tbody>
    </table>
    <p class="s-fine">Concept site. The pictures are licensed stock photographs standing in for the fictional photographer's work, relit live by the plot; credits are on the About page. The log is invented.</p>
  </section>

  <nav class="s-next" aria-label="Series">
    <a class="s-prev" href="../${prev.slug}/index.html"><span class="leg">Previous</span><b>${prev.n}</b><span>${esc(prev.title)}</span></a>
    <a class="s-fwd" href="../${next.slug}/index.html"><span class="leg">Next</span><b>${next.n}</b><span>${esc(next.title)}</span></a>
  </nav>
</main>
<!--@foot-->
</body>
</html>
`;
  const dir = resolve(root, 'series', s.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), html);
});

// Running order on the home page
const sched = series
  .map((s, si) => {
    const second =
      s.cover2
        ? `
        <span class="b-img2 ph">${pic(s.cover2.img, s.cover2.pos, '', '30vw', false)}</span>`
        : '';
    return `    <article class="blk blk-${si + 1}" data-count-text="Series ${s.n} / ${pad(series.length)}">
      <a class="blk-link" href="series/${s.slug}/index.html">
        <span class="b-img ph">${pic(s.cover.img, s.cover.pos, '', '(max-width: 820px) 100vw, 55vw')}</span>${second}
        <span class="b-info">
          <span class="b-num" aria-hidden="true">${s.n}</span>
          <h3 class="b-title">${esc(s.title)}</h3>
          <span class="b-fields">
            <span><i>Call</i>${s.call}</span>
            <span><i>Location</i>${esc(s.place)}</span>
            <span><i>Garments</i>${esc(s.garments)}</span>
          </span>
          <span class="b-blurb">${esc(s.blurb)}</span>
          <span class="b-go"><span class="mark">Open series</span><span class="b-frames">${s.frames.length} frames</span></span>
        </span>
      </a>
    </article>`;
  })
  .join('\n');

const idx = resolve(root, 'index.html');
const src = readFileSync(idx, 'utf8');
const out = src.replace(/<!--gen:schedule-->[\s\S]*?<!--\/gen:schedule-->/, `<!--gen:schedule-->\n${sched}\n    <!--/gen:schedule-->`);
writeFileSync(idx, out);
// Photo credits on the About page
const used = [...new Set([...series.flatMap((s) => [s.cover.img, s.cover2?.img, ...s.frames.map((f) => f.img)]), 'metallic', 'face'].filter(Boolean))];
const credits = used
  .map((id) => `      <li><a href="${photos[id].page}" rel="noopener">${esc(photos[id].by)}</a> <span>${esc(photos[id].alt)}</span></li>`)
  .join('\n');
const ab = resolve(root, 'about.html');
const block = `<!--gen:credits-->\n${credits}\n      <!--/gen:credits-->`;
writeFileSync(ab, readFileSync(ab, 'utf8').replace(/<!--gen:credits-->[\s\S]*?<!--\/gen:credits-->/, block));
console.log(`generated ${series.length} series pages`);
