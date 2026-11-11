import { useEffect, useRef } from 'react';
import { subscribeScroll } from '../lib/scrollStore';

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

    // Fallback: re-measure whenever the shared scroll store reports a change, so the state is
    // right even where observer notifications lag (programmatic jumps, embedded contexts).
    const pct = parseFloat(margin) || 0;
    const unsubscribe = subscribeScroll(({ vh }) => {
      const r = el.getBoundingClientRect();
      const m = (vh * pct) / 100;
      set(r.bottom > -m && r.top < vh + m);
    });

    return () => {
      io?.disconnect();
      unsubscribe();
      el.classList.remove('is-offscreen');
    };
  }, [ref, margin]);

  return inView;
}
