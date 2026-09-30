# Marlowe Adeyemi-Voss: fashion photographer (concept)

> **Fictional concept project.** Marlowe Adeyemi-Voss, the studio, clients, garments, locations and contact details are invented for a web design portfolio. There are no real clients, testimonials or results. The booking form sends nothing and stores nothing. The photographs are licensed Unsplash stock images standing in for the photographer's work; they are not by a fictional person and are credited below.

Project 03 of a five-site portfolio series. Each site is meant to differ from the others in layout, type, navigation, interaction, motion and density (see [docs/DIFFERENTIATION-MATRIX.md](docs/DIFFERENTIATION-MATRIX.md)).

## Project

A portfolio site for a fictional fashion photographer. Five series of work, each a colour story: Oxblood, Bone, Black, Gilt and Stage.

## Challenge

A photographer's site has to be led by the pictures, not by UI cards around them. The pictures here are stock stand-ins, so the job was to make them the structure of the page and keep the interface as quiet paperwork around them.

## Design Direction

The paperwork is the interface: a shoot-day **call sheet** with a **lighting plot**. Cool paper, ink, thin rules, registration crosses, and one chartreuse highlighter used only as a fill under black text. Schibsted Grotesk throughout; rank comes from weight and case, not size. No rounded corners, no shadows. Full detail in [DESIGN.md](DESIGN.md).

## UX Approach

- The home page opens on a ruled call-sheet block beside a large photograph, with a live lighting plot overlapping it.
- The "running order" lists the five series as stepped, alternating image blocks, not a card grid.
- Each series page has a shot log and a frame sequence. Any frame opens a full-screen viewer.
- A fixed top bar carries a live frame counter that follows what is on screen.
- Booking is a call-sheet form with inline validation and an "issued" confirmation.

## Technology

Vite + vanilla TypeScript, multi-page static (8 HTML pages). A small Vite plugin injects shared partials; `scripts/gen-series.mjs` generates the series pages from `src/series.json`. Photographs are WebP at three sizes (`scripts/make-images.mjs`, sharp) served with `srcset`. The plot sets `--lx/--ly/--lk` on `<html>`; a CSS radial-gradient overlay (`mix-blend-mode: overlay`) relights every photo. No runtime dependencies.

```bash
npm install
npm run dev      # dev server
npm run build    # static site in dist/
```

## Key Features

- **Draggable lighting plot**: move the key light and the photographs relight live (key angle, distance, elevation), by pointer or keyboard.
- **25 licensed photographs** in five series, responsive and lazy-loaded.
- **Full-screen viewer** with prev/next, Esc to close, focus return, and the plot as a live control.
- **Stepped running order** and per-series shot logs.
- **Booking call sheet** with validation and an issued state (nothing is sent).

## Responsive Design

Desktop uses a 38/62 ruled split and stepped blocks that bleed off the edge. At 1100px and 820px the layout re-stacks: the hero becomes a single column, the plot moves under the study, the top bar collapses to a "Sheet" menu, and the viewer puts the plot below the image. Verified at 1440, 768 and 375px with no horizontal scroll.

## Accessibility

- Semantic landmarks, skip link, visible focus (3px ink outline plus highlight halo).
- Plot is keyboard operable; viewer is a native `<dialog>` with a live region announcing the frame.
- Form: labels, `aria-invalid`, inline errors announced politely, focus moved to the issued state.
- Photographs carry descriptive alt text (frame buttons are labelled); text contrast meets 4.5:1.
- `prefers-reduced-motion` is respected.
- Not yet audited with a screen reader.

## Status

Complete as a concept, awaiting human review. Not deployed. Project 04 is not started.

Known limits: `prefers-reduced-motion` was implemented but only lightly tested; the CSS light overlay is an approximation, not true relighting; the detector's three `flat-type-hierarchy` warnings were reviewed and left as false positives (it reads HTML without CSS).

## Image credits and licence

Photographs are from Unsplash, used under the [Unsplash licence](https://unsplash.com/license) (free for commercial use, no attribution required; credit given as a courtesy). They are stand-ins and do not depict or represent any real client. The full per-photo credit list, with links, is on the site's About page and generated from `src/photos.json`. Raw downloads (`raw/`) are not committed. Replace them with original photography before any real use.
