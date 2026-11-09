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
const H = 170;
const MID = H * 0.55;
const NS = 'http://www.w3.org/2000/svg';

// leaf silhouettes, origin at the stalk, pointing +x
const LEAVES = [
  'M0 0 C 7 -11, 22 -15, 28 -2 C 22 9, 7 11, 0 0 Z',               // oval
  'M0 0 C 5 -7, 16 -16, 30 -6 C 18 -2, 10 6, 0 0 Z',               // slender, swept
  'M0 0 C 8 -14, 24 -14, 26 -4 C 30 2, 20 12, 8 8 C 3 6, 1 3, 0 0 Z', // broad with a tip
];
const VEIN = 'M1 0 C 9 -3, 17 -4, 25 -2';
const SIDE_VEINS = 'M7 -1.5 c 2 -3, 4 -5, 7 -6 M13 -2.5 c 2 -3, 4 -5, 6 -6 M8 0.5 c 2 3, 4 5, 7 5 M14 -0.5 c 2 3, 4 4, 6 4';
const BUD = 'M0 0 C -3 -5, -1 -12, 0 -14 C 1 -12, 3 -5, 0 0 Z';
const TENDRIL = 'M0 0 c 6 -8, 14 -10, 18 -4 c 3 5, -2 10, -6 8 c -3 -1, -3 -5, 0 -6';

function el(tag, attrs = {}) {
  const n = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  return n;
}

// wavy stem from an edge toward the centre. `phase` flips the wave for the secondary stem
function buildStem(width, mirror, { amp = 24, phase = 0, inset = 34, y = MID } = {}) {
  const cx = width / 2;
  const end = mirror ? cx + inset : cx - inset;
  const start = mirror ? width + 12 : -12;
  const dir = mirror ? -1 : 1;
  const segs = 5;
  const span = Math.abs(end - start) / segs;
  let d = `M ${start} ${y}`;
  let x = start;
  for (let i = 0; i < segs; i++) {
    const nx = x + dir * span;
    const up = (i + phase) % 2 === 0 ? -1 : 1;
    const a = amp - i * 2.5;
    d += ` C ${x + dir * span * 0.38} ${y + up * a}, ${nx - dir * span * 0.38} ${y + up * a}, ${nx} ${y}`;
    x = nx;
  }
  return d;
}

function decorate(svg, stem, mirror, { density = 95, size = 1.35, tendrils = true, berries = true }) {
  const len = stem.getTotalLength();
  const g = el('g', { class: 'vine-growth' });
  const items = [];
  const count = Math.max(5, Math.round(len / density));
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
      leaf.appendChild(el('path', { d: shape, class: 'vine-leaf-blade' }));
      leaf.appendChild(el('path', { d: VEIN, class: 'vine-leaf-vein' }));
      leaf.appendChild(el('path', { d: SIDE_VEINS, class: 'vine-leaf-vein side' }));
      if (i % 4 === 1) leaf.appendChild(el('circle', { class: 'vine-dew', cx: 14, cy: -4, r: 1.6 })); // dewdrop
      wrap.appendChild(leaf);
    }
    g.appendChild(wrap);
    items.push(wrap);
  }
  svg.appendChild(g);
  return items;
}

export default function VineDivider() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const host = ref.current;
    const svg = host.querySelector('svg');
    let ctx;

    const build = () => {
      ctx?.revert();
      svg.querySelectorAll('.vine-growth').forEach((g) => g.remove());
      const width = host.getBoundingClientRect().width;
      svg.setAttribute('viewBox', `0 0 ${width} ${H}`);

      // [left main, right main, left secondary, right secondary]
      const mains = Array.from(svg.querySelectorAll('.vine-stem.main'));
      const subs = Array.from(svg.querySelectorAll('.vine-stem.sub'));
      const wisps = Array.from(svg.querySelectorAll('.vine-stem.wisp'));
      const hi = Array.from(svg.querySelectorAll('.vine-stem-highlight'));
      mains.forEach((s, i) => s.setAttribute('d', buildStem(width, i === 1)));
      hi.forEach((s, i) => s.setAttribute('d', buildStem(width, i === 1)));
      subs.forEach((s, i) => s.setAttribute('d', buildStem(width, i === 1, { amp: 18, phase: 1, inset: 70, y: MID + 2 })));
      wisps.forEach((s, i) => s.setAttribute('d', buildStem(width, i === 1, { amp: 34, phase: 0, inset: 150, y: MID - 6 })));
      svg.querySelector('.vine-bloom').setAttribute('transform', `translate(${width / 2} ${MID})`);

      const growth = [
        ...mains.map((s, i) => decorate(svg, s, i === 1, { density: 72, size: 1.45 })),
        ...subs.map((s, i) => decorate(svg, s, i === 1, { density: 105, size: 0.95, tendrils: false })),
        ...wisps.map((s, i) => decorate(svg, s, i === 1, { density: 140, size: 0.75, tendrils: true, berries: false })),
      ];
      const allStems = [...mains, ...hi, ...subs, ...wisps];

      ctx = gsap.context(() => {
        if (reduce) return; // fully grown, static

        const tl = gsap.timeline({
          scrollTrigger: { trigger: host, start: 'top 95%', end: 'top 30%', scrub: 0.7 },
          defaults: { ease: 'none' },
        });

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

        const leaves = growth.flat().filter((w) => w.dataset.kind === 'leaf');
        gsap.to(leaves, {
          rotation: '+=4',
          duration: 2.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: { each: 0.1, from: 'random' },
          transformOrigin: '0 0',
          scrollTrigger: { trigger: host, start: 'top bottom', toggleActions: 'play pause resume pause' },
        });
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
    <div ref={ref} className="vine-divider" aria-hidden="true">
      <div className="vine-divider-line" />
      <svg className="vine-svg" preserveAspectRatio="none" height={H}>
        <defs>
          <linearGradient id="vine-leaf-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9fcf74" />
            <stop offset="0.6" stopColor="#6fa551" />
            <stop offset="1" stopColor="#3f6f33" />
          </linearGradient>
          <linearGradient id="vine-leaf-fill-2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9d98a" />
            <stop offset="1" stopColor="#7fa84a" />
          </linearGradient>
          <radialGradient id="vine-bloom-fill" cx="0.4" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#ffd3dc" />
            <stop offset="1" stopColor="#e2879c" />
          </radialGradient>
          <linearGradient id="vine-bud-fill" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#7fb069" />
            <stop offset="1" stopColor="#f5c6d0" />
          </linearGradient>
          <radialGradient id="vine-berry-fill" cx="0.35" cy="0.3" r="0.8">
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
