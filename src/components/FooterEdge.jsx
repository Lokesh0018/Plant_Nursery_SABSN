import React, { useMemo } from 'react';

/**
 * Botanical top edge for the footer: a gently waving stem with alternating leaves, a few closed
 * buds and tiny blossoms, in the same shapes as the vine dividers. Static SVG, no animation, so
 * it costs nothing on scroll.
 */
const W = 1440;
const H = 44;
const MID = 24;
const LEAVES = [
  'M0 0 C 7 -11, 22 -15, 28 -2 C 22 9, 7 11, 0 0 Z',
  'M0 0 C 5 -7, 16 -16, 30 -6 C 18 -2, 10 6, 0 0 Z',
];
const VEIN = 'M1 0 C 9 -3, 17 -4, 25 -2';
const BUD = 'M0 0 C -3 -5, -1 -12, 0 -14 C 1 -12, 3 -5, 0 0 Z';

export default function FooterEdge() {
  const { stem, items } = useMemo(() => {
    // stem: a soft wave across the full width
    const segs = 12;
    const span = W / segs;
    let d = `M -10 ${MID}`;
    let x = -10;
    for (let i = 0; i < segs; i++) {
      const nx = x + span;
      const up = i % 2 === 0 ? -1 : 1;
      d += ` C ${x + span * 0.4} ${MID + up * 9}, ${nx - span * 0.4} ${MID + up * 9}, ${nx} ${MID}`;
      x = nx;
    }
    // items along the stem, alternating sides
    const items = [];
    const count = 30;
    for (let i = 1; i <= count; i++) {
      const px = (i / (count + 1)) * W;
      const seg = Math.floor(px / span);
      const t = (px - seg * span) / span;
      const up = seg % 2 === 0 ? -1 : 1;
      // y on the cubic (approximate with the symmetric wave), tangent angle
      const py = MID + up * 9 * (4 * t * (1 - t));
      const ang = Math.atan2(up * 9 * (4 - 8 * t) / span, 1) * (180 / Math.PI);
      const side = i % 2 ? -1 : 1;
      const roll = i % 6;
      items.push({ px, py, ang, side, roll, i });
    }
    return { stem: d, items };
  }, []);

  return (
    <svg className="footer-edge" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="fe-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9d98a" />
          <stop offset="1" stopColor="#6fa551" />
        </linearGradient>
        <linearGradient id="fe-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.08" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.92" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="fe-mask"><rect x="0" y="-20" width={W} height={H + 40} fill="url(#fe-fade)" /></mask>
      </defs>
      <g mask="url(#fe-mask)">
        {/* secondary thin stem weaving the other way, then the main stem */}
        <path d={stem} fill="none" stroke="#9bbf6a" strokeWidth="1" opacity="0.55" transform={`translate(0 ${H}) scale(1 -1)`} />
        <path d={stem} fill="none" stroke="#7fa84a" strokeWidth="2" strokeLinecap="round" />
        <path d={stem} fill="none" stroke="rgba(236,245,210,0.6)" strokeWidth="0.8" transform="translate(0 -0.9)" />
        {items.map(({ px, py, ang, side, roll, i }) => (
          <g key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
            {roll === 3 ? (
              <g transform={`rotate(${ang + side * 60 + 90})`}>
                <path d={BUD} fill="#e6a9b5" stroke="#4a7a37" strokeWidth="0.5" />
              </g>
            ) : roll === 5 ? (
              <g transform={`rotate(${ang + side * 70})`}>
                <path d="M0 0 L 7 0" stroke="#6a994e" strokeWidth="1" strokeLinecap="round" />
                <g transform="translate(7 0)">
                  {[0, 72, 144, 216, 288].map((a) => (
                    <path key={a} d="M0 0 C 2 -2.8, 5.5 -3.2, 6.8 -0.4 C 5.5 2.4, 2 2.8, 0 0 Z" fill="#fff7f0" stroke="#e3b8a0" strokeWidth="0.3" transform={`rotate(${a})`} />
                  ))}
                  <circle r="1.4" fill="#f1c94a" />
                </g>
              </g>
            ) : (
              <g transform={`rotate(${ang + side * 58}) scale(${side === -1 ? 0.95 : -0.95}, 0.95)`}>
                <path d={LEAVES[i % 2]} fill="url(#fe-leaf)" stroke="#2f5a28" strokeWidth="0.6" />
                <path d={VEIN} fill="none" stroke="rgba(236,245,210,0.7)" strokeWidth="0.5" strokeLinecap="round" />
              </g>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
