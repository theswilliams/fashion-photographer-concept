import { defineConfig, type Plugin } from 'vite';
import { readFileSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import data from './src/series.json';

// Shared chrome (top bar, sheet menu, footer) lives in partials/ and is stitched into each page at build time,
// so the output stays real static pages with no runtime templating. {{root}} resolves the page's depth.
const partials = (): Plugin => ({
  name: 'partials',
  transformIndexHtml: {
    order: 'pre',
    handler(html, ctx) {
      const rel = relative(dirname(ctx.filename), __dirname).replace(/\\/g, '/');
      const root = rel ? `${rel}/` : './';
      const inSeries = /[\\/]series[\\/]/.test(ctx.filename);
      const page = inSeries ? 'work' : basename(ctx.filename, '.html') === 'index' ? 'work' : basename(ctx.filename, '.html');
      const current = inSeries ? 'true' : 'page';
      const read = (n: string) => readFileSync(resolve(__dirname, 'partials', n), 'utf8');
      const nav = read('nav.html').replace(new RegExp(`data-page="${page}"`, 'g'), `data-page="${page}" aria-current="${current}"`);
      return html
        .replace('<!--@nav-->', nav)
        .replace('<!--@foot-->', read('foot.html'))
        .replace(/\{\{root\}\}/g, root);
    },
  },
});

const input: Record<string, string> = {
  home: resolve(__dirname, 'index.html'),
  about: resolve(__dirname, 'about.html'),
  book: resolve(__dirname, 'book.html'),
};
for (const s of data.series) input[s.slug] = resolve(__dirname, 'series', s.slug, 'index.html');

export default defineConfig({
  base: './',
  plugins: [partials()],
  build: { rollupOptions: { input } },
});
