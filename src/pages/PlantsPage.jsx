import React, { useEffect, useMemo, useState, lazy, Suspense } from 'react';
import { Search, X, Sun, CloudSun, Cloud, Sprout, ArrowLeft, MessageCircle, Star, Droplets, Plus, Check, Leaf, ArrowDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import { ProductCard } from '../components/Collection';
import VineOrnament from '../components/VineOrnament';
import { products } from '../data/products';
import './PlantsPage.css';

const PlantModal = lazy(() => import('../components/PlantModal')); // only fetched when a plant is opened
const Footer = lazy(() => import('../components/Footer'));

// Which light conditions each care label suits. "Low to Bright" and "Any Light" sit in several.
const LIGHT_FIT = {
  'Low Light': ['low'],
  'Low to Bright': ['low', 'medium', 'bright'],
  'Medium Light': ['medium'],
  'Bright Indirect': ['bright'],
  'Bright Light': ['bright'],
  'Direct Sun': ['sun'],
  'Any Light': ['low', 'medium', 'bright', 'sun'],
};
const LIGHT_FILTERS = [
  { key: 'all', label: 'All light', Icon: null },
  { key: 'low', label: 'Low light', Icon: Cloud },
  { key: 'medium', label: 'Medium', Icon: CloudSun },
  { key: 'bright', label: 'Bright indirect', Icon: Sun },
  { key: 'sun', label: 'Full sun', Icon: Sun },
];
// Watering at most every week or so, or only when the soil is dry
const EASY_WATER = new Set(['When Dry', 'Every 2 Weeks', '1x Month', '1x Week']);
const SORTS = {
  featured: { label: 'Featured', fn: null },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top rated', fn: (a, b) => b.rating - a.rating || b.reviews - a.reviews },
};

const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, can you help me choose a plant?')}`;

// Facts for the header, read from the catalogue itself
const STATS = (() => {
  const reviews = products.reduce((n, p) => n + (p.reviews || 0), 0);
  const avg = products.reduce((n, p) => n + p.rating * (p.reviews || 0), 0) / (reviews || 1);
  return [
    { value: products.length, label: 'varieties in stock' },
    { value: `₹${Math.min(...products.map((p) => p.price)).toLocaleString()}`, label: 'starting price' },
    { value: avg.toFixed(1), label: `average rating, ${reviews.toLocaleString()} reviews`, star: true },
  ];
})();
// The nursery pick: best rated, most reviewed
const PICK = [...products].sort(SORTS.rating.fn)[0];

function Spotlight({ product, onOpen }) {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return undefined;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  const add = () => {
    window.dispatchEvent(new CustomEvent('cart-updated', { detail: { item: product, quantity: 1 } }));
    setAdded(true);
  };

  return (
    <section className="pp-spot" aria-labelledby="pp-spot-name">
      <div className="pp-spot-stage">
        <span className="pp-spot-glow" aria-hidden="true" />
        <img src={product.image} alt={product.name} width="420" height="420" loading="eager" decoding="async" />
      </div>
      <div className="pp-spot-body">
        <p className="pp-spot-badge"><Leaf size={14} strokeWidth={2.2} aria-hidden="true" />Nursery pick</p>
        <p className="pp-spot-latin">{product.scientificName}</p>
        <h2 id="pp-spot-name" className="pp-spot-name">{product.name}</h2>
        <p className="pp-spot-rating" aria-label={`Rated ${product.rating} out of 5 from ${product.reviews} reviews`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={15} strokeWidth={0} fill="currentColor" className={i < Math.round(product.rating) ? '' : 'is-off'} aria-hidden="true" />
          ))}
          <strong>{product.rating.toFixed(1)}</strong>
          <span>{product.reviews} reviews</span>
        </p>
        <p className="pp-spot-desc">{product.description}</p>
        <ul className="pp-spot-care" aria-label="Care">
          <li><Sun size={15} strokeWidth={2.2} aria-hidden="true" />{product.care.light}</li>
          <li><Droplets size={15} strokeWidth={2.2} aria-hidden="true" />{product.care.water}</li>
        </ul>
        <div className="pp-spot-foot">
          <p className="pp-spot-price">₹{product.price.toLocaleString()}</p>
          <div className="pp-spot-actions">
            <button type="button" className="pp-btn pp-btn--ghost" onClick={(e) => onOpen(product, e.currentTarget)}>View details</button>
            <button type="button" className={`pp-btn${added ? ' is-done' : ''}`} onClick={add} aria-live="polite">
              {added ? <Check size={18} strokeWidth={2.4} aria-hidden="true" /> : <Plus size={18} strokeWidth={2.4} aria-hidden="true" />}
              {added ? 'Added to cart' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PlantsPage() {
  const [query, setQuery] = useState('');
  const [light, setLight] = useState('all');
  const [easy, setEasy] = useState(false);
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState(null); // { product, rect, card }

  useEffect(() => {
    document.title = 'All Plants | SABSN — Sri Ayyappa Bala Sai Nursery';
    // the navbar's search box filters this page instead of scrolling the home page
    const onSearch = (e) => {
      setQuery(e.detail || '');
      document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('plants-search', onSearch);
    return () => window.removeEventListener('plants-search', onSearch);
  }, []);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (q && !`${p.name} ${p.scientificName} ${p.uses || ''}`.toLowerCase().includes(q)) return false;
      if (light !== 'all' && !(LIGHT_FIT[p.care?.light] || []).includes(light)) return false;
      if (easy && !EASY_WATER.has(p.care?.water)) return false;
      return true;
    });
    const fn = SORTS[sort].fn;
    return fn ? [...list].sort(fn) : list;
  }, [query, light, easy, sort]);

  const filtered = query !== '' || light !== 'all' || easy;
  const reset = () => { setQuery(''); setLight('all'); setEasy(false); };

  const openProduct = (product, card) => setSelected({ product, rect: card.getBoundingClientRect(), card });
  const closeProduct = () => {
    const card = selected?.card;
    setSelected(null);
    card?.focus({ preventScroll: true });
  };

  return (
    <div className="plants-page">
      <Navbar page="plants" />

      <header className="pp-hero">
        {/* the home hero's own foliage, framing the corners */}
        <img className="pp-hero-art pp-hero-art--tl" src="/hero-tree/foliage-tl.webp" alt="" width="420" height="300" aria-hidden="true" />
        <img className="pp-hero-art pp-hero-art--tr" src="/hero-tree/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" />
        <img className="pp-hero-art pp-hero-art--bl" src="/hero-tree/flowers-bl.webp" alt="" width="500" height="321" aria-hidden="true" />
        <img className="pp-hero-art pp-hero-art--br" src="/hero-tree/flowers-br.webp" alt="" width="432" height="321" aria-hidden="true" />

        <div className="pp-hero-inner">
          <nav className="pp-crumbs" aria-label="Breadcrumb">
            <a href="/"><ArrowLeft size={14} strokeWidth={2.2} aria-hidden="true" />Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Plants</span>
          </nav>
          <p className="pp-eyebrow">The nursery collection</p>
          <h1 className="pp-title">All <em>Plants</em></h1>
          <VineOrnament />
          <p className="pp-lede">
            Every plant is raised in our own beds and leaves the nursery healthy and acclimatised.
            Filter by the light you have, or by how much care you can give.
          </p>
          <ul className="pp-stats">
            {STATS.map(({ value, label, star }) => (
              <li key={label}>
                <strong>{value}{star && <Star size={16} strokeWidth={0} fill="currentColor" aria-hidden="true" />}</strong>
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <a className="pp-hero-cue" href="#plants">
            Browse the plants <ArrowDown size={15} strokeWidth={2.2} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main className="pp-main" id="plants">
        {!filtered && PICK && <Spotlight product={PICK} onOpen={openProduct} />}

        <div className="pp-toolbar" role="search">
          <div className="pp-search">
            <Search size={18} strokeWidth={2} aria-hidden="true" />
            <label htmlFor="pp-search-input" className="pp-sr-only">Search plants</label>
            <input
              id="pp-search-input"
              type="search"
              placeholder="Search by name, e.g. pothos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button type="button" className="pp-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                <X size={16} strokeWidth={2.2} />
              </button>
            )}
          </div>

          <div className="pp-filters" role="group" aria-label="Filter by light">
            {LIGHT_FILTERS.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                className={`pp-chip${light === key ? ' is-on' : ''}`}
                aria-pressed={light === key}
                onClick={() => setLight(key)}
              >
                {Icon && <Icon size={14} strokeWidth={2.2} aria-hidden="true" />}
                {label}
              </button>
            ))}
            <button
              type="button"
              className={`pp-chip pp-chip--easy${easy ? ' is-on' : ''}`}
              aria-pressed={easy}
              onClick={() => setEasy((v) => !v)}
            >
              <Sprout size={14} strokeWidth={2.2} aria-hidden="true" />
              Easy care
            </button>
          </div>

          <div className="pp-sort">
            <label htmlFor="pp-sort-select">Sort</label>
            <select id="pp-sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([key, { label }]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="pp-count" aria-live="polite">
          <p>
            <strong>{shown.length}</strong>
            {shown.length === products.length ? ' plants' : ` of ${products.length} plants`}
            {query.trim() && <> for <q>{query.trim()}</q></>}
          </p>
          {filtered && shown.length > 0 && (
            <button type="button" className="pp-reset" onClick={reset}>Clear filters</button>
          )}
        </div>

        {shown.length > 0 ? (
          // re-keyed on every change so the cards settle in again rather than snapping
          <div key={`${query}|${light}|${easy}|${sort}`} className="collection-grid pp-grid">
            {shown.map((product) => (
              <ProductCard key={product.id} product={product} onOpen={openProduct} showRating />
            ))}
          </div>
        ) : (
          <div className="pp-empty">
            <span className="pp-empty-icon"><Sprout size={30} strokeWidth={1.8} aria-hidden="true" /></span>
            <h2>No plants match that</h2>
            <p>Try a different name or loosen the filters. We grow far more than we list, so ask us too.</p>
            <div className="pp-empty-actions">
              <button type="button" className="pp-btn" onClick={reset}>Show all plants</button>
              <a className="pp-btn pp-btn--ghost" href={WA_LINK} target="_blank" rel="noopener noreferrer">Ask the nursery</a>
            </div>
          </div>
        )}

        <section className="pp-help" aria-labelledby="pp-help-title">
          <img className="pp-help-art" src="/hero-tree/flowers-br.webp" alt="" width="432" height="321" loading="lazy" aria-hidden="true" />
          <div className="pp-help-copy">
            <p className="pp-eyebrow pp-eyebrow--dark">Free advice</p>
            <h2 id="pp-help-title">Not sure which plant suits your space?</h2>
            <p>Tell us about your light and how often you can water. Our gardeners will suggest a few that will do well for you.</p>
          </div>
          <a className="pp-btn pp-btn--wa" href={WA_LINK} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            Ask on WhatsApp
          </a>
        </section>
      </main>

      <Suspense fallback={<div style={{ minHeight: 460, background: '#0f2d1b' }} aria-hidden="true" />}>
        <Footer />
      </Suspense>
      <WhatsAppButton />

      {selected && (
        <Suspense fallback={null}>
          <PlantModal product={selected.product} originRect={selected.rect} onClose={closeProduct} />
        </Suspense>
      )}
    </div>
  );
}
