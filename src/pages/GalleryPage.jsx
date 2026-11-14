import React, { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { ArrowLeft, ArrowRight, X, Images, Expand } from 'lucide-react';
import Navbar from '../components/Navbar';
import WhatsAppButton from '../components/WhatsAppButton';
import VineOrnament from '../components/VineOrnament';
import { GALLERY_GROUPS, galleryItems } from '../data/gallery';
import './GalleryPage.css';

const Footer = lazy(() => import('../components/Footer'));

const FILTERS = [{ key: 'all', label: 'All' }, ...GALLERY_GROUPS.map(({ key, label }) => ({ key, label }))];
const countOf = (key) => (key === 'all' ? galleryItems.length : galleryItems.filter((g) => g.cat === key).length);

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
      <figure className="gp-lightbox-figure" key={item.src}>
        <img src={item.src} alt={item.alt} width={item.width} height={item.height} />
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
  const indexOf = useMemo(() => new Map(shown.map((item, i) => [item.src, i])), [shown]);

  return (
    <div className="gallery-page">
      <Navbar page="gallery" />

      <header className="gp-hero">
        <div className="gp-hero-inner">
          <nav className="gp-crumbs" aria-label="Breadcrumb">
            <a href="/"><ArrowLeft size={14} strokeWidth={2.2} aria-hidden="true" />Home</a>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Gallery</span>
          </nav>
          <p className="gp-eyebrow">The living archive</p>
          <h1 className="gp-title">Our <em>Gallery</em></h1>
          <VineOrnament />
          <p className="gp-lede">
            Landscapes we plant and look after, stock from our nursery beds in Kadiyam, and the clients and
            partners we work with.
          </p>
          <ul className="gp-stats">
            <li><strong>{galleryItems.length}</strong><span>photographs</span></li>
            <li><strong>{GALLERY_GROUPS.length}</strong><span>collections</span></li>
          </ul>
        </div>
      </header>

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
              {label}
              <span className="gp-filter-count">{countOf(key)}</span>
            </button>
          ))}
        </div>

        {/* re-keyed per filter so the collections settle in again */}
        <div key={filter}>
          {groups.map((group) => (
            <section key={group.key} className="gp-group" aria-labelledby={`gp-${group.key}`}>
              <header className="gp-group-head">
                <div>
                  <h2 id={`gp-${group.key}`}>{group.title}</h2>
                  <p>{group.blurb}</p>
                </div>
                <span className="gp-group-count"><Images size={15} aria-hidden="true" />{group.items.length} photos</span>
              </header>

              {/* masonry: every photo keeps its own shape, nothing is cropped */}
              <ul className={`gp-masonry${group.items.length <= 2 ? ' gp-masonry--pair' : ''}`}>
                {group.items.map((item) => {
                  const at = indexOf.get(item.src);
                  return (
                    <li key={item.src} className="gp-tile" style={{ '--i': at }}>
                      <button type="button" className="gp-tile-btn" onClick={() => setOpen(at)} aria-label={`Open photo: ${item.title}`}>
                        <span className="gp-tile-media">
                          <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" />
                          <span className="gp-tile-zoom" aria-hidden="true"><Expand size={16} /></span>
                        </span>
                        <span className="gp-tile-caption">
                          <span className="gp-tag">{item.tag}</span>
                          <span className="gp-tile-title">{item.title}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <section className="gp-cta" aria-labelledby="gp-cta-title">
          <div>
            <p className="gp-eyebrow gp-eyebrow--dark">Work with us</p>
            <h2 id="gp-cta-title">Want your landscape in our next photographs?</h2>
            <p>From a single planter to a full campus, tell us what you have in mind.</p>
          </div>
          <a className="gp-btn" href="/?section=contact">Plan a project <ArrowRight size={17} strokeWidth={2.2} aria-hidden="true" /></a>
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
