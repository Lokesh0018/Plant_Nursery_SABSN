import React, { useLayoutEffect, useRef } from 'react';
import { useGsap } from '../../lib/gsap';
import './AboutHero.css';

/*
 * Compact landscape header for /about: one picture of the nursery lawn with the SABSN topiary standing
 * in it (lawn, topiary and its shadows baked together in public/images/about/). Wide screens load the 3:1
 * version, phones and narrow tablets the near-square one, so the topiary is never cropped.
 * No text over the picture; the page's heading is in the "Who we are" section directly below.
 * GSAP (loaded on demand, src/lib/gsap.js): the picture fades in (held hidden by .gsap-pending until then) and
 * drifts slightly as the header scrolls away. The navbar fades in too, but only if GSAP arrived straight away:
 * the navbar is outside this header, so it can't be held hidden, and fading it out once it has shown would flicker.
 * Everything stays still under prefers-reduced-motion.
 */
export default function AboutHero() {
  const rootRef = useRef(null);

  // when the header mounted, to tell whether GSAP arrived straight away (declared before useGsap, so it runs first)
  const mountedAt = useRef(0);
  useLayoutEffect(() => { mountedAt.current = performance.now(); }, []);
  useGsap(rootRef, (gsap) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const nav = document.querySelector('.navbar-container');
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      .from('.ah-picture', { opacity: 0, duration: 1.4 }, 0);
    if (nav && performance.now() - mountedAt.current < 200) tl.from(nav, { opacity: 0, duration: 1 }, 0.1);

    gsap.to('.ah-picture', {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { pending: true });

  return (
    <header ref={rootRef} className="about-hero">
      <picture className="ah-picture">
        <source media="(max-width: 820px)" srcSet="/images/about/about-hero-mobile.webp" width="900" height="820" />
        <img src="/images/about/about-hero.webp" width="1920" height="640" fetchPriority="high" decoding="async" draggable="false"
          alt="The letters SABSN shaped from clipped green topiary in a flowering bed on the nursery lawn" />
      </picture>
      <div className="ah-navshade" aria-hidden="true" />
    </header>
  );
}
