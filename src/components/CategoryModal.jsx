import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sun, Sprout, Ruler, MapPin, Weight, MessageCircle, ArrowRight, ArrowLeft, Check, Leaf } from 'lucide-react';
import { plantCategoryDetails, potCategoryDetails } from '../data/categoryDetails';
import { atlasCell } from '../data/categories';
import './CategoryModal.css';

const WA_NUMBER = '919849936169';
const wa = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

/*
 * Category detail modal for the homepage plant and pot sections.
 * Esc, backdrop and the close button dismiss it; arrow buttons (and ←/→ keys) step through the section.
 */
export default function CategoryModal({ kind, categories, index, onIndex, onClose }) {
  const pots = kind === 'pots';
  const category = categories[index];
  const details = (pots ? potCategoryDetails : plantCategoryDetails)[category.title];
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const bodyRef = useRef(null);
  const [closing, setClosing] = useState(false);
  const total = categories.length;
  const go = (step) => onIndex((index + step + total) % total);

  const close = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return onClose();
    setClosing(true);
  };

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    return () => { document.body.style.overflow = overflow; };
  }, []);

  // new category: start reading from the top
  useEffect(() => { bodyRef.current?.scrollTo({ top: 0 }); }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Tab') {
        const f = panelRef.current.querySelectorAll('button, a[href]');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const cell = atlasCell(kind, index);
  const facts = pots
    ? [{ icon: MapPin, label: 'Placement', value: details.facts.placement }, { icon: Weight, label: 'Weight', value: details.facts.weight }, { icon: Ruler, label: 'Sizes', value: details.facts.sizes }]
    : [{ icon: Sun, label: 'Light', value: details.facts.light }, { icon: Sprout, label: 'Care', value: details.facts.care }, { icon: Ruler, label: 'Sizes', value: details.facts.sizes }];
  const list = pots ? details.styles : details.varieties;
  const number = String(index + 1).padStart(2, '0');

  return createPortal(
    <div className={`cm-root cm-root--${kind}${closing ? ' is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="cm-title" aria-describedby="cm-intro"
      onAnimationEnd={(e) => { if (closing && e.target === e.currentTarget) onClose(); }}>
      <div className="cm-backdrop" onClick={close} />
      <div ref={panelRef} className="cm-panel">
        <button ref={closeRef} className="cm-close" onClick={close} aria-label="Close category details"><X size={20} aria-hidden="true" /></button>

        <div className="cm-media" key={`media-${index}`}>
          <div className="cm-cell" style={{ '--r': cell.ratio }}>
            <img src={`/categories/${kind}-atlas.webp`} alt="" width="1536" height="1024" decoding="async" style={cell.style} />
          </div>
          <span className="cm-number" aria-hidden="true">{number}</span>
          <span className="cm-tag">{category.tag}</span>
        </div>

        <div ref={bodyRef} className="cm-body">
          <div className="cm-content" key={`body-${index}`}>
            <p className="cm-kicker"><Leaf size={13} strokeWidth={2.2} aria-hidden="true" />{pots ? 'Pot category' : 'Plant category'} · {number} of {String(total).padStart(2, '0')}</p>
            <h2 id="cm-title" className="cm-title">{category.title}</h2>
            <p className="cm-lead">{category.text}</p>
            <p id="cm-intro" className="cm-intro">{details.intro}</p>

            <ul className="cm-facts" aria-label={pots ? 'At a glance' : 'Growing at a glance'}>
              {facts.map(({ icon: Icon, label, value }) => (
                <li key={label}>
                  <span className="cm-fact-icon"><Icon size={17} strokeWidth={2} aria-hidden="true" /></span>
                  <span><small>{label}</small><strong>{value}</strong></span>
                </li>
              ))}
            </ul>

            <section className="cm-block" aria-labelledby="cm-list-title">
              <h3 id="cm-list-title" className="cm-label">{pots ? 'Styles we stock' : 'Popular varieties'}</h3>
              <ul className="cm-chips">{list.map((v) => <li key={v}>{v}</li>)}</ul>
            </section>

            <section className="cm-block" aria-labelledby="cm-best-title">
              <h3 id="cm-best-title" className="cm-label">Best for</h3>
              <p className="cm-best">{details.bestFor}</p>
            </section>

            <section className="cm-block" aria-labelledby="cm-tips-title">
              <h3 id="cm-tips-title" className="cm-label">{pots ? 'Good to know' : 'Care tips'}</h3>
              <ul className="cm-tips">{details.tips.map((t) => <li key={t}><Check size={14} strokeWidth={2.6} aria-hidden="true" /><span>{t}</span></li>)}</ul>
            </section>
          </div>

          <div className="cm-foot">
            <div className="cm-actions">
              <a className="cm-btn cm-btn--solid" target="_blank" rel="noopener noreferrer"
                href={wa(`Hello SABSN, I would like to enquire about ${category.title}. Please share available ${pots ? 'styles, sizes' : 'varieties, sizes'} and prices.`)}>
                <MessageCircle size={18} aria-hidden="true" /> Enquire on WhatsApp
              </a>
              {pots
                ? <a className="cm-btn cm-btn--ghost" target="_blank" rel="noopener noreferrer" href={wa(`Hello SABSN, please help me choose the right ${category.title.toLowerCase()} for my plants.`)}>Help me choose <ArrowRight size={17} aria-hidden="true" /></a>
                : <a className="cm-btn cm-btn--ghost" href="/plants">Browse all plants <ArrowRight size={17} aria-hidden="true" /></a>}
            </div>
            <nav className="cm-nav" aria-label={`${pots ? 'Pot' : 'Plant'} categories`}>
              <button type="button" onClick={() => go(-1)} aria-label={`Previous: ${categories[(index - 1 + total) % total].title}`}><ArrowLeft size={17} aria-hidden="true" /></button>
              <span aria-live="polite">{number} / {String(total).padStart(2, '0')}</span>
              <button type="button" onClick={() => go(1)} aria-label={`Next: ${categories[(index + 1) % total].title}`}><ArrowRight size={17} aria-hidden="true" /></button>
            </nav>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
