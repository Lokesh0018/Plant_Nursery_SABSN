import { useEffect, useState, lazy, Suspense } from 'react';
import { Search, Flower2, Shrub, Apple, ArrowRight, ArrowDown, MessageCircle, LayoutGrid, Sprout } from 'lucide-react';
import Navbar from '../components/Navbar';
import IndoorPlants from '../components/IndoorPlants';
import WhatsAppButton from '../components/WhatsAppButton';
import VineOrnament from '../components/VineOrnament';
import groups from '../data/plantCatalogue.json';
import './PlantsPage.css';

const Footer = lazy(() => import('../components/Footer'));
const total = groups.reduce((sum, g) => sum + g.items.length, 0);
const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, can you help me choose plants?')}`;
// shortcuts shown on the header's plant shelf; each jumps straight to that category
const HEADER_PICKS = [
  { slug: 'flowering-plants', label: 'Flowering', Icon: Flower2 },
  { slug: 'ornamental-topiary-plants', label: 'Topiary', Icon: Shrub },
  { slug: 'fruit-plants', label: 'Fruit trees', Icon: Apple },
].map((p) => ({ ...p, count: groups.find((g) => g.slug === p.slug)?.items.length ?? 0 }));
export default function PlantsPage() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('search') || '');
  const [category, setCategory] = useState(() => {
    const slug = new URLSearchParams(window.location.search).get('category');
    return groups.some(g => g.slug === slug) ? slug : 'all';
  });
  useEffect(() => {
    document.title = 'Plant Catalogue | SABSN Nursery';
    const search = e => { setQuery(e.detail || ''); setCategory('all'); document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' }); };
    window.addEventListener('plants-search', search);
    return () => window.removeEventListener('plants-search', search);
  }, []);
  const pickCategory = (slug) => {
    setQuery('');
    setCategory(slug);
    document.getElementById('plants')?.scrollIntoView({ behavior: 'smooth' });
  };
  const visible = groups.filter(g => category === 'all' || category === g.slug);
  const count = visible.reduce((sum, g) => sum + g.items.filter(p => `${p.name} ${p.botanical} ${g.title}`.toLowerCase().includes(query.trim().toLowerCase())).length, 0);
  return <div className="plants-page">
    <Navbar page="plants" />
    <header className="catalogue-header">
      {/* the home hero's own foliage and flowers, framing the corners */}
      <img className="ch-corner ch-corner--tr" src="/hero-tree/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" decoding="async" />
      <img className="ch-corner ch-corner--bl" src="/hero-tree/flowers-bl.webp" alt="" width="500" height="321" aria-hidden="true" decoding="async" />
      <div className="catalogue-header-copy">
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
        <ul className="catalogue-stats">
          <li><span className="ch-stat-icon"><LayoutGrid size={16} strokeWidth={2} aria-hidden="true" /></span><span><strong>{groups.length}</strong> categories</span></li>
          <li><span className="ch-stat-icon"><Sprout size={16} strokeWidth={2} aria-hidden="true" /></span><span><strong>{total}</strong> catalogue entries</span></li>
        </ul>
      </div>
      {/* a glasshouse arch with three potted plants on a ledge, and category shortcuts around it */}
      <div className="catalogue-header-art">
        <div className="cha-arch" aria-hidden="true">
          <span className="cha-glow" />
          <img className="cha-plant cha-plant--left" src="/plants/plant2-Photoroom.webp" alt="" width="450" height="800" decoding="async" />
          <img className="cha-plant cha-plant--centre" src="/plants/plant3-Photoroom.webp" alt="" width="530" height="800" decoding="async" />
          <img className="cha-plant cha-plant--right" src="/plants/plant5-Photoroom.webp" alt="" width="640" height="640" decoding="async" />
          <span className="cha-ledge" />
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
    <main className="pp-main" id="plants">
      <div className="catalogue-controls">
        <label className="catalogue-search"><Search size={20} /><input type="search" aria-label="Search plants" placeholder="Search a plant or botanical name" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <nav className="plant-category-links" aria-label="Plant categories">
          <button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All plants <span>{total}</span></button>
          {groups.map(g => <button key={g.slug} aria-pressed={category === g.slug} onClick={() => setCategory(g.slug)}>{g.title} <span>{g.items.length}</span></button>)}
        </nav>
        <p aria-live="polite">{count} matching catalogue entries</p>
      </div>
      {visible.map(g => <IndoorPlants key={g.slug} items={g.items} category={g.title} slug={g.slug} title={g.title} subtitle="Explore the collection and enquire about your favourites." query={query} />)}
      {!count && <div className="pp-empty"><h2>No plants match your search</h2><button className="pp-btn" onClick={() => { setQuery(''); setCategory('all'); }}>Show all plants</button></div>}
    </main>
    <Suspense fallback={null}><Footer /></Suspense><WhatsAppButton />
  </div>;
}
