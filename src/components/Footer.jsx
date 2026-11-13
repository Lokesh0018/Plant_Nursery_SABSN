import React, { useEffect, useRef } from 'react';
import { MapPin, Phone, Mail, MessageCircle, ArrowUp, Clock } from 'lucide-react';
import FallingLeaves from './FallingLeaves';
import FooterStamp from './FooterStamp';
import Meadow from './Meadow';
import FooterEdge from './FooterEdge';
import useOffscreenPause from '../hooks/useOffscreenPause';
import { subscribeScroll } from '../lib/scrollStore';
import './Footer.css';

// ink blots stamped along the wordmark (x %, y %), in stamping order
const BLOTS = [
  [6, 55], [17, 38], [28, 62], [39, 44], [50, 58], [61, 40], [72, 60], [83, 42], [94, 56],
];
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const YEAR = new Date().getFullYear();

export default function Footer() {
  const footerRef = useRef(null);
  const footerInView = useOffscreenPause(footerRef);

  // wordmark ink reveal: blot radii follow the footer's progress into the viewport, so the mark is
  // fully inked exactly at the page bottom and un-inks on the way back up
  useEffect(() => {
    const el = footerRef.current;
    const mark = el?.querySelector('.footer-wordmark');
    if (!el || !mark) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      BLOTS.forEach((_, i) => mark.style.setProperty(`--b${i}`, '40%'));
      return undefined;
    }
    let last = -1;
    const tick = ({ vh }) => {
      if (!footerInView.current) return; // nothing to ink while the footer is off screen
      const r = el.getBoundingClientRect();
      const p = clamp01((vh - r.top) / r.height); // 1 exactly at the page bottom
      if (p === last) return;
      last = p;
      BLOTS.forEach((_, i) => {
        const t = clamp01((p - 0.38 - i * 0.05) / 0.16);
        mark.style.setProperty(`--b${i}`, `${(t * 40).toFixed(2)}%`);
      });
    };
    return subscribeScroll(tick);
  }, [footerInView]);


  return (
    <div className="footer-shell">
    {/* botanical top edge: a leafy vine straddling the seam. It sits outside the footer so the
        footer's overflow clipping cannot cut off the leaves that reach up over the contact section */}
    <FooterEdge />
    <footer ref={footerRef} className="premium-footer">
      {/* Theme atmosphere: forest ground like the hero, lime light, corner leaves, ghost watermark */}
      <div className="footer-atmosphere" aria-hidden="true">
        <span className="footer-glow footer-glow--left" />
        <span className="footer-glow footer-glow--right" />
        <span className="footer-glow footer-glow--top" />
        <span className="footer-grain" />
        {/* a slow light band keeps the end screen alive */}
        <span className="footer-light-band" />
        {/* dappled light: sun through a canopy, two soft leaf-shadow layers drifting against each other */}
        <span className="footer-dapple footer-dapple--a" />
        <span className="footer-dapple footer-dapple--b" />
        {/* low lime ground mist that breathes */}
        <span className="footer-ground-mist" />
        {/* fireflies: the hero's pollen recipe, slower and sparser for the close of the page */}
        <div className="footer-fireflies">
          {Array.from({ length: 16 }).map((_, i) => (
            <i key={i} style={{ '--i': i }} />
          ))}
        </div>
        {/* a few leaves drifting down, the same component the hero uses */}
        <FallingLeaves className="footer-leaves" count={10} />
      </div>
      {/* giant wordmark, revealed by ink blots on scroll and sinking into the meadow */}
      <div
        className="footer-wordmark"
        aria-hidden="true"
        style={{
          '--blots': BLOTS.map(([x, y], i) =>
            `radial-gradient(circle at ${x}% ${y}%, #000 var(--b${i}, 0%), transparent calc(var(--b${i}, 0%) + 1.5%))`
          ).join(', '),
        }}
      >
        SABSN
      </div>
      <span className="footer-meadow-glow" aria-hidden="true" />
      <Meadow className="footer-meadow" />
      <div className="footer-corner-leaf footer-corner-leaf-top" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>
      <div className="footer-corner-leaf footer-corner-leaf-bottom" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>
      <div className="premium-footer-container">

        <div className="footer-top-grid footer-reveal">
          <div className="footer-brand-col">
            <div className="footer-brand-row">
              <img src="/logo/logo-256.webp" alt="Sri Ayyappa Bala Sai Nursery logo" className="footer-brand-logo" width="64" height="64" />
              <h3 className="footer-brand-name">SABSN</h3>
            </div>
            <p className="footer-brand-desc">
              Sri Ayyappa Bala Sai Nursery — hybrid flowering plants, fruit saplings, ornamental, revenue and lawn plants, grown with care.
            </p>
            <ul className="footer-meta">
              <li><MapPin size={14} /> Kadiam, Godavari Delta, Andhra Pradesh</li>
              <li><Clock size={14} /> Open daily, 7 am to 6 pm</li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-header">Shop</h4>
            <a href="#collection" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}>All Plants</a>
            <a href="#collection" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}>Collections</a>
            <a href="#pots-collection" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('pots-collection')?.scrollIntoView({ behavior: 'smooth' }); }}>Planters</a>
            <a href="#care" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('care')?.scrollIntoView({ behavior: 'smooth' }); }}>Care Tools</a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-header">About</h4>
            <a href="#about" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>Our Story</a>
            <a href="#about" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>Journal</a>
            <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Careers</a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-header">Support</h4>
            <a href="#care" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('care')?.scrollIntoView({ behavior: 'smooth' }); }}>Plant Care</a>
            <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>FAQ</a>
            <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact Us</a>
          </div>

          {/* finale: the seed rolls in from the page edge and becomes the nursery stamp */}
          <div className="footer-stamp-col">
            <FooterStamp />
          </div>
        </div>

        <div className="footer-divider footer-reveal" />

        <div className="footer-bottom footer-reveal">
          <p className="footer-copyright">&copy; {YEAR} Sri Ayyappa Bala Sai Nursery. All rights reserved.</p>

          <div className="footer-socials">
            <a href="https://wa.me/919849936169" target="_blank" rel="noopener noreferrer" className="social-link">
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a href="tel:+919849936169" className="social-link">
              <Phone size={14} /> +91 98499 36169
            </a>
            <a href="mailto:uppadakumaraswamy@gmail.com" className="social-link">
              <Mail size={14} /> uppadakumaraswamy@gmail.com
            </a>
          </div>

          <button
            type="button"
            className="footer-top-btn"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp size={16} />
          </button>
        </div>

      </div>
    </footer>
    </div>
  );
}
