# SABSN — Sri Ayyappa Bala Sai Nursery

Single-page marketing site for a plant nursery in Kadiam, Andhra Pradesh. Built with React 19, Vite and GSAP.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

## Structure

- `src/App.jsx` — page composition: hero, plants, pots, about, founder, care, gallery, contact, footer, joined by `VineDivider` bands.
- `src/components/` — one `.jsx` + `.css` pair per section.
- `src/hooks/useSmoothScroll.js` — Lenis smooth scrolling driven by GSAP's ticker.
- `src/hooks/useOffscreenPause.js` — pauses a section's looping animations while it is off screen.
- `src/styles/global.css` — design tokens (colors, fonts) and global rules.
- `public/` — static assets (WebP images, icons, manifest).

See `OPTIMIZATIONS.md` for the performance plan.
