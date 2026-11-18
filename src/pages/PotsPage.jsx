import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Leaf, ArrowUpRight, ArrowDown, ArrowLeft, ArrowRight, Search, X, MessageCircle, Layers, MoveDiagonal, Flower2, Clock, MapPin, Phone, Droplets } from 'lucide-react';
import VineOrnament from '../components/VineOrnament';
import VineDivider from '../components/VineDivider';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import groups from '../data/potCatalogue.json';
import './PotsPage.css';

const Footer = lazy(() => import('../components/Footer'));
const total = groups.reduce((sum, group) => sum + group.items.length, 0);
// materials offered as shortcuts in the header (each opens that category in the catalogue)
const HERO_MATERIALS = ['terracotta-clay-pots', 'ceramic-pots', 'cement-pots', 'designer-decorative-pots'].map(slug => groups.find(g => g.slug === slug)).filter(Boolean);
// a colour swatch for each material shortcut
const SWATCHES = {
  'terracotta-clay-pots': 'linear-gradient(135deg, #e08a5a, #a9532c)',
  'ceramic-pots': 'linear-gradient(135deg, #f4f6ef, #9fb7a2)',
  'cement-pots': 'linear-gradient(135deg, #b9b8b1, #74736d)',
  'designer-decorative-pots': 'linear-gradient(135deg, #f0d48a, #a8792c)',
};
const enquiry = name => `https://wa.me/919849936169?text=${encodeURIComponent(`Hello SABSN, I am interested in ${name}. Please share available sizes, materials, finishes, drainage options and prices.`)}`;

function PotFrame({ item, eager = false }) {
  return <div className="pots-frame" role="img" aria-label={`${item.name}, illustrative pot style`}><div className="pots-frame-cell" style={{ aspectRatio: item.cellAspectRatio }}><img src={item.sheet} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ width: `${item.columns * 100}%`, transform: `translate(-${item.cell % item.columns * 100 / item.columns}%, -${Math.floor(item.cell / item.columns) * 100 / item.rows}%)` }} /></div></div>;
}

// where each kind of pot works well, shown in the detail window
const BEST_FOR = {
  'plastic-pots': ['Nursery growing', 'Balconies', 'Everyday plants'],
  'ceramic-pots': ['Living rooms', 'Office desks', 'Gifting'],
  'cement-pots': ['Patios & gardens', 'Large shrubs', 'Entrances'],
  'terracotta-clay-pots': ['Herbs & flowers', 'Terraces', 'Outdoor beds'],
  'fibre-pots': ['Lobbies & offices', 'Large indoor plants', 'Rooftops'],
  'designer-decorative-pots': ['Statement corners', 'Hotels & cafés', 'Gifting'],
  'hanging-pots': ['Balconies', 'Verandahs', 'Trailing plants'],
  'grow-nursery-bags': ['Nursery stock', 'Kitchen gardens', 'Saplings & trees'],
};

// detail window: the same size for every pot; steps through the pots of the same category
function PotDetails({ group, index, onStep, onGo, onClose }) {
  const ref = useRef(null);
  const item = group.items[index];
  const many = group.items.length > 1;
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    ref.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  const neighbour = d => group.items[(index + d + group.items.length) % group.items.length].name;
  return <dialog ref={ref} className="pots-dialog" aria-labelledby="pot-detail-title" onCancel={onClose}
    onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    onKeyDown={e => { if (many && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) onStep(e.key === 'ArrowRight' ? 1 : -1); }}>
    <button className="pots-close" onClick={onClose} aria-label="Close pot details" autoFocus><X size={18} /></button>
    <div className="pots-dialog-grid" key={item.id}>
      <div className="pots-dialog-photo">
        <PotFrame item={item} eager />
        <span className="pots-dialog-num">{String(index + 1).padStart(2, '0')}<small> / {String(group.items.length).padStart(2, '0')}</small></span>
        <span className="pots-dialog-material"><Layers size={13} strokeWidth={2.2} aria-hidden="true" />{item.material}</span>
      </div>
      <div className="pots-detail-copy">
        <p className="pots-dialog-kicker"><span aria-hidden="true"><Flower2 size={15} strokeWidth={1.9} /></span>{group.title}</p>
        <h2 id="pot-detail-title">{item.name}</h2>
        <p className="pots-dialog-text">{item.description}</p>

        {BEST_FOR[group.slug] && <>
          <h3>Works well for</h3>
          <ul className="pots-dialog-for">{BEST_FOR[group.slug].map(x => <li key={x}>{x}</li>)}</ul>
        </>}

        <h3>Before you order</h3>
        <ul className="pots-dialog-facts">
          <li><span aria-hidden="true"><MoveDiagonal size={16} strokeWidth={2} /></span><div><strong>Sizes & finishes</strong><p>Ask us for the current options and dimensions.</p></div></li>
          <li><span aria-hidden="true"><Droplets size={16} strokeWidth={2} /></span><div><strong>Planting details</strong><p>Confirm the opening, drainage and any liner or saucer.</p></div></li>
        </ul>

        {many && <>
          <h3>In this collection</h3>
          <ul className="pots-dialog-thumbs">{group.items.map((p, i) => <li key={p.id}>
            <button type="button" aria-label={`Show ${p.name}`} aria-current={i === index ? 'true' : undefined} onClick={() => onGo(i)}><PotFrame item={p} /></button>
          </li>)}</ul>
        </>}

        <div className="pots-dialog-actions">
          <a className="pots-dialog-cta" href={enquiry(item.name)} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" />Enquire on WhatsApp</a>
          <a className="pots-dialog-call" href="tel:+919849936169"><Phone size={15} strokeWidth={2.2} aria-hidden="true" />Call us</a>
          {many && <div className="pots-dialog-nav">
            <button type="button" onClick={() => onStep(-1)} aria-label={`Previous pot: ${neighbour(-1)}`}><ArrowLeft size={17} aria-hidden="true" /></button>
            <button type="button" onClick={() => onStep(1)} aria-label={`Next pot: ${neighbour(1)}`}><ArrowRight size={17} aria-hidden="true" /></button>
          </div>}
        </div>
        <p className="pots-disclaimer">Illustrative style. Colours, proportions and availability may differ from nursery stock.</p>
      </div>
    </div>
  </dialog>;
}

export default function PotsPage() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('search') || '');
  const [category, setCategory] = useState(() => {
    const value = new URLSearchParams(window.location.search).get('category');
    return groups.some(g => g.slug === value) ? value : 'all';
  });
  const [selected, setSelected] = useState(null);
  // header pots follow the cursor a little (--mx / --my from -1 to 1); mouse only, never for reduced motion
  const heroRef = useRef(null);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const set = (x, y) => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { hero.style.setProperty('--mx', x.toFixed(3)); hero.style.setProperty('--my', y.toFixed(3)); }); };
    const onMove = e => { const r = hero.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1); };
    const onLeave = () => set(0, 0);
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => { cancelAnimationFrame(raf); hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave); };
  }, []);
  useEffect(() => {
    document.title = 'Pots & Planters | SABSN Nursery';
    const search = e => { setQuery(e.detail || ''); setCategory('all'); document.getElementById('pots-catalogue')?.scrollIntoView({ behavior: 'smooth' }); };
    window.addEventListener('pots-search', search);
    return () => window.removeEventListener('pots-search', search);
  }, []);
  const filtered = groups.filter(g => category === 'all' || category === g.slug).map(g => ({ ...g, items: g.items.filter(p => `${p.name} ${p.description} ${g.title} ${p.material}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter(g => g.items.length);
  const count = filtered.reduce((sum, g) => sum + g.items.length, 0);
  const toCatalogue = () => document.getElementById('pots-catalogue')?.scrollIntoView({ behavior: 'smooth' });
  return <div className="pots-page"><Navbar page="pots" />
    <header ref={heroRef} className="pots-hero">
      <img className="pots-corner" src="/hero-tree/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" decoding="async" />
      {/* a large outline leaf, barely there, so the lower left of the copy column is not flat green */}
      <Leaf className="pots-watermark" strokeWidth={0.6} aria-hidden="true" />
      <div className="pots-hero-copy">
        <p className="pots-visit">
          <span className="pots-visit-open"><span className="pots-visit-dot" aria-hidden="true" />Open daily</span>
          <span><Clock size={13} strokeWidth={2.2} aria-hidden="true" />7 am – 6 pm</span>
          <span><MapPin size={13} strokeWidth={2.2} aria-hidden="true" />Madhurawada, Visakhapatnam</span>
        </p>
        <p className="pots-eyebrow">The planter collection</p>
        <h1>Good roots. <em>Beautiful pots.</em></h1>
        <VineOrnament />
        <p className="pots-lede">From the warmth of clay to clean contemporary forms, find a home for every kind of green.</p>
        <div className="pots-hero-actions">
          <a href="#pots-catalogue" className="pots-hero-btn" onClick={e => { e.preventDefault(); toCatalogue(); }}>Explore the collection <ArrowDown size={16} strokeWidth={2.2} aria-hidden="true" /></a>
          <a href={enquiry('pots for my plants')} className="pots-hero-btn pots-hero-btn--ghost" target="_blank" rel="noopener noreferrer"><MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> Ask the nursery</a>
        </div>
        <div className="pots-hero-materials">
          <span>Shop by material</span>
          <ul>{HERO_MATERIALS.map(g => <li key={g.slug}><button type="button" onClick={() => { setQuery(''); setCategory(g.slug); toCatalogue(); }}><span className="pots-swatch" style={{ background: SWATCHES[g.slug] }} aria-hidden="true" />{g.title.split(' / ')[0].replace(' Pots', '')}<ArrowUpRight size={13} strokeWidth={2.2} aria-hidden="true" /></button></li>)}</ul>
        </div>
      </div>

      {/* three planters on a stone plinth inside a glass arch; the pots drift a little with the cursor */}
      <div className="pots-stage" aria-hidden="true">
        <div className="pots-arch" />
        <img className="pots-stage-pot pots-stage-pot--l" src="/pots/hero/facet.webp" alt="" width="361" height="397" decoding="async" fetchPriority="high" />
        <img className="pots-stage-pot pots-stage-pot--c" src="/pots/hero/curve.webp" alt="" width="359" height="537" decoding="async" fetchPriority="high" />
        <img className="pots-stage-pot pots-stage-pot--r" src="/pots/hero/slim.webp" alt="" width="220" height="565" decoding="async" fetchPriority="high" />
        <div className="pots-light" />
        <div className="pots-plinth"><span /></div>
        <div className="pots-stage-card"><strong>Form. Texture. Character.</strong><span>Made for your green spaces</span></div>
        <ul className="pots-stage-stats">
          <li><strong>{String(groups.length).padStart(2, '0')}</strong><span>categories</span></li>
          <li><strong>{total}</strong><span>illustrated styles</span></li>
        </ul>
      </div>
      {/* every category, drifting slowly along the foot of the header (the list is doubled so it loops seamlessly) */}
      <div className="pots-ticker" aria-hidden="true">
        <div className="pots-ticker-track">
          {[...groups, ...groups].map((g, i) => <span key={`${g.slug}-${i}`} className="pots-ticker-item">{g.title}<small>{g.material}</small></span>)}
        </div>
      </div>
    </header>
    <VineDivider variant="ramp" id="pots-top" from="#163624" to="#FAF8F2" />
    <main id="pots-catalogue" className="pots-main">
      <div className="pots-toolbar"><div><p className="pots-eyebrow">Find your favourite</p><h2>Pots for every setting.</h2></div><label className="pots-search"><Search size={19} /><input type="search" aria-label="Search pots" placeholder="Search styles, materials or finishes" value={query} onChange={e => setQuery(e.target.value)} />{query && <button onClick={() => setQuery('')} aria-label="Clear pot search"><X size={17} /></button>}</label></div>
      <nav className="pots-filters" aria-label="Pot categories"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All pots <span>{total}</span></button>{groups.map(g => <button key={g.slug} aria-pressed={category === g.slug} onClick={() => setCategory(g.slug)}>{g.title}<span>{g.items.length}</span></button>)}</nav>
      <p className="pots-results" aria-live="polite">{count} {count === 1 ? 'style' : 'styles'}{query && <> matching “{query}”</>}</p>
      {filtered.map((g, gi) => <Fragment key={g.slug}>
      {/* a vine divider between categories, and one after the last before the help panel */}
      {gi > 0 && <VineDivider variant="ramp" id={`pots-${g.slug}`} from="#FAF8F2" to="#FAF8F2" />}
      <section className="pots-category" aria-labelledby={`${g.slug}-heading`}><div className="pots-category-heading"><div><p className="pots-eyebrow">{g.material}</p><h2 id={`${g.slug}-heading`}>{g.title}</h2></div><span>{g.items.length} styles</span></div><div className="pots-grid">{g.items.map((item, i) => <button className="pots-card" key={item.id} onClick={() => setSelected({ group: g, index: i })} aria-label={`View ${item.name} details`} aria-haspopup="dialog">
        <div className="pots-card-photo"><PotFrame item={item} /><span className="pots-card-num">{String(i + 1).padStart(2, '0')}</span><span className="pots-card-material">{item.material}</span></div>
        <div className="pots-card-copy"><h3>{item.name}</h3><p>{item.description}</p><div className="pots-card-bottom"><span className="pots-card-more">View details<ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" /></span></div></div>
      </button>)}</div></section></Fragment>)}
      {count > 0 && <VineDivider variant="ramp" id="pots-help" from="#FAF8F2" to="#FAF8F2" />}
      {!count && <div className="pots-empty"><Flower2 size={35} /><h2>No matching styles</h2><p>Try another material or browse the full collection.</p><button className="pots-button" onClick={() => { setQuery(''); setCategory('all'); }}>Show all pots</button></div>}
      <aside className="pots-help"><div><p className="pots-eyebrow">Let's find the right fit</p><h2>A beautiful pairing starts here.</h2><p>Share your plant and space with us. We’ll help you compare pot sizes and finishes.</p></div><a className="pots-button" href={enquiry('pots for my plants')} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Ask the nursery</a></aside><p className="pots-disclaimer">Images show illustrative styles. Please confirm current stock, dimensions, materials and prices with the nursery.</p>
    </main><Suspense fallback={null}><Footer /></Suspense><WhatsAppButton />{selected && <PotDetails {...selected} onStep={d => setSelected(s => ({ ...s, index: (s.index + d + s.group.items.length) % s.group.items.length }))} onGo={i => setSelected(s => ({ ...s, index: i }))} onClose={() => setSelected(null)} />}
  </div>;
}
