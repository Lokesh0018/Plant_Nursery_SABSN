import React, { useRef } from 'react';
import useOffscreenPause from '../hooks/useOffscreenPause';
import './NurseryMarquee.css';

const CAPABILITIES = [
  { value: '4,000+', label: 'Product Types' },
  { value: '950,000', label: 'Plants / Year' },
  { value: '100+', label: 'Regular Suppliers' },
  { value: 'Multi-State', label: 'Reach' },
];
const STRENGTHS = [
  'Reliable Supply Planning',
  'Diverse Plant Selection',
  'Large-Scale Production',
  'Landscaping Support',
  'Planting & Maintenance',
];

// Each track holds the same run twice, side by side; sliding by exactly one run (-50%) loops
// seamlessly. A run repeats the items so it is always wider than the widest screen.
const REPEAT = 3;

function Track({ children, direction }) {
  const run = Array.from({ length: REPEAT }, (_, r) => (
    <React.Fragment key={r}>{children}</React.Fragment>
  ));
  return (
    <div className={`nm-track nm-track--${direction}`} aria-hidden="true">
      <div className="nm-run">{run}</div>
      <div className="nm-run">{run}</div>
    </div>
  );
}

const Star = () => <span className="nm-star">✳</span>;

/* Two crossing ribbons: capabilities in figures (moving right), strengths in words (moving left).
   Pure CSS transform animation on the compositor; paused while off screen and for reduced motion. */
export default function NurseryMarquee() {
  const ref = useRef(null);
  useOffscreenPause(ref);

  return (
    <section ref={ref} className="nursery-marquee" aria-label="SABSN at a glance">
      {/* one readable copy for screen readers; the moving ribbons are decorative duplicates */}
      <ul className="nm-sr-only">
        {CAPABILITIES.map(({ value, label }) => <li key={label}>{value} {label}</li>)}
        {STRENGTHS.map((s) => <li key={s}>{s}</li>)}
      </ul>

      <div className="nm-ribbon nm-ribbon--figures">
        <Track direction="right">
          {CAPABILITIES.map(({ value, label }) => (
            <span className="nm-item" key={label}>
              <strong>{value}</strong> {label}
              <Star />
            </span>
          ))}
        </Track>
      </div>

      <div className="nm-ribbon nm-ribbon--words">
        <Track direction="left">
          {STRENGTHS.map((s) => (
            <span className="nm-item" key={s}>
              {s}
              <Star />
            </span>
          ))}
        </Track>
      </div>
    </section>
  );
}
