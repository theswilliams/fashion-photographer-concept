# Marlowe Adeyemi-Voss: fashion photographer (concept)

> **Fictional concept project.** Marlowe Adeyemi-Voss, the studio, clients, garments, locations and contact details are invented for a web design portfolio. There are no real clients, testimonials or results. The booking form sends nothing and stores nothing. All imagery is concept imagery drawn in code, standing in for photography.

Project 03 of a five-site portfolio series. Each site is meant to differ from the others in layout, type, navigation, interaction, motion and density (see [docs/DIFFERENTIATION-MATRIX.md](docs/DIFFERENTIATION-MATRIX.md)).

## Project

A portfolio site for a fictional fashion photographer. Five series of work, each a fabric: Bias (oxblood satin), Pleat Study (bone), Veil (black tulle), Rib (cobalt knit), Crumple (silver foil).

## Challenge

A photographer's site has to be led by the pictures, not by UI cards around them. But there are no real photographs here. The job was to make the images the structure of the page and keep the interface as quiet paperwork around them.

## Design Direction

The paperwork is the interface: a shoot-day **call sheet** with a **lighting plot**. Cool paper, ink, thin rules, registration crosses, and one chartreuse highlighter used only as a fill under black text. Schibsted Grotesk throughout; rank comes from weight and case, not size. No rounded corners, no shadows. Full detail in [DESIGN.md](DESIGN.md).

## UX Approach

- The home page opens on a ruled call-sheet block beside a large study, with a live lighting plot overlapping it.
- The "running order" lists the five series as stepped, alternating image blocks, not a card grid.
- Each series page has a shot log and a frame sequence. Any frame opens a full-screen viewer.
- A fixed top bar carries a live frame counter that follows what is on screen.
- Booking is a call-sheet form with inline validation and an "issued" confirmation.

## Technology

Vite + vanilla TypeScript, multi-page static (8 HTML pages). A small Vite plugin injects shared partials; `scripts/gen-series.mjs` generates the series pages from `src/series.json`. Images are WebGL fragment shaders (`src/light.ts`, `src/studies.ts`) on one shared context, painted only while visible. No runtime dependencies, no raster images.

```bash
npm install
npm run dev      # dev server
npm run build    # static site in dist/
```

## Key Features

- **Draggable lighting plot**: move the key light and the images relight live (key angle, distance, elevation), by pointer or keyboard.
- **Code-authored cloth studies** for five fabrics, rendered in WebGL.
- **Full-screen viewer** with prev/next, Esc to close, focus return, and the plot as a live control.
- **Stepped running order** and per-series shot logs.
- **Booking call sheet** with validation and an issued state (nothing is sent).
- WebGL context-loss handling and a no-WebGL fallback.

## Responsive Design

Desktop uses a 38/62 ruled split and stepped blocks that bleed off the edge. At 1100px and 820px the layout re-stacks: the hero becomes a single column, the plot moves under the study, the top bar collapses to a "Sheet" menu, and the viewer puts the plot below the image. Verified at 1440, 768 and 375px with no horizontal scroll.

## Accessibility

- Semantic landmarks, skip link, visible focus (3px ink outline plus highlight halo).
- Plot is keyboard operable; viewer is a native `<dialog>` with a live region announcing the frame.
- Form: labels, `aria-invalid`, inline errors announced politely, focus moved to the issued state.
- Decorative canvases are labelled as concept studies (or hidden in the viewer); text contrast meets 4.5:1.
- `prefers-reduced-motion` is respected.
- Not yet audited with a screen reader.

## Status

Complete as a concept, awaiting human review. Not deployed. Project 04 is not started.

Known limits: `prefers-reduced-motion` and the no-WebGL fallback were implemented but only lightly tested; the detector's three `flat-type-hierarchy` warnings were reviewed and left as false positives (it reads HTML without CSS).

**To replace with real photography:** the hero study, the five series covers, every frame in `src/series.json` series, the About study.
