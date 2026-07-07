# Floating Product Objects — Design

**Date:** 2026-07-07
**Status:** Approved

## Goal

Add decorative floating sweets (unpackaged, product-palette inspired) with micro
movements to the homepage, in the style of the reference screenshot (Ülker-style
candy/chocolate floaters hugging the page edges).

## Items

8 hand-drawn inline SVG illustrations, semi-3D look (gradients + soft shading),
no packaging:

1. Chocolate chunk with bite-mark edge + 2 crumbs
2. Prinzenrolle-style sandwich biscuit (stamped biscuits, chocolate cream edge, angled)
3. Biskrem-style round biscuit with glossy chocolate center
4. Wafer roll stick (diagonal)
5. Three glossy candy balls (pink, teal, yellow — site palette / Yupo vibe)
6. Raspberry-style bumpy gummy (red)
7. Swirl lollipop (pink/white)
8. Small gummy bear

## Placement

- One absolutely-positioned `pointer-events: none` decoration layer spanning the
  **stats + story** sections (first light areas after the cinematic video hero).
- Items hug left/right edges and inter-section whitespace, sized ~28–80px,
  never overlapping text columns.
- Mobile: only 4 smaller items (edges only).

## Motion

- **Ambient:** per-item CSS keyframe bob (±6–10px) and micro-rotation (±4–8°),
  durations 6–11s with staggered delays so nothing syncs.
- **Scroll parallax:** new `js/floaters.js` — one scroll listener +
  requestAnimationFrame translates each item by scroll progress × per-item
  `data-speed` (−0.06 … 0.12).
- IntersectionObserver pauses animation off-screen.
- `prefers-reduced-motion`: everything static.

## Files

- `index.html` — SVG markup + floater layer, one `<script>` tag
- `css/styles.css` — layer positioning + keyframes
- `js/floaters.js` — new, scroll parallax
- No new image assets.
