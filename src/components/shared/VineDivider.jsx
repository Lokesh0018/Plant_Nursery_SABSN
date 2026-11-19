import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './VineDivider.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * Divider vines on the seam between the hero and the collection.
 * Each side has a main stem and a thinner secondary stem that weaves around it. Both grow
 * in from the screen edge as the band scrolls into view; leaves unfurl, tendrils curl,
 * berries pop, and a bloom opens where the tips meet in the centre.
 */
const H = 130; // slim band: the vines carry the seam, not empty space
const MID = H * 0.55;
const NS = 'http://www.w3.org/2000/svg';

// money plant (pothos) leaf silhouettes: heart-shaped, two rounded lobes around the stalk notch
// tapering to a drip tip. Origin at the notch, pointing +x
const LEAVES = [
  'M0 0 C -3 -5, 1 -13, 9 -12 C 18 -11, 23 -3, 30 0 C 23 3, 18 11, 9 12 C 1 13, -3 5, 0 0 Z',     // full heart
  'M0 0 C -4 -6, 1 -14, 10 -12.5 C 19 -11, 23 -3, 30 0 C 24 3, 18 10, 9 10.5 C 2 11, -2 4, 0 0 Z', // one lobe fuller
  'M0 0 C -2 -4, 1 -10, 8 -9.5 C 16 -9, 21 -3, 27 0 C 21 3, 16 9, 8 9.5 C 1 10, -2 4, 0 0 Z',     // young, narrower
];
const PETIOLE = 4; // short leaf stalk between the stem and the notch
const VEIN = 'M0 0 C 9 -0.8, 18 -0.6, 26 0';
// side veins arch off the midrib toward the tip
const SIDE_VEINS = 'M4 -0.8 C 7 -4, 11 -6, 15 -5.5 M11 -0.7 C 14 -2.6, 17 -3.2, 20 -2.8 M4 0.8 C 7 4, 11 6, 15 5.5 M11 0.7 C 14 2.6, 17 3.2, 20 2.8';
// golden splashes of variegation, one either side of the midrib
const VARIEGATION = 'M6 -3 C 9 -7.5, 14 -7.5, 16 -4 C 13 -5, 10 -2, 6 -3 Z M10 3 C 13 2, 16 3.6, 19 2 C 16 6, 12 6, 10 3 Z';
const BUD = 'M0 0 C -3 -5, -1 -12, 0 -14 C 1 -12, 3 -5, 0 0 Z';
const TENDRIL = 'M0 0 c 6 -8, 14 -10, 18 -4 c 3 5, -2 10, -6 8 c -3 -1, -3 -5, 0 -6';

function el(tag, attrs = {}) {
  const n = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

// wavy stem from an edge toward the centre. `phase` flips the wave for the secondary stem;
// `segs` sets how many waves it makes (fewer on phones, so the curve stays relaxed instead of zigzagging)
function buildStem(width, mirror, { amp = 24, phase = 0, inset = 34, y = MID, segs = 5 } = {}) {
  const cx = width / 2;
  const end = mirror ? cx + inset : cx - inset;
  const start = mirror ? width + 12 : -12;
  const dir = mirror ? -1 : 1;
  const span = Math.abs(end - start) / segs;
  const taper = (amp * 0.5) / segs; // waves calm toward the centre, whatever the count
  let d = `M ${start} ${y}`;
  let x = start;
  for (let i = 0; i < segs; i++) {
    const nx = x + dir * span;
    const up = (i + phase) % 2 === 0 ? -1 : 1;
    const a = amp - i * taper;
    d += ` C ${x + dir * span * 0.38} ${y + up * a}, ${nx - dir * span * 0.38} ${y + up * a}, ${nx} ${y}`;
    x = nx;
  }
  return d;
}

function decorate(svg, stem, mirror, { density = 95, size = 1.35, tendrils = true, berries = true, min = 5 }) {
  const len = stem.getTotalLength();
  const g = el('g', { class: 'vine-growth' });
  const items = [];
  const count = Math.max(min, Math.round(len / density));
  for (let i = 1; i <= count; i++) {
    const t = (i / (count + 1)) * len;
    const p = stem.getPointAtLength(t);
    const q = stem.getPointAtLength(Math.min(len, t + 1));
    const angle = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI;
    const up = i % 2 ? -1 : 1;
    const wrap = el('g', { transform: `translate(${p.x} ${p.y})` });
    wrap.dataset.t = (t / len).toFixed(4);

    const roll = i % 7;
    if (tendrils && roll === 0) {
      wrap.dataset.kind = 'tendril';
      wrap.appendChild(el('path', { d: TENDRIL, class: 'vine-tendril', transform: `rotate(${angle + up * 70}) scale(${mirror ? -1.4 : 1.4}, 1.4)` }));
    } else if (berries && roll === 3) {
      wrap.dataset.kind = 'berries';
      const c = el('g', { class: 'vine-berries', transform: `rotate(${angle + up * 80})` });
      [[8, 0, 3.4], [13, -4, 2.8], [13, 4, 2.6]].forEach(([x, y, r]) => c.appendChild(el('circle', { cx: x, cy: y, r })));
      c.appendChild(el('path', { d: 'M0 0 L 8 0', class: 'vine-berry-stalk' }));
      wrap.appendChild(c);
    } else if (roll === 5) {
      // small white blossom on a short stalk
      wrap.dataset.kind = 'blossom';
      const b = el('g', { class: 'vine-blossom', transform: `rotate(${angle + up * 75})` });
      b.appendChild(el('path', { d: 'M0 0 L 9 0', class: 'vine-berry-stalk' }));
      const f = el('g', { class: 'vine-blossom-head', transform: 'translate(9 0)' });
      for (let k = 0; k < 5; k++) f.appendChild(el('path', { class: 'blossom-petal', d: 'M0 0 C 2.5 -3.5, 7 -4, 8.5 -0.5 C 7 3, 2.5 3.5, 0 0 Z', transform: `rotate(${k * 72})` }));
      f.appendChild(el('circle', { class: 'blossom-eye', r: 1.8 }));
      b.appendChild(f);
      wrap.appendChild(b);
    } else if (roll === 6) {
      // closed bud
      wrap.dataset.kind = 'bud';
      const b = el('g', { class: 'vine-bud', transform: `rotate(${angle + up * 60 + 90})` });
      b.appendChild(el('path', { d: BUD, class: 'vine-bud-body', transform: 'scale(1.1)' }));
      b.appendChild(el('path', { d: 'M0 0 C -2 -3, -1 -6, 0 -7', class: 'vine-bud-sepal' }));
      wrap.appendChild(b);
    } else {
      wrap.dataset.kind = 'leaf';
      const s = size + Math.sin(i * 1.9) * 0.3;
      const shape = LEAVES[i % LEAVES.length];
      const rot = angle + up * (mirror ? -58 : 58) + Math.sin(i * 2.3) * 8;
      const leaf = el('g', { class: 'vine-leaf', transform: `rotate(${rot}) scale(${mirror ? -s : s}, ${s})` });
      leaf.appendChild(el('path', { d: `M0 0 L ${PETIOLE} 0`, class: 'vine-leaf-petiole' }));
      const blade = el('g', { transform: `translate(${PETIOLE} 0)` });
      blade.appendChild(el('path', { d: shape, class: 'vine-leaf-blade' }));
      if (i % 3 !== 2) blade.appendChild(el('path', { d: VARIEGATION, class: 'vine-leaf-variegation' })); // most leaves are marbled
      blade.appendChild(el('path', { d: VEIN, class: 'vine-leaf-vein' }));
      blade.appendChild(el('path', { d: SIDE_VEINS, class: 'vine-leaf-vein side' }));
      if (i % 4 === 1) blade.appendChild(el('circle', { class: 'vine-dew', cx: 14, cy: -4, r: 1.6 })); // dewdrop
      leaf.appendChild(blade);
      wrap.appendChild(leaf);
    }
    g.appendChild(wrap);
    items.push(wrap);
  }
  svg.appendChild(g);
  return items;
}

// `id` lets a variant be used more than once on a page (each instance needs its own gradient ids);
// `from` / `to` are the exact colours of the sections above and below, for variants that ramp between them
export default function VineDivider({ variant = 'top', id = variant, from, to }) {
  const ref = useRef(null);
  const uid = id;
  const style = {
    '--leaf-fill': `url(#vine-leaf-fill-${uid})`,
    '--leaf-fill-2': `url(#vine-leaf-fill-2-${uid})`,
    '--bloom-fill': `url(#vine-bloom-fill-${uid})`,
    '--berry-fill': `url(#vine-berry-fill-${uid})`,
    '--bud-fill': `url(#vine-bud-fill-${uid})`,
    ...(from && { '--vd-from': from }),
    ...(to && { '--vd-to': to }),
  };

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const host = ref.current;
    const svg = host.querySelector('svg');
    let ctx;

    let builtWidth = -1;
    const build = () => {
      const rect = host.getBoundingClientRect();
      const width = rect.width;
      // Phones fire `resize` whenever the address bar slides in or out while scrolling; the width does not
      // change then, so skip the rebuild (it would wipe and regrow the vines mid-scroll).
      if (Math.abs(width - builtWidth) < 1) return;
      builtWidth = width;

      ctx?.revert();
      svg.querySelectorAll('.vine-growth').forEach((g) => g.remove());

      // Draw at the band's real height (it is shorter on tablets and phones) so nothing is squashed by the
      // preserveAspectRatio="none" stretch; every vertical measure scales with it.
      const height = rect.height || H;
      const k = height / H;
      const mid = height * 0.55;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

      // Breakpoints match VineDivider.css: below 1200px only the main stems are drawn (the secondary and
      // wisp stems are hidden there, so their leaves must not be built either, or they float stemless).
      const single = width <= 1200;
      const phone = width <= 600;
      const segs = phone ? 3 : width <= 900 ? 4 : 5;

      // [left main, right main, left secondary, right secondary]
      const mains = Array.from(svg.querySelectorAll('.vine-stem.main'));
      const subs = Array.from(svg.querySelectorAll('.vine-stem.sub'));
      const wisps = Array.from(svg.querySelectorAll('.vine-stem.wisp'));
      const hi = Array.from(svg.querySelectorAll('.vine-stem-highlight'));
      const mainOpts = { amp: 20 * k, y: mid, segs, inset: phone ? 26 : 34 };
      mains.forEach((s, i) => s.setAttribute('d', buildStem(width, i === 1, mainOpts)));
      hi.forEach((s, i) => s.setAttribute('d', buildStem(width, i === 1, mainOpts)));
      subs.forEach((s, i) => s.setAttribute('d', single ? '' : buildStem(width, i === 1, { amp: 15 * k, phase: 1, inset: 70, y: mid + 2 * k, segs })));
      wisps.forEach((s, i) => s.setAttribute('d', single ? '' : buildStem(width, i === 1, { amp: 26 * k, phase: 0, inset: 150, y: mid - 5 * k, segs })));
      // the centre bloom is a touch smaller on phones so it stays in proportion with the shorter band
      svg.querySelector('.vine-bloom').setAttribute('transform', `translate(${width / 2} ${mid}) scale(${phone ? 0.85 : k < 1 ? 0.92 : 1})`);

      // leaves are smaller and a little more spaced out on narrow screens, so the short stems are not crowded
      const mainLeaf = phone
        ? { density: 52, size: 1.12, min: 4 }
        : width <= 900
          ? { density: 62, size: 1.28 }
          : { density: 70, size: 1.5 };
      const growth = [
        ...mains.map((s, i) => decorate(svg, s, i === 1, mainLeaf)),
        ...(single ? [] : subs.map((s, i) => decorate(svg, s, i === 1, { density: 105, size: 1.05, tendrils: false }))),
        ...(single ? [] : wisps.map((s, i) => decorate(svg, s, i === 1, { density: 140, size: 0.8, tendrils: true, berries: false }))),
      ];
      const allStems = [...mains, ...hi, ...(single ? [] : [...subs, ...wisps])];

      ctx = gsap.context(() => {
        if (reduce) { host.classList.add('is-grown'); return; } // fully grown, static

        host.classList.remove('is-grown');
        // Plays on its own clock (~1.6 s) each time the band comes into view, from either direction,
        // and resets to bare once the band is fully off screen, so it grows again next time. A scroll
        // scrub would re-render hundreds of SVG nodes on every scroll frame instead.
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: 'none' },
          onComplete: () => host.classList.add('is-grown'),
        });
        tl.timeScale(0.62); // the timeline is laid out in 0..1 units; this makes it ~1.6 s
        // only grow from bare: a band that never fully left the screen keeps its vines
        const grow = () => { if (tl.progress() === 0 && !tl.isActive()) tl.play(0); };
        const reset = () => { tl.pause(0); host.classList.remove('is-grown'); };
        // grow once a good part of the band is on screen ...
        ScrollTrigger.create({ trigger: host, start: 'top 88%', end: 'bottom 12%', onEnter: grow, onEnterBack: grow });
        // ... and clear it only when it has left the screen completely, so it never vanishes in view
        ScrollTrigger.create({ trigger: host, start: 'top bottom', end: 'bottom top', onLeave: reset, onLeaveBack: reset });

        allStems.forEach((stem) => {
          const len = stem.getTotalLength();
          gsap.set(stem, { strokeDasharray: len, strokeDashoffset: len });
          const isSub = stem.classList.contains('sub');
          const isWisp = stem.classList.contains('wisp');
          tl.to(stem, { strokeDashoffset: 0, duration: isWisp ? 0.75 : isSub ? 0.8 : 0.85, ease: 'power2.out' }, isWisp ? 0.14 : isSub ? 0.08 : 0);
        });

        growth.forEach((items, gi) => {
          const offset = gi >= 4 ? 0.14 : gi >= 2 ? 0.08 : 0; // later stems start a beat later
          items.forEach((wrap) => {
            const t = parseFloat(wrap.dataset.t);
            const at = offset + t * 0.8;
            if (wrap.dataset.kind === 'tendril') {
              const path = wrap.firstElementChild;
              const l = path.getTotalLength();
              gsap.set(path, { strokeDasharray: l, strokeDashoffset: l });
              tl.to(path, { strokeDashoffset: 0, duration: 0.14, ease: 'power1.out' }, at);
            } else if (wrap.dataset.kind === 'blossom') {
              const head = wrap.querySelector('.vine-blossom-head');
              const petals = wrap.querySelectorAll('.blossom-petal');
              gsap.set(head, { scale: 0, transformOrigin: '0 0' });
              gsap.set(petals, { scale: 0, transformOrigin: '0 0' });
              tl.to(head, { scale: 1, duration: 0.06, ease: 'back.out(2)' }, at)
                .to(petals, { scale: 1, duration: 0.1, stagger: 0.012, ease: 'back.out(1.8)' }, at + 0.04);
            } else if (wrap.dataset.kind === 'bud') {
              gsap.set(wrap, { scale: 0, transformOrigin: '0 0' });
              tl.to(wrap, { scale: 1, duration: 0.1, ease: 'back.out(2)' }, at);
            } else if (wrap.dataset.kind === 'berries') {
              const dots = wrap.querySelectorAll('circle');
              gsap.set(dots, { scale: 0, transformOrigin: 'center' });
              tl.to(dots, { scale: 1, duration: 0.08, stagger: 0.02, ease: 'back.out(2.5)' }, at);
            } else {
              gsap.set(wrap, { scale: 0, rotation: -25, transformOrigin: '0 0' });
              tl.to(wrap, { scale: 1, rotation: 0, duration: 0.12, ease: 'back.out(2.2)' }, at);
            }
          });
        });

        gsap.set('.vine-bloom .petal', { scale: 0, transformOrigin: '0 0' });
        gsap.set('.vine-bloom .bud', { scale: 0, transformOrigin: 'center' });
        tl.to('.vine-bloom .bud', { scale: 1, duration: 0.08, ease: 'back.out(2)' }, 0.84)
          .to('.vine-bloom .petal', { scale: 1, duration: 0.12, stagger: 0.015, ease: 'back.out(1.8)' }, 0.88);
      }, host);
    };

    build();
    let tid;
    const onResize = () => { clearTimeout(tid); tid = setTimeout(build, 200); };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(tid);
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={ref} className={`vine-divider vine-divider--${variant}`} style={style} aria-hidden="true">
      <svg className="vine-svg" preserveAspectRatio="none" height={H}>
        <defs>
          <linearGradient id={`vine-leaf-fill-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#93cf66" />
            <stop offset="0.55" stopColor="#559a40" />
            <stop offset="1" stopColor="#2f6a2c" />
          </linearGradient>
          <linearGradient id={`vine-leaf-fill-2-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d3e08a" />
            <stop offset="1" stopColor="#7fae48" />
          </linearGradient>
          <radialGradient id={`vine-bloom-fill-${uid}`} cx="0.4" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#ffd3dc" />
            <stop offset="1" stopColor="#e2879c" />
          </radialGradient>
          <linearGradient id={`vine-bud-fill-${uid}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#7fb069" />
            <stop offset="1" stopColor="#f5c6d0" />
          </linearGradient>
          <radialGradient id={`vine-berry-fill-${uid}`} cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#f5a6b4" />
            <stop offset="1" stopColor="#b03a5a" />
          </radialGradient>
        </defs>
        {/* wisps and secondary stems sit behind the mains */}
        <path className="vine-stem wisp" d="" />
        <path className="vine-stem wisp" d="" />
        <path className="vine-stem sub" d="" />
        <path className="vine-stem sub" d="" />
        <path className="vine-stem main" d="" />
        <path className="vine-stem main" d="" />
        <path className="vine-stem-highlight" d="" />
        <path className="vine-stem-highlight" d="" />
        <g className="vine-bloom">
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={i} className="petal" d="M0 0 C 5 -7, 14 -8, 17 -1 C 14 6, 5 7, 0 0 Z" transform={`rotate(${i * 60})`} />
          ))}
          <circle className="bud" r="4.2" />
        </g>
      </svg>
    </div>
  );
}
