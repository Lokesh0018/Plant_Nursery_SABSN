import React, { lazy, Suspense, useRef, useState } from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import VineOrnament from './VineOrnament';
import { atlasCell } from '../data/categories';
import './CategoryCollection.css';

const CategoryModal = lazy(() => import('./CategoryModal')); // only fetched when a category is opened

export default function CategoryCollection({ kind, categories }) {
  const pots = kind === 'pots';
  const [open, setOpen] = useState(null);
  const cards = useRef([]);
  const closeModal = () => {
    const card = cards.current[open];
    setOpen(null);
    card?.focus({ preventScroll: true });
  };
  return (
    <section id={pots ? 'pots-collection' : 'collection'} className={`category-section category-section--${kind}`} aria-labelledby={`${kind}-categories-title`}>
      <div className="category-wrap">
        <header className="category-heading">
          <div>
            <p className="category-eyebrow">{pots ? 'The perfect home for your plants' : 'Explore our plant world'}</p>
            <h2 id={`${kind}-categories-title`}>{pots ? <>Good roots. <em>Beautiful pots.</em></> : <>Find your kind <em>of green.</em></>}</h2>
            <VineOrnament />
          </div>
          <div className="category-heading-side">
            <p>{pots ? 'From earthy clay to contemporary finishes, discover a planter for every plant and every space.' : 'From a quiet indoor corner to an entire landscape, explore plants for the spaces you love.'}</p>
            <span className="category-count">08 categories · Endless possibilities</span>
          </div>
        </header>
        <ul className="category-grid">
          {categories.map(({ title, text, alt, tag }, i) => {
            return <li key={title} className="category-card">
              <button type="button" ref={(el) => { cards.current[i] = el; }} onClick={() => setOpen(i)} aria-haspopup="dialog" aria-label={`View details for ${title}`}>
                <div className="category-media">
                  <div className="category-photo">
                    <img src={`/categories/${kind}-atlas.webp`} alt={`Illustration of ${alt.charAt(0).toLowerCase() + alt.slice(1)}`} loading="lazy" decoding="async" width="1536" height="1024"
                      style={atlasCell(kind, i).style} />
                  </div>
                  <span className="category-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <span className="category-tag">{tag}</span>
                </div>
                <div className="category-body">
                  <h3>{title}</h3><p>{text}</p>
                  <span className="category-enquire">Explore this category <span><ArrowUpRight size={18} aria-hidden="true" /></span></span>
                </div>
              </button>
            </li>;
          })}
        </ul>
        <div className="category-bottom">
          <p>{pots ? 'Need help choosing a size or finish? Let’s find the right fit.' : 'Not sure where to start? We’ll help you choose the right plants.'}</p>
          <a href={pots ? `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, please help me choose the right pots for my plants.')}` : '/plants'}
            {...(pots ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {pots ? 'Find your perfect planter' : 'Browse all plants'} <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
      {open !== null && (
        <Suspense fallback={null}>
          <CategoryModal kind={kind} categories={categories} index={open} onIndex={setOpen} onClose={closeModal} />
        </Suspense>
      )}
    </section>
  );
}
