import React, { useLayoutEffect, useRef } from 'react';
import { loadSheet, paint, plantDivider } from './vine/paint';
import './VineDivider.css';

/*
 * Divider vines on the seams between sections: a golden trumpet creeper (Allamanda cathartica, the yellow
 * creeper the nursery grows). One vine grows in from each edge as the band scrolls into view, and the two
 * meet under a cluster of blooms in the centre.
 *
 * The plant is painted on a canvas from rendered drawings of its leaves, buds and flowers (see
 * vine/paint.js), so a band is one element however dense the foliage, and growing it is one loop that
 * repaints the canvas for a couple of seconds and then stops.
 */
const H = 130; // slim band: the vines carry the seam, not empty space
const PACE = 0.62; // the growth is laid out on a 0..1 timeline; this many of those units pass per second

// `id` lets a variant be used more than once on a page (it seeds the growth, so each band is its own plant);
// `from` / `to` are the exact colours of the sections above and below, for variants that ramp between them
export default function VineDivider({ variant = 'top', id = variant, from, to }) {
  const ref = useRef(null);
  const uid = id;
  const style = {
    ...(from && { '--vd-from': from }),
    ...(to && { '--vd-to': to }),
  };

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const host = ref.current;
    const canvas = host.querySelector('canvas');
    const g = canvas.getContext('2d');
    let levels; // the drawings, once they have loaded
    let scene;
    let dpr = 1;
    let builtWidth = -1;
    let t = 0; // where the growth stands: 0 is bare, scene.end is full-grown
    let frame = 0;
    let last = 0;
    let inView = false;
    let gone = false;

    const draw = () => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
      if (levels && t > 0) paint(g, scene, levels, t, dpr);
    };

    const step = (now) => {
      // a long gap (a background tab) counts as one frame, so the growth resumes instead of jumping
      t += (Math.min(now - (last || now), 100) / 1000) * PACE;
      last = now;
      if (t >= scene.end) t = scene.end;
      draw();
      frame = t < scene.end ? requestAnimationFrame(step) : 0;
    };
    // Plays on its own clock (about two seconds) each time the band comes into view, from either direction,
    // and only from bare: a band that never fully left the screen keeps its vines.
    const grow = () => {
      if (!levels || frame || t > 0) return;
      last = 0;
      t = 1e-4;
      frame = requestAnimationFrame(step);
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      t = 0;
      draw();
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      const width = rect.width;
      const scale = Math.min(window.devicePixelRatio || 1, 3);
      // Phones fire `resize` whenever the address bar slides in or out while scrolling; the width does not
      // change then, so skip the rebuild.
      if (Math.abs(width - builtWidth) < 1 && scale === dpr) return;
      builtWidth = width;
      dpr = scale;
      // Planted at the band's real size (it is shorter on tablets and phones); every measure scales with it.
      const height = rect.height || H;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      scene = plantDivider(width, height, uid);
      // a band that had grown, or was growing, stays grown through a resize
      if (reduce || t > 0) {
        cancelAnimationFrame(frame);
        frame = 0;
        t = scene.end;
      }
      draw();
    };

    build();
    loadSheet().then((ready) => {
      if (gone) return;
      levels = ready;
      if (reduce) draw(); // fully grown, static
      else if (inView) grow();
    }, () => {}); // without the drawings the band simply stays a plain seam

    let enter;
    let leave;
    if (!reduce) {
      // grow once a good part of the band is on screen ...
      enter = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) grow();
      }, { rootMargin: '-12% 0px -12% 0px' });
      // ... and clear it only when it has left the screen completely, so it never vanishes in view
      leave = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) reset();
      });
      enter.observe(host);
      leave.observe(host);
    }

    let tid;
    const onResize = () => { clearTimeout(tid); tid = setTimeout(build, 200); };
    window.addEventListener('resize', onResize);
    // a window dragged to a screen of another pixel density keeps its width, so `resize` may not fire
    let density;
    const watchDensity = () => {
      density = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
      density.addEventListener?.('change', onDensity, { once: true }); // (older Safari has no such method)
    };
    const onDensity = () => { build(); watchDensity(); };
    watchDensity();
    return () => {
      gone = true;
      window.removeEventListener('resize', onResize);
      density.removeEventListener?.('change', onDensity);
      clearTimeout(tid);
      cancelAnimationFrame(frame);
      enter?.disconnect();
      leave?.disconnect();
    };
  }, [uid]);

  return (
    <div ref={ref} className={`vine-divider vine-divider--${variant}`} style={style} aria-hidden="true">
      <canvas className="vine-canvas" height={H} />
    </div>
  );
}
