---
name: Marlowe Adeyemi-Voss
description: A fictional fashion photographer's portfolio, set as a shoot-day call sheet with a live lighting plot.
colors:
  paper: "#eceeef"
  paper-2: "#e0e3e5"
  ink: "#0d0e10"
  ink-2: "#3b4147"
  ink-3: "#596067"
  highlighter: "#d4f23a"
typography:
  display:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3rem, 6.4vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.035em"
  numeral:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(3.5rem, 8vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.85
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Schibsted Grotesk Variable, Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(16px, 3vw, 40px)"
  bar: "56px"
  field-y: "10px"
  cell-x: "14px"
components:
  button-primary:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "14px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
  button-ghost-hover:
    backgroundColor: "{colors.highlighter}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  chip-selected:
    backgroundColor: "{colors.highlighter}"
  mark:
    backgroundColor: "{colors.highlighter}"
    textColor: "{colors.ink}"
    padding: "0.45em 0.8em"
  top-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "56px"
---

# Design System: Marlowe Adeyemi-Voss

## Overview

**Creative North Star: "The Call Sheet"**

The interface is the paperwork of a shoot day: call times, slate numbers, a lighting plot, a shot log. It is a cool paper sheet ruled in ink, and the pictures are laid over it at frame scale. The pictures are code-authored WebGL studies of cloth (satin, pleat, tulle, rib, foil) that relight live when the key-light handle on the plot moves. They are labelled as concept imagery.

The system is severe and quiet. Structure comes from 1px ink rules, registration crosses, fold ticks and stamped uppercase field labels, never from cards, radii or shadows. Images set the layout by bleeding off the page edge, stepping across the 12-column grid and overlapping, so each of the five series blocks on the home page has its own composition. One highlighter colour is the only heat in the sheet.

**Key Characteristics:**
- Cool paper, ink and one chartreuse highlighter used as a fill under black text.
- Schibsted Grotesk only. Rank is carried by weight and case, not by a wide size range.
- Every series and frame keeps a durable two-digit number; numerals are the largest type on the page.
- Zero radius and zero shadow everywhere; depth is overlap and ruled edges.
- Asymmetric 38 / 62 split as the recurring page grammar.

## Colors

A near-monochrome cool sheet with a single fluorescent marker.

### Primary
- **Highlighter Chartreuse** (`highlighter`): Only ever a fill behind ink text or an ink-outlined control: primary button, "your call" marks (`.mark`), active and hover nav, hovered ghost buttons, selected chips, focused form cells, the draggable light handle, text selection, the focus halo. Never a text color, border or line color.

### Neutral
- **Cool Paper** (`paper`): page, bar, plot and form sheet ground.
- **Paper Shade** (`paper-2`): the recessed tone behind canvases while they load, the subject disc on the plot, error cells.
- **Ink** (`ink`): text, all structural rules, registration crosses, the camera mark.
- **Ink Soft** (`ink-2`): running body copy and blurbs.
- **Ink Quiet** (`ink-3`): stamped field labels, plot axes, fine print. Darkest step that still reads as secondary; do not lighten it.

### Named Rules
**The Fill-Only Rule.** Chartreuse is a background under black text, never a foreground. Its meaning is "this is yours to act on" or "this is active".
**The Ink Rule.** Structure is `1px solid ink` (`--rule`) for major divisions and ink at 28% alpha (`--hair`) for row dividers. No other line colors.
**The Not-By-Colour Rule.** State is never colour alone: errors add a thick ink underline and a "Fix:" prefix, selected chips add an inset ink outline, current nav is also filled and marked with aria-current.

## Typography

**Display / Body / Label Font:** Schibsted Grotesk Variable (fallback system-ui, sans-serif). One family throughout.

**Character:** A plain, exacting grotesque. Weight 800 with tight negative tracking for numerals and headlines, weight 600 tiny caps for labels, weight 400 for reading text.

### Hierarchy
- **Display** (800, clamp(3rem, 6.4vw, 6rem), 0.94, -0.035em): hero headline, series title, about and booking h1 (the last two at clamp 2.5 to 5rem), closing call (clamp 2.25 to 4.5rem).
- **Numeral** (800, clamp(3.5rem, 8vw, 6rem), 0.85, -0.04em): series numbers 01 to 05 on the home blocks and series heads; tabular figures.
- **Headline** (800, 1.75rem, 1.1, -0.02em): block titles and section headings; 1.25rem for the small block 03 title.
- **Body** (400, 1.0625rem, 1.5): reading text, capped at 34 to 62ch by context; 0.9375rem for field values and table cells, 0.875rem for fine print and captions.
- **Label** (600, 0.75rem, 0.08em, uppercase, 1.3): stamped legends, field names (dt), table heads, nav links, frame counter, plot headers, form labels. The `.leg` legend is 700 at 0.8125rem and is the actual section heading for "Running order", "The brief", "Shot log" and "Concept notice".

### Named Rules
**The Rank-By-Weight Rule.** Hierarchy comes from weight (400, 600, 700, 800) and case, not from many sizes. Add a new size only for numerals and display.
**The Tabular Rule.** `tabular-nums` only on counters, table cells, plot readouts, numerals and refs, where figures must align.

## Layout

A 12-column grid with a fluid gutter (`clamp(16px, 3vw, 40px)`) that is also the page margin. Most text regions use a 38fr / 62fr split: legend or headline left, content right (hero, order head, brief, log, about, booking, closing call, footer). A 56px fixed top bar (52px on phones) carries name, frame counter (centered) and three links; `scroll-padding-top` clears it.

Images bleed: negative gutter margins push plates to the viewport edge. Home blocks use five different compositions (tall right with info left; wide left with info right; overlapped pair with a 12px paper outline knockout; full-width 8:3 strip with info row beneath; narrow 3:5 centre-right). Series frames use named layouts (wide 3:2, tall 4:5, small 1:1, half pair offset by `clamp(40px, 8vw, 120px)`, strip 8:3, full 21:9). Vertical rhythm is `clamp(36px, 6vw, 96px)` between blocks, with a 1px fold tick between series.

Breakpoints: 1100px (tighten block 2 and 4) and 820px (single column, hamburger bar with a full-screen numbered nav, hero reorders fields, study, plot, headline; tables collapse to labelled rows). On phones the varied bleed becomes varied side margins (10 to 30%) so the stepped rhythm survives.

## Elevation & Depth

Flat. There are no drop shadows. Depth is overlap (the plot sits over the hero study; the small Veil frame overlaps the large one with a paper outline), ruled edges and the recessed `paper-2` tone. The only box-shadow is the keyboard focus halo (see Components).

### Named Rules
**The No-Shadow Rule.** Surfaces are flat ink-on-paper. Hierarchy is made with rules, scale and overlap.

## Shapes

Square. Every corner is 0px: buttons, chips, form cells, canvases, plot, handle (a 26px square with a 6px ink centre). Forms are ruled boxes. Recurring marks are drawn in CSS gradients: registration crosses (17px, offset -9px at two corners of a frame) and 1px fold ticks. Plates are cropped rectangles with fixed aspect ratios.

## Components

### Buttons
- **Shape:** square, `1px` ink border.
- **Primary:** chartreuse fill, ink text, weight 700, padding 14px 20px; trailing arrow glyph is decorative and `aria-hidden`. Hover inverts to ink fill with paper text (0.15s); active nudges down 1px.
- **Ghost (viewer close/step, nav menu, issued reset):** transparent, ink border, label caps, padding about 10px 14px; hover fills chartreuse.
- **Mark (`.mark`):** non-interactive chartreuse label block for "Open series"; inverts to ink inside a hovered block link.

### Chips
Paper fill, ink border, weight 600. Selected: chartreuse fill plus inset 3px ink outline. Focus: 3px ink outline with offset. The hidden radio or checkbox stays the real control.

### Inputs / Fields
A form is a ruled two-column sheet of cells. Fields are transparent with a 1px ink-3 underline only, labels in stamped caps above. Focus is the whole cell filling chartreuse (the default outline is removed inside cells). Error: cell shifts to `paper-2`, the underline thickens to 3px ink, and the message is prefixed "Fix:". Selects use a CSS-drawn ink caret.

### Navigation
Uppercase label-size links right-aligned in the 56px ruled bar. Hover and current page fill chartreuse. Under 820px a bordered "Menu" button opens a full-screen list of 36 to 56px weight-800 links, each ruled.

### Lighting Plot (signature)
A 260px ruled panel (190px in the viewer, hidden on phones) with a top-down diagram: rings, dashed axes, subject disc, camera mark, dashed beam and a draggable square chartreuse key-light handle; a three-column readout of angle and values sits below. Dragging relights the canvas studies live. It appears in the hero, every series head and the fullscreen viewer.

### Field Block (call-sheet data)
A `dl` with a 1px ink top rule, rows separated by hairlines, label column 6 to 7.5rem in `ink-3` caps and value in 0.9375rem. Used for Production/Call/Location and each series' call, location and garments.

### Fullscreen Viewer
A native `dialog` on paper with a ruled top bar (big frame number, title, close), the study at contain scale, ruled bottom bar with prev/next. Focus-trapped, arrows and Escape work. Motion is a 260ms cut with `cubic-bezier(0.2, 0.7, 0.2, 1)`; reduced motion disables all transitions.

## Do's and Don'ts

### Do:
- **Do** keep chartreuse (`#d4f23a`) as a fill under ink text only, for action, "your call" and active state.
- **Do** build structure from `1px solid ink` rules and 28%-ink hairlines; register crosses and fold ticks are the ornaments.
- **Do** give every series and frame a fixed two-digit number and show it at display scale.
- **Do** keep all corners at 0px and all surfaces shadow-free.
- **Do** rank by weight and case in Schibsted Grotesk; use `tabular-nums` only where figures align.
- **Do** vary each new image block's composition (bleed, step, overlap) rather than repeating one row.
- **Do** label generated imagery as concept imagery and keep canvas studies relit by the plot.
- **Do** keep the focus halo: 3px ink outline, 2px offset, plus a 6px chartreuse ring.

### Don't:
- **Don't** use chartreuse as text, border or icon color.
- **Don't** use card grids, rounded thumbnails, hover overlays or a dark gallery ground.
- **Don't** add radii, drop shadows or gradients as decoration.
- **Don't** add a second typeface or a wide size ramp to express rank.
- **Don't** carry state by colour alone.
