# AKAR Homepage — Design Spec

**Date:** 2026-06-02
**Project:** Premium single-page corporate homepage for AKAR GmbH (Turkish & international FMCG distribution in Europe).
**Inputs:** `claude-code-website-brief.md` (content + positioning), `mockup.png` (structure, content, color palette), `https://bombon.rs/` (interaction & motion guidance only).

## Guiding Principle

The **mockup** is authoritative for layout, content, and color palette. **Bombon.rs** is the reference for *how it moves and feels*: Lenis-style smooth scroll, parallax layering, atmospheric floating elements, staggered scroll-reveals, large editorial headlines, a sticky/morphing nav, magnetic interactive elements, and cinematic section pacing. The result must read **premium, established, international, trustworthy** — motion-led but never playful/childish.

## Tech Stack

- **Static HTML / CSS / vanilla JS** — no build step, hostable anywhere.
- **GSAP + ScrollTrigger** — scroll-driven choreography (reveals, parallax, pins, counters).
- **Lenis** — smooth inertial scrolling (loaded via CDN ESM).
- **Custom cursor** — small dot + ring that scales over interactive elements (desktop only; disabled on touch).
- Libraries loaded via CDN. No framework, no bundler.
- `prefers-reduced-motion` respected: motion degrades to instant/opacity-only.

## File Structure

```
index.html
css/
  styles.css        # tokens, layout, components, sections, responsive
js/
  main.js           # Lenis init, GSAP registration, orchestration
  cursor.js         # custom cursor + magnetic buttons
  reveals.js        # scroll reveal + parallax helpers
  counters.js       # animated KPI counters
assets/
  (svg shapes, logo, icons, map — generated, no licensed assets)
```

Keep each JS module focused and independently understandable. CSS organized by clearly commented section blocks.

## Design Tokens

**Color (from mockup):**
- `--teal: #16B0A6` (primary: logo, buttons, accents)
- `--teal-deep: #0E8C84` (hover/darker)
- `--pink: #F0408C` (secondary: highlighted headline words, accents)
- `--blob-pink: #FFE3EC`, `--blob-mint: #D9F5F0`, `--blob-cream: #FFF6E9`
- `--ink: #16302E` (teal-tinted near-black text)
- `--muted: #5C6B69` (secondary text)
- `--bg: #FFFDFB` (near-white background)
- `--card: #FFFFFF` with soft shadow `0 18px 40px -24px rgba(20,48,46,.25)`

**Typography:**
- Display/headlines: **Cabinet Grotesk** (or Clash Display) via Fontshare CDN — bold, geometric, characterful.
- Body/UI: **General Sans** (or Inter) via Fontshare/Google CDN.
- Headlines color individual words per the mockup (e.g. "Turkish" in pink, "World" italic; "glücklich" teal; "Grenzenlos im Handel" pink).
- Fluid type via `clamp()`. Headlines tight (`letter-spacing: -0.02em`, `line-height: 0.95`).

**Spacing/Shape:** Generous section padding (`clamp(80px, 12vh, 160px)`). Rounded geometry — pill buttons (`border-radius: 999px`), cards `border-radius: 24px`, blob shapes via `border-radius` morphs / SVG.

## Asset Strategy

No licensed brand logos or client product photos are available. To stay premium and avoid broken images, all visual content is **generated**:
- **Floating hero "product packets":** styled CSS/SVG shapes with gradients + typeset labels, not photos.
- **Brand wall:** tastefully **typeset wordmark logos** (CSS text styled per brand character) — selective, not cluttered.
- **Category tiles:** gradient cards with label + simple inline-SVG icon.
- **Photos (story/culture/news):** organic-blob-masked gradient placeholders with subtle texture; every slot is structured so real photos drop in later via a single `background-image`/`<img>` swap.
- **Europe map:** inline SVG silhouette with animated location pins.

## Section-by-Section Spec

Order follows the mockup (single long-scroll page; nav links are in-page anchors).

### 1. Sticky Navigation
- Transparent over hero; on scroll-down past hero, condenses into a frosted (`backdrop-filter: blur`) pill bar that fades/slides in.
- Left: AKAR wordmark (teal). Center/right: links (Unternehmen, Marken, Produkte, Präsenz, Karriere) with animated underline on hover. Right: language toggle (DE) + teal pill CTA "Kontakt".
- Mobile: hamburger → full-screen overlay menu with staggered link reveal.
- **Motion:** nav bar morph on scroll; magnetic CTA.

### 2. Hero
- Headline: "Bringing **Turkish** Brands to the *World.*" Supporting copy: 30+ years, FMCG expertise, European network. Two CTAs: "Sortiment entdecken" (filled teal), "Kontakt aufnehmen" (outline).
- Small stat chips below CTAs (e.g. 30+ Jahre · 7 Länder · 800+ Produkte).
- Right: open "box" with product packets that **float/parallax**, settle on load (staggered GSAP intro), and drift subtly toward cursor. Pastel blobs behind on parallax.
- **Motion:** timeline intro (headline words clip-reveal, packets spring in), cursor-parallax on packets, blob parallax on scroll.

### 3. Story — "Seit 1992 machen wir Leute *glücklich.*"
- Left: photo (blob-masked placeholder) revealing via clip-path/scale on scroll. Right: heading + body copy (heritage near Munich, 30+ years, Europe-wide network, passion for quality) + CTA "Mehr über AKAR".
- Below: 4 value cards (Internationale Markenwelt · Zuverlässige Logistik · Qualität, der man vertraut · Partnerschaft auf Augenhöhe) with inline-SVG icons.
- **Motion:** image clip-reveal, copy fade-up, cards stagger-in, card hover lift.

### 4. Brand Wall — "Starke Marken. *Grenzenlos im Handel.*"
- Intro line + selective typeset wordmarks (Ülker, Uludağ, Torku, Halley, Bebeto, Red Bull, Pınar, Cola Turka, Komili, Tat, Superfresh…). Mix of a static stagger-reveal grid and one slow horizontal marquee row. A few floating product shapes between.
- **Motion:** wordmarks stagger/scale in on scroll; marquee row auto-scrolls (pauses on hover); subtle float on decorations.

### 5. Categories — "Vielfalt, die *verbindet.*"
- Grid of rounded/circular category tiles from the brief: Süßes, Salzgebäck, Grundnahrungsmittel, Hülsenfrüchte, Brotaufstriche, Fertiggerichte, Suppen, Speiseöle, Saucen & Gewürze, Eingelegtes, Getränke, Tee & Kaffee, Backwaren, Haushaltswaren. CTA "Jetzt Sortiment entdecken" + space for a "B2B Shop" button.
- **Motion:** tiles pop-scale in on scroll (stagger), hover lift + icon nudge.

### 6. Europe Footprint — "Starke Präsenz. Europaweiter *Service.*"
- Inline-SVG Europe silhouette with location pins for Germany, France, Belgium, Netherlands, Austria, Switzerland, Sweden. Country legend list. Pins drop-in sequentially with pulse.
- KPI counters: 14 Niederlassungen · 7 Länder · 50.500 Palettenkapazität · 15.000+ Verkaufsstellen.
- **Motion:** map fades/draws in, pins sequence-drop + pulse, counters count up on reveal.

### 7. Stats Strip
- Four headline metrics counting up (15+ Länder · 10.000+ Produkte · 1.000+ Kunden · 30+ Jahre Erfahrung), per mockup. (Complements §6; §7 is the broad trust strip, §6 is operational network.)
- **Motion:** counters animate once on first reveal; subtle background blob parallax.

### 8. Culture — "Menschen. Leidenschaft. *Gemeinsam erfolgreich.*"
- Team photo in organic blob frame + copy about shaping the future together + CTA "Karriere entdecken" / "Finden Sie Ihr Team". 4 culture cards (Vielfalt leben · Teamgeist erleben · Verantwortung tragen · Zukunft gestalten).
- **Motion:** blob-mask reveal, copy fade-up, cards stagger.

### 9. News & Events
- Section heading "News & *Events.*" + 3 cards (image, date/tag, title, "Mehr lesen"). Sample editorial content (trade-fair, new warehouse, new brand listing).
- **Motion:** cards fade-up stagger; hover = image zoom + card lift.

### 10. Final CTA — "Let's build success *together.*"
- Centered big statement, floating decorative elements, primary teal button "Kontakt aufnehmen" + secondary "Vertrieb anfragen".
- **Motion:** floating elements parallax, magnetic primary button.

### 11. Footer
- AKAR wordmark + short positioning line. Link columns: Unternehmen, Marken, Produkte, Distribution, Kontakt. Faint world-map SVG backdrop. Socials + copyright + legal (Impressum, Datenschutz).
- **Motion:** gentle reveal on enter.

## Global Motion System

- **Smooth scroll:** Lenis, eased; synced to GSAP ScrollTrigger via `requestAnimationFrame`.
- **Reveals:** reusable helper — elements with `[data-reveal]` fade/translate/clip on enter (stagger groups via `[data-reveal-group]`).
- **Parallax:** `[data-parallax="speed"]` on blobs/products/photos.
- **Counters:** `[data-count]` animate once on first intersection.
- **Magnetic buttons + custom cursor:** desktop pointer only.
- **Reduced motion:** all of the above collapse to instant opacity transitions when `prefers-reduced-motion: reduce`.

## Responsive / Mobile

Mobile-first polish. Hero box restacks below headline; brand wall becomes a single marquee + smaller grid; category grid reflows to 2 columns; map section stacks map over legend/counters. Motion simplified (less parallax, no custom cursor) but reveals/counters retained. Tap targets ≥ 44px.

## Out of Scope (this build)

- Real CMS, live B2B shop, working contact form backend (form is front-end only / mailto).
- Licensed brand logos and real product/team photography (placeholders engineered for easy later swap).
- Separate sub-pages (single-page homepage only; can be added later).

## Success Criteria

- Visually matches the mockup's structure, content, and palette.
- Motion quality evokes Bombon's polish (smooth scroll, layered parallax, staggered reveals, magnetic/cursor interactions) without feeling gimmicky.
- Fully responsive with equal desktop/mobile care; respects reduced-motion.
- Loads with no broken assets; clean, modular, readable code.
