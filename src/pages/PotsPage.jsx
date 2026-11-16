import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowRight, Search, X, MessageCircle, Layers, MoveDiagonal, Flower2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import groups from '../data/potCatalogue.json';
import './PotsPage.css';

const Footer = lazy(() => import('../components/Footer'));
const total = groups.reduce((sum, group) => sum + group.items.length, 0);
const enquiry = name => `https://wa.me/919849936169?text=${encodeURIComponent(`Hello SABSN, I am interested in ${name}. Please share available sizes, materials, finishes, drainage options and prices.`)}`;

function PotFrame({ item, eager = false }) {
  return <div className="pots-frame" role="img" aria-label={`${item.name}, illustrative pot style`}><div className="pots-frame-cell" style={{ aspectRatio: item.cellAspectRatio }}><img src={item.sheet} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" style={{ width: `${item.columns * 100}%`, transform: `translate(-${item.cell % item.columns * 100 / item.columns}%, -${Math.floor(item.cell / item.columns) * 100 / item.rows}%)` }} /></div></div>;
}

function PotDetails({ item, category, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    ref.current.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={ref} className="pots-dialog" aria-labelledby="pot-detail-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <button className="pots-close" onClick={onClose} aria-label="Close pot details" autoFocus><X size={20} /></button>
    <div className="pots-dialog-grid"><PotFrame item={item} eager /><div className="pots-detail-copy"><p className="pots-eyebrow">{category}</p><h2 id="pot-detail-title">{item.name}</h2><p>{item.description}</p>
      <dl><div><dt><Layers size={16} /> Material family</dt><dd>{item.material}</dd></div><div><dt><MoveDiagonal size={16} /> Sizes & finishes</dt><dd>Ask us for current options and dimensions.</dd></div><div><dt><Flower2 size={16} /> Planting details</dt><dd>Confirm the internal opening, drainage and any liner or saucer before ordering.</dd></div></dl>
      <a className="pots-button" href={enquiry(item.name)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Enquire about this style</a><p className="pots-disclaimer">AI-generated style illustration. Colours, proportions and availability may differ from nursery stock.</p>
    </div></div>
  </dialog>;
}

export default function PotsPage() {
  const [query, setQuery] = useState(() => new URLSearchParams(window.location.search).get('search') || '');
  const [category, setCategory] = useState(() => {
    const value = new URLSearchParams(window.location.search).get('category');
    return groups.some(g => g.slug === value) ? value : 'all';
  });
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    document.title = 'Pots & Planters | SABSN Nursery';
    const search = e => { setQuery(e.detail || ''); setCategory('all'); document.getElementById('pots-catalogue')?.scrollIntoView({ behavior: 'smooth' }); };
    window.addEventListener('pots-search', search);
    return () => window.removeEventListener('pots-search', search);
  }, []);
  const filtered = groups.filter(g => category === 'all' || category === g.slug).map(g => ({ ...g, items: g.items.filter(p => `${p.name} ${p.description} ${g.title} ${p.material}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter(g => g.items.length);
  const count = filtered.reduce((sum, g) => sum + g.items.length, 0);
  return <div className="pots-page"><Navbar page="pots" />
    <header className="pots-hero"><div className="pots-hero-copy"><a href="/" className="pots-back"><ArrowLeft size={15} /> Home</a><p className="pots-eyebrow">The planter collection</p><h1>Good roots.<br /><em>Beautiful pots.</em></h1><p>From the warmth of clay to clean contemporary forms, find a home for every kind of green.</p><a href="#pots-catalogue" className="pots-button">Explore the collection <ArrowRight size={18} /></a><div className="pots-stats"><span><strong>08</strong> categories</span><span><strong>{total}</strong> illustrated styles</span></div></div><div className="pots-hero-art"><PotFrame item={groups[3].items[0]} eager /><div className="pots-hero-caption"><span>Form. Texture. Character.</span><span>Made for your green spaces</span></div></div></header>
    <main id="pots-catalogue" className="pots-main">
      <div className="pots-toolbar"><div><p className="pots-eyebrow">Find your favourite</p><h2>Pots for every setting.</h2></div><label className="pots-search"><Search size={19} /><input type="search" aria-label="Search pots" placeholder="Search styles, materials or finishes" value={query} onChange={e => setQuery(e.target.value)} />{query && <button onClick={() => setQuery('')} aria-label="Clear pot search"><X size={17} /></button>}</label></div>
      <nav className="pots-filters" aria-label="Pot categories"><button aria-pressed={category === 'all'} onClick={() => setCategory('all')}>All pots <span>{total}</span></button>{groups.map(g => <button key={g.slug} aria-pressed={category === g.slug} onClick={() => setCategory(g.slug)}>{g.title}<span>{g.items.length}</span></button>)}</nav>
      <p className="pots-results" aria-live="polite">{count} {count === 1 ? 'style' : 'styles'}{query && <> matching “{query}”</>}</p>
      {filtered.map(g => <section className="pots-category" key={g.slug} aria-labelledby={`${g.slug}-heading`}><div className="pots-category-heading"><div><p className="pots-eyebrow">{g.material}</p><h2 id={`${g.slug}-heading`}>{g.title}</h2></div><span>{g.items.length} styles</span></div><div className="pots-grid">{g.items.map(item => <button className="pots-card" key={item.id} onClick={() => setSelected({ item, category: g.title })} aria-label={`View ${item.name} details`} aria-haspopup="dialog"><PotFrame item={item} /><div className="pots-card-copy"><span className="pots-eyebrow">{g.title}</span><h3>{item.name}</h3><p>{item.description}</p><div className="pots-card-bottom"><span>Explore style</span><ArrowUpRight size={19} /></div></div></button>)}</div></section>)}
      {!count && <div className="pots-empty"><Flower2 size={35} /><h2>No matching styles</h2><p>Try another material or browse the full collection.</p><button className="pots-button" onClick={() => { setQuery(''); setCategory('all'); }}>Show all pots</button></div>}
      <aside className="pots-help"><div><p className="pots-eyebrow">Let's find the right fit</p><h2>A beautiful pairing starts here.</h2><p>Share your plant and space with us. We’ll help you compare pot sizes and finishes.</p></div><a className="pots-button" href={enquiry('pots for my plants')} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /> Ask the nursery</a></aside><p className="pots-disclaimer">Images show illustrative styles. Please confirm current stock, dimensions, materials and prices with the nursery.</p>
    </main><Suspense fallback={null}><Footer /></Suspense><WhatsAppButton />{selected && <PotDetails {...selected} onClose={() => setSelected(null)} />}
  </div>;
}
