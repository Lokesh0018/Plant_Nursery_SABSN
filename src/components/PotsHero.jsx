import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import './PotsHero.css';

gsap.registerPlugin(ScrollTrigger);

export default function PotsHero() {
  const containerRef = useRef(null);
  const potRef = useRef(null);
  const contentRef = useRef(null);
  
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current.children, 
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out'
        }
      );

      gsap.fromTo(potRef.current, 
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out'
        }
      );

      // Scroll Parallax Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top -10%',
          end: 'bottom top',
          scrub: 1,
        }
      });

      tl.to([potRef.current, contentRef.current], {
        y: '-10vh',
        opacity: 0,
        ease: 'none'
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="pots" ref={containerRef} className="pots-hero-section">
      {/* Floor color element */}
      <div className="pots-hero-floor" />

      {/* Centering Wrapper */}
      <div className="pots-hero-wrapper">
        
        {/* Content on the Left */}
        <div ref={contentRef} className="pots-hero-content">
          <h1 className="pots-hero-title">
            Handcrafted Ceramic
          </h1>
          
          <h2 className="pots-hero-subtitle">
            Minimalist Terrazzo Collection
          </h2>

          <p className="pots-hero-description">
            Elevate your botanical display with our artisanal pots. Designed to provide perfect drainage and root breathability while serving as a stunning sculptural element in your home.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <button 
              className="hero-cta-button"
              style={{ padding: '1.1rem 2.2rem', fontSize: '1rem' }}
              onClick={() => {
                const el = document.getElementById('pots-collection');
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 100;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
            >
              <span>Explore Pots</span>
              <ArrowRight size={18} className="cta-arrow" />
            </button>
          </div>
        </div>

        {/* Image on the Right */}
        <div className="pots-hero-image-container">
          <img 
            ref={potRef}
            src="/pots/pots-Photoroom.webp"
            alt="Handcrafted Ceramic Pot"
            className="pots-hero-image"
          />
        </div>
      </div>
    </section>
  );
}
