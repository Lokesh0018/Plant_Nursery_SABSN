import React, { useEffect, useRef, useState } from 'react';
import { Package, Sprout, Handshake, MapPinned } from 'lucide-react';
import useOffscreenPause from '../hooks/useOffscreenPause';
import './NurseryMarquee.css';

const CAPABILITIES = [
  { value: '4,000+', label: 'Product Types', Icon: Package },
  { value: '950,000', label: 'Plants / Year', Icon: Sprout },
  { value: '100+', label: 'Regular Suppliers', Icon: Handshake },
  { value: 'Multi-State', label: 'Reach', Icon: MapPinned },
];
const STRENGTHS = [
  'Reliable Supply Planning',
  'Diverse Plant Selection',
  'Large-Scale Production',
  'Landscaping Support',
  'Planting & Maintenance',
];

// The ribbon holds the same run twice, side by side; sliding by exactly one run (-50%) loops
// seamlessly. A run repeats the items so it is always wider than the widest screen.
const REPEAT = 3;

// "4,000+" -> { n: 4000, suffix: '+' }; words stay as they are
function parseFigure(value) {
  const m = value.match(/^([\d,]+)(.*)$/);
  return m ? { n: Number(m[1].replace(/,/g, '')), suffix: m[2] } : null;
}
const FIGURES = CAPABILITIES.map((c) => ({ ...c, figure: parseFigure(c.value) }));

/* "SABSN at a glance", between the pots and the about section: four stat cards that rise in and
   count up the first time they are seen, then one calm ribbon of the nursery's strengths running
   left. The ribbon is a plain CSS transform loop, paused off screen and on hover, and still for
   reduced motion. */
export default function NurseryMarquee() {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 count-up
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useOffscreenPause(ref);

  // first sighting: raise the cards
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setIsIn(true); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsIn(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // then count the figures up over ~1.8 s (ease-out); reduced motion shows the final values
  useEffect(() => {
    if (!isIn || reduce) return undefined;
    let raf = 0;
    const start = performance.now() + 200; // let the cards start rising first
    const step = (now) => {
      const t = Math.max(0, Math.min(1, (now - start) / 1800));
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isIn, reduce]);

  const shown = reduce ? 1 : progress;
  const show = ({ value, figure }) => (figure
    ? `${Math.round(figure.n * shown).toLocaleString('en-US')}${figure.suffix}`
    : value);

  const run = Array.from({ length: REPEAT }, (_, r) => (
    <React.Fragment key={r}>
      {STRENGTHS.map((s) => (
        <span className="nm-item" key={s}>
          {s}
          <span className="nm-star">✳</span>
        </span>
      ))}
    </React.Fragment>
  ));

  return (
    <section ref={ref} className={`nursery-marquee${isIn ? ' is-in' : ''}`} aria-labelledby="nm-title">
      <div className="nm-head">
        <p className="nm-eyebrow">SABSN at a glance</p>
        <h2 id="nm-title" className="nm-title">Grown at scale, chosen with care</h2>
      </div>

      <ul className="nm-stats">
        {FIGURES.map((c) => (
          <li key={c.label} className="nm-stat">
            <span className="nm-icon" aria-hidden="true"><c.Icon size={22} strokeWidth={1.8} /></span>
            {/* the final value holds the width, so counting up never shifts the card; screen
                readers get the final value only */}
            <strong className="nm-fig">
              <span className="nm-fig-final">{c.value}</span>
              <span className="nm-fig-now" aria-hidden="true">{show(c)}</span>
            </strong>
            <span className="nm-label">{c.label}</span>
          </li>
        ))}
      </ul>

      {/* the strengths, readable once for screen readers; the moving copies are decorative */}
      <ul className="nm-sr-only">
        {STRENGTHS.map((s) => <li key={s}>{s}</li>)}
      </ul>
      <div className="nm-ribbon" aria-hidden="true">
        <div className="nm-track">
          <div className="nm-run">{run}</div>
          <div className="nm-run">{run}</div>
        </div>
      </div>
    </section>
  );
}
