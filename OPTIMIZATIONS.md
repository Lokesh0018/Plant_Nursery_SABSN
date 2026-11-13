# SABSN — Performance Analysis and Optimization Plan

A whole-application review of where the site spends its budget, what has already been done, and what to do next.
All numbers are measured from the current production build (`npm run build`) and the `public/` folder.

---

## 1. Where the budget goes today

### First-paint payload (gzip over the wire)

| Resource | Minified | Gzip | Notes |
|---|---:|---:|---|
| `react` chunk | 214 KB | 66 KB | React 19 + DOM; cached across deploys |
| `gsap` chunk | 111 KB | 43 KB | core + ScrollTrigger; cached across deploys |
| `index` (app) | 66 KB | 20 KB | navbar, hero, grids, about, founder, dividers, loader |
| `lenis` chunk | 20 KB | 6 KB | smooth scrolling |
| `vendor` chunk | 13 KB | 5 KB | lucide icons |
| CSS (main) | 48 KB | 11 KB | |
| **First paint JS + CSS** | **472 KB** | **~150 KB** | |
| Lazy: Footer, PlantCare, LivingArchive, Contact (+ CSS) | 67 KB | 22 KB | fetched as you scroll near |
| Lazy: PlantModal, CartDrawer (+ CSS) | 20 KB | 8 KB | on first open |
| Web fonts (Google) | — | ~120–180 KB | 3 families, 12 variants, two third-party connections |

First-screen images on a 1440 px desktop: banyan 332 KB (1200 w) + background 49 + ground 64 + four foliage/flower layers ~113 + logo 21 ≈ **580 KB**. On a phone the banyan drops to 166 KB, ≈ **410 KB**.

`public/` holds 3.6 MB across 46 files, down from 11.9 MB; most of it is `srcset` variants that any one device never downloads together.

### Runtime work (what runs every frame or every scroll)

| Source | Count | Cost |
|---|---:|---|
| `requestAnimationFrame` loops that run continuously | 7 | Navbar active-section poll, `useOffscreenPause` ×4 (hero, founder, footer, stamp), footer wordmark ink, stamp roll. Each reads `scrollY` every frame; most then do nothing. |
| Lenis ticker | 1 | runs on GSAP's ticker every frame, drives every ScrollTrigger update |
| ScrollTrigger scrubs | 6 | hero (10 layer tweens on one trigger), 3 image parallaxes, 2 background-word parallaxes, 6 vine dividers |
| Vine divider SVG nodes | ~6 × 200 | each divider decorates 6 stems at densities 72/105/140 → ~40 leaf/bud/berry groups of 3–4 nodes, all tweened on scroll |
| Canvas animations | 2 | FallingLeaves: 26 leaves in the hero, 10 in the footer (pause off-screen) |
| CSS `infinite` animations | 10 | footer (6), WhatsApp button (2), hero pollen (1), cart (1); footer ones pause off-screen |
| GSAP `repeat: -1` | 3 | founder glow (pauses off-screen), loader leaves, modal float |
| `backdrop-filter` | 27 | navbar pill at `blur(20px)` full-width and fixed; the rest are small chips |
| `mix-blend-mode` | 2 | footer dapple and grain |
| Cursor parallax | 1 | hero, event-driven, measures the hero box per frame |

### Stylesheet weight

134 KB of source CSS across 16 files compiles to 48 KB. Largest: `StorySection.css` 21 KB, `PlantCare.css` 17 KB, `Footer.css` 16 KB. A selector scan finds 7 classes in `StorySection.css` left over from the pre-split founder layout (`founder-grid`, `founder-portrait-*`, `founder-caption`, `founder-frame-leaf-accent`, `founder-image-aspect`) and 3 Lenis helper classes in `global.css` that Lenis adds only when configured to.

---

## 2. Already done

- **Dead code and assets:** removed 3 unused components, 2 stray stylesheets, 27 orphaned images (8.7 MB), the unused `clsx` package; merged 18 duplicate CSS blocks; lint is clean.
- **Scroll cost:** removed every scroll-reveal entrance/exit animation; stripped per-leaf SVG drop-shadows on the dividers; removed redundant `blur()` on gradient orbs and `backdrop-filter` on large opaque cards; looping animations pause off-screen (`useOffscreenPause`).
- **Images:** banyan at 800/1200/1534 px with `srcset`, `fetchpriority="high"` and a preload; nursery, portrait, plants and pots resized to 2× display size; gallery hosted locally, pre-cropped, two widths; manifest icons quantized (214 KB → 35 KB etc.); explicit `width`/`height` or aspect boxes everywhere.
- **Fonts:** render-blocking `@import` replaced by preconnect + `<link>`; 16 variants trimmed to 12; Inter dropped.
- **Bundle:** `es2020` target; React, GSAP and Lenis in their own cached chunks; `PlantCare`, `LivingArchive`, `Contact`, `Footer`, the modal and the cart drawer lazy-loaded behind height-reserving placeholders.
- **Delivery:** `public/_headers` (Netlify/Cloudflare) and `public/.htaccess` (Apache) with brotli/gzip, immutable caching for hashed assets, revalidation for `index.html`, SPA rewrite; `dns-prefetch` for `wa.me`.
- **Loading screen:** progress is driven by real readiness (fonts, hero images, load event) with no fixed delays; the hero entrance plays on hand-over.

---

## 3. What to do next, in priority order

> **Status:** every P1 and P2 item below is now implemented (see the notes marked *Done*). Only the P3 items remain open.

### P1 — Consolidate the per-frame loops (runtime, low effort, measurable on phones)

*Done:* `src/lib/scrollStore.js` runs the single animation-frame loop (only while something is subscribed), reads `scrollY`/`innerHeight`/`scrollHeight` once per frame and notifies subscribers only on change. The navbar, all `useOffscreenPause` instances, the footer wordmark and the stamp subscribe to it; no component owns a frame loop any more.

Seven independent `requestAnimationFrame` loops each read `window.scrollY` every frame. Replace them with one shared scroll store: a single rAF loop that reads `scrollY` and `innerHeight` once, and only when they change notifies subscribers (navbar, the four `useOffscreenPause` instances, the stamp, the wordmark). Expected effect: idle CPU on the page drops to near zero, and scroll frames do one read instead of seven. Files: `src/hooks/useOffscreenPause.js`, `Navbar.jsx`, `FooterStamp.jsx`, `Footer.jsx`.

### P1 — Decide on Lenis (runtime + 6 KB)

*Done (kept, gated):* duration 1.2 → 0.9; Lenis is not created on coarse-pointer (touch) devices or under `prefers-reduced-motion`, so those visitors scroll natively with no per-frame tick. Full removal remains a judgement call on feel.

Lenis adds inertia on top of native scrolling and ticks every frame via GSAP. It is the single biggest contributor to "heavy" scroll feel on mid-range devices, because every scrubbed tween now follows an eased value instead of the native position.
- Quick test: set `duration: 0.9` (currently 1.2) and compare.
- Better: disable Lenis for touch input (`syncTouch` is already off; also skip creating it when `matchMedia('(pointer: coarse)')` matches) and under `prefers-reduced-motion`.
- Best for performance: remove it. The scroll-to-top handling in `main.jsx`, the navbar scroll handling and every ScrollTrigger work natively without it. Removing it also lets `global.css` drop the three `lenis-*` rules.

### P1 — Vine dividers: fewer nodes, grow once (runtime)

*Done:* densities 72/105/140 → 90/130/170 (~25 % fewer nodes), `once: true` so a band grows on first entry and never scrubs backwards, and the secondary/wisp stems are hidden below 1200 px instead of 900 px.

Six dividers × ~200 tweened SVG nodes is the largest scroll-scrub workload on the page.
- Lower the densities in `VineDivider.jsx` (e.g. main 90, sub 130, wisp 170) for roughly 25 % fewer nodes with no visible loss at normal sizes.
- Use `once: true` on the divider's ScrollTrigger so a band grows the first time it enters and never re-animates on the way back up. Scrubbing backwards is the cost nobody notices.
- Keep the phone rule that hides the sub and wisp stems; consider applying it below 1200 px as well.

### P2 — Fonts: self-host the subset (critical path)

*Done:* 12 Latin-subset WOFF2 files (417 KB total, ~37 KB each for Playfair, ~26 KB for Plus Jakarta Sans) live in `public/fonts/` with `@font-face` rules in `src/styles/fonts.css` (`font-display: swap`). The Google Fonts links and both preconnects are gone from `index.html`; Playfair 700 and Plus Jakarta Sans 400 are preloaded. Zero third-party requests remain on the page.

Google Fonts still costs two third-party connections and ~150 KB. Self-hosting subset WOFF2 files (Latin only) under `public/fonts/` with `font-display: swap` lets `index.html` preload the two display faces (Playfair 600/700) and removes the connection cost entirely. Expect ~100–150 ms off first text on a cold mobile connection. Caveat 400 is used for one word; consider rendering that word as an inline SVG and dropping the family.

### P2 — Hero first-screen bytes (LCP)

*Done:* 600 px banyan variant added (94 KB) and the 1200/1534 px files re-encoded at q72 (306/406 KB); `Main Hero Plant.webp` capped at 800 px (161 → 72 KB); `nursery.webp` capped at 1200 px (305 → 216 KB) with `srcset` and dimensions updated.

- The banyan is the LCP element and already has three widths and a preload. Two more savings: export a 600 px variant for narrow phones (the 800 px file is 166 KB; 600 px would be ~100 KB), and try quality 72 on the 1200/1534 files (visually indistinguishable on a photo with this much texture).
- `Main Hero Plant.webp` (161 KB, 1261×1247) is only used as a product image in `src/data/products.js`; it renders at ~300 px. Cap it at 800 px like the other product images.
- `nursery.webp` full size is 305 KB for a 1456 px source; a 1200 px cap is enough for its ~680 px slot at 2×.

### P2 — Navbar backdrop blur

*Done:* `blur(20px)` → `blur(10px) saturate(1.3)` with `contain: paint` on the floating capsule.

The fixed navbar pill blurs at `20px` across the full width on every scroll frame. Drop to `blur(10px)` and add `contain: paint` on the pill; on phones consider a solid translucent background instead of a blur.

### P2 — Stylesheet cleanup

*Done (first half):* 14 orphaned founder-layout rules removed from `StorySection.css`. The Lenis helper rules stay while Lenis stays. The utility-class refactor of `PlantCare.css`/`Footer.css` is still open (maintainability only).

- Delete the 7 orphaned founder-layout rules in `StorySection.css` (~2 KB) and the 3 Lenis helpers in `global.css` if Lenis is removed.
- `PlantCare.css` and `Footer.css` carry per-card and per-layer rules that could share a small set of utility classes; a modest refactor would take 10–15 KB of source out without changing output much, mainly for maintainability.

### P3 — React 19 and GSAP footprint

React (66 KB gzip) cannot shrink without leaving React. GSAP (43 KB gzip) is used for scroll scrubs, the hero, the loader, the stamp and the modal. Two routes if it ever matters:
- Replace scrubbed parallaxes with CSS scroll-driven animations (`animation-timeline: scroll()`), currently supported in Chromium and Firefox and shipping in Safari; keep GSAP only for the hero entrance and loader.
- Or keep GSAP but drop ScrollTrigger for the simple image parallaxes by driving them from the shared scroll store above.

### P3 — Loading screen tuning

The loader waits for fonts, every eager hero image and the load event. On slow networks the load event (which includes below-the-fold lazy images and the font CSS) can hold the overlay longer than needed. Option: wait for fonts and the four largest hero layers only, and let the load event be informational. Keep the watchdog.

### P3 — Delivery

*Partly done:* font preloads are in place now that fonts are self-hosted.

- Pick one of `public/_headers` / `public/.htaccess` for your host and delete the other.
- If the site moves behind Cloudflare, enable Polish/Mirage or Cloudflare Images for on-the-fly resizing and retire the hand-exported `srcset` variants.
- Add `<link rel="preload" as="font">` for the two display faces once fonts are self-hosted.

---

## 4. Things verified as fine (no action)

- No layout shift sources: every image has dimensions or an aspect box; vine bands have fixed heights; lazy sections reserve height.
- All motion uses `transform`/`opacity`; no width/height/top/left animations remain.
- `prefers-reduced-motion` disables every loop and shows final states; the loader and stamp show their finished composition.
- No `console.log` left in source; lint is clean; `React.StrictMode` is on (dev-only double effects are expected).
- SEO basics present: `lang`, title, description, manifest, icons; headings are present in every section.

---

## 5. How to measure

1. `npm run build && npm run preview`, then Lighthouse (mobile, simulated throttling). Targets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms, TBT < 200 ms.
2. Chrome DevTools → Performance, record a slow scroll from top to bottom with CPU 4× throttling. Look for long frames while a vine divider is on screen (P1 above) and for the per-frame scripting baseline when idle (should be ~0 after the loop consolidation).
3. Rendering panel → "Paint flashing": nothing should flash during scroll except the navbar strip.
4. Network panel on a cold load: first screen should be under ~750 KB transferred on desktop and ~600 KB on a phone, including fonts.

---

## 6. Quick wins — all seven done

1. ✔ Shared scroll store replacing seven rAF loops.
2. ✔ Lenis off on touch and reduced motion; `duration: 0.9`.
3. ✔ Vine dividers: lower density, `once: true`, one stem per side below 1200 px.
4. ✔ Self-hosted subset fonts with preload; no third-party requests remain.
5. ✔ `Main Hero Plant.webp` and `nursery.webp` capped; 600 px banyan added; large banyans at q72.
6. ✔ Navbar blur 10 px + `contain: paint`.
7. ✔ Orphaned CSS rules deleted.

### Still open (P3)

- ✔ Lenis removed: native scrolling, no inertia lag, one less chunk.
- ✔ Vine dividers grow once on entry (timed, ~1.6 s) instead of scrubbing on every scroll frame; their shadow is applied only after growth.
- ✔ `backdrop-filter` dropped from near-opaque chips over moving images (About badge and service cards, founder seal, gallery and care tags); parallax layers carry `will-change: transform`.
- Move the simple image parallaxes off ScrollTrigger (or to CSS scroll-driven animations).
- Loader: wait on fonts + largest hero layers only, let the load event be informational.
- Pick one of `_headers` / `.htaccess` for the host and delete the other.
- Optional utility-class refactor of `PlantCare.css` / `Footer.css`.
