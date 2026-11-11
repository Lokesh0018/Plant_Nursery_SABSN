import React, { useMemo } from 'react';

const H = 96; // viewBox height, matches .footer-meadow height

// small deterministic PRNG so the meadow is identical on every render
function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

/**
 * Wind-blown meadow along the footer's bottom edge.
 * - Tapered grass blades in three depths, each lightening toward its tip.
 * - The sway is phased by x position so a gust visibly travels left to right across the meadow.
 * - A few wildflowers and seed heads sit among the blades; a dark soil line grounds everything.
 * Pure SVG + CSS. Every sway animation lives on an inner group so it never overrides the outer
 * group's positioning transform.
 */
export default function Meadow({ className = '', blades = 96 }) {
  const { grass, flowers, seeds } = useMemo(() => {
    const rnd = lcg(11);
    const grass = [];
    for (let i = 0; i < blades; i++) {
      const x = (i / blades) * 1440 + rnd() * 16;
      const depth = rnd();
      const tone = depth < 0.34 ? 'back' : depth < 0.72 ? 'mid' : 'front';
      const h = (tone === 'back' ? 26 : tone === 'mid' ? 34 : 42) + rnd() * 44;
      const lean = (rnd() - 0.5) * 40;
      const w = (tone === 'front' ? 3.2 : 2.4) + rnd() * 1.8;
      grass.push({
        x, h, lean, w, tone,
        // phase follows x so the gust ripples across; a touch of noise keeps it organic
        delay: (-(x / 1440) * 5.5 - rnd() * 0.8).toFixed(2),
        dur: (5.2 + rnd() * 1.6).toFixed(2),
        amp: (tone === 'front' ? 3.2 : 2.2) + rnd() * 1.6,
      });
    }
    const flowers = [];
    for (let i = 0; i < 9; i++) {
      const x = 60 + (i / 9) * 1320 + rnd() * 90;
      flowers.push({
        x, h: 34 + rnd() * 30,
        kind: rnd() < 0.5 ? 'white' : 'lime',
        delay: (-(x / 1440) * 5.5).toFixed(2),
        dur: (6 + rnd() * 1.5).toFixed(2),
        r: 2.4 + rnd() * 1.2,
      });
    }
    const seeds = [];
    for (let i = 0; i < 7; i++) {
      const x = 120 + (i / 7) * 1250 + rnd() * 120;
      seeds.push({ x, h: 44 + rnd() * 30, delay: (-(x / 1440) * 5.5 - 0.4).toFixed(2), dur: (6.5 + rnd() * 1.5).toFixed(2) });
    }
    const order = { back: 0, mid: 1, front: 2 };
    grass.sort((a, b) => order[a.tone] - order[b.tone]);
    return { grass, flowers, seeds };
  }, [blades]);

  return (
    <svg className={`meadow ${className}`} viewBox={`0 0 1440 ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        {/* blades lighten toward the tip, catching the light */}
        <linearGradient id="mw-back" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#173a27" />
          <stop offset="1" stopColor="#2b5a3a" />
        </linearGradient>
        <linearGradient id="mw-mid" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1f4a30" />
          <stop offset="1" stopColor="#4a8a4a" />
        </linearGradient>
        <linearGradient id="mw-front" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2b5a38" />
          <stop offset="0.7" stopColor="#6fa551" />
          <stop offset="1" stopColor="#a9d47a" />
        </linearGradient>
        <linearGradient id="mw-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b2416" stopOpacity="0" />
          <stop offset="0.55" stopColor="#0a1f13" stopOpacity="0.85" />
          <stop offset="1" stopColor="#081a10" />
        </linearGradient>
      </defs>

      <g transform={`translate(0 ${H})`}>
        {grass.map((b, i) => (
          <g key={`g${i}`} transform={`translate(${b.x.toFixed(1)} 0)`}>
            <g
              className={`meadow-blade meadow-blade--${b.tone}`}
              style={{ '--d': `${b.delay}s`, '--dur': `${b.dur}s`, '--amp': `${b.amp.toFixed(2)}deg` }}
            >
              <path
                fill={`url(#mw-${b.tone})`}
                d={`M${-b.w / 2} 0 Q ${b.lean * 0.35} ${-b.h * 0.55} ${b.lean} ${-b.h} Q ${b.lean * 0.5} ${-b.h * 0.5} ${b.w / 2} 0 Z`}
              />
            </g>
          </g>
        ))}

        {/* seed heads: a thin stem with a small cluster of grains at the tip */}
        {seeds.map((s, i) => (
          <g key={`s${i}`} transform={`translate(${s.x.toFixed(1)} 0)`}>
            <g className="meadow-blade meadow-blade--front" style={{ '--d': `${s.delay}s`, '--dur': `${s.dur}s`, '--amp': '3.4deg' }}>
              <path d={`M0 0 Q 4 ${-s.h * 0.5} 8 ${-s.h}`} fill="none" stroke="#6fa551" strokeWidth="1.3" strokeLinecap="round" />
              <g transform={`translate(8 ${-s.h})`} fill="#c9d98a" opacity="0.9">
                <ellipse cx="0" cy="-3" rx="1.6" ry="3" />
                <ellipse cx="-2.6" cy="-7" rx="1.5" ry="2.8" transform="rotate(-20 -2.6 -7)" />
                <ellipse cx="2.6" cy="-7" rx="1.5" ry="2.8" transform="rotate(20 2.6 -7)" />
                <ellipse cx="0" cy="-10.5" rx="1.4" ry="2.6" />
              </g>
            </g>
          </g>
        ))}

        {/* wildflowers: five tiny petals around a gold eye */}
        {flowers.map((f, i) => (
          <g key={`f${i}`} transform={`translate(${f.x.toFixed(1)} 0)`}>
            <g className="meadow-blade meadow-blade--front" style={{ '--d': `${f.delay}s`, '--dur': `${f.dur}s`, '--amp': '2.8deg' }}>
              <path d={`M0 0 Q -3 ${-f.h * 0.5} -5 ${-f.h}`} fill="none" stroke="#4a8a4a" strokeWidth="1.2" strokeLinecap="round" />
              <g transform={`translate(-5 ${-f.h})`}>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse
                    key={a}
                    cx="0" cy={-f.r * 1.15} rx={f.r * 0.75} ry={f.r * 1.15}
                    transform={`rotate(${a})`}
                    fill={f.kind === 'white' ? '#fff7f0' : '#c9d98a'}
                    opacity="0.95"
                  />
                ))}
                <circle r={f.r * 0.55} fill="#f1c94a" />
              </g>
            </g>
          </g>
        ))}
      </g>

      {/* soil line at the very base */}
      <rect x="0" y={H - 14} width="1440" height="14" fill="url(#mw-soil)" />
    </svg>
  );
}
