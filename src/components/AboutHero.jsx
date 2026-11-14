import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './AboutHero.css';

gsap.registerPlugin(ScrollTrigger);

/*
 * Compact landscape header for /about: the nursery lawn (public/about/hero-bg) with the SABSN topiary
 * standing in the middle of it, under the navbar capsule. No text over the picture; the page's heading
 * is in the "Who we are" section directly below.
 * GSAP: the lawn and navbar fade in, the topiary rises gently onto the lawn, and on scroll the two
 * planes drift apart slightly. Everything stays still under prefers-reduced-motion.
 */
export default function AboutHero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      const nav = document.querySelector('.navbar-container');
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from('.ah-bg', { opacity: 0, duration: 1.4 }, 0)
        .from('.ah-sign', { opacity: 0, y: 26, duration: 1.3 }, 0.25);
      if (nav) tl.from(nav, { opacity: 0, duration: 1 }, 0.1);

      // gentle parallax while the header scrolls away
      const scrub = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true };
      gsap.to('.ah-bg', { yPercent: 9, ease: 'none', scrollTrigger: scrub });
      gsap.to('.ah-sign', { yPercent: 6, ease: 'none', scrollTrigger: scrub });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={rootRef} className="about-hero">
      <div className="ah-layer ah-bg" aria-hidden="true">
        <img src="/about/hero-bg.webp" srcSet="/about/hero-bg-900.webp 900w, /about/hero-bg.webp 1672w" sizes="100vw"
          width="1672" height="941" alt="" fetchPriority="high" decoding="async" draggable="false" />
      </div>
      <div className="ah-navshade" aria-hidden="true" />
      <div className="ah-layer ah-sign">
        <span className="ah-shadow ah-shadow--cast" aria-hidden="true" />
        <span className="ah-shadow ah-shadow--contact" aria-hidden="true" />
        <img src="/about/hero-sabsn.webp" srcSet="/about/hero-sabsn-900.webp 900w, /about/hero-sabsn.webp 1400w"
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 76vw, 60vw" width="1400" height="467"
          fetchPriority="high" decoding="async" draggable="false"
          alt="The letters SABSN shaped from clipped green topiary in a flowering bed on the nursery lawn" />
      </div>
    </header>
  );
}
