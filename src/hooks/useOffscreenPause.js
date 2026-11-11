import { useEffect, useRef } from 'react';

/**
 * Pause a section's continuous animations while it is off screen.
 *
 * - Toggles the `is-offscreen` class on the element. Global CSS pauses every CSS animation inside
 *   an `.is-offscreen` element (see global.css), so fireflies, glows, grass and the like stop
 *   burning frames when nobody can see them.
 * - Returns a ref whose `.current` is true while the element is (nearly) in view, for JS loops
 *   (requestAnimationFrame tickers, GSAP repeat tweens) to consult or be driven by `onChange`.
 *
 * `margin` is the IntersectionObserver rootMargin: animations resume a little before the section
 * scrolls into view so nothing pops in frozen.
 */
export default function useOffscreenPause(ref, { margin = '12%', onChange } = {}) {
  const inView = useRef(true);
  const cb = useRef(onChange);
  useEffect(() => { cb.current = onChange; });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let current = null;
    const set = (visible) => {
      if (visible === current) return;
      current = visible;
      inView.current = visible;
      el.classList.toggle('is-offscreen', !visible);
      cb.current?.(visible);
    };

    // Primary: IntersectionObserver, which costs nothing between changes.
    let io = null;
    if (typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => set(entry.isIntersecting), { rootMargin: margin, threshold: 0 });
      io.observe(el);
    }

    // Fallback: watch the scroll position each frame and re-measure only when it has changed, so
    // the state is right even where observer notifications or scroll events lag (programmatic
    // jumps, some embedded or headless contexts). One rect read per change is negligible.
    const pct = parseFloat(margin) || 0;
    let raf = 0;
    let lastY = -1;
    let lastH = -1;
    const check = () => {
      const r = el.getBoundingClientRect();
      const m = (window.innerHeight * pct) / 100;
      set(r.bottom > -m && r.top < window.innerHeight + m);
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const y = window.scrollY;
      const h = window.innerHeight;
      if (y !== lastY || h !== lastH) {
        lastY = y;
        lastH = h;
        check();
      }
    };
    loop();

    return () => {
      io?.disconnect();
      cancelAnimationFrame(raf);
      el.classList.remove('is-offscreen');
    };
  }, [ref, margin]);

  return inView;
}
