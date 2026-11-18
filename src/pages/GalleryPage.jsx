import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { Leaf, ArrowLeft, ArrowRight, ArrowDown, X, Images, Expand, Clock, MapPin, MessageCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import VineOrnament from '../components/VineOrnament';
import VineDivider from '../components/VineDivider';
import { GALLERY_GROUPS, galleryItems } from '../data/gallery';
import './GalleryPage.css';

const Footer = lazy(() => import('../components/Footer'));

const FILTERS = [{ key: 'all', label: 'All' }, ...GALLERY_GROUPS.map(({ key, label }) => ({ key, label }))];
const countOf = (key) => (key === 'all' ? galleryItems.length : galleryItems.filter((g) => g.cat === key).length);
// three photographs pinned up in the header like prints
const PRINTS = ['/gallery/airport.webp', '/gallery/ficus.webp', '/gallery/palms.webp'].map((src) => galleryItems.find((g) => g.src === src)).filter(Boolean);
const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I saw your gallery and would like to discuss a landscaping project.')}`;

function GalleryPhoto({ item, lazy = false, crop = false }) {
  if (item.cell !== undefined) return <span className="gp-sheet-photo" role="img" aria-label={item.alt} style={{ backgroundImage: `url(${item.src})`, backgroundPosition: `${(item.cell % 2) * 100}% ${Math.floor(item.cell / 2) * 100}%` }} />;
  return <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading={lazy ? 'lazy' : undefined} decoding="async" style={crop && item.pos ? { objectPosition: item.pos } : undefined} />;
}

/* Full-screen viewer for one photo at a time: arrows, keyboard (left / right / Esc), swipe on touch,
   and a click on the dark backdrop closes it. Runs through whichever photos are currently shown. */
function Lightbox({ items, index, onClose, onMove }) {
  const ref = useRef(null);
  const touch = useRef(null);
  const item = items[index];

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); onMove(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); onMove(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onMove]);

  return (
    <dialog
      ref={ref}
      className="gp-lightbox"
      aria-label={`${item.title}, photo ${index + 1} of ${items.length}`}
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) ref.current.close(); }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 50) onMove(dx < 0 ? 1 : -1);
      }}
    >
      <figure className="gp-lightbox-figure" key={item.id || item.src}>
        <GalleryPhoto item={item} />
        <figcaption>
          <span className="gp-tag">{item.tag}</span>
          <strong>{item.title}</strong>
          <span className="gp-lightbox-count">{index + 1} / {items.length}</span>
        </figcaption>
      </figure>
      <button type="button" className="gp-lightbox-btn gp-lightbox-close" onClick={() => ref.current.close()} aria-label="Close" autoFocus>
        <X size={22} />
      </button>
      {items.length > 1 && (
        <>
          <button type="button" className="gp-lightbox-btn gp-lightbox-prev" onClick={() => onMove(-1)} aria-label="Previous photo">
            <ArrowLeft size={22} />
          </button>
          <button type="button" className="gp-lightbox-btn gp-lightbox-next" onClick={() => onMove(1)} aria-label="Next photo">
            <ArrowRight size={22} />
          </button>
        </>
      )}
    </dialog>
  );
}

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null); // index into `shown`, or null

  useEffect(() => { document.title = 'Gallery | SABSN — Sri Ayyappa Bala Sai Nursery'; }, []);

  const groups = useMemo(
    () => GALLERY_GROUPS
      .filter((g) => filter === 'all' || g.key === filter)
      .map((g) => ({ ...g, items: galleryItems.filter((i) => i.cat === g.key) })),
    [filter],
  );
  // the lightbox runs through the photos in the order they appear on screen
  const shown = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  const move = useCallback((dir) => {
    setOpen((i) => (i === null ? i : (i + dir + shown.length) % shown.length));
  }, [shown.length]);

  // position of each tile within `shown`
  const indexOf = useMemo(() => new Map(shown.map((item, i) => [item.id || item.src, i])), [shown]);

  return (
    <div className="gallery-page">
      <Navbar page="gallery" />

      <header className="gp-hero">
        <img className="gp-corner" src="/hero-tree/foliage-tr.webp" alt="" width="372" height="420" aria-hidden="true" decoding="async" />
        {/* a large outline leaf, barely there, so the lower left of the copy column is not flat green */}
        <Leaf className="gp-watermark" strokeWidth={0.6} aria-hidden="true" />
        <div className="gp-hero-copy">
          <p className="gp-visit">
            <span className="gp-visit-open"><span className="gp-visit-dot" aria-hidden="true" />Open daily</span>
            <span><Clock size={13} strokeWidth={2.2} aria-hidden="true" />7 am – 6 pm</span>
            <span><MapPin size={13} strokeWidth={2.2} aria-hidden="true" />Madhurawada, Visakhapatnam</span>
          </p>
          <p className="gp-eyebrow">The living archive</p>
          <h1 className="gp-title">Our <em>Gallery</em></h1>
          <VineOrnament />
          <p className="gp-lede">
            Landscapes we plant and look after, stock from our nursery beds in Kadiyam, and the clients and
            partners we work with.
          </p>
          <div className="gp-actions">
            <a className="gp-hero-btn" href="#photos" onClick={(e) => { e.preventDefault(); document.getElementById('photos')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Browse the photos <ArrowDown size={16} strokeWidth={2.2} aria-hidden="true" />
            </a>
            <a className="gp-hero-btn gp-hero-btn--ghost" href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> Plan a project
            </a>
          </div>
          <div className="gp-collections">
            <span>Collections</span>
            <ul>{GALLERY_GROUPS.map((g) => (
              <li key={g.key}><button type="button" onClick={() => { setFilter(g.key); document.getElementById('photos')?.scrollIntoView({ behavior: 'smooth' }); }}>
                {g.label}<span>{countOf(g.key)}</span>
              </button></li>
            ))}</ul>
          </div>
        </div>

        {/* three photographs pinned up like prints, with the archive's figures on a glass card */}
        <div className="gp-collage" aria-hidden="true">
          {PRINTS.map((item, i) => (
            <figure key={item.id || item.src} className={`gp-print gp-print--${'abc'[i]}`}>
              <img src={item.src} alt="" width={item.width} height={item.height} decoding="async" style={{ objectPosition: item.pos || 'center' }} />
              <figcaption>{item.tag}</figcaption>
            </figure>
          ))}
          <ul className="gp-collage-stats">
            <li><strong>{galleryItems.length}</strong><span>photographs</span></li>
            <li><strong>{GALLERY_GROUPS.length}</strong><span>collections</span></li>
          </ul>
        </div>
      </header>

      <VineDivider variant="ramp" id="gallery-top" from="#163624" to="#F7F3EA" />

      <main className="gp-main" id="photos">
        <div className="gp-filters" role="group" aria-label="Show a collection">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`gp-filter${filter === key ? ' is-on' : ''}`}
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {key === 'all' && <Images size={15} strokeWidth={2} aria-hidden="true" />}
              {label}
              <span className="gp-filter-count">{countOf(key)}</span>
            </button>
          ))}
        </div>

        {/* re-keyed per filter so the collections settle in again */}
        <div key={filter}>
          {groups.map((group, gi) => (
            <Fragment key={group.key}>
              {/* a vine divider between collections */}
              {gi > 0 && <VineDivider variant="ramp" id={`gallery-${group.key}`} from="#F7F3EA" to="#F7F3EA" />}
              <section className="gp-group" aria-labelledby={`gp-${group.key}`}>
                <header className="gp-group-head">
                  <div>
                    <p className="gp-group-kicker"><span>{String(GALLERY_GROUPS.findIndex((g) => g.key === group.key) + 1).padStart(2, '0')}</span>{group.label}</p>
                    <h2 id={`gp-${group.key}`}>{group.title}</h2>
                    <p>{group.blurb}</p>
                  </div>
                  <span className="gp-group-count"><Images size={15} aria-hidden="true" />{group.items.length} photos</span>
                </header>

                {/* justified rows: every photo keeps its own shape, and each row fills the width at one height */}
                <ul className="gp-rows">
                  {group.items.map((item, ii) => {
                    const at = indexOf.get(item.id || item.src);
                    // the first fixed-size photo starts a fresh row, so the closing portraits sit together
                    const breakBefore = item.fixedRow && !group.items[ii - 1]?.fixedRow;
                    return (
                      <Fragment key={item.id || item.src}>
                      {breakBefore && <li className="gp-row-break" role="presentation" />}
                      <li className={`gp-tile${item.fit === 'contain' ? ' gp-tile--complete' : ''}${item.fixedRow ? ' gp-tile--fixed' : ''}`} style={{ '--i': at, '--r': (item.displayRatio || item.width / item.height).toFixed(3) }}>
                        <button type="button" className="gp-tile-btn" onClick={() => setOpen(at)} aria-label={`Open photo: ${item.title}`}>
                          <span className="gp-tile-media">
                            <GalleryPhoto item={item} lazy crop />
                            <span className="gp-tile-zoom" aria-hidden="true"><Expand size={16} /></span>
                            <span className="gp-tile-caption">
                              <span className="gp-tag">{item.tag}</span>
                              <span className="gp-tile-title">{item.title}</span>
                            </span>
                          </span>
                        </button>
                      </li>
                      </Fragment>
                    );
                  })}
                </ul>
              </section>
            </Fragment>
          ))}
        </div>

        <section className="gp-cta" aria-labelledby="gp-cta-title">
          <div>
            <p className="gp-eyebrow">Work with us</p>
            <h2 id="gp-cta-title">Want your landscape in <em>our next photographs?</em></h2>
            <p>From a single planter to a full campus, tell us what you have in mind.</p>
          </div>
          <div className="gp-cta-actions">
            <a className="gp-hero-btn" href={WA_LINK} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} strokeWidth={2.2} aria-hidden="true" /> Chat on WhatsApp</a>
            <a className="gp-hero-btn gp-hero-btn--ghost" href="/contact">Contact details <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" /></a>
          </div>
        </section>
      </main>

      <Suspense fallback={<div style={{ minHeight: 460, background: '#0f2d1b' }} aria-hidden="true" />}>
        <Footer />
      </Suspense>
      <WhatsAppButton />

      {open !== null && <Lightbox items={shown} index={open} onClose={() => setOpen(null)} onMove={move} />}
    </div>
  );
}
