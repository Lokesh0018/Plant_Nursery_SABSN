import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

// drift speed in cards per second, and how long a click / drag / hover holds it before drifting on
const DRIFT = 0.2;
const HOLD_AFTER_MS = 2600;

/**
 * A centred, endlessly looping card carousel that glides continuously while it is on screen.
 *
 * Position is one fractional number (in cards). Every animation frame it advances a little and each
 * card's offset from the centre is written straight to that card's CSS variables (--offset, --depth,
 * --scale, --fade), so the fan of cards moves smoothly instead of stepping. React only re-renders
 * when the centred card changes (for the counter, dots and labels).
 *
 * Arrows, dots, keys and clicks ease the fan to a card; dragging moves it directly and settles on
 * the nearest card. Each of those, hovering and keyboard focus hold the drift, which resumes a
 * moment later. No drift off screen, in background tabs or for reduced motion.
 */
export default function useServiceCarousel(count) {
  const trackRef = useRef(null);
  const cards = useRef([]);
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const pos = useRef(0);          // fractional position, in cards
  const target = useRef(null);    // card position being eased to, if any
  const holdUntil = useRef(0);    // drift held until this time
  const held = useRef({ hover: false, focus: false, paused: false });
  const lastIndex = useRef(0);
  const visible = useRef(false);
  const drag = useRef(null);
  const dragged = useRef(false);

  // write every card's place in the fan for the current position
  const apply = useCallback(() => {
    const p = pos.current;
    cards.current.forEach((el, i) => {
      if (!el) return;
      let off = ((i - p) % count + count) % count;
      if (off > count / 2) off -= count;
      const d = Math.abs(off);
      el.style.setProperty('--offset', off.toFixed(4));
      el.style.setProperty('--depth', d.toFixed(4));
      el.style.setProperty('--scale', Math.max(0.55, 1 - d * 0.12).toFixed(4));
      el.style.setProperty('--fade', Math.max(0, 1 - d * 0.24).toFixed(4));
      // cards fade out smoothly past the third place instead of popping
      el.style.opacity = d <= 3 ? '1' : Math.max(0, 1 - (d - 3) / 0.7).toFixed(3);
      el.style.zIndex = String(100 - Math.round(d * 10));
    });
    const i = ((Math.round(p) % count) + count) % count;
    if (i !== lastIndex.current) { lastIndex.current = i; setIndex(i); }
  }, [count]);

  useLayoutEffect(() => { apply(); }, [apply]);

  const hold = useCallback((ms = HOLD_AFTER_MS) => { holdUntil.current = performance.now() + ms; }, []);

  // ease to card i by the shortest way round the loop
  const goTo = useCallback((i) => {
    const base = target.current ?? Math.round(pos.current);
    let diff = ((i - base) % count + count) % count;
    if (diff > count / 2) diff -= count;
    target.current = base + diff;
    hold();
    if (reducedMotion) { pos.current = target.current; target.current = null; apply(); }
  }, [count, hold, reducedMotion, apply]);

  const nudge = useCallback((dir) => {
    const base = target.current ?? Math.round(pos.current);
    goTo(((base + dir) % count + count) % count);
  }, [count, goTo]);

  const setPaused = useCallback((on) => {
    held.current.paused = on;
    if (!on) hold(1200);
  }, [hold]);

  // reduced-motion preference and on-screen state
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(media.matches);
    media.addEventListener('change', change);
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; }, { threshold: 0.25 });
    if (trackRef.current) observer.observe(trackRef.current);
    return () => { media.removeEventListener('change', change); observer.disconnect(); };
  }, []);

  // the motion loop: eases toward a chosen card, otherwise drifts
  useEffect(() => {
    if (reducedMotion) return undefined;
    let raf = 0;
    let last = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible.current || document.hidden || drag.current?.active) return;
      if (target.current !== null) {
        const gap = target.current - pos.current;
        pos.current += gap * Math.min(1, dt * 7);
        if (Math.abs(gap) < 0.002) {
          pos.current = target.current;
          target.current = null;
          hold();
        }
        apply();
        return;
      }
      const h = held.current;
      if (h.hover || h.focus || h.paused || now < holdUntil.current) return;
      pos.current = (pos.current + DRIFT * dt) % count;
      apply();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion, count, apply, hold]);

  // how many pixels one card's step in the fan is, from the stage's --spread
  const spreadPx = () => {
    const raw = getComputedStyle(trackRef.current).getPropertyValue('--spread').trim();
    const n = parseFloat(raw) || 225;
    return raw.endsWith('vw') ? (n * window.innerWidth) / 100 : n;
  };

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      nudge(event.key === 'ArrowRight' ? 1 : -1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : count - 1);
    }
  };
  const onPointerDown = (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, id: event.pointerId, start: pos.current, active: false };
    dragged.current = false;
  };
  const onPointerMove = (event) => {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    if (!d.active && Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(event.clientY - d.y)) {
      d.active = true;
      dragged.current = true;
      target.current = null;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (d.active) {
      pos.current = d.start - dx / spreadPx();
      apply();
    }
  };
  const onPointerUp = (event) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.active) goTo(((Math.round(pos.current) % count) + count) % count);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const onClickCapture = (event) => {
    if (dragged.current) { event.preventDefault(); event.stopPropagation(); dragged.current = false; }
  };

  const cardRef = (i) => (el) => { cards.current[i] = el; };

  return {
    trackRef, cardRef, index, reducedMotion, goTo, nudge, setPaused,
    interactionProps: {
      onKeyDown, onPointerDown, onPointerMove, onPointerUp, onClickCapture,
      onPointerCancel: () => { drag.current = null; dragged.current = false; },
      onMouseEnter: () => { held.current.hover = true; },
      onMouseLeave: () => { held.current.hover = false; hold(700); },
      onFocus: () => { held.current.focus = true; },
      onBlur: (e) => { if (!e.currentTarget.contains(e.relatedTarget)) { held.current.focus = false; hold(700); } },
    },
  };
}
