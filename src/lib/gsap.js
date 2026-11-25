import { useLayoutEffect } from 'react';

/*
 * GSAP, loaded on demand. Importing it statically put 113 KB (45 KB gzipped) into the first-load JS of the
 * home and About pages, ahead of the first paint. Here it is fetched with import() once, after the page has
 * rendered, and shared by every caller.
 *
 * Sections that animate content in from hidden must not show it first and then hide it when GSAP arrives.
 * `useGsap` puts a `gsap-pending` class on the scope element until the setup has run (or GSAP failed to load);
 * each section's CSS hides its entrance targets under that class. Reduced motion skips the class entirely.
 */
let loading = null;

export function loadGsap() {
  if (!loading) {
    loading = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, st]) => {
      const gsap = core.gsap || core.default;
      gsap.registerPlugin(st.ScrollTrigger);
      return { gsap, ScrollTrigger: st.ScrollTrigger };
    });
  }
  return loading;
}

// re-measure scroll-trigger positions after layout changes; a no-op until GSAP has been loaded by someone
export function refreshScrollTriggers() {
  if (loading) loading.then(({ ScrollTrigger }) => ScrollTrigger.refresh()).catch(() => {});
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Run `setup(gsap, ScrollTrigger)` inside a gsap.context scoped to `scopeRef`, once GSAP has loaded.
 * `setup` may return a cleanup function (gsap.context runs it on revert). Everything is reverted on unmount.
 * `{ pending: true }` adds the `gsap-pending` class to the scope until setup has run (see above).
 */
export function useGsap(scopeRef, setup, { pending = false } = {}) {
  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;
    const hold = pending && !reducedMotion();
    if (hold) scope.classList.add('gsap-pending');
    let ctx = null;
    let cancelled = false;
    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        ctx = gsap.context(() => setup(gsap, ScrollTrigger), scope);
      })
      .catch(() => {}) // offline or blocked: the section simply stays static
      .finally(() => { if (hold) scope.classList.remove('gsap-pending'); });
    return () => {
      cancelled = true;
      ctx?.revert();
    };
    // the setup is fixed for the life of the component
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
