import { Fragment, useEffect, useRef, useState, lazy, Suspense } from 'react';
import useOffscreenPause from '../hooks/useOffscreenPause';
import { Search, Flower2, Shrub, Apple, ArrowRight, ArrowDown, MessageCircle, LayoutGrid, Armchair, X, Sun, Trees, TreePine, Leaf, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import IndoorPlants from '../components/plants/IndoorPlants';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import VineOrnament from '../components/shared/VineOrnament';
import VineDivider from '../components/shared/VineDivider';
import VisitBadge from '../components/shared/VisitBadge';
import CATALOGUE_INDEX from 'virtual:plant-index';
import { HEART_LIGHTS_VIEW, HEART_LIGHTS_MAX, HEART_LIGHTS_LEFT, HEART_LIGHTS_RIGHT } from '../data/heartStandLights';
import './PlantsPage.css';
import { routeFor } from '../data/routes';

const Footer = lazy(() => import('../components/layout/Footer'));
// the full catalogue is its own chunk: start fetching it as soon as this page's code runs, in parallel with the
// first render. The header, chips and counts only need the build-time index (slug, title, count).
const cataloguePromise = import('../data/plantCatalogue.json').then((m) => m.default);
const total = CATALOGUE_INDEX.reduce((sum, g) => sum + g.count, 0);
// one icon per catalogue category, for the filter chips
const CATEGORY_ICONS = {
  'indoor-plants': Armchair,
  'outdoor-plants': Sun,
  'flowering-plants': Flower2,
  'ornamental-topiary-plants': Shrub,
  'avenue-shade-trees': Trees,
  'fruit-plants': Apple,
  'native-forest-trees': TreePine,
  'ground-cover-landscape-plants': Leaf,
};
const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, can you help me choose plants?')}`;
// shortcuts shown on the header's plant shelf; each jumps straight to that category
const HEADER_PICKS = [
  { slug: 'flowering-plants', label: 'Flowering', Icon: Flower2 },
  { slug: 'indoor-plants', label: 'Indoor', Icon: Armchair },
  { slug: 'ornamental-topiary-plants', label: 'Topiary', Icon: Shrub },
  { slug: 'fruit-plants', label: 'Fruit trees', Icon: Apple },
].map((p) => ({ ...p, count: CATALOGUE_INDEX.find((g) => g.slug === p.slug)?.count ?? 0 }));
// fairy lights along both heart frames. A chase leaves the centre top, where the hearts meet, and runs out
// over both lobes and down both sides at once: each bulb's delay is its distance from the centre.
const CHASE_RUN = 2.4; // seconds for the light to travel the longest side
const [VIEW_W, VIEW_H] = HEART_LIGHTS_VIEW;
const HEART_LIGHTS = [...HEART_LIGHTS_LEFT, ...HEART_LIGHTS_RIGHT].map(([x, y, dist]) => ({
  x, y,
  left: `${((x / VIEW_W) * 100).toFixed(2)}%`,
  top: `${((y / VIEW_H) * 100).toFixed(2)}%`,
  delay: `${((dist / HEART_LIGHTS_MAX) * CHASE_RUN).toFixed(2)}s`,
}));

export default function PlantsPage() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('search') || '');
  const [category, setCategory] = useState(() => {
    const slug = new URLSearchParams(window.location.search).get('category');
    return CATALOGUE_INDEX.some(g => g.slug === slug) ? slug : 'all';
  });
  // the category pills follow the cursor: --mx / --my run from -1 to 1 across the header (see .cha-pick in
  // PlantsPage.css); the glasshouse itself stays still. Mouse only, never for reduced motion.
  const headerRef = useRef(null);
  // the hero's looping animations (status pulse, tickers, drifting tags) stop while it is scrolled away
  useOffscreenPause(headerRef);
  const artRef = useRef(null);
  useEffect(() => {
    const header = headerRef.current;
    const art = artRef.current;
    if (!header || !art) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const set = (x, y) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        art.style.setProperty('--mx', x.toFixed(3));
        art.style.setProperty('--my', y.toFixed(3));
      });
    };
    const onMove = (e) => {
      const r = header.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => set(0, 0);
    header.addEventListener('pointermove', onMove);
    header.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      header.removeEventListener('pointermove', onMove);
      header.removeEventListener('pointerleave', onLeave);
    };
  }, []);
  useEffect(() => {
    document.title = routeFor('/plants/').title;
    const search = e => { setQuery(e.detail || ''); setCategory('all'); document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' }); };
    window.addEventListener('plants-search', search);
    return () => window.removeEventListener('plants-search', search);
  }, []);
  const pickCategory = (slug) => {
    setQuery('');
    setCategory(slug);
    document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
  };
  const [groups, setGroups] = useState(null);
  useEffect(() => {
    let live = true;
    cataloguePromise.then((g) => { if (live) setGroups(g); });
    return () => { live = false; };
  }, []);
  const visible = (groups ?? []).filter(g => category === 'all' || category === g.slug);
  // "All plants" with no search loads one category at a time as the visitor scrolls: each next section
  // arrives after a vine divider and a short loader. A chosen category or a search shows everything at once.
  const progressive = category === 'all' && !query.trim() && typeof IntersectionObserver !== 'undefined';
  // progress is kept per filter, so changing the category or search starts again from the first section
  const filterKey = `${category}|${query}`;
  const [progress, setProgress] = useState({ key: filterKey, loaded: 1, loading: false });
  const loaded = progress.key === filterKey ? progress.loaded : 1;
  const loadingNext = progress.key === filterKey && progress.loading;
  const sentinel = useRef(null);
  useEffect(() => {
    if (!progressive || loaded >= visible.length) return undefined;
    const el = sentinel.current;
    if (!el) return undefined;
    let timer;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      // the next section is requested well before it scrolls into view and, while still off-screen, added at
      // once, so nothing the visitor can see moves (no layout shift). Only someone who scrolls fast enough to
      // reach the loader first sees it: the vine grows and the section follows after a short beat.
      if (e.boundingClientRect.top > window.innerHeight) {
        setProgress({ key: filterKey, loaded: loaded + 1, loading: false });
        return;
      }
      setProgress({ key: filterKey, loaded, loading: true });
      const wait = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : 900;
      timer = setTimeout(() => setProgress({ key: filterKey, loaded: loaded + 1, loading: false }), wait);
    }, { rootMargin: '0px 0px 150% 0px' });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); };
  }, [progressive, loaded, visible.length, filterKey]);
  const shownGroups = progressive ? visible.slice(0, loaded) : visible;
  const nextGroup = progressive && loaded < visible.length ? visible[loaded] : null;
  // until the catalogue arrives, the index gives the unfiltered count
  const count = groups
    ? visible.reduce((sum, g) => sum + g.items.filter(p => `${p.name} ${p.botanical} ${g.title}`.toLowerCase().includes(query.trim().toLowerCase())).length, 0)
    : CATALOGUE_INDEX.filter(g => category === 'all' || category === g.slug).reduce((sum, g) => sum + g.count, 0);
  return <div className="plants-page">
    <Navbar page="plants" />
    <header ref={headerRef} className="catalogue-header">
      {/* the home hero's own foliage, framing the top-right corner */}
      <img className="ch-corner ch-corner--tr" src="/images/home/hero/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" decoding="async" />
      {/* a large outline leaf, barely there, so the lower left of the copy column is not flat green */}
      <Leaf className="ch-watermark" strokeWidth={0.6} aria-hidden="true" />
      <div className="catalogue-header-copy">
        {/* visiting details, as given in the footer */}
        <VisitBadge />
        <p className="indoor-kicker">The nursery collection</p>
        <h1>Find your kind of <em>green.</em></h1>
        <VineOrnament />
        <p>Explore palms, flowers, sculpted foliage and trees, thoughtfully arranged for your space.</p>
        <div className="ch-actions">
          <a className="ch-btn" href="#plants" onClick={(e) => { e.preventDefault(); document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Browse the catalogue <ArrowDown size={16} strokeWidth={2.2} aria-hidden="true" />
          </a>
          <a className="ch-btn ch-btn--ghost" href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> Ask on WhatsApp
          </a>
        </div>
        {/* the catalogue in figures: serif numerals over small caps, ruled off from the copy above */}
        <ul className="catalogue-stats">
          <li><strong>{CATALOGUE_INDEX.length}</strong><span>Categories</span></li>
          <li><strong>{total}</strong><span>Plants listed</span></li>
          <li><strong>7</strong><span>Days a week</span></li>
        </ul>
      </div>
      {/* the heart-shaped plant stand, with category shortcuts around it */}
      <div ref={artRef} className="catalogue-header-art">
        {/* the illuminated heart-shaped plant stand, glowing warm from its fairy lights */}
        <div className="cha-stand" aria-hidden="true">
          <span className="cha-stand-glow" />
          <span className="cha-stand-floor" />
          {/* the photo and its twinkling bulbs move together */}
          <div className="cha-stand-scene">
            {/* AVIF (about half the size) where supported, WebP otherwise; the AVIF set is also preloaded in the
                page head (routes.js preloadImage), so keep the two in step */}
            <picture>
              <source type="image/avif" sizes="(max-width: 560px) 92vw, (max-width: 900px) 440px, 560px"
                srcSet="/images/plants/header/heart-stand-480.avif 480w, /images/plants/header/heart-stand.avif 800w" />
              <img className="cha-stand-img" src="/images/plants/header/heart-stand.webp"
                srcSet="/images/plants/header/heart-stand-480.webp 480w, /images/plants/header/heart-stand.webp 800w"
                sizes="(max-width: 560px) 92vw, (max-width: 900px) 440px, 560px"
                alt="" width="800" height="834" decoding="async" fetchPriority="high" />
            </picture>
            {/* fairy lights along the heart frames. The resting bulbs never change, so they are one still SVG
                (painted once). The chase flares are HTML elements animating only transform and opacity, which
                the browser composites on the GPU instead of repainting an SVG every frame. */}
            <svg className="cha-lights" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none">
              <defs>
                <radialGradient id="cha-halo">
                  <stop offset="0" stopColor="#f4fbe0" />
                  <stop offset="0.25" stopColor="#d6ec9a" stopOpacity="0.95" />
                  <stop offset="0.6" stopColor="#9fd05a" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#9fd05a" stopOpacity="0" />
                </radialGradient>
              </defs>
              {HEART_LIGHTS.map(({ x, y }, i) => (
                <g key={i} transform={`translate(${x} ${y})`}>
                  <circle r="7" fill="url(#cha-halo)" opacity="0.4" />
                  <circle r="2.3" fill="#e4f5b4" />
                </g>
              ))}
            </svg>
            <span className="cha-flares">
              {HEART_LIGHTS.map(({ left, top, delay }, i) => (
                <i key={i} style={{ left, top, animationDelay: delay }} />
              ))}
            </span>
          </div>
        </div>
        <nav className="cha-picks" aria-label="Jump to a category">
          {HEADER_PICKS.map(({ slug, label, Icon, count }) => (
            <button key={slug} type="button" className={`cha-pick cha-pick--${slug}`} onClick={() => pickCategory(slug)}>
              <span className="cha-pick-icon"><Icon size={16} strokeWidth={2} aria-hidden="true" /></span>
              <span className="cha-pick-text"><strong>{label}</strong><small>{count} plants</small></span>
              <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
            </button>
          ))}
        </nav>
      </div>
    </header>
    {/* the header's forest green into the catalogue's ivory, as between sections on Home and About */}
    <VineDivider variant="ramp" id="plants-top" from="#163624" to="#F7F3EA" />
    <main className="pp-main" id="plants">
      <div className="catalogue-controls">
        <div className="cc-head">
          <p className="cc-title"><SlidersHorizontal size={16} strokeWidth={2.2} aria-hidden="true" />Browse the collection</p>
          <label className="catalogue-search">
            <Search size={20} aria-hidden="true" />
            <input type="search" aria-label="Search plants" placeholder="Search a plant or botanical name" value={query} onChange={e => setQuery(e.target.value)} />
            {query && <button type="button" className="cc-clear" onClick={() => setQuery('')} aria-label="Clear search"><X size={16} strokeWidth={2.4} /></button>}
          </label>
        </div>
        <nav className="plant-category-links" aria-label="Plant categories">
          <button type="button" className="pcl-all" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
            <LayoutGrid size={15} strokeWidth={2} aria-hidden="true" /><em>All plants</em> <span>{total}</span>
          </button>
          {CATALOGUE_INDEX.map(g => {
            const Icon = CATEGORY_ICONS[g.slug] || Leaf;
            return <button type="button" key={g.slug} aria-pressed={category === g.slug} onClick={() => setCategory(g.slug)}>
              <Icon size={15} strokeWidth={2} aria-hidden="true" /><em>{g.title}</em> <span>{g.count}</span>
            </button>;
          })}
        </nav>
        <div className="cc-status">
          <p aria-live="polite">
            <strong>{count}</strong> {count === 1 ? 'plant' : 'plants'}
            {category !== 'all' && <> in <strong>{CATALOGUE_INDEX.find(g => g.slug === category)?.title}</strong></>}
            {query.trim() && <> matching <q>{query.trim()}</q></>}
          </p>
          {(query || category !== 'all') && (
            <button type="button" className="cc-reset" onClick={() => { setQuery(''); setCategory('all'); }}>
              <X size={14} strokeWidth={2.4} aria-hidden="true" />Clear filters
            </button>
          )}
        </div>
      </div>
      {!groups && (
        <div className="pp-catalogue-loading">
          <p className="pp-next-loader is-loading" role="status" aria-live="polite">
            <span className="pp-next-spinner" aria-hidden="true"><Leaf size={16} /></span>Loading the catalogue…
          </p>
        </div>
      )}
      {shownGroups.map((g, i) => (
        <Fragment key={g.slug}>
          {/* in the progressive "All plants" view, a vine divider separates each loaded category */}
          {progressive && i > 0 && <VineDivider variant="ramp" id={`plants-${g.slug}`} from="#F7F3EA" to="#F7F3EA" />}
          <IndoorPlants icon={CATEGORY_ICONS[g.slug] || Leaf} items={g.items} category={g.title} slug={g.slug} title={g.title} subtitle="Explore the collection and enquire about your favourites." query={query} />
        </Fragment>
      ))}
      {nextGroup && (
        <div ref={sentinel} className="pp-next">
          <VineDivider variant="ramp" id={`plants-${nextGroup.slug}`} from="#F7F3EA" to="#F7F3EA" />
          <p className={`pp-next-loader${loadingNext ? ' is-loading' : ''}`} role="status" aria-live="polite">
            <span className="pp-next-spinner" aria-hidden="true"><Leaf size={16} /></span>
            {loadingNext ? `Loading ${nextGroup.title}…` : `Next: ${nextGroup.title}`}
          </p>
        </div>
      )}
      {groups && !count && <div className="pp-empty"><h2>No plants match your search</h2><button className="pp-btn" onClick={() => { setQuery(''); setCategory('all'); }}>Show all plants</button></div>}
    </main>
    {/* while more sections are still to load, the loader ends the page: a footer below it would be pushed down
        by every section that arrives (a layout shift each time) */}
    {!nextGroup && <Suspense fallback={null}><Footer /></Suspense>}<WhatsAppButton />
  </div>;
}
