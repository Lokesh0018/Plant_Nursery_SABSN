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
  cb.current = onChange;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        inView.current = visible;
        el.classList.toggle('is-offscreen', !visible);
        cb.current?.(visible);
      },
      { rootMargin: margin, threshold: 0 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.classList.remove('is-offscreen');
    };
  }, [ref, margin]);

  return inView;
}
