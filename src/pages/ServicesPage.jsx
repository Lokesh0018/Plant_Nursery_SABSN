import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import useOffscreenPause from '../hooks/useOffscreenPause';
import { Leaf, ArrowRight, ArrowLeft, ArrowDown, ArrowUpRight, MessageCircle, Phone, LayoutGrid, Building2, Briefcase, Home, Check, X, Users } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import WhatsAppButton from '../components/layout/WhatsAppButton';
import VineOrnament from '../components/shared/VineOrnament';
import VineDivider from '../components/shared/VineDivider';
import VisitBadge from '../components/shared/VisitBadge';
import { SERVICES, SERVICE_IMAGES, SERVICE_DETAILS } from '../data/services';
import './ServicesPage.css';
import { routeFor } from '../data/routes';

const Footer = lazy(() => import('../components/layout/Footer'));

const PHONE = '+919849936169';
const waLink = (text) => `https://wa.me/919849936169?text=${encodeURIComponent(text)}`;
const WA_GENERAL = waLink('Hello SABSN, I would like to discuss a landscaping / garden service.');

// where each service picture sits in its image sheet: [sheet, column, row]
const CELLS = {
  landscape: ['six', 0, 0], planting: ['six', 1, 0], lawn: ['six', 0, 1], flowers: ['six', 1, 1], compost: ['six', 0, 2], planters: ['six', 1, 2],
  cocopeat: ['four', 0, 0], vertical: ['four', 1, 0], civil: ['four', 0, 1], research: ['four', 1, 1],
};
const SHEETS = { six: '/images/services/service-atlas-six.webp', four: '/images/services/service-atlas.webp' };

// one picture from a sheet, scaled to cover whatever frame it sits in
function ServicePicture({ atlas, alt }) {
  const [sheet, col, row] = CELLS[atlas];
  return (
    <span className="sp-pic" role="img" aria-label={alt}>
      <img src={SHEETS[sheet]} alt="" loading="lazy" decoding="async" draggable="false"
        style={{ '--col': col, '--row': row, '--rows': sheet === 'six' ? 3 : 2 }} />
    </span>
  );
}

const ITEMS = SERVICES.map((s, i) => ({ ...s, ...SERVICE_IMAGES[i], ...SERVICE_DETAILS[i], n: i + 1 }));
// how the work runs, shown at the foot of every detail window
const STEPS = {
  project: ['Site visit', 'Plan & quote', 'Execution', 'Aftercare'],
  supply: ['Your requirement', 'Quote & stock', 'Supply', 'Support'],
};
const CATEGORIES = ['All', ...new Set(ITEMS.map((s) => s.category))];
// facts from the nursery's company profile (also on the About page)
const FACTS = [['10', 'services'], ['20 acres', 'of nursery'], ['50+', 'full-time team']];
const SECTORS = [[Building2, 'Institutional'], [Briefcase, 'Commercial'], [Home, 'Residential']];

export default function ServicesPage() {
  const [category, setCategory] = useState('All');
  useEffect(() => { document.title = routeFor('/services/').title; }, []);
  // the mosaic's labels and figures card drift with the cursor (--mx / --my from -1 to 1); the photos stay still.
  // Mouse only, never for reduced motion.
  const heroRef = useRef(null);
  // the hero's looping animations (status pulse, tickers, drifting tags) stop while it is scrolled away
  useOffscreenPause(heroRef);
  const mosaicRef = useRef(null);
  useEffect(() => {
    const hero = heroRef.current;
    const mosaic = mosaicRef.current;
    if (!hero || !mosaic) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const set = (x, y) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { mosaic.style.setProperty('--mx', x.toFixed(3)); mosaic.style.setProperty('--my', y.toFixed(3)); });
    };
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onLeave = () => set(0, 0);
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    return () => { cancelAnimationFrame(raf); hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave); };
  }, []);
  const shown = category === 'All' ? ITEMS : ITEMS.filter((s) => s.category === category);

  // detail window: one service at a time, stepping through the services currently shown
  const [open, setOpen] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const isOpen = open !== null;
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; opener.current?.focus(); };
  }, [isOpen]);
  const close = () => { dialog.current?.close(); setOpen(null); };
  const at = shown.findIndex((s) => s.title === open);
  const step = (d) => setOpen(shown[(at + d + shown.length) % shown.length].title);
  const toServices = (e) => { e.preventDefault(); document.getElementById('services-list')?.scrollIntoView({ behavior: 'smooth' }); };

  return (
    <div className="services-page">
      <Navbar page="services" />

      <header ref={heroRef} className="sp-hero">
        <img className="sp-corner" src="/images/home/hero/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" decoding="async" />
        {/* a large outline leaf, barely there, so the lower left of the copy column is not flat green */}
        <Leaf className="sp-watermark" strokeWidth={0.6} aria-hidden="true" />
        <div className="sp-hero-copy">
          <VisitBadge />
          <p className="sp-kicker">What we do</p>
          <h1>Complete <em>landscape</em> services.</h1>
          <VineOrnament />
          <p className="sp-lede">
            From a single planter to a full campus landscape: plants, growing media, design, build and upkeep,
            all from one nursery, point to point.
          </p>
          <div className="sp-actions">
            <a className="sp-btn" href="#services-list" onClick={toServices}>Explore services <ArrowDown size={16} strokeWidth={2.2} aria-hidden="true" /></a>
            <a className="sp-btn sp-btn--ghost" href={WA_GENERAL} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> Plan a project</a>
          </div>
          <div className="sp-for">
            <span>We work with</span>
            <ul>{SECTORS.map(([Icon, label]) => <li key={label}><Icon size={14} strokeWidth={2} aria-hidden="true" />{label}</li>)}</ul>
          </div>
        </div>

        {/* three service pictures in a staggered mosaic, with the nursery's figures on a glass card */}
        <div ref={mosaicRef} className="sp-mosaic" aria-hidden="true">
          <div className="sp-tile sp-tile--a"><ServicePicture atlas="landscape" alt="" /><span className="sp-tile-tag">Design & build</span></div>
          <div className="sp-tile sp-tile--b"><ServicePicture atlas="planting" alt="" /><span className="sp-tile-tag">Plants & planting</span></div>
          <div className="sp-tile sp-tile--c"><ServicePicture atlas="vertical" alt="" /><span className="sp-tile-tag">Vertical gardens</span></div>
          <ul className="sp-facts">
            {FACTS.map(([value, label]) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}
          </ul>
        </div>
        {/* every service, drifting slowly along the foot of the hero (the list is doubled so it loops seamlessly) */}
        <div className="sp-ticker" aria-hidden="true">
          <div className="sp-ticker-track">
            {[...ITEMS, ...ITEMS].map(({ title, Icon }, i) => (
              <span key={`${title}-${i}`} className="sp-ticker-item"><Icon size={16} strokeWidth={1.9} />{title}</span>
            ))}
          </div>
        </div>
      </header>

      <VineDivider variant="ramp" id="services-top" from="#163624" to="#F7F3EA" />

      <main className="sp-main">
        <section id="services-list" className="sp-list" aria-labelledby="sp-list-title">
          <div className="sp-list-head">
            <div>
              <p className="sp-kicker sp-kicker--dark">Our services</p>
              <h2 id="sp-list-title">Ten ways to bring <em>your space</em> to life.</h2>
            </div>
            <nav className="sp-filters" aria-label="Filter services">
              {CATEGORIES.map((c) => (
                <button key={c} type="button" aria-pressed={category === c} onClick={() => setCategory(c)}>
                  {c === 'All' && <LayoutGrid size={14} strokeWidth={2} aria-hidden="true" />}{c}
                  <span>{c === 'All' ? ITEMS.length : ITEMS.filter((s) => s.category === c).length}</span>
                </button>
              ))}
            </nav>
          </div>

          <ul className="sp-grid">
            {shown.map(({ title, text, Icon, atlas, alt, category: cat, n }) => (
              <li key={title} className="sp-card">
                <div className="sp-card-media">
                  <ServicePicture atlas={atlas} alt={alt} />
                  <span className="sp-card-num">{String(n).padStart(2, '0')}</span>
                  <span className="sp-card-cat">{cat}</span>
                </div>
                <div className="sp-card-body">
                  <span className="sp-card-icon"><Icon size={20} strokeWidth={1.8} aria-hidden="true" /></span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <button type="button" className="sp-card-link" aria-label={`View details: ${title}`}
                    onClick={(e) => { opener.current = e.currentTarget; setOpen(title); }}>
                    View details<ArrowUpRight size={15} strokeWidth={2.2} aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="sp-cta" aria-labelledby="sp-cta-title">
          <div>
            <p className="sp-kicker">Start a project</p>
            <h2 id="sp-cta-title">Tell us about your site. <em>We will take it from there.</em></h2>
            <p>Share your space, size and timeline. We visit, suggest a plant palette and materials, and send a quotation.</p>
          </div>
          <div className="sp-cta-actions">
            <a className="sp-btn" href={WA_GENERAL} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Chat on WhatsApp</a>
            <a className="sp-btn sp-btn--ghost" href={`tel:${PHONE}`}><Phone size={16} strokeWidth={2.2} aria-hidden="true" /> 98499 36169</a>
          </div>
        </section>
      </main>

      {isOpen && at >= 0 && (() => {
        const { title, text, Icon, atlas, alt, category: cat, n, includes, idealFor, kind } = shown[at];
        return (
          <dialog ref={dialog} className="sp-dialog" aria-labelledby="sp-dialog-title" onCancel={close}
            onClick={(e) => { if (e.target === e.currentTarget) close(); }}
            onKeyDown={(e) => { if (shown.length > 1 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) step(e.key === 'ArrowRight' ? 1 : -1); }}>
            <div className="sp-dialog-layout" key={title}>
              <div className="sp-dialog-media">
                <ServicePicture atlas={atlas} alt={alt} />
                <span className="sp-dialog-num">{String(n).padStart(2, '0')}<small> / {String(ITEMS.length).padStart(2, '0')}</small></span>
                <div className="sp-dialog-for">
                  <p><Users size={14} strokeWidth={2.2} aria-hidden="true" />Ideal for</p>
                  <ul>{idealFor.map((f) => <li key={f}>{f}</li>)}</ul>
                </div>
              </div>

              <div className="sp-dialog-body">
                <p className="sp-dialog-kicker"><span><Icon size={16} strokeWidth={1.9} aria-hidden="true" /></span>{cat}</p>
                <h2 id="sp-dialog-title">{title}</h2>
                <p className="sp-dialog-text">{text}</p>

                <h3>What's included</h3>
                <ul className="sp-dialog-includes">
                  {includes.map((x) => <li key={x}><span aria-hidden="true"><Check size={13} strokeWidth={2.6} /></span>{x}</li>)}
                </ul>

                <h3>How it works</h3>
                <ol className="sp-dialog-steps">{STEPS[kind].map((x, i) => <li key={x}><span>{i + 1}</span>{x}</li>)}</ol>

                <div className="sp-dialog-actions">
                  <a className="sp-dialog-cta" href={waLink(`Hello SABSN, I would like to enquire about ${title}.`)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" />Enquire on WhatsApp
                  </a>
                  <a className="sp-dialog-call" href={`tel:${PHONE}`}><Phone size={15} strokeWidth={2.2} aria-hidden="true" /><span className="sp-dialog-call-label">Call us</span></a>
                  {shown.length > 1 && (
                    <div className="sp-dialog-nav">
                      <button type="button" onClick={() => step(-1)} aria-label={`Previous service: ${shown[(at - 1 + shown.length) % shown.length].title}`}><ArrowLeft size={17} aria-hidden="true" /></button>
                      <button type="button" onClick={() => step(1)} aria-label={`Next service: ${shown[(at + 1) % shown.length].title}`}><ArrowRight size={17} aria-hidden="true" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button type="button" className="sp-dialog-close" onClick={close} aria-label="Close"><X size={18} aria-hidden="true" /></button>
          </dialog>
        );
      })()}

      <Suspense fallback={null}><Footer /></Suspense>
      <WhatsAppButton />
    </div>
  );
}
