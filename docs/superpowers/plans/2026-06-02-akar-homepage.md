# AKAR Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Use the **frontend-design** skill while implementing visual/section tasks.

**Goal:** Build a premium, motion-led single-page corporate homepage for AKAR GmbH matching the mockup's structure/content/palette, with Bombon-class interaction polish.

**Architecture:** Static `index.html` + modular CSS + vanilla JS. Smooth scroll via Lenis; scroll choreography via GSAP + ScrollTrigger; reusable data-attribute helpers drive reveals, parallax, and counters; a custom cursor + magnetic buttons add desktop polish. All assets generated (CSS/SVG) — no licensed/photo dependencies. `prefers-reduced-motion` collapses motion to instant.

**Tech Stack:** HTML5, CSS3 (custom properties, clamp, backdrop-filter), vanilla ES modules, GSAP 3 + ScrollTrigger (CDN), Lenis (CDN), Fontshare fonts (Cabinet Grotesk + General Sans).

**Spec:** `docs/superpowers/specs/2026-06-02-akar-homepage-design.md`

**Verification model:** No unit-test framework. Each task is verified by serving the site (`python3 -m http.server 8080`) and using Playwright MCP to navigate to `http://localhost:8080`, take a screenshot, and confirm **zero console errors** + the expected DOM/visual result. A persistent background server is started in Task 0.

---

## File Structure

```
index.html              # All sections, semantic markup, data-* motion hooks
css/
  styles.css            # Tokens, base, layout, components, all sections, responsive, reduced-motion
js/
  main.js               # Entry: Lenis init, GSAP register + ScrollTrigger sync, calls init helpers
  reveals.js            # initReveals(): [data-reveal], [data-reveal-group], [data-parallax]
  counters.js           # initCounters(): [data-count]
  cursor.js             # initCursor(): custom cursor + [data-magnetic] buttons + nav scroll-morph
assets/
  europe.svg            # inline-referenced silhouette (or inlined in HTML)
```

Single CSS file is intentional (one cohesive design system, easier token reuse for a one-page site); it is organized by clearly commented `/* === SECTION === */` blocks. JS is split by responsibility.

---

### Task 0: Scaffold + tooling + dev server

**Files:**
- Create: `index.html`, `css/styles.css`, `js/main.js`, `js/reveals.js`, `js/counters.js`, `js/cursor.js`

- [ ] **Step 1: Create `index.html` skeleton** with head (meta, German `lang="de"`, Fontshare + GSAP + Lenis CDN links), an empty `<main>`, and module script. **Add `integrity="sha384-…" crossorigin="anonymous"` (Subresource Integrity) to the GSAP/ScrollTrigger CDN `<script>` tags** — fetch the correct hashes from jsDelivr (`https://www.jsdelivr.com/package/npm/gsap` → SRI tab, pinned to 3.12.5) during implementation. The Lenis ESM import is version-pinned in the URL.

```html
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AKAR GmbH — Türkische & internationale Lebensmittel für den Handel in Europa</title>
  <meta name="description" content="AKAR GmbH — Ihr Full-Service-Partner für türkische und internationale Lebensmittel und Distribution in Europa. Über 30 Jahre Erfahrung." />
  <link rel="preconnect" href="https://api.fontshare.com" />
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800,900&f[]=general-sans@400,500,600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>
  <script type="module" src="js/main.js"></script>
</head>
<body>
  <div class="cursor" aria-hidden="true"></div>
  <main><!-- sections appended in later tasks --></main>
</body>
</html>
```

- [ ] **Step 2: Create empty module stubs** so imports resolve.

`js/reveals.js`, `js/counters.js`, `js/cursor.js` each: `export function initX() {}` (named per file: `initReveals`, `initCounters`, `initCursor`).

- [ ] **Step 3: Create `js/main.js`** that imports Lenis (CDN ESM), sets up smooth scroll + GSAP ScrollTrigger sync, and calls the init helpers after DOM ready.

```js
import Lenis from 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs';
import { initReveals } from './reveals.js';
import { initCounters } from './counters.js';
import { initCursor } from './cursor.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function boot() {
  const gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);

  if (!reduceMotion) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  initReveals({ gsap, ST, reduceMotion });
  initCounters({ gsap, ST });
  initCursor({ gsap, reduceMotion });
}

// GSAP loads with defer; wait for it.
window.addEventListener('load', () => {
  if (window.gsap) boot();
  else { const i = setInterval(() => { if (window.gsap) { clearInterval(i); boot(); } }, 30); }
});
```

- [ ] **Step 4: Create `css/styles.css`** with a reset + the design tokens from the spec under `:root`, base `body` typography, and `.cursor` hidden on touch. (Tokens: teal/pink/blobs/ink/muted/bg from spec.)

- [ ] **Step 5: Start a persistent dev server** (background) for all later verification.

Run: `python3 -m http.server 8080` (run_in_background)
Expected: serving at 0.0.0.0:8080.

- [ ] **Step 6: Verify** via Playwright MCP: navigate to `http://localhost:8080`, screenshot, check console.
Expected: blank near-white page, **no console errors**, fonts loading.

- [ ] **Step 7: Commit**

```bash
git add index.html css js && git commit -m "feat: scaffold AKAR homepage with motion tooling"
```

---

### Task 1: Motion helpers (reveals, parallax, counters, cursor)

Build the reusable infrastructure first so every section just adds `data-*` hooks.

**Files:** Modify `js/reveals.js`, `js/counters.js`, `js/cursor.js`, `css/styles.css`

- [ ] **Step 1: Implement `initReveals`** — fade/translate/clip on `[data-reveal]`, stagger children of `[data-reveal-group]`, parallax on `[data-parallax]` (value = speed). Reduced-motion: set elements visible immediately, skip parallax.

```js
export function initReveals({ gsap, ST, reduceMotion }) {
  const reveals = gsap.utils.toArray('[data-reveal]');
  reveals.forEach((el) => {
    if (reduceMotion) { gsap.set(el, { opacity: 1, y: 0, clipPath: 'none' }); return; }
    const type = el.dataset.reveal || 'up';
    const from = { opacity: 0, y: type === 'up' ? 40 : 0, scale: type === 'scale' ? 0.9 : 1 };
    gsap.fromTo(el, from, {
      opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    const items = group.children;
    if (reduceMotion) { gsap.set(items, { opacity: 1, y: 0 }); return; }
    gsap.fromTo(items, { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 80%' }
    });
  });
  if (reduceMotion) return;
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.2;
    gsap.to(el, { yPercent: -speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.closest('section') || el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}
```

- [ ] **Step 2: Implement `initCounters`** — animate `[data-count]` (target number, optional `data-suffix`/`data-prefix`, locale-formatted with `.` thousands like the mockup) once on first reveal.

```js
export function initCounters({ gsap, ST }) {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    const obj = { v: 0 };
    ST.create({ trigger: el, start: 'top 85%', once: true, onEnter: () => {
      gsap.to(obj, { v: end, duration: 1.6, ease: 'power2.out',
        onUpdate: () => { el.textContent = pre + Math.round(obj.v).toLocaleString('de-DE') + suf; } });
    }});
  });
}
```

- [ ] **Step 3: Implement `initCursor`** — dot+ring following pointer, scales over `a, button, [data-magnetic]`; magnetic translate on `[data-magnetic]`; nav scroll-morph (add `.is-stuck` to `header` after scrollY > hero). Disable entirely on touch / reduced-motion.

```js
export function initCursor({ gsap, reduceMotion }) {
  const header = document.querySelector('header');
  const onScroll = () => header && header.classList.toggle('is-stuck', window.scrollY > window.innerHeight * 0.85);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const touch = window.matchMedia('(hover: none)').matches;
  const cursor = document.querySelector('.cursor');
  if (touch || reduceMotion || !cursor) { if (cursor) cursor.style.display = 'none'; return; }
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3' });
  window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); });
  document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
  });
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)' }));
  });
}
```

- [ ] **Step 4: Add cursor + reduced-motion CSS** to `styles.css`: `.cursor` fixed, mix-blend, `transform: translate(-50%,-50%)`, transition scale on `.is-active`; `@media (prefers-reduced-motion: reduce){ * { animation-duration:.01ms!important; scroll-behavior:auto } }`; `@media (hover:none){ .cursor{display:none} }`.

- [ ] **Step 5: Verify** — add one temporary `<div data-reveal style="height:200px">` and `<span data-count="800" data-suffix="+">`, serve, Playwright navigate + scroll, screenshot, confirm reveal fires, counter animates, no console errors. Remove temp markup after.

- [ ] **Step 6: Commit**

```bash
git add js css && git commit -m "feat: reusable reveal, parallax, counter, and cursor helpers"
```

---

### Task 2: Sticky navigation

**Files:** Modify `index.html` (prepend `<header>`), `css/styles.css`

- [ ] **Step 1:** Add semantic `<header>` with AKAR wordmark (teal, styled text logo), nav links (`Unternehmen, Marken, Produkte, Präsenz, Karriere` → in-page `#anchors`), `DE` language chip, and a `data-magnetic` teal pill CTA "Kontakt". Add a mobile hamburger button + `<nav class="mobile-menu">` overlay with the same links.
- [ ] **Step 2:** CSS — fixed header, transparent initially; `.is-stuck` → frosted `backdrop-filter: blur(12px)`, white/translucent bg, shadow, slight padding shrink (transition). Animated underline on links (`::after` scaleX). Mobile: hide inline links, show hamburger; `.mobile-menu` full-screen, links stagger via CSS transition when `.open`.
- [ ] **Step 3:** Add minimal JS in `cursor.js` (or a tiny inline handler in `main.js`) to toggle `.open` on hamburger click + close on link click. Keep it small and focused.
- [ ] **Step 4: Verify** — Playwright desktop screenshot (transparent over future hero area), scroll to confirm `.is-stuck` frosted state; resize to 390px, open mobile menu, screenshot. No console errors.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: sticky morphing navigation with mobile menu"`

---

### Task 3: Hero

**Files:** Modify `index.html`, `css/styles.css`, `js/main.js` (hero intro timeline)

- [ ] **Step 1:** Markup — `<section id="hero">`: left column headline "Bringing <em class="pink">Turkish</em> Brands to the <span class="italic">World.</span>", sub-copy (30+ Jahre, FMCG-Expertise, europaweites Netzwerk), two CTAs (`data-magnetic` filled "Sortiment entdecken" → `#sortiment`, outline "Kontakt aufnehmen" → `#kontakt`), stat chips row (30+ Jahre · 7 Länder · 800+ Produkte). Right column: `.hero-box` (open-box SVG/CSS) with 6 `.packet` elements (gradient + typeset labels: Lokum, Halley, Cola Turka, Hobby, Metro, Ülker), each `data-parallax`. Background: 3 `.blob` divs `data-parallax`.
- [ ] **Step 2:** CSS — two-column grid (stacks on mobile), fluid headline `clamp(2.6rem, 7vw, 6rem)` line-height .95, pink/teal word colors, pill buttons, chip styling, absolutely-positioned packets around the box, blob gradients with blur.
- [ ] **Step 3:** Hero intro timeline in `main.js` `boot()` (guarded by `!reduceMotion`): headline lines clip/`y` reveal, packets spring in from box with stagger (`back.out`), chips fade up. Add subtle cursor-parallax: on `mousemove` translate packets by small factor (reuse pattern; keep in `main.js`).
- [ ] **Step 4: Verify** — Playwright: load, screenshot above-the-fold (desktop + 390px). Confirm intro animation ran (packets visible/positioned), no console errors, no layout overflow.
- [ ] **Step 5: Commit** `git commit -am "feat: hero with animated product-box intro"`

---

### Task 4: Story "Seit 1992" + value cards

**Files:** Modify `index.html`, `css/styles.css`

- [ ] **Step 1:** `<section id="unternehmen">`: left blob-masked photo placeholder (`.photo-blob`, gradient + `data-reveal="scale"`), right heading "Seit 1992 machen wir Leute <em class='teal'>glücklich.</em>", body copy (Großhandel/heritage near Munich, 30+ Jahre, europaweites Netzwerk, Qualität), CTA "Mehr über AKAR". Below: `<div data-reveal-group>` 4 value cards (Internationale Markenwelt, Zuverlässige Logistik, Qualität der man vertraut, Partnerschaft auf Augenhöhe) each with inline-SVG icon + title + 1-line copy.
- [ ] **Step 2:** CSS — two-column, `.photo-blob` organic `border-radius` + overflow hidden, card grid (4→2→1 cols), card hover lift (`translateY(-6px)` + shadow).
- [ ] **Step 3: Verify** — Playwright scroll to section, screenshot desktop + mobile, confirm clip reveal + card stagger fired, no console errors.
- [ ] **Step 4: Commit** `git commit -am "feat: heritage story section with value cards"`

---

### Task 5: Brand wall

**Files:** Modify `index.html`, `css/styles.css`, `js/main.js` (marquee)

- [ ] **Step 1:** `<section id="marken">`: heading "Starke Marken. <em class='pink'>Grenzenlos im Handel.</em>" + intro line. A `data-reveal-group` grid of ~10 typeset wordmark logos (`.brand` styled spans: Ülker, Uludağ, Torku, Halley, Bebeto, Red Bull, Pınar, Cola Turka, Komili, Tat) + below them a `.marquee` row duplicating a subset for seamless loop. A couple floating `.packet` decorations `data-parallax`.
- [ ] **Step 2:** CSS — brand grid (responsive auto-fit), each wordmark with distinct weight/letter-spacing/color to feel logo-like (no images). `.marquee` overflow hidden; `.marquee__track` flex; animation `marquee 28s linear infinite`; pause on hover.
- [ ] **Step 3:** Ensure marquee uses CSS animation (works without JS); if reduced-motion, CSS media query sets `animation: none` and centers content.
- [ ] **Step 4: Verify** — Playwright screenshot, confirm marquee moving (two screenshots ~1s apart differ) + wordmarks readable, no console errors.
- [ ] **Step 5: Commit** `git commit -am "feat: brand wall with wordmarks and marquee"`

---

### Task 6: Product categories

**Files:** Modify `index.html`, `css/styles.css`

- [ ] **Step 1:** `<section id="sortiment">`: heading "Vielfalt, die <em class='teal'>verbindet.</em>" + intro. `data-reveal-group` grid of 14 category tiles (Süßes, Salzgebäck, Grundnahrungsmittel, Hülsenfrüchte, Brotaufstriche, Fertiggerichte, Suppen, Speiseöle, Saucen & Gewürze, Eingelegtes, Getränke, Tee & Kaffee, Backwaren, Haushaltswaren) — each `.cat` round/rounded gradient tile with inline-SVG icon + label. CTAs: "Jetzt Sortiment entdecken" (filled, `data-magnetic`) + "B2B Shop" (outline).
- [ ] **Step 2:** CSS — responsive tile grid (auto-fit minmax; 2 cols mobile), each tile unique pastel gradient cycling teal/pink/cream, hover scale + icon nudge, `data-reveal="scale"` pop-in.
- [ ] **Step 3: Verify** — Playwright screenshot desktop + mobile, confirm 14 tiles render + pop-in stagger, no console errors.
- [ ] **Step 4: Commit** `git commit -am "feat: product category grid"`

---

### Task 7: Europe footprint map

**Files:** Create `assets/europe.svg` content (inline in HTML), Modify `index.html`, `css/styles.css`

- [ ] **Step 1:** `<section id="praesenz">`: heading "Starke Präsenz. <em class='teal'>Europaweiter Service.</em>". Left: inline SVG simplified Europe silhouette with 7 `.pin` markers (absolute-positioned over the map container) for DE, FR, BE, NL, AT, CH, SE; a country legend list. Right/below: 4 KPI counters using `[data-count]`: 14 Niederlassungen, 7 Länder, 50500 Palettenkapazität, 15000 Verkaufsstellen (`data-suffix="+"` where appropriate).
- [ ] **Step 2:** CSS — map container relative; `.pin` with pulsing ring `@keyframes pulse`; legend grid; KPI layout. Pins animate drop-in: add `data-reveal-group` on pin container (stagger handles sequence).
- [ ] **Step 3: Verify** — Playwright scroll to section, screenshot, confirm pins placed over map + counters animate to correct German-formatted values (e.g. "50.500"), no console errors.
- [ ] **Step 4: Commit** `git commit -am "feat: europe footprint map with animated KPIs"`

---

### Task 8: Stats strip

**Files:** Modify `index.html`, `css/styles.css`

- [ ] **Step 1:** `<section class="stats">`: 4 large counters per mockup — 15+ Länder, 10.000+ Produkte, 1.000+ Kunden, 30+ Jahre Erfahrung — using `[data-count]` + `data-suffix="+"` + label. Light pastel-blob background `data-parallax`.
- [ ] **Step 2:** CSS — 4-col flex (2x2 mobile), big teal numbers, muted labels, generous padding.
- [ ] **Step 3: Verify** — Playwright screenshot, confirm counters animate once, no console errors.
- [ ] **Step 4: Commit** `git commit -am "feat: trust stats strip"`

---

### Task 9: Culture section

**Files:** Modify `index.html`, `css/styles.css`

- [ ] **Step 1:** `<section id="karriere">`: team photo in `.photo-blob` (`data-reveal="scale"`), heading "Menschen. Leidenschaft. <em class='pink'>Gemeinsam erfolgreich.</em>", copy + CTA "Karriere entdecken". `data-reveal-group` of 4 culture cards (Vielfalt leben, Teamgeist erleben, Verantwortung tragen, Zukunft gestalten) with icons.
- [ ] **Step 2:** CSS — mirror of story section layout (image right or left per mockup), reuse `.photo-blob` + card styles (DRY — no new card classes).
- [ ] **Step 3: Verify** — Playwright screenshot desktop + mobile, confirm reveal + cards, no console errors.
- [ ] **Step 4: Commit** `git commit -am "feat: company culture section"`

---

### Task 10: News & Events

**Files:** Modify `index.html`, `css/styles.css`

- [ ] **Step 1:** `<section id="news">`: heading "News & <em class='pink'>Events.</em>". `data-reveal-group` of 3 `.news-card`s (gradient image header + date/tag chip + title + "Mehr lesen" link). Sample content: Messe/Anuga 2024, Neues Lager in Hamburg, Neue Marken im Sortiment.
- [ ] **Step 2:** CSS — 3-col grid (1 col mobile), card hover = image `scale(1.05)` + card lift, rounded corners, overflow hidden on image.
- [ ] **Step 3: Verify** — Playwright screenshot + hover one card (screenshot), confirm zoom, no console errors.
- [ ] **Step 4: Commit** `git commit -am "feat: news and events cards"`

---

### Task 11: Final CTA + footer

**Files:** Modify `index.html`, `css/styles.css`

- [ ] **Step 1:** `<section id="kontakt" class="cta">`: centered "Let's build success <em class='pink'>together.</em>", sub-line, primary `data-magnetic` teal button "Kontakt aufnehmen" + secondary outline "Vertrieb anfragen", floating decoration `.packet`s `data-parallax`.
- [ ] **Step 2:** `<footer>`: AKAR wordmark + positioning line ("Mit unserer Leidenschaft für das Beste."), 5 link columns (Unternehmen, Marken, Produkte, Distribution, Kontakt), faint inline world-map SVG backdrop, social icon row, copyright + Impressum/Datenschutz line.
- [ ] **Step 3:** CSS — CTA centered with blob bg; footer dark-teal or light per mockup (light with teal accents), responsive columns (stack on mobile).
- [ ] **Step 4: Verify** — Playwright screenshot footer desktop + mobile, no console errors.
- [ ] **Step 5: Commit** `git commit -am "feat: final CTA and footer"`

---

### Task 12: Responsive + reduced-motion + final polish pass

**Files:** Modify `css/styles.css`, any section as needed

- [ ] **Step 1:** Full-page Playwright sweep at 1440px, 768px, 390px — full-page screenshots. Fix any overflow, cramped spacing, broken stacking, or tap targets < 44px.
- [ ] **Step 2:** Toggle reduced-motion in Playwright (`browser_emulate_media` or launch flag) — confirm content all visible, counters show final values, no infinite marquee, no cursor. Fix any element stuck at `opacity:0`.
- [ ] **Step 3:** Console + network check across full scroll — zero errors, no failed asset requests.
- [ ] **Step 4:** Cross-check every spec section (§1–§11) renders with its intended motion. List + fix gaps.
- [ ] **Step 5: Commit** `git commit -am "polish: responsive, reduced-motion, and final QA pass"`

---

### Task 13: README + project docs

**Files:** Create `README.md`

- [ ] **Step 1:** Write `README.md` — project summary, how to run (`python3 -m http.server`), stack, where to swap in real photos/logos (the engineered asset slots), and credits to the spec/plan.
- [ ] **Step 2: Commit** `git commit -am "docs: add README"`

---

## Self-Review Notes

- **Spec coverage:** Nav(§1)→T2, Hero(§2)→T3, Story(§3)→T4, Brands(§4)→T5, Categories(§5)→T6, Europe(§6)→T7, Stats(§7)→T8, Culture(§8)→T9, News(§9)→T10, Final CTA+Footer(§10–11)→T11. Global motion system→T1. Responsive/reduced-motion→T12. All covered.
- **Verification adapted** from TDD to browser-based (no test framework for a static motion site) — each task ends in a real Playwright check + commit, consistent across all tasks.
- **Type/name consistency:** helper names `initReveals/initCounters/initCursor`, data hooks `data-reveal`/`data-reveal-group`/`data-parallax`/`data-count`/`data-magnetic`, classes `.packet`/`.photo-blob`/`.blob`/`.cursor.is-active`/`header.is-stuck` used consistently across tasks.
- **No placeholders:** shared infrastructure code is given in full (T0–T1); section tasks specify exact content, headings, classes, and data hooks reusing that infrastructure.
