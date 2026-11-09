import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { X, Sun, Droplets, ShoppingBag, MessageCircle, Leaf, Check, Home, Sparkles, Layers, MapPin, Waves } from 'lucide-react';
import './PlantModal.css';

const WA_NUMBER = '919849936169';

/*
 * Plant detail modal. Opens by expanding from the clicked card (FLIP-style), closes back into it.
 * Esc, backdrop click and the close button all dismiss it; focus returns to the card.
 */
export default function PlantModal({ product, originRect, onClose }) {
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [added, setAdded] = useState(false);
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- open animation
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });

    if (reduce) {
      gsap.set([backdrop, panel], { opacity: 1 });
      return () => { document.body.style.overflow = ''; };
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.22 }, 0);

    if (originRect) {
      // FLIP: start where the card was, settle into the centred panel
      const r = panel.getBoundingClientRect();
      const sx = originRect.width / r.width;
      const sy = originRect.height / r.height;
      const dx = originRect.left + originRect.width / 2 - (r.left + r.width / 2);
      const dy = originRect.top + originRect.height / 2 - (r.top + r.height / 2);
      tl.fromTo(
        panel,
        { x: dx, y: dy, scaleX: sx, scaleY: sy, opacity: 0.6, borderRadius: 22 },
        { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, borderRadius: 28, duration: 0.38, ease: 'expo.out' },
        0
      );
    } else {
      tl.fromTo(panel, { y: 40, scale: 0.96, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.3 }, 0);
    }
    tl.fromTo('.pm-img', { y: 24, opacity: 0, scale: 0.92 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, 0.1)
      .fromTo('.pm-reveal', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.32, stagger: 0.04 }, 0.14);

    // gentle idle float on the plant
    const float = gsap.to('.pm-img', { y: -8, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.6 });

    return () => {
      tl.kill();
      float.kill();
      document.body.style.overflow = '';
    };
  }, [originRect, reduce]);

  // --- close with animation back toward the card
  const close = () => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (reduce) return onClose();
    const tl = gsap.timeline({ onComplete: onClose, defaults: { ease: 'power3.in' } });
    tl.to('.pm-reveal, .pm-img', { opacity: 0, y: 8, duration: 0.12, stagger: 0.01 }, 0);
    if (originRect) {
      const r = panel.getBoundingClientRect();
      const dx = originRect.left + originRect.width / 2 - (r.left + r.width / 2);
      const dy = originRect.top + originRect.height / 2 - (r.top + r.height / 2);
      tl.to(panel, { x: dx, y: dy, scaleX: originRect.width / r.width, scaleY: originRect.height / r.height, opacity: 0, duration: 0.26, ease: 'expo.in' }, 0.03);
    } else {
      tl.to(panel, { y: 24, scale: 0.96, opacity: 0, duration: 0.2 }, 0.03);
    }
    tl.to(backdrop, { opacity: 0, duration: 0.2 }, 0.08);
  };

  // --- keyboard: Esc closes, Tab stays inside
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
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

  const addToCart = () => {
    const img = panelRef.current.querySelector('.pm-img');
    const cartIcon = document.querySelector('.cart-icon-target');
    if (img && cartIcon && !reduce) {
      // same flight as the card's quick add: shrink, dip, then arc up into the cart
      const clone = img.cloneNode(true);
      const a = img.getBoundingClientRect();
      const c = cartIcon.getBoundingClientRect();
      Object.assign(clone.style, {
        position: 'fixed', top: `${a.top}px`, left: `${a.left}px`, width: `${a.width}px`, height: `${a.height}px`,
        zIndex: 9999, pointerEvents: 'none', transform: 'none', transition: 'none', margin: 0,
        filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.25))',
      });
      document.body.appendChild(clone);
      gsap.to(clone, { left: c.left + c.width / 2 - 15, width: 30, height: 30, duration: 0.9, ease: 'power1.inOut' });
      gsap.to(clone, {
        top: c.top + c.height / 2 - 15,
        opacity: 0.3,
        duration: 0.9,
        ease: 'back.in(3)',
        onComplete: () => {
          clone.remove();
          window.dispatchEvent(new CustomEvent('cart-updated', { detail: { item: product, quantity: 1 } }));
          gsap.fromTo(cartIcon, { scale: 1 }, { scale: 1.3, duration: 0.15, yoyo: true, repeat: 1 });
          setTimeout(() => {
            const badge = document.querySelector('.cart-badge');
            if (badge) gsap.fromTo(badge, { scale: 1 }, { scale: 1.5, duration: 0.15, yoyo: true, repeat: 1 });
          }, 50);
        },
      });
      // the plant on stage dips and springs back as its copy leaves
      gsap.fromTo(img, { scale: 1 }, { scale: 0.94, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
    } else {
      window.dispatchEvent(new CustomEvent('cart-updated', { detail: { item: product, quantity: 1 } }));
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const isPot = Array.isArray(product.materials) && product.materials.length > 0;
  const waText = encodeURIComponent(isPot ? `Hello SABSN, I’d like to enquire about the ${product.name} pot (${product.scientificName}).` : `Hello SABSN, I’d like to enquire about the ${product.name} (${product.scientificName}).`);

  return createPortal(
    <div className="pm-root" role="dialog" aria-modal="true" aria-labelledby="pm-title">
      <div ref={backdropRef} className="pm-backdrop" onClick={close} />
      <div ref={panelRef} className="pm-panel" data-lenis-prevent>
        <button ref={closeRef} className="pm-close" onClick={close} aria-label="Close">
          <X size={20} />
        </button>

        {/* Stage */}
        <div className="pm-stage">
          <span className="pm-stage-glow" aria-hidden="true" />
          <span className="pm-stage-ring" aria-hidden="true" />
          <span className="pm-stage-shadow" aria-hidden="true" />
          <img className="pm-img" src={product.image} alt={product.name} />
        </div>

        {/* Details */}
        <div className="pm-body">
          <p className="pm-latin pm-reveal">
            <Leaf size={13} strokeWidth={2.2} />
            <span>{product.scientificName}</span>
          </p>
          <h2 id="pm-title" className="pm-name pm-reveal">{product.name}</h2>
          <p className="pm-desc pm-reveal">{product.description}</p>

          {product.care && (
            <ul className="pm-care pm-reveal" aria-label={isPot ? 'Pot details' : 'Care guide'}>
              <li>
                <span className="pm-care-icon">{isPot ? <MapPin size={18} strokeWidth={2} /> : <Sun size={18} strokeWidth={2} />}</span>
                <span className="pm-care-text"><small>{isPot ? 'Placement' : 'Light'}</small><strong>{product.care.light}</strong></span>
              </li>
              <li>
                <span className="pm-care-icon">{isPot ? <Waves size={18} strokeWidth={2} /> : <Droplets size={18} strokeWidth={2} />}</span>
                <span className="pm-care-text"><small>{isPot ? 'Drainage' : 'Water'}</small><strong>{product.care.water}</strong></span>
              </li>
            </ul>
          )}

          {isPot && (
            <div className="pm-materials pm-reveal">
              <span className="pm-more-label"><Layers size={13} strokeWidth={2.2} /> Made from</span>
              <ul aria-label="Materials">
                {product.materials.map((m) => (
                  <li key={m.name}>
                    <strong>{m.name}</strong>
                    <span>{m.note}</span>
                  </li>
                ))}
              </ul>
              {product.finish && <p className="pm-finish"><span>Finish</span> {product.finish}</p>}
            </div>
          )}

          {(product.uses || product.positives) && (
            <div className="pm-more pm-reveal">
              {product.uses && (
                <div className="pm-uses">
                  <span className="pm-more-label"><Home size={13} strokeWidth={2.2} /> Best for</span>
                  <p>{product.uses}</p>
                </div>
              )}
              {product.positives && (
                <ul className="pm-positives" aria-label="Why you will love it">
                  {product.positives.map((t) => (
                    <li key={t}><Sparkles size={13} strokeWidth={2.2} /><span>{t}</span></li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="pm-foot pm-reveal">
            <div className="pm-price">
              <small>Price</small>
              <strong>₹{product.price.toLocaleString()}</strong>
            </div>
            <div className="pm-actions">
              <button className={`pm-btn pm-btn-solid${added ? ' is-added' : ''}`} onClick={addToCart}>
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                <span>{added ? 'Added to cart' : 'Add to cart'}</span>
              </button>
              <a
                className="pm-btn pm-btn-wa"
                href={`https://wa.me/${WA_NUMBER}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={18} />
                <span>Enquire</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
