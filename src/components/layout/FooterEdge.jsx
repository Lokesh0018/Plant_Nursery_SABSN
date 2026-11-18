import React, { useMemo } from 'react';

/**
 * Botanical top edge for the footer: a waving stem with leaves, buds, berries and tiny blossoms,
 * in the same shapes as the vine dividers. Sizes, angles and spacing vary along the stem so it
 * reads as grown rather than stamped. Static SVG, no animation, so it costs nothing on scroll.
 */
const W = 1440;
const H = 44;
const MID = 24;
// the largest leaves reach ~43 units out from the stem's crest/trough (14..34), so the view keeps a
// 34-unit margin on both sides of the 0..44 band; nothing is cut at the top or bottom
const PAD = 34;
const AMP = 10;
const LEAVES = [
  'M0 0 C 7 -11, 22 -15, 28 -2 C 22 9, 7 11, 0 0 Z',                  // oval
  'M0 0 C 5 -7, 16 -16, 30 -6 C 18 -2, 10 6, 0 0 Z',                  // slender, swept
  'M0 0 C 8 -14, 24 -14, 26 -4 C 30 2, 20 12, 8 8 C 3 6, 1 3, 0 0 Z', // broad with a tip
];
const VEIN = 'M1 0 C 9 -3, 17 -4, 25 -2';
const SIDE_VEINS = 'M7 -1.5 c 2 -3, 4 -5, 7 -6 M13 -2.5 c 2 -3, 4 -5, 6 -6 M8 0.5 c 2 3, 4 5, 7 5 M14 -0.5 c 2 3, 4 4, 6 4';
const BUD = 'M0 0 C -3 -5, -1 -12, 0 -14 C 1 -12, 3 -5, 0 0 Z';
const PETAL = 'M0 0 C 2.5 -3.5, 7 -4, 8.5 -0.5 C 7 3, 2.5 3.5, 0 0 Z';

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
      d += ` C ${x + span * 0.4} ${MID + up * AMP}, ${nx - span * 0.4} ${MID + up * AMP}, ${nx} ${MID}`;
      x = nx;
    }
    // items along the stem, alternating sides, with deterministic jitter in spacing, size and angle
    const items = [];
    const count = 36;
    for (let i = 1; i <= count; i++) {
      const px = ((i + Math.sin(i * 3.7) * 0.3) / (count + 1)) * W;
      const seg = Math.floor((px + 10) / span);
      const t = (px + 10 - seg * span) / span;
      const up = seg % 2 === 0 ? -1 : 1;
      // y on the cubic (approximate with the symmetric wave), tangent angle
      const py = MID + up * AMP * (4 * t * (1 - t));
      const ang = Math.atan2(up * AMP * (4 - 8 * t) / span, 1) * (180 / Math.PI);
      const side = i % 2 ? -1 : 1;
      const size = 1.3 + Math.sin(i * 1.9) * 0.25;
      const tilt = Math.sin(i * 2.3) * 10;
      const roll = i % 7;
      items.push({ px, py, ang, side, size, tilt, roll, i });
    }
    return { stem: d, items };
  }, []);

  return (
    <svg className="footer-edge" viewBox={`0 ${-PAD} ${W} ${H + PAD * 2}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="fe-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9fcf74" />
          <stop offset="0.6" stopColor="#6fa551" />
          <stop offset="1" stopColor="#3f6f33" />
        </linearGradient>
        <linearGradient id="fe-leaf-2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9d98a" />
          <stop offset="1" stopColor="#7fa84a" />
        </linearGradient>
        <radialGradient id="fe-berry" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#f5a6b4" />
          <stop offset="1" stopColor="#b03a5a" />
        </radialGradient>
        <linearGradient id="fe-bud" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7fb069" />
          <stop offset="1" stopColor="#f5c6d0" />
        </linearGradient>
        <linearGradient id="fe-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.06" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.94" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="fe-mask"><rect x="0" y={-PAD - 4} width={W} height={H + PAD * 2 + 8} fill="url(#fe-fade)" /></mask>
      </defs>
      <g mask="url(#fe-mask)">
        {/* secondary thin stem weaving the other way, then the main stem: dark body, lime face, pale highlight */}
        <path d={stem} fill="none" stroke="#9bbf6a" strokeWidth="1.4" opacity="0.6" transform={`translate(0 ${H}) scale(1 -1)`} />
        <path d={stem} fill="none" stroke="#3d6a2e" strokeWidth="4.6" strokeLinecap="round" />
        <path d={stem} fill="none" stroke="#7fa84a" strokeWidth="3" strokeLinecap="round" />
        <path d={stem} fill="none" stroke="rgba(236,245,210,0.65)" strokeWidth="0.9" transform="translate(0 -1)" />
        {items.map(({ px, py, ang, side, size, tilt, roll, i }) => (
          <g key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)})`}>
            {roll === 3 ? (
              <g transform={`rotate(${ang + side * 60 + 90})`}>
                <path d={BUD} fill="url(#fe-bud)" stroke="#4a7a37" strokeWidth="0.5" transform="scale(1.35)" />
                <path d="M0 0 C -2 -3, -1 -6, 0 -7" fill="none" stroke="#4a7a37" strokeWidth="0.8" />
              </g>
            ) : roll === 5 ? (
              <g transform={`rotate(${ang + side * 70})`}>
                <path d="M0 0 L 10 0" stroke="#6a994e" strokeWidth="1.2" strokeLinecap="round" />
                <g transform="translate(10 0) scale(1.25)">
                  {[0, 72, 144, 216, 288].map((a) => (
                    <path key={a} d={PETAL} fill="#fff7f0" stroke="#e3b8a0" strokeWidth="0.3" transform={`rotate(${a})`} />
                  ))}
                  <circle r="1.8" fill="#f1c94a" />
                </g>
              </g>
            ) : roll === 0 ? (
              <g transform={`rotate(${ang + side * 80})`}>
                <path d="M0 0 L 9 0" stroke="#6a994e" strokeWidth="1.1" strokeLinecap="round" />
                {[[10, 0, 3.6], [15, -4.2, 3], [15, 4.2, 2.8]].map(([cx, cy, r]) => (
                  <circle key={cx + cy} cx={cx} cy={cy} r={r} fill="url(#fe-berry)" stroke="#7a2440" strokeWidth="0.4" />
                ))}
              </g>
            ) : (
              <g transform={`rotate(${ang + side * 58 + tilt}) scale(${side === -1 ? size : -size}, ${size})`}>
                <path d={LEAVES[i % LEAVES.length]} fill={i % 3 === 1 ? 'url(#fe-leaf-2)' : 'url(#fe-leaf)'} stroke="#2f5a28" strokeWidth="0.6" />
                <path d={VEIN} fill="none" stroke="rgba(236,245,210,0.7)" strokeWidth="0.55" strokeLinecap="round" />
                <path d={SIDE_VEINS} fill="none" stroke="rgba(236,245,210,0.45)" strokeWidth="0.4" strokeLinecap="round" />
              </g>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
