import { useEffect, useRef, useState } from 'react';

/**
 * Botanical loading screen: the controller.
 *
 * The screen itself (logo, seedling, floating leaves, caption, progress rail) is written into the page by
 * index.html before any JavaScript has downloaded, with its intro animated in CSS. So the branded intro shows
 * immediately, even on a slow connection, while the hero images download in parallel (preloaded there too).
 * This component, which arrives with the home page bundle, decides when it leaves. Event-driven, never timed:
 *
 *   loading ──(backdrop decoded)──▶ hero-ready ─────┐
 *      └──────(an image failed)──▶ error-fallback ──┴─(intro played)─▶ exiting ──(fade done)─▶ complete
 *
 *  - "backdrop decoded": the hero's backdrop <img> elements (marked `data-hero-critical` in Hero.jsx) have loaded
 *    AND decoded. It waits on those exact elements, so the width their srcset chose is the one checked and
 *    nothing is downloaded twice.
 *  - "intro played": every finite CSS animation of the intro has finished (Animation.finished), so the logo
 *    animation always completes naturally first.
 *  - "fade done": the exit transitions have finished.
 * A failed image is logged, hidden and replaced by a painted forest on the hero, and the page opens anyway, so
 * the visitor is never trapped behind the overlay. The state is mirrored on <html data-hero-load> for debugging
 * and tests. On exit it dispatches `sabsn:loaded` so the hero runs its entrance behind the dissolve.
 */

/** One hero image: resolves true once it has loaded and decoded, false if it failed */
function heroImageReady(img) {
  return new Promise((resolve) => {
    const settle = () => {
      if (!img.naturalWidth) { resolve(false); return; }
      if (!img.decode) { resolve(true); return; }
      // decode() can reject for reasons other than a broken image (e.g. a src swap); a loaded bitmap still counts
      img.decode().then(() => resolve(true), () => resolve(img.naturalWidth > 0));
    };
    if (img.complete) settle();
    else {
      img.addEventListener('load', settle, { once: true });
      img.addEventListener('error', settle, { once: true });
    }
  });
}

/** Resolves when every finite animation or transition currently running on `el` or inside it has finished */
function animationsSettled(el) {
  if (!el || !el.getAnimations) return Promise.resolve();
  const running = el.getAnimations({ subtree: true }).filter((a) => a.effect?.getComputedTiming().iterations !== Infinity);
  return Promise.all(running.map((a) => a.finished.catch(() => undefined)));
}

/** The hero backdrop's state ('loading' → 'hero-ready' | 'error-fallback') and real 0–1 progress */
function useHeroReady() {
  const [state, setState] = useState('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const hero = document.querySelector('.tree-hero');
    const imgs = Array.from(document.querySelectorAll('.tree-hero img[data-hero-critical]'));
    let done = 0;
    Promise.all(imgs.map((img) => heroImageReady(img).then((ok) => {
      if (cancelled) return ok;
      if (!ok) {
        console.error('[SABSN] Hero image failed to load:', img.currentSrc || img.src);
        img.setAttribute('data-hero-failed', '');
        hero?.setAttribute('data-hero-fallback', '');
      }
      done += 1;
      setProgress(done / imgs.length);
      return ok;
    }))).then((oks) => {
      if (!cancelled) setState(oks.every(Boolean) ? 'hero-ready' : 'error-fallback');
    });
    return () => { cancelled = true; };
  }, []);

  return { state, progress };
}

export default function LoadingScreen({ onDone }) {
  const { state, progress } = useHeroReady();
  const exited = useRef(false);

  // the static screen from index.html: progress on its rail and in its accessible label
  useEffect(() => {
    const boot = document.getElementById('boot-loader');
    if (!boot) return;
    const fill = boot.querySelector('.ls-rail-fill');
    if (fill) fill.style.transform = `scaleX(${Math.max(0.04, progress)})`;
    boot.setAttribute('aria-label', `Loading, ${Math.round(progress * 100)}%`);
  }, [progress]);

  useEffect(() => {
    if (state === 'loading' || exited.current) return undefined;
    const html = document.documentElement;
    html.dataset.heroLoad = state;
    const boot = document.getElementById('boot-loader');
    let cancelled = false;

    // the hero is ready (or has fallen back); leave as soon as the intro has played through
    animationsSettled(boot).then(() => {
      if (cancelled || exited.current) return undefined;
      exited.current = true;
      html.dataset.heroLoad = 'exiting';
      window.__sabsnLoaded = true;
      window.dispatchEvent(new Event('sabsn:loaded'));
      boot?.classList.add('is-exiting');
      return animationsSettled(boot).then(() => {
        boot?.remove();
        html.style.overflow = '';
        html.dataset.heroLoad = 'complete';
        onDone?.();
      });
    });
    return () => { cancelled = true; };
  }, [state, onDone]);

  return null;
}
