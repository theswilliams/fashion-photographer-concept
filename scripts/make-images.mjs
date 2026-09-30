// Resizes the source photographs in raw/ (not committed) into public/img as WebP at three widths.
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const W = [600, 1100, 1800];
for (const f of readdirSync('raw').filter((f) => f.endsWith('.jpg'))) {
  const id = f.replace('.jpg', '');
  for (const w of W) await sharp(`raw/${f}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: 76 }).toFile(`public/img/${id}-${w}.webp`);
}
console.log('done');
