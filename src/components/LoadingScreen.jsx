import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './LoadingScreen.css';

/**
 * Botanical loading screen.
 *
 * Progress is real: it counts the things the first screen genuinely needs before it can be shown
 * cleanly (web fonts, the hero's eagerly loaded images, and the document's own load event). There
 * is no artificial delay. The only wait that is not "loading" is the intro's own choreography: the
 * exit will not start before the logo has finished appearing, so a fast connection still gets a
 * calm, complete introduction instead of a flash.
 *
 * On exit it dispatches `sabsn:loaded` on `window` so the hero can run its entrance behind the
 * dissolve, then unmounts.
 */

// small leaves that drift around the logo, (x %, y %, size px, rotation deg)
const FLOATERS = [
  [18, 26, 26, -20], [80, 22, 22, 35], [12, 66, 20, 10],
  [86, 62, 28, -40], [30, 84, 18, 25], [70, 86, 22, -15],
];

const LEAF = 'M0 0 C 7 -11, 22 -15, 28 -2 C 22 9, 7 11, 0 0 Z';
const VEIN = 'M1 0 C 9 -3, 17 -4, 25 -2';

function Leaf({ size, rotate, className }) {
  return (
    <svg className={className} width={size} height={size * 0.8} viewBox="-2 -16 32 32" style={{ transform: `rotate(${rotate}deg)` }} aria-hidden="true">
      <path d={LEAF} fill="#79A66A" stroke="#174D35" strokeWidth="0.5" />
      <path d={VEIN} fill="none" stroke="#DCE8D3" strokeWidth="0.7" strokeLinecap="round" />
    </svg>
  );
}

/** Wait for the assets the first screen needs; report progress as a 0–1 fraction. */
function useRealProgress() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const tasks = [];

    // 1. web fonts, so the hero headline does not swap mid-dissolve
    if (document.fonts && document.fonts.ready) tasks.push(document.fonts.ready);

    // 2. the hero's eager images (the parts of the first screen that must be decoded)
    const heroImgs = Array.from(document.querySelectorAll('.tree-hero img[loading="eager"]'));
    heroImgs.forEach((img) => {
      tasks.push(
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : (img.decode ? img.decode().catch(() => undefined) : new Promise((res) => { img.onload = img.onerror = res; }))
      );
    });

    // 3. the document itself
    tasks.push(document.readyState === 'complete' ? Promise.resolve() : new Promise((res) => window.addEventListener('load', res, { once: true })));

    const total = Math.max(1, tasks.length);
    let done = 0;
    tasks.forEach((t) => {
      Promise.resolve(t).finally(() => {
        if (cancelled) return;
        done += 1;
        setProgress(done / total);
        if (done === total) setReady(true);
      });
    });
    return () => { cancelled = true; };
  }, []);

  return { progress, ready };
}

export default function LoadingScreen({ onDone }) {
  const root = useRef(null);
  const introDone = useRef(false);
  const readyRef = useRef(false);
  const exited = useRef(false);
  const { progress, ready } = useRealProgress();
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Exit runs when BOTH the app is ready and the intro has shown the logo. It is called from
  // whichever of the two happens last (event-driven, no frame polling), so it cannot stall.
  const exit = useCallback(() => {
    if (exited.current) return;
    exited.current = true;
    const el = root.current;
    window.__sabsnLoaded = true;
    window.dispatchEvent(new Event('sabsn:loaded'));
    if (reduce || !el) { onDone?.(); return; }
    gsap.timeline({ onComplete: () => onDone?.() })
      .to('.ls-floater', { opacity: 0, y: -10, duration: 0.5, stagger: 0.04, ease: 'power2.in' }, 0)
      .to('.ls-caption, .ls-rail', { opacity: 0, y: -6, duration: 0.45, ease: 'power2.in' }, 0)
      .to('.ls-stage', { scale: 1.06, duration: 0.9, ease: 'power2.inOut' }, 0.1)
      .to(el, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0.35);
  }, [reduce, onDone]);
  const maybeExit = useCallback(() => {
    if (readyRef.current && (introDone.current || reduce)) exit();
  }, [exit, reduce]);

  // lock scroll while the overlay is up
  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => { document.documentElement.style.overflow = prev; };
  }, []);

  // intro choreography
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    if (reduce) { introDone.current = true; return undefined; }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: () => { introDone.current = true; maybeExit(); } });
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power1.out' })
        // the original logo: scale + opacity only
        .fromTo('.ls-logo', { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 1.1 }, 0.25)
        // seedling beneath the logo: the stem grows, then the two leaves unfold from the stem
        .fromTo('.ls-stem', { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0.7)
        .fromTo('.ls-leaf-l', { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' }, 1.25)
        .fromTo('.ls-leaf-r', { scale: 0, rotation: 40 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' }, 1.4)
        // floating leaves settle in around the logo
        .fromTo('.ls-floater', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 1.0)
        // caption and progress rail
        .fromTo('.ls-caption', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 1.3)
        .fromTo('.ls-rail', { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.5);

      // idle drift: each floating leaf bobs and turns on its own cycle (transform only)
      gsap.utils.toArray('.ls-floater').forEach((leaf, i) => {
        gsap.to(leaf, { y: '+=' + (8 + (i % 3) * 3), rotation: '+=' + (i % 2 ? 6 : -6), duration: 3.2 + i * 0.35, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 + i * 0.2 });
      });
    }, el);
    return () => ctx.revert();
  }, [reduce, maybeExit]);

  // ready: try to exit now (the intro's onComplete tries too, whichever comes last wins)
  useEffect(() => {
    if (!ready) return undefined;
    readyRef.current = true;
    maybeExit();
    // Watchdog, not a delay: if the animation engine is starved (background tab, throttled frames),
    // never trap the visitor behind the overlay. A plain CSS fade hands over instead.
    const guard = setTimeout(() => {
      if (exited.current) return;
      exited.current = true;
      window.__sabsnLoaded = true;
      window.dispatchEvent(new Event('sabsn:loaded'));
      const el = root.current;
      if (!el) { onDone?.(); return; }
      el.style.transition = 'opacity 0.5s ease';
      el.style.opacity = '0';
      setTimeout(() => onDone?.(), 520);
    }, 4000);
    return () => clearTimeout(guard);
  }, [ready, maybeExit, onDone]);

  const pct = Math.round(progress * 100);

  return (
    <div ref={root} className="ls-root" role="status" aria-live="polite" aria-label={`Loading, ${pct}%`} style={{ opacity: reduce ? 1 : 0 }}>
      <div className="ls-stage">
        {FLOATERS.map(([x, y, s, r], i) => (
          <span key={i} className="ls-floater" style={{ left: `${x}%`, top: `${y}%` }}>
            <Leaf size={s} rotate={r} />
          </span>
        ))}

        <div className="ls-logo-wrap">
          <img className="ls-logo" src="/logo/logo-256.webp" alt="Sri Ayyappa Bala Sai Nursery" width="256" height="256" decoding="async" fetchPriority="high" />
          {/* the seedling: a stem that draws itself and two leaves that unfold */}
          <svg className="ls-seedling" viewBox="0 0 80 60" width="80" height="60" aria-hidden="true">
            <path className="ls-stem" d="M40 58 C 40 46, 38 36, 40 22" fill="none" stroke="#174D35" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="60" />
            <g className="ls-leaf-l" style={{ transformOrigin: '40px 30px' }}>
              <path d="M40 30 C 30 30, 20 24, 18 14 C 28 14, 38 20, 40 30 Z" fill="#79A66A" stroke="#174D35" strokeWidth="0.8" />
            </g>
            <g className="ls-leaf-r" style={{ transformOrigin: '40px 24px' }}>
              <path d="M40 24 C 50 24, 60 18, 62 8 C 52 8, 42 14, 40 24 Z" fill="#79A66A" stroke="#174D35" strokeWidth="0.8" />
            </g>
            <path d="M28 59 Q40 55 52 59" fill="none" stroke="#DCE8D3" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        <p className="ls-caption">Growing Your Experience…</p>
        <div className="ls-rail" aria-hidden="true">
          <span className="ls-rail-fill" style={{ transform: `scaleX(${Math.max(0.04, progress)})` }} />
        </div>
      </div>
    </div>
  );
}
