/**
 * One shared scroll ticker for the whole app.
 *
 * Several features need "the scroll position, every frame" (navbar active section, off-screen
 * pausing, the footer finale). Each used to run its own requestAnimationFrame loop and read
 * window.scrollY independently. This store runs a single loop, only while something is
 * subscribed, reads scrollY / innerHeight / scrollHeight once per frame, and notifies subscribers
 * only when one of them changed. Idle pages therefore do one cheap comparison per frame and no
 * layout reads at all.
 */
const subs = new Set();
let raf = 0;
const state = { y: -1, vh: 0, max: 0 };

function read() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  if (y !== state.y || vh !== state.vh || max !== state.max) {
    state.y = y; state.vh = vh; state.max = max;
    subs.forEach((fn) => fn(state));
  }
}

function loop() {
  raf = requestAnimationFrame(loop);
  read();
}

/** Subscribe to scroll changes. Returns an unsubscribe function. The callback fires once on subscribe. */
export function subscribeScroll(fn) {
  subs.add(fn);
  if (!raf) {
    raf = requestAnimationFrame(loop);
    // scroll events too: animation frames pause in background tabs, events do not
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
  }
  // give the new subscriber a current value right away
  if (state.y < 0) read(); else fn(state);
  return () => {
    subs.delete(fn);
    if (subs.size === 0 && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
      state.y = -1;
    }
  };
}

/** Last known values without subscribing. */
export function getScroll() {
  return state;
}
