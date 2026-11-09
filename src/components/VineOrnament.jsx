import React, { useEffect, useRef } from 'react';
import './VineOrnament.css';

/* Small vine flourish used under section headings. Draws itself the first time it scrolls into view. */
export default function VineOrnament({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <svg ref={ref} className={`vine-ornament ${className}`} viewBox="0 0 180 28" width="180" height="28" aria-hidden="true">
      <defs>
        <linearGradient id="vo-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9fcf74" />
          <stop offset="1" stopColor="#4f7f3a" />
        </linearGradient>
      </defs>
      {/* two stems meeting at the centre bud */}
      <path className="vo-stem" d="M4 14 C 28 6, 44 22, 68 14 S 82 10, 86 14" />
      <path className="vo-stem" d="M176 14 C 152 6, 136 22, 112 14 S 98 10, 94 14" />
      {/* leaves, alternating sides */}
      <g className="vo-leaf" style={{ '--d': '0.35s' }} transform="translate(22 10) rotate(-50)"><path d="M0 0 C 3 -5, 9 -6, 11 -1 C 9 3, 3 4, 0 0 Z" /></g>
      <g className="vo-leaf" style={{ '--d': '0.5s' }} transform="translate(46 17) rotate(40)"><path d="M0 0 C 3 -5, 9 -6, 11 -1 C 9 3, 3 4, 0 0 Z" /></g>
      <g className="vo-leaf" style={{ '--d': '0.65s' }} transform="translate(66 13) rotate(-45)"><path d="M0 0 C 3 -5, 9 -6, 11 -1 C 9 3, 3 4, 0 0 Z" /></g>
      <g className="vo-leaf" style={{ '--d': '0.35s' }} transform="translate(158 10) rotate(-130) scale(-1 1)"><path d="M0 0 C 3 -5, 9 -6, 11 -1 C 9 3, 3 4, 0 0 Z" /></g>
      <g className="vo-leaf" style={{ '--d': '0.5s' }} transform="translate(134 17) rotate(140) scale(-1 1)"><path d="M0 0 C 3 -5, 9 -6, 11 -1 C 9 3, 3 4, 0 0 Z" /></g>
      <g className="vo-leaf" style={{ '--d': '0.65s' }} transform="translate(114 13) rotate(-135) scale(-1 1)"><path d="M0 0 C 3 -5, 9 -6, 11 -1 C 9 3, 3 4, 0 0 Z" /></g>
      {/* centre bud */}
      <g className="vo-bud" transform="translate(90 14)">
        <circle r="5" className="vo-bud-ring" />
        <circle r="2.4" className="vo-bud-eye" />
      </g>
    </svg>
  );
}
