import React, { useEffect, useRef } from 'react';
import useOffscreenPause from '../hooks/useOffscreenPause';

const ROLL = 380;  // px the seed rolls in from (to the right of its spot)
const RANGE = 260; // px of scroll at the very bottom of the page that drive the whole animation

const clamp = (v) => Math.max(0, Math.min(1, v));
// 0 -> 1 between a and b with an ease-in-out curve
const smooth = (a, b, p) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Footer finale: as the page reaches its bottom, a seed rolls in from the right edge (spinning as it
 * rolls), squashes a little as it lands, then becomes a round nursery stamp with a slowly turning
 * lettered ring. Scroll-linked, forward and back, over the last RANGE px of the page. Under
 * prefers-reduced-motion the finished stamp is shown.
 */
export default function FooterStamp() {
  const root = useRef(null);
  // Observe a static anchor, not the moving spot: while rolling in, the seed sits 380px to the
  // right of its spot, outside the viewport, which would read as "off screen" and stall the loop.
  const anchor = useRef(null);
  const inView = useOffscreenPause(anchor, { margin: '40%' });
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const whole = el.querySelector('[data-fs="whole"]');
    const stamp = el.querySelector('[data-fs="stamp"]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      whole.style.opacity = '0';
      stamp.style.opacity = '1';
      return undefined;
    }

    let raf = 0;
    let last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!inView.current) return; // skip the scroll maths while the stamp is off screen
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = clamp((window.scrollY - (max - RANGE)) / RANGE); // 0 -> 1 over the last RANGE px
      if (p === last) return; // nothing moved
      last = p;

      // beats: appear 0-0.04, roll 0.04-0.76, land/squash around 0.76, stamp 0.76-1
      const appear = clamp(p / 0.04);
      const roll = smooth(0.04, 0.76, p);
      const land = 1 - Math.min(1, Math.abs(p - 0.76) / 0.12); // squash peaks on landing
      const toStamp = smooth(0.78, 1, p);
      const x = ROLL * (1 - roll);
      const rot = -620 * roll;
      const sy = 1 - 0.16 * land;
      const sx = 1 + 0.09 * land;

      el.style.transform = `translate3d(${x}px, ${(el.offsetHeight * (1 - sy)) / 2}px, 0)`;
      whole.style.opacity = String(appear * (1 - toStamp));
      whole.style.transform = `scale(${sx}, ${sy}) rotate(${rot}deg)`;
      stamp.style.opacity = String(toStamp);
      stamp.style.transform = `scale(${1.15 - 0.15 * toStamp})`;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <span ref={anchor} className="footer-stamp-anchor" aria-hidden="true">
    <span ref={root} className="footer-stamp-spot">
      {/* the seed: a warm brown pod with a pale crease so the spin reads */}
      <svg data-fs="whole" className="footer-stamp-layer" viewBox="0 0 200 200" style={{ opacity: 0 }}>
        <defs>
          <radialGradient id="fs-seed" cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#b98a52" />
            <stop offset="0.55" stopColor="#7a5230" />
            <stop offset="1" stopColor="#4a2f18" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#fs-seed)" />
        <path d="M100 30 C 86 60, 86 140, 100 170" fill="none" stroke="#e8cfa6" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="78" cy="66" rx="18" ry="10" fill="#ffffff" opacity="0.16" transform="rotate(-30 78 66)" />
        <path d="M100 170 c 4 -14, 18 -20, 30 -16 c -8 10, -18 16, -30 16 Z" fill="#9bc478" />
      </svg>

      {/* the stamp: lime rings, a turning lettered ring, and the nursery sprout at the centre */}
      <svg data-fs="stamp" className="footer-stamp-face" viewBox="0 0 200 200" style={{ opacity: 0 }}>
        <defs>
          <path id="fs-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
        </defs>
        <circle cx="100" cy="100" r="94" fill="none" stroke="#c9d98a" strokeWidth="5" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#c9d98a" strokeWidth="2.5" />
        <g className="footer-stamp-ring">
          {!reduceMotion && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="40s"
              repeatCount="indefinite"
            />
          )}
          <text fill="#c9d98a" fontFamily="var(--font-sans, 'Inter', sans-serif)" fontWeight="600" fontSize="16" letterSpacing="3.6">
            <textPath href="#fs-ring">GROWN IN KADIAM · SINCE 1980s · WITH CARE ·</textPath>
          </text>
        </g>
        <g transform="translate(100 100)">
          <circle r="34" fill="#c9d98a" />
          <circle r="27" fill="#163624" />
          {/* sprout: stem with two leaves, soil mound beneath */}
          <path d="M-14 12 Q0 18 14 12 Q0 10 -14 12 Z" fill="#7a5230" />
          <path d="M0 11 V -6" stroke="#c9d98a" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M0 -4 C -4 -14, -16 -16, -18 -8 C -12 -2, -4 -2, 0 -4 Z" fill="#9bc478" />
          <path d="M0 -8 C 4 -18, 16 -20, 18 -12 C 12 -6, 4 -6, 0 -8 Z" fill="#c9d98a" />
        </g>
      </svg>
    </span>
    </span>
  );
}
