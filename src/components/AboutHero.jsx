import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutHero.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * Compact landscape header for /about: one picture of the nursery lawn with the SABSN topiary standing
 * in it (lawn, topiary and its shadows baked together in public/about/). Wide screens load the 3:1
 * version, phones and narrow tablets the near-square one, so the topiary is never cropped.
 * No text over the picture; the page's heading is in the "Who we are" section directly below.
 * GSAP: the picture and navbar fade in, and the picture drifts slightly as the header scrolls away.
 * Everything stays still under prefers-reduced-motion.
 */
export default function AboutHero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const nav = document.querySelector('.navbar-container');
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from('.ah-picture', { opacity: 0, duration: 1.4 }, 0);
      if (nav) tl.from(nav, { opacity: 0, duration: 1 }, 0.1);

      gsap.to('.ah-picture', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={rootRef} className="about-hero">
      <picture className="ah-picture">
        <source media="(max-width: 820px)" srcSet="/about/about-hero-mobile.webp" width="900" height="820" />
        <img src="/about/about-hero.webp" width="1920" height="640" fetchPriority="high" decoding="async" draggable="false"
          alt="The letters SABSN shaped from clipped green topiary in a flowering bed on the nursery lawn" />
      </picture>
      <div className="ah-navshade" aria-hidden="true" />
    </header>
  );
}
