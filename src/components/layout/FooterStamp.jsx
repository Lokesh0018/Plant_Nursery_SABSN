import React, { useEffect, useRef } from 'react';
import useOffscreenPause from '../../hooks/useOffscreenPause';
import { subscribeScroll } from '../../lib/scrollStore';

const RANGE = 300; // px of scroll at the very bottom of the page that drive the whole growth

const clamp = (v) => Math.max(0, Math.min(1, v));
// 0 -> 1 between a and b with an ease-in-out curve
const smooth = (a, b, p) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const r2 = (n) => Math.round(n * 100) / 100;

const r1 = (n) => Math.round(n * 10) / 10;

// small seeded generator, so the soil texture is the same on every visit
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* A leaf with its stalk base at the origin, pointing +x. The blade's half-width follows `shape(t)`
   along its length; `teeth` pushes every other margin point out, which the curve smoothing turns into
   fine serration. Returns the blade, the shaded lower half, the lit upper rim, the midrib and veins. */
function leafPaths(len, w, { stalk = 3, teeth = 0, round = false, veins = 5 } = {}) {
  const N = 16;
  const shape = round
    ? (t) => w * Math.pow(Math.sin(Math.PI * t), 0.55)                        // fleshy and blunt (seed leaf)
    : (t) => w * Math.sin(Math.PI * Math.pow(t, 0.72)) * (1 - 0.12 * t);      // widest below the middle, drawn to a point
  const edge = (sign) => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const tooth = teeth && i % 2 && t > 0.2 && t < 0.92 ? teeth : 0;
      pts.push([stalk + t * len, sign * (shape(t) + tooth)]);
    }
    return pts;
  };
  // smooth a run of points with quadratic curves through their midpoints
  const smoothRun = (pts) => {
    let d = '';
    for (let i = 1; i < pts.length - 1; i++) {
      const [x, y] = pts[i];
      const [nx, ny] = pts[i + 1];
      d += ` Q ${r1(x)} ${r1(y)} ${r1((x + nx) / 2)} ${r1((y + ny) / 2)}`;
    }
    const [lx, ly] = pts[pts.length - 1];
    return `${d} L ${r1(lx)} ${r1(ly)}`;
  };
  const up = edge(-1);
  const down = edge(1);
  const tipX = r1(stalk + len);
  const blade = `M ${stalk} 0${smoothRun(up)}${smoothRun([...down].reverse())} Z`;
  const shade = `M ${stalk} 0 L ${tipX} 0${smoothRun([...down].reverse())} Z`;
  const rim = `M ${stalk} 0${smoothRun(up)}`;
  let vein = '';
  for (let k = 0; k < veins; k++) {
    const t0 = 0.12 + (k * 0.72) / veins;
    const t1 = Math.min(0.97, t0 + 0.16);
    [-1, 1].forEach((sg) => {
      vein += `M ${r1(stalk + t0 * len)} 0 Q ${r1(stalk + (t0 + 0.05) * len)} ${r1(sg * shape(t0 + 0.05) * 0.45)} ${r1(stalk + t1 * len)} ${r1(sg * shape(t1) * 0.74)} `;
    });
  }
  return { blade, shade, rim, rib: `M 0 0 L ${tipX - 1} 0`, vein };
}
const LEAF_TYPES = {
  seed: leafPaths(15, 6.2, { stalk: 1.5, round: true, veins: 2 }),
  true: leafPaths(27, 8.6, { stalk: 4, teeth: 0.7, veins: 6 }),
  young: leafPaths(17, 5.4, { stalk: 2.5, teeth: 0.45, veins: 4 }),
};
// [data key, leaf type, node x, node y, closed angle, open angle, size, gradient]
// opposite pairs up the stem: seed leaves, the first true leaves, then a young pair at the tip
const LEAVES = [
  ['cot-l', 'seed', 100.4, 111, -98, -170, 1, 'cot'],
  ['cot-r', 'seed', 100.4, 111, -82, -10, 1, 'cot'],
  ['leaf-l', 'true', 100.8, 93, -100, -148, 1, 'leaf'],
  ['leaf-r', 'true', 100.8, 93, -80, -30, 0.96, 'leaf'],
  ['tip-l', 'young', 100.3, 77, -96, -122, 1, 'young'],
  ['tip-r', 'young', 100.3, 77, -84, -58, 1, 'young'],
];
const STEM = 'M100 127 C 98.6 113, 102.6 98, 100.2 72';
const STEM_BASE = 'M100 127 C 99.2 119, 100.2 112, 100.6 106'; // the woodier, thicker lower stem

// soil texture: crumbs over the whole bed and a scatter along the surface, seeded so it never shifts
const SOIL = (() => {
  const rand = rng(1980);
  const crumbs = [];
  for (let i = 0; i < 46; i++) {
    const x = 46 + rand() * 108;
    const y = 128 + rand() * 30;
    crumbs.push({ x: r1(x), y: r1(y), r: r1(0.5 + rand() * 1.2), c: ['#a87848', '#5e3b1d', '#c08d57', '#3d2612'][Math.floor(rand() * 4)], o: r1(0.35 + rand() * 0.5) });
  }
  const surface = [];
  for (let i = 0; i < 22; i++) {
    const x = 50 + i * 4.6 + rand() * 2;
    const y = 134 - 9.8 * Math.sin(Math.PI * ((x - 40) / 120)) + rand() * 1.2 - 0.6; // along the mound's top
    surface.push({ x: r1(x), y: r1(y), r: r1(0.8 + rand() * 1.3) });
  }
  return { crumbs, surface };
})();
// fine hairs along the taproot, angled down and out
const ROOT_HAIRS = Array.from({ length: 12 }, (_, i) => {
  const y = 133 + i * 1.5;
  const side = i % 2 ? 1 : -1;
  const x = 100 + Math.sin(i * 1.3) * 0.8;
  return `M ${r1(x)} ${r1(y)} l ${r1(side * (2.2 + (i % 3)))} ${r1(1.4 + (i % 2))}`;
}).join(' ');

/**
 * Footer finale, told inside the nursery stamp as the page reaches its bottom: a seed drops into a
 * mound of soil, its coat cracks open, roots reach down while a shoot climbs, the leaves unfurl, and
 * the stamp's rings draw themselves around the sapling before the lettered ring fades in and turns.
 * Scroll-linked over the last RANGE px of the page, forward and back. Under prefers-reduced-motion the
 * grown stamp is shown straight away.
 */
export default function FooterStamp() {
  const root = useRef(null);
  const inView = useOffscreenPause(root, { margin: '40%' });
  const reduceMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const q = (k) => el.querySelector(`[data-fs="${k}"]`);
    const disc = q('disc');
    const soil = q('soil');
    const seed = q('seed');
    const coatL = q('coat-l');
    const coatR = q('coat-r');
    const roots = q('roots');
    const hairs = q('hairs');
    const stems = ['stem', 'stem-base', 'stem-light'].map(q);
    const bud = q('bud');
    const rays = q('rays');
    const shadow = q('shadow');
    const glow = q('glow');
    const ringOuter = q('ring-outer');
    const ringInner = q('ring-inner');
    const letters = q('letters');
    const leaves = LEAVES.map(([k, , x, y, a0, a1, s]) => ({ node: q(k), x, y, a0, a1, s }));

    // a line drawn on as t goes 0 -> 1; hidden entirely at 0, since round caps and sub-pixel dash
    // rounding would otherwise leave a dot or a sliver where it starts
    const draw = (node, t) => {
      node.style.strokeDashoffset = String(r2(1 - t));
      node.style.visibility = t > 0.002 ? 'visible' : 'hidden';
    };
    const render = (p) => {
      // the dark disc and the soil settle in first
      disc.style.opacity = String(smooth(0, 0.08, p));
      soil.style.opacity = String(smooth(0.02, 0.14, p));
      // the seed drops in from above the stamp and bounces once on the soil
      const drop = smooth(0.04, 0.22, p);
      const bounce = Math.sin(Math.PI * clamp((p - 0.22) / 0.08)) * 5;
      seed.setAttribute('transform', `translate(0 ${r2(-92 * (1 - drop) * (1 - drop) - bounce)})`);
      seed.style.opacity = String(clamp(p / 0.05));
      // the coat cracks: the halves tip apart, then fall away as the shoot comes through
      const crack = smooth(0.28, 0.42, p);
      const shed = smooth(0.44, 0.6, p);
      coatL.setAttribute('transform', `translate(${r2(-4 * crack - 6 * shed)} ${r2(8 * shed)}) rotate(${r2(-32 * crack - 30 * shed)} 100 128)`);
      coatR.setAttribute('transform', `translate(${r2(4 * crack + 6 * shed)} ${r2(8 * shed)}) rotate(${r2(32 * crack + 30 * shed)} 100 128)`);
      coatL.style.opacity = coatR.style.opacity = String(1 - shed);
      // roots reach down through the soil while the shoot climbs
      roots.querySelectorAll('path').forEach((path, i) => draw(path, smooth(0.32 + i * 0.04, 0.58 + i * 0.04, p)));
      hairs.style.opacity = String(smooth(0.5, 0.66, p));
      const grow = smooth(0.4, 0.72, p);
      stems.forEach((node) => draw(node, grow));
      shadow.style.opacity = String(smooth(0.42, 0.6, p));
      // leaves unfurl from folded (pointing up the stem) to open, from the seed leaves upward; they
      // expand as they open, starting a little way in so a folded leaf is never a dot
      const opens = [0.5, 0.52, 0.62, 0.65, 0.74, 0.76].map((a) => smooth(a, a + 0.18, p));
      leaves.forEach(({ node, x, y, a0, a1, s }, i) => {
        const t = opens[i];
        node.setAttribute('transform', `translate(${x} ${y}) rotate(${r2(a0 + (a1 - a0) * t)}) scale(${r2(s * (0.2 + 0.8 * t))})`);
        node.style.opacity = String(clamp(t * 6));
      });
      const budT = smooth(0.7, 0.86, p);
      bud.setAttribute('transform', `translate(100.2 73) scale(${r2(budT)})`);
      bud.style.opacity = String(clamp(budT * 4));
      // the stamp closes around the sapling: rings draw on, warm light behind, then the lettering
      draw(ringInner, smooth(0.66, 0.86, p));
      draw(ringOuter, smooth(0.7, 0.94, p));
      glow.style.opacity = String(smooth(0.8, 1, p));
      rays.style.opacity = String(smooth(0.84, 1, p) * 0.9);
      letters.style.opacity = String(smooth(0.86, 1, p));
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(1);
      return undefined;
    }
    render(0);
    let last = -1;
    const tick = ({ y, max }) => {
      if (!inView.current) return; // skip the scroll maths while the stamp is off screen
      const p = clamp((y - (max - RANGE)) / RANGE); // 0 -> 1 over the last RANGE px
      if (p === last) return;
      last = p;
      render(p);
    };
    return subscribeScroll(tick);
  }, [inView]);

  return (
    <span ref={root} className="footer-stamp-spot" aria-hidden="true">
      <svg className="footer-stamp-face" viewBox="0 0 200 200">
        <defs>
          <path id="fs-ring" d="M100 100m-74 0a74 74 0 1 1 148 0a74 74 0 1 1-148 0" />
          <clipPath id="fs-disc-clip"><circle cx="100" cy="100" r="55" /></clipPath>
          <radialGradient id="fs-disc" cx="0.5" cy="0.35" r="0.75">
            <stop offset="0" stopColor="#24563a" />
            <stop offset="1" stopColor="#10291b" />
          </radialGradient>
          <radialGradient id="fs-glow" cx="0.5" cy="0.45" r="0.5">
            <stop offset="0" stopColor="#f3e9a8" stopOpacity="0.55" />
            <stop offset="1" stopColor="#f3e9a8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fs-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8a5d36" />
            <stop offset="1" stopColor="#4a2f18" />
          </linearGradient>
          <radialGradient id="fs-seed" cx="0.38" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#c99a5e" />
            <stop offset="0.6" stopColor="#7a5230" />
            <stop offset="1" stopColor="#4a2f18" />
          </radialGradient>
          {/* blades: deeper at the stalk, fresher toward the tip */}
          <linearGradient id="fs-leaf" x1="0" y1="0" x2="1" y2="0.2">
            <stop offset="0" stopColor="#3f7a2e" />
            <stop offset="0.55" stopColor="#6fa443" />
            <stop offset="1" stopColor="#a8d06a" />
          </linearGradient>
          <linearGradient id="fs-young" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6fa443" />
            <stop offset="1" stopColor="#c6e389" />
          </linearGradient>
          <linearGradient id="fs-cot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8db556" />
            <stop offset="1" stopColor="#d3e59a" />
          </linearGradient>
          {/* stem: woody olive at the soil, bright green at the growing tip (user space, so it follows the height) */}
          <linearGradient id="fs-stem" gradientUnits="userSpaceOnUse" x1="0" y1="127" x2="0" y2="72">
            <stop offset="0" stopColor="#6d6a34" />
            <stop offset="0.35" stopColor="#6f9b3f" />
            <stop offset="1" stopColor="#b8db7c" />
          </linearGradient>
          <linearGradient id="fs-root" gradientUnits="userSpaceOnUse" x1="0" y1="128" x2="0" y2="156">
            <stop offset="0" stopColor="#efe0c0" />
            <stop offset="1" stopColor="#c9ad83" />
          </linearGradient>
          <linearGradient id="fs-soil-deep" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2e1c0c" stopOpacity="0" />
            <stop offset="1" stopColor="#2e1c0c" stopOpacity="0.75" />
          </linearGradient>
          <radialGradient id="fs-shadow">
            <stop offset="0" stopColor="#24160a" stopOpacity="0.45" />
            <stop offset="1" stopColor="#24160a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fs-ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6efbf" stopOpacity="0.32" />
            <stop offset="1" stopColor="#f6efbf" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* the outer lime rings, drawn on at the end (pathLength 1 so the dash maths is 0..1) */}
        <circle data-fs="ring-outer" cx="100" cy="100" r="94" fill="none" stroke="#c9d98a" strokeWidth="5"
          pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" transform="rotate(-90 100 100)" />
        <g data-fs="letters" style={{ opacity: 0 }}>
          {!reduceMotion && (
            <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="40s" repeatCount="indefinite" />
          )}
          <text fill="#c9d98a" fontFamily="var(--font-sans, sans-serif)" fontWeight="600" fontSize="16" letterSpacing="3.6">
            <textPath href="#fs-ring">GROWN IN KADIYAM · SINCE 1980s · WITH CARE ·</textPath>
          </text>
        </g>

        {/* the scene, clipped to the centre disc */}
        <circle data-fs="disc" cx="100" cy="100" r="55" fill="url(#fs-disc)" style={{ opacity: 0 }} />
        <g clipPath="url(#fs-disc-clip)">
          <circle data-fs="glow" cx="100" cy="88" r="46" fill="url(#fs-glow)" style={{ opacity: 0 }} />
          {/* faint shafts of sun from the upper left */}
          <g data-fs="rays" fill="url(#fs-ray)" style={{ opacity: 0 }}>
            <path d="M64 44 L76 44 L104 132 L94 132 Z" transform="rotate(-14 70 44)" />
            <path d="M84 40 L90 40 L114 132 L108 132 Z" transform="rotate(-14 87 40)" />
            <path d="M48 52 L54 52 L86 132 L80 132 Z" transform="rotate(-14 51 52)" />
          </g>
          <g data-fs="soil" style={{ opacity: 0 }}>
            <path d="M40 162 L40 134 C 62 120, 138 120, 160 134 L160 162 Z" fill="url(#fs-soil)" />
            <path d="M40 162 L40 140 L160 140 L160 162 Z" fill="url(#fs-soil-deep)" />
            {SOIL.crumbs.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c.c} opacity={c.o} />)}
            {/* loose crumbs along the surface, lit from above */}
            {SOIL.surface.map((c, i) => (
              <g key={i}>
                <circle cx={c.x} cy={c.y} r={c.r} fill="#7d5330" />
                <circle cx={c.x - c.r * 0.3} cy={c.y - c.r * 0.35} r={c.r * 0.45} fill="#b88a58" opacity="0.8" />
              </g>
            ))}
            {/* two small pebbles */}
            <ellipse cx="74" cy="131" rx="3.2" ry="2.1" fill="#8d8273" />
            <ellipse cx="73.2" cy="130.2" rx="1.6" ry="0.9" fill="#c4baa9" opacity="0.8" />
            <ellipse cx="128" cy="133.5" rx="2.4" ry="1.6" fill="#7b7062" />
            <ellipse cx="127.4" cy="132.9" rx="1.1" ry="0.6" fill="#b9ae9c" opacity="0.8" />
          </g>
          {/* roots: a tapering taproot, side roots, then fine root hairs */}
          <g data-fs="roots" fill="none" stroke="url(#fs-root)" strokeLinecap="round">
            <path d="M100 128 C 99.2 135, 101.6 141, 100.4 148" strokeWidth="2.2" pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
            <path d="M100.4 147 C 99.6 151, 100.8 154, 100 158" strokeWidth="1.2" pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
            <path d="M100 133 C 96 136, 91 137.5, 86 143" strokeWidth="1.2" pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
            <path d="M100.6 136 C 105 139, 110 140, 115 146" strokeWidth="1.2" pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
            <path d="M100.2 141 C 97 144, 94 146, 91 152" strokeWidth="0.9" pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
            <path d="M100.8 143 C 104 146, 107 148, 109 154" strokeWidth="0.9" pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
          </g>
          <path data-fs="hairs" d={ROOT_HAIRS} fill="none" stroke="#efe0c0" strokeWidth="0.45" strokeLinecap="round" style={{ opacity: 0 }} />
          {/* contact shadow where the stem meets the soil */}
          <ellipse data-fs="shadow" cx="100.5" cy="126.8" rx="9" ry="2.2" fill="url(#fs-shadow)" style={{ opacity: 0 }} />
          {/* the stem: thicker woody base, the full stem, and a highlight down its lit side */}
          <path data-fs="stem-base" d={STEM_BASE} fill="none" stroke="#6b6332" strokeWidth="4" strokeLinecap="round"
            pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
          <path data-fs="stem" d={STEM} fill="none" stroke="url(#fs-stem)" strokeWidth="2.8" strokeLinecap="round"
            pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
          <path data-fs="stem-light" d={STEM} transform="translate(-0.7 0)" fill="none" stroke="#e2f2b4" strokeWidth="0.7" strokeLinecap="round" opacity="0.65"
            pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" />
          {LEAVES.map(([k, type, , , , , , fill]) => {
            const L = LEAF_TYPES[type];
            return (
              <g key={k} data-fs={k} transform="scale(0)" style={{ opacity: 0 }}>
                <path d={L.rib} stroke="#5b8a36" strokeWidth={type === 'true' ? 1.1 : 0.9} strokeLinecap="round" />
                <path d={L.blade} fill={`url(#fs-${fill})`} />
                <path d={L.shade} fill="#173d1c" opacity={type === 'seed' ? 0.16 : 0.26} />
                <path d={L.vein} fill="none" stroke="#e6f3c4" strokeWidth="0.45" strokeLinecap="round" opacity="0.45" />
                <path d={L.rib} stroke="#eef7d2" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" />
                <path d={L.rim} fill="none" stroke="#f1f9d6" strokeWidth="0.55" strokeLinecap="round" opacity="0.55" />
                <circle r={type === 'true' ? 1.5 : 1.1} fill="#5d8a34" /> {/* the node, where the stalk joins */}
                {k === 'leaf-r' && (
                  <g>{/* a dew drop on the blade */}
                    <circle cx="19" cy="-2.6" r="1.35" fill="#dff1f3" opacity="0.55" />
                    <circle cx="18.6" cy="-3" r="0.45" fill="#ffffff" opacity="0.95" />
                  </g>
                )}
              </g>
            );
          })}
          {/* the terminal bud: two folded leaves at the growing tip */}
          <g data-fs="bud" transform="scale(0)" style={{ opacity: 0 }}>
            <path d="M0 2 C -2.6 -1, -2 -5.5, 0.4 -8 C 0.8 -4.5, 0.6 -1, 0 2 Z" fill="#9cc865" />
            <path d="M0 2 C 2.4 -1, 2.2 -5, 0.4 -8 C -0.2 -4.5, -0.2 -1, 0 2 Z" fill="#c4e38a" />
          </g>
          {/* the seed: two halves of a coat that crack apart around the shoot */}
          <g data-fs="seed" style={{ opacity: 0 }}>
            <g data-fs="coat-l">
              <path d="M100 119 C 91 119, 88 126, 91 131 C 94 134, 98 134, 100 133 Z" fill="url(#fs-seed)" />
              <path d="M94.5 122.5 C 95.5 120.5, 98 119.6, 100 119.8" fill="none" stroke="#f2dcb4" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
            </g>
            <path data-fs="coat-r" d="M100 119 C 109 119, 112 126, 109 131 C 106 134, 102 134, 100 133 Z" fill="url(#fs-seed)" />
          </g>
        </g>
        <circle data-fs="ring-inner" cx="100" cy="100" r="57" fill="none" stroke="#c9d98a" strokeWidth="2.5"
          pathLength="1" strokeDasharray="1 2" strokeDashoffset="1" visibility="hidden" transform="rotate(90 100 100)" />
      </svg>
    </span>
  );
}
