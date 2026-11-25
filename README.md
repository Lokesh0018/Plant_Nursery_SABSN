# SABSN — Sri Ayyappa Bala Sai Nursery

Marketing site for a plant nursery in Kadiyam (near Rajahmundry) and Madhurawada, Visakhapatnam, Andhra Pradesh.
Built with React 19 and Vite; GSAP is loaded on demand for the home and About page animations.

## Run

```bash
npm install
npm run dev       # local dev server
npm run build     # production build into dist/ (one static HTML file per route, plus sitemap and 404)
npm run preview   # serve the production build
npm run lint      # oxlint
```

## Structure

- `src/Root.jsx`: routes; each page is lazy-loaded.
- `src/App.jsx`: the home page: hero, collections, about, founder, services, care, gallery, locations, FAQ, contact
  and footer, joined by `VineDivider` bands.
- `src/pages/`: the other routes (Plants, Pots, Services, Gallery, About, Contact, the two location pages, 404).
- `src/components/`: one `.jsx` + `.css` pair per section, grouped by `home/`, `about/`, `plants/`, `layout/`, `shared/`.
- `src/data/`: site content (catalogues, gallery, locations, routes, certifications, ...).
- `src/hooks/useOffscreenPause.js`: pauses a section's looping animations while it is off screen.
- `src/lib/scrollStore.js`: one shared, passive scroll listener for the whole app.
- `src/lib/gsap.js`: loads GSAP on demand; `useGsap` runs a section's animation setup once it has arrived.
- `src/styles/global.css`: design tokens (colors, fonts) and global rules.
- `seo/build-seo.js` + `vite.config.js`: per-route `<head>` tags, structured data, sitemap and 404 at build time.
- `public/`: static assets (WebP/AVIF images, fonts, icons, manifest, hosting headers).
- `assets-src/`: source originals kept for re-exporting; **not** deployed (see its README).

See `PERFORMANCE_AUDIT.md` for the performance review and what has been done.
