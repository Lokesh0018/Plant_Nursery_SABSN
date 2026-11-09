import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sprout, ArrowRight, Leaf, MessageCircle, Flower2, Apple, TreeDeciduous, Shrub } from 'lucide-react';
import FallingLeaves from './FallingLeaves';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * Layered parallax hero built from ref/hero.png.
 * The ancient banyan is the sharp centre subject; every other asset is a cut layer
 * (feathered crops of the reference) placed on its own depth plane.
 *   depth 0 = furthest back (blurred forest), depth 1 = closest (foreground flowers)
 * `depth` drives scroll parallax, mouse parallax and the idle sway.
 */
const LAYERS = [
  { id: 'bg',      src: '/hero-tree/background.webp', depth: 0,    cls: 'tl-bg' },
  { id: 'rays',    src: null,                         depth: 0.12, cls: 'tl-rays' },
  { id: 'ground',  src: '/hero-tree/ground.webp',     depth: 0.3,  cls: 'tl-ground' },
  { id: 'banyan',  src: '/hero-tree/banyan.webp',     depth: 0.42, cls: 'tl-banyan' },
  { id: 'fol-tr',  src: '/hero-tree/foliage-tr.webp', depth: 0.7,  cls: 'tl-fol-tr' },
  { id: 'fol-tl',  src: '/hero-tree/foliage-tl.webp', depth: 0.8,  cls: 'tl-fol-tl' },
  { id: 'flw-br',  src: '/hero-tree/flowers-br.webp', depth: 0.92, cls: 'tl-flw-br' },
  { id: 'flw-bl',  src: '/hero-tree/flowers-bl.webp', depth: 1,    cls: 'tl-flw-bl' },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 900px)').matches;
    const k = mobile ? 0.5 : 1;

    const ctx = gsap.context(() => {
      if (reduce) return; // static composition

      const layers = gsap.utils.toArray('.tree-layer');
      const depth = (el) => parseFloat(el.dataset.depth);
      const content = contentRef.current.children;

      // --- Entrance: far layers settle first, foreground layers slide in from the edges
      gsap.set(layers, { opacity: 0, scale: (i, el) => 1 + depth(el) * 0.08 });
      gsap.set(content, { opacity: 0, y: 32 });
      gsap
        .timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true }, defaults: { ease: 'power3.out' } })
        .to(layers, { opacity: 1, scale: 1, duration: 1.6, stagger: { each: 0.1 } })
        .to(content, { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.5);

      // --- Scroll parallax as a camera move. Each plane scrolls at its own speed relative to
      // the page: the far forest lags most, the tree + lawn linger at about 0.75× scroll speed,
      // and the near foliage runs ahead. Offsets are in viewport heights so it feels identical
      // on every screen. The hero is the first section, so progress runs from the page top.
      const scrub = { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
      const vh = () => window.innerHeight * k;
      const planes = [
        { match: 'tl-bg',     lag:  0.14 },              // slowest: far forest (no scale: re-rasterising a 1600px image flickers)
        { match: 'tl-rays',   lag:  0.26 },
        { match: 'tl-ground', lag:  0.25 },              // tree + lawn share a plane so roots stay planted
        { match: 'tl-banyan', lag:  0.25 },
        { match: 'tl-fol-tr', lag: -0.08 },              // negatives run ahead of the page
        { match: 'tl-fol-tl', lag: -0.12 },
        { match: 'tl-flw-br', lag: -0.18 },
        { match: 'tl-flw-bl', lag: -0.22 },
      ];
      planes.forEach(({ match, lag, scale }) => {
        const el = layers.find((l) => l.classList.contains(match));
        if (!el) return;
        gsap.to(el, {
          y: () => vh() * lag,
          ...(scale ? { scale } : {}),
          ease: 'none',
          scrollTrigger: scrub,
        });
      });
      // The scene settles into shadow as it leaves (opacity on an overlay, not a filter on images)
      gsap.to('.tree-hero-dusk', {
        opacity: 0.45,
        ease: 'none',
        scrollTrigger: { ...scrub, start: '35% top' },
      });
      // Copy runs ahead and fades, so the message clears before the scene does
      gsap.to(contentRef.current, {
        y: () => -vh() * 0.18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { ...scrub, end: '70% top' },
      });

      // --- Mouse parallax (desktop)
      if (!mobile) {
        // Cursor parallax drives the INNER element of each layer, while scroll parallax drives
        // the wrapper. Two tweens writing `y` on one element fight each other (visible as the
        // background jerking when the cursor leaves). The banyan and lawn stay anchored.
        const movers = layers
          .filter((el) => !el.classList.contains('tl-banyan') && !el.classList.contains('tl-ground'))
          .map((el) => {
            const inner = el.firstElementChild;
            return {
              d: depth(el),
              x: gsap.quickTo(inner, 'x', { duration: 0.5, ease: 'power2.out' }),
              y: gsap.quickTo(inner, 'y', { duration: 0.5, ease: 'power2.out' }),
            };
          });
        const node = sectionRef.current;
        let rect = node.getBoundingClientRect();
        let frame = 0;
        let px = 0;
        let py = 0;
        const apply = () => {
          frame = 0;
          movers.forEach(({ d, x, y }) => {
            x(-px * (2 + d * 16));
            y(-py * (1 + d * 8));
          });
        };
        const onMove = (e) => {
          px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          if (!frame) frame = requestAnimationFrame(apply);
        };
        const onLeave = () => {
          px = 0;
          py = 0;
          if (!frame) frame = requestAnimationFrame(apply);
        };
        const onResize = () => { rect = node.getBoundingClientRect(); };
        node.addEventListener('mousemove', onMove, { passive: true });
        node.addEventListener('mouseleave', onLeave);
        window.addEventListener('resize', onResize);
        return () => {
          if (frame) cancelAnimationFrame(frame);
          node.removeEventListener('mousemove', onMove);
          node.removeEventListener('mouseleave', onLeave);
          window.removeEventListener('resize', onResize);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
  };

  return (
    <section id="home" ref={sectionRef} className="tree-hero" aria-labelledby="hero-title">
      {/* Depth layers */}
      <div className="tree-hero-stage" aria-hidden="true">
        {LAYERS.map((l, i) => (
          <div key={l.id} className={`tree-layer ${l.cls}`} data-depth={l.depth} style={{ zIndex: i + 1 }}>
            {l.src ? <img src={l.src} alt="" draggable="false" loading={i < 4 ? 'eager' : 'lazy'} /> : <div className="tree-rays" />}
          </div>
        ))}
        <div className="tree-hero-haze" />
        <div className="tree-hero-pollen">
          {Array.from({ length: 14 }).map((_, i) => (
            <i key={i} style={{ '--i': i }} />
          ))}
        </div>
        <FallingLeaves className="tree-hero-leaves" count={26} />
        <div className="tree-hero-dusk" />
        <div className="tree-hero-vignette" />
        <div className="tree-hero-grain" />
      </div>

      {/* Copy */}
      <div ref={contentRef} className="tree-hero-content">
        <p className="tree-hero-eyebrow">
          <Leaf size={14} strokeWidth={2} />
          <span>Sri Ayyappa Bala Sai Nursery</span>
          <i className="tree-hero-eyebrow-rule" />
        </p>
        <h1 id="hero-title" className="tree-hero-title">
          Where Nature
          <br />
          Finds Its <em>Beauty.</em>
        </h1>
        <p className="tree-hero-description">
          Growing beautiful flowers, healthy fruit plants, and nature’s finest greenery with care.
        </p>
        <div className="tree-hero-actions">
          <button className="tree-btn tree-btn-solid" onClick={() => scrollTo('collection')}>
            <Sprout size={18} />
            <span>Explore Our Plants</span>
          </button>
          <button className="tree-btn tree-btn-outline" onClick={() => scrollTo('contact')}>
            <span>Visit Our Nursery</span>
            <ArrowRight size={16} className="tree-btn-arrow" />
          </button>
        </div>
        <ul className="tree-hero-tags" aria-label="What we grow">
          <li><Flower2 size={14} /><span>Hybrid flowering</span></li>
          <li><Apple size={14} /><span>Fruit saplings</span></li>
          <li><TreeDeciduous size={14} /><span>Ornamental</span></li>
          <li><Shrub size={14} /><span>Lawn &amp; revenue</span></li>
        </ul>
      </div>

      {/* Direct enquiry: the one action a nursery visitor most often wants */}
      <a
        className="tree-hero-whatsapp"
        href="https://wa.me/919849936169?text=Hello%20SABSN%2C%20I%27d%20like%20to%20enquire%20about%20your%20plants."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with SABSN on WhatsApp"
      >
        <span className="tree-hero-whatsapp-dot" aria-hidden="true" />
        <MessageCircle size={18} strokeWidth={2} />
        <span className="tree-hero-whatsapp-text">
          <strong>Chat on WhatsApp</strong>
          <small>+91 98499 36169</small>
        </span>
      </a>

      <div className="tree-hero-fade" />
    </section>
  );
}
