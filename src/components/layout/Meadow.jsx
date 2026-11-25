import React, { useMemo } from 'react';

const W = 1440;
const H = 96; // viewBox height, matches .footer-meadow height

// small deterministic PRNG so the meadow is identical on every render
function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
const f1 = (n) => n.toFixed(1);

// A tapering, curving blade: base half-width w at the origin, tip at (lean, -h). The curve bends more
// toward the tip, the way a long blade droops under its own weight.
const bladePath = (w, h, lean) =>
  `M${f1(-w)} 0 C ${f1(-w * 0.6)} ${f1(-h * 0.45)} ${f1(lean * 0.55 - w * 0.3)} ${f1(-h * 0.82)} ${f1(lean)} ${f1(-h)} ` +
  `C ${f1(lean * 0.55 + w * 0.45)} ${f1(-h * 0.8)} ${f1(w * 0.7)} ${f1(-h * 0.45)} ${f1(w)} 0 Z`;
const ribPath = (h, lean) => `M0 -1 C 0 ${f1(-h * 0.45)} ${f1(lean * 0.55)} ${f1(-h * 0.82)} ${f1(lean * 0.95)} ${f1(-h * 0.96)}`;

/**
 * Wind-blown meadow along the footer's bottom edge.
 * - Depth: a dark rolling silhouette, a dense static carpet of fine blades, then tufts of tapering,
 *   curving blades (front ones with a lit midrib) and a few clover clumps at the base.
 * - Wildflowers of four kinds, each drawn once in <defs>: daisies, golden buttercups, lavender spikes
 *   and dandelion clocks, some with a stem leaf or a closed bud beside them.
 * - The sway is per tuft / per flower and phased by x, so a gust visibly travels left to right.
 * Pure SVG + CSS. Every sway animation lives on an inner group so it never overrides the outer
 * group's positioning transform.
 */
export default function Meadow({ className = '', tufts = 56 }) {
  const { carpet, clumps, flowers, clovers } = useMemo(() => {
    const rnd = lcg(11);
    const phase = (x, extra = 0) => (-(x / W) * 5.5 - extra).toFixed(2);

    // static carpet: many fine blades merged into one path (no animation, almost no cost)
    let carpet = '';
    for (let i = 0; i < 260; i++) {
      const x = (i / 260) * W + rnd() * 6;
      const h = 12 + rnd() * 22;
      const lean = (rnd() - 0.5) * 14;
      const w = 0.9 + rnd() * 0.8;
      carpet += `M${f1(x - w)} ${H} Q ${f1(x + lean * 0.3)} ${f1(H - h * 0.6)} ${f1(x + lean)} ${f1(H - h)} Q ${f1(x + lean * 0.4 + w)} ${f1(H - h * 0.5)} ${f1(x + w)} ${H} Z `;
    }

    // tufts: 3-6 blades fanning out from one root, in three depths
    const clumps = [];
    for (let i = 0; i < tufts; i++) {
      const x = (i / tufts) * W + rnd() * 22;
      const depth = rnd();
      const tone = depth < 0.3 ? 'back' : depth < 0.68 ? 'mid' : 'front';
      const n = 3 + Math.floor(rnd() * 4);
      const base = tone === 'back' ? 26 : tone === 'mid' ? 34 : 40;
      const blades = [];
      for (let b = 0; b < n; b++) {
        const spread = (b / (n - 1 || 1) - 0.5) * 2; // -1 .. 1 across the tuft
        const h = base + rnd() * 38 * (1 - Math.abs(spread) * 0.35);
        blades.push({
          dx: spread * 3 + (rnd() - 0.5) * 2,
          h,
          lean: spread * (14 + rnd() * 16) + (rnd() - 0.5) * 8,
          w: (tone === 'front' ? 2.4 : 1.8) + rnd() * 1.2,
        });
      }
      clumps.push({
        x, tone, blades,
        delay: phase(x, rnd() * 0.8),
        dur: (5.2 + rnd() * 1.6).toFixed(2),
        amp: ((tone === 'front' ? 3 : 2) + rnd() * 1.4).toFixed(2),
      });
    }
    const order = { back: 0, mid: 1, front: 2 };
    clumps.sort((a, b) => order[a.tone] - order[b.tone]);

    // wildflowers, spread across the width with a little jitter
    const kinds = ['daisy', 'buttercup', 'daisy', 'lavender', 'dandelion', 'daisy', 'buttercup', 'lavender'];
    const flowers = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      const x = 30 + (i / count) * (W - 60) + rnd() * 40;
      const kind = kinds[i % kinds.length];
      const h = (kind === 'lavender' ? 46 : kind === 'dandelion' ? 54 : 34) + rnd() * 24;
      flowers.push({
        x, kind, h,
        bend: (rnd() - 0.5) * 12,
        size: 0.8 + rnd() * 0.45,
        tilt: (rnd() - 0.5) * 30,
        leaf: rnd() < 0.55 ? (rnd() < 0.5 ? -1 : 1) : 0,
        bud: kind !== 'dandelion' && rnd() < 0.35,
        delay: phase(x, 0.3),
        dur: (6 + rnd() * 1.5).toFixed(2),
      });
    }

    // a few clover clumps sitting low in the grass
    const clovers = Array.from({ length: 9 }, (_, i) => ({ x: 80 + (i / 9) * 1300 + rnd() * 60, s: 0.8 + rnd() * 0.5 }));
    return { carpet, clumps, flowers, clovers };
  }, [tufts]);

  return (
    <svg className={`meadow ${className}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        {/* blades lighten toward the tip, catching the light */}
        <linearGradient id="mw-back" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#14341f" />
          <stop offset="1" stopColor="#2b5a3a" />
        </linearGradient>
        <linearGradient id="mw-mid" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1c452c" />
          <stop offset="0.6" stopColor="#3e7a40" />
          <stop offset="1" stopColor="#5f9a4e" />
        </linearGradient>
        <linearGradient id="mw-front" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#24522f" />
          <stop offset="0.55" stopColor="#5f9a48" />
          <stop offset="1" stopColor="#b2d97c" />
        </linearGradient>
        <linearGradient id="mw-carpet" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#10301c" />
          <stop offset="1" stopColor="#2f6237" />
        </linearGradient>
        <linearGradient id="mw-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b2416" stopOpacity="0" />
          <stop offset="0.55" stopColor="#0a1f13" stopOpacity="0.85" />
          <stop offset="1" stopColor="#081a10" />
        </linearGradient>
        <linearGradient id="mw-petal" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#efdbe6" />
          <stop offset="0.45" stopColor="#fffaf3" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id="mw-disc" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="0.6" stopColor="#f0b829" />
          <stop offset="1" stopColor="#b9781a" />
        </radialGradient>
        <radialGradient id="mw-gold" cx="0.5" cy="0.9" r="1">
          <stop offset="0" stopColor="#e89a1c" />
          <stop offset="0.5" stopColor="#f7c936" />
          <stop offset="1" stopColor="#ffe680" />
        </radialGradient>

        {/* daisy: two rings of slim petals around a domed, dotted gold disc */}
        <g id="mw-daisy">
          {Array.from({ length: 14 }, (_, k) => (
            <ellipse key={`o${k}`} cx="0" cy="-5" rx="1.15" ry="4.3" fill="url(#mw-petal)" transform={`rotate(${k * (360 / 14)})`} />
          ))}
          {Array.from({ length: 10 }, (_, k) => (
            <ellipse key={`i${k}`} cx="0" cy="-3.6" rx="0.9" ry="3" fill="#ffffff" opacity="0.9" transform={`rotate(${k * 36 + 18})`} />
          ))}
          <circle r="2.7" fill="url(#mw-disc)" />
          {[[-0.9, -0.6], [0.8, -0.9], [0.2, 0.5], [-0.5, 1], [1.1, 0.6], [-1.3, 0.3]].map(([x, y], k) => (
            <circle key={`d${k}`} cx={x} cy={y} r="0.32" fill="#9a5f12" opacity="0.7" />
          ))}
          <circle cx="-0.8" cy="-1" r="0.8" fill="#fff4b8" opacity="0.6" />
        </g>
        {/* buttercup: five broad, cupped golden petals with a glossy sheen and green-gold eye */}
        <g id="mw-buttercup">
          {[0, 72, 144, 216, 288].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M0 -0.5 C -3.4 -1.6 -3.6 -6.6 0 -7.2 C 3.6 -6.6 3.4 -1.6 0 -0.5 Z" fill="url(#mw-gold)" />
              <path d="M-1 -5.6 C -0.4 -6.4 0.8 -6.4 1.3 -5.6" fill="none" stroke="#fff6c4" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />
            </g>
          ))}
          <circle r="1.7" fill="#9bb33a" />
          {Array.from({ length: 8 }, (_, k) => (
            <circle key={k} cx={Math.cos(k * 0.785) * 1.9} cy={Math.sin(k * 0.785) * 1.9} r="0.42" fill="#f3d24e" />
          ))}
        </g>
        {/* lavender: florets crowded up a spike, smaller and paler toward the tip */}
        <g id="mw-lavender">
          {Array.from({ length: 8 }, (_, k) => {
            const y = -k * 2.6;
            const s = 1 - k * 0.08;
            return (
              <g key={k}>
                <ellipse cx={-1.3 * s} cy={y} rx={1.3 * s} ry={1.8 * s} fill={k > 5 ? '#b8a2e3' : '#8f6fcf'} transform={`rotate(-25 ${-1.3 * s} ${y})`} />
                <ellipse cx={1.3 * s} cy={y - 1.2} rx={1.3 * s} ry={1.8 * s} fill={k > 5 ? '#c7b4ec' : '#7d5cbf'} transform={`rotate(25 ${1.3 * s} ${y - 1.2})`} />
              </g>
            );
          })}
          <ellipse cx="0" cy="-21.5" rx="0.9" ry="1.6" fill="#cfc0f0" />
        </g>
        {/* dandelion clock: a sphere of fine seed filaments, each tipped with a tiny tuft */}
        <g id="mw-dandelion">
          {Array.from({ length: 28 }, (_, k) => {
            const a = (k / 28) * Math.PI * 2;
            const r = 6.4 + (k % 3) * 0.5;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r * 0.92;
            return (
              <g key={k}>
                <line x1="0" y1="0" x2={x} y2={y} stroke="#f4f1e4" strokeWidth="0.28" opacity="0.7" />
                <circle cx={x} cy={y} r="0.62" fill="#ffffff" opacity="0.85" />
              </g>
            );
          })}
          <circle r="1.4" fill="#d9c9a2" />
          <circle r="7.6" fill="#ffffff" opacity="0.07" />
        </g>
        {/* a small leaf on a flower stem, and a closed bud */}
        <path id="mw-stem-leaf" d="M0 0 C 3 -3, 9 -3.6, 12 -1 C 8 1.4, 3 1.6, 0 0 Z" />
        <g id="mw-bud">
          <path d="M0 0 C -2.2 -2, -1.8 -5.4, 0 -7 C 1.8 -5.4, 2.2 -2, 0 0 Z" fill="#f3e9d6" />
          <path d="M0 0 C -1.6 -1, -2.4 -3, -1.6 -4.6 M0 0 C 1.6 -1, 2.4 -3, 1.6 -4.6" fill="none" stroke="#4a8a4a" strokeWidth="0.9" strokeLinecap="round" />
        </g>
        {/* clover: three heart-shaped leaflets */}
        <g id="mw-clover">
          {[-90, 30, 150].map((a) => (
            <path key={a} transform={`rotate(${a + 90})`} d="M0 0 C -3.2 -1.5 -3.8 -5.4 -1.2 -5.8 C -0.4 -5.9 0 -5.2 0 -4.6 C 0 -5.2 0.4 -5.9 1.2 -5.8 C 3.8 -5.4 3.2 -1.5 0 0 Z" fill="#3f7c3c" />
          ))}
          {[-90, 30, 150].map((a) => (
            <path key={`v${a}`} transform={`rotate(${a + 90})`} d="M-1.8 -3.4 C -0.8 -2.6 0.8 -2.6 1.8 -3.4" fill="none" stroke="#9cc879" strokeWidth="0.5" opacity="0.7" />
          ))}
        </g>
      </defs>

      {/* far back: a dark rolling bank, then a dense carpet of fine blades */}
      <path
        d={`M0 ${H} L0 66 C 120 56, 240 60, 360 64 C 480 68, 600 56, 720 58 C 840 60, 960 70, 1080 64 C 1200 58, 1320 60, 1440 66 L1440 ${H} Z`}
        fill="#0f2b1a"
        opacity="0.85"
      />
      <path d={carpet} fill="url(#mw-carpet)" opacity="0.9" />

      <g transform={`translate(0 ${H})`}>
        {clumps.map((c, i) => (
          <g key={`t${i}`} transform={`translate(${f1(c.x)} 0)`}>
            <g className={`meadow-blade meadow-blade--${c.tone}`} style={{ '--d': `${c.delay}s`, '--dur': `${c.dur}s`, '--amp': `${c.amp}deg` }}>
              {c.blades.map((b, j) => (
                <g key={j} transform={`translate(${f1(b.dx)} 0)`}>
                  <path fill={`url(#mw-${c.tone})`} d={bladePath(b.w, b.h, b.lean)} />
                  {c.tone === 'front' && (
                    <path d={ribPath(b.h, b.lean)} fill="none" stroke="#d6eea6" strokeWidth="0.55" strokeLinecap="round" opacity="0.4" />
                  )}
                </g>
              ))}
            </g>
          </g>
        ))}

        {/* clover clumps low in the grass */}
        {clovers.map((c, i) => (
          <g key={`c${i}`} transform={`translate(${f1(c.x)} -11) scale(${c.s.toFixed(2)})`}>
            <use href="#mw-clover" />
            <use href="#mw-clover" transform="translate(7 2) scale(0.8) rotate(25)" />
          </g>
        ))}

        {/* wildflowers: a curved stem, an optional leaf and bud, and the head */}
        {flowers.map((fl, i) => {
          const tipX = fl.bend;
          const stem = `M0 0 Q ${f1(fl.bend * 0.2)} ${f1(-fl.h * 0.55)} ${f1(tipX)} ${f1(-fl.h)}`;
          return (
            <g key={`f${i}`} transform={`translate(${f1(fl.x)} 0)`}>
              <g className="meadow-blade meadow-blade--front" style={{ '--d': `${fl.delay}s`, '--dur': `${fl.dur}s`, '--amp': '2.8deg' }}>
                <path d={stem} fill="none" stroke="#3f7a3e" strokeWidth="1.25" strokeLinecap="round" />
                <path d={stem} fill="none" stroke="#8fc06a" strokeWidth="0.45" strokeLinecap="round" opacity="0.6" transform="translate(-0.4 0)" />
                {fl.leaf !== 0 && (
                  <use href="#mw-stem-leaf" fill="#4f8d45" transform={`translate(${f1(fl.bend * 0.08)} ${f1(-fl.h * 0.32)}) scale(${fl.leaf} 1) rotate(-28)`} />
                )}
                {fl.bud && (
                  <g transform={`translate(${f1(fl.bend * 0.12)} ${f1(-fl.h * 0.5)})`}>
                    <path d={`M0 0 Q ${fl.leaf >= 0 ? -5 : 5} -5 ${fl.leaf >= 0 ? -7 : 7} -11`} fill="none" stroke="#3f7a3e" strokeWidth="0.9" strokeLinecap="round" />
                    <use href="#mw-bud" transform={`translate(${fl.leaf >= 0 ? -7 : 7} -11) rotate(${fl.leaf >= 0 ? -20 : 20}) scale(0.8)`} />
                  </g>
                )}
                {fl.kind === 'lavender' ? (
                  <use href="#mw-lavender" transform={`translate(${f1(tipX)} ${f1(-fl.h + 2)}) rotate(${f1(fl.bend * 0.8)}) scale(${fl.size.toFixed(2)})`} />
                ) : (
                  <g transform={`translate(${f1(tipX)} ${f1(-fl.h)}) rotate(${f1(fl.tilt)})`}>
                    {/* a green calyx cupping the head */}
                    {fl.kind !== 'dandelion' && <ellipse cx="0" cy="1.4" rx="1.9" ry="1.3" fill="#3f7a3e" />}
                    {/* heads are seen slightly from below, so they are squashed a touch */}
                    <use href={`#mw-${fl.kind}`} transform={`scale(${fl.size.toFixed(2)} ${(fl.size * (fl.kind === 'dandelion' ? 1 : 0.86)).toFixed(2)})`} />
                  </g>
                )}
              </g>
            </g>
          );
        })}
      </g>

      {/* soil line at the very base */}
      <rect x="0" y={H - 14} width={W} height="14" fill="url(#mw-soil)" />
    </svg>
  );
}
