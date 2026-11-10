import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Sparkles, Award, MapPin, Trees, Sprout, CheckCircle2 } from 'lucide-react';
import VineOrnament from './VineOrnament';
import './StorySection.css';

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  { value: '35+', label: 'Years of Heritage', sub: 'Est. in Kadiam' },
  { value: '250+', label: 'Rare Plant Varieties', sub: 'Native & Exotic' },
  { value: '100k+', label: 'Saplings Planted', sub: 'Across India' }
];

export default function StorySection() {
  const containerRef = useRef(null);
  const portraitCardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const glowRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Ambient atmospheric glow breathing animation
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.15,
          opacity: 0.75,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Portrait parallax
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          },
          y: '6%',
          ease: 'none'
        });
      }

      // Entrance animation for portrait
      if (portraitCardRef.current) {
        gsap.fromTo(portraitCardRef.current,
          { y: 45, opacity: 0 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse'
            },
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out'
          }
        );
      }

      // Entrance animation for narrative content
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children,
          { y: 30, opacity: 0 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play reverse play reverse'
            },
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.1
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="founder-section" id="founder">
      {/* Editorial Decorative Background Watermark */}
      <div className="founder-bg-text" aria-hidden="true">
        HERITAGE
      </div>

      {/* Atmospheric Soft Light Flares */}
      <div ref={glowRef} className="founder-ambient-glow" aria-hidden="true" />
      <div className="founder-ambient-glow-secondary" aria-hidden="true" />

      {/* Decorative Botanical Corner Leaves */}
      <div className="founder-corner-leaf founder-corner-leaf-top" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="founder-card">
        {/* Plant Theme: Botanical Vine & Flower Corner Flourishes */}
        <div className="founder-card-vine-top-left" aria-hidden="true">
          <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-10 10 C 30 15, 60 40, 75 75 S 100 110, 140 105" stroke="#4f7f3a" strokeWidth="1.8" strokeLinecap="round" opacity="0.45" />
            <path d="M15 12 C 45 30, 80 50, 110 35" stroke="#355f2c" strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
            {/* Delicate leaves */}
            <path d="M35 22 C 30 10, 48 8, 45 22 Z" fill="#7fa868" opacity="0.6" />
            <path d="M65 48 C 60 36, 78 34, 75 48 Z" fill="#9bb896" opacity="0.75" />
            <path d="M90 38 C 98 26, 110 36, 100 45 Z" fill="#6a8c65" opacity="0.65" />
            {/* Jasmine flower bloom */}
            <g transform="translate(75 75) scale(0.85)">
              <circle cx="0" cy="0" r="3" fill="#fcd34d" />
              <ellipse cx="0" cy="-7" rx="3.5" ry="5.5" fill="#ffffff" opacity="0.9" />
              <ellipse cx="7" cy="0" rx="5.5" ry="3.5" fill="#ffffff" opacity="0.9" />
              <ellipse cx="0" cy="7" rx="3.5" ry="5.5" fill="#ffffff" opacity="0.9" />
              <ellipse cx="-7" cy="0" rx="5.5" ry="3.5" fill="#ffffff" opacity="0.9" />
              <ellipse cx="5" cy="-5" rx="3" ry="4.5" fill="#fef08a" opacity="0.8" />
              <ellipse cx="-5" cy="5" rx="3" ry="4.5" fill="#fef08a" opacity="0.8" />
            </g>
          </svg>
        </div>

        <div className="founder-card-vine-bottom-right" aria-hidden="true">
          <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M170 90 C 130 85, 100 60, 85 25 S 60 -10, 20 -5" stroke="#4f7f3a" strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
            <path d="M145 88 C 115 70, 80 50, 50 65" stroke="#355f2c" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
            {/* Leaves */}
            <path d="M125 78 C 130 90, 112 92, 115 78 Z" fill="#7fa868" opacity="0.6" />
            <path d="M95 52 C 100 64, 82 66, 85 52 Z" fill="#9bb896" opacity="0.75" />
            <path d="M70 62 C 62 74, 50 64, 60 55 Z" fill="#6a8c65" opacity="0.65" />
            {/* Soft pink bougainvillea flower petal */}
            <g transform="translate(85 25) scale(0.9)">
              <circle cx="0" cy="0" r="2.5" fill="#f59e0b" />
              <ellipse cx="0" cy="-6" rx="4" ry="6" fill="#f472b6" opacity="0.7" />
              <ellipse cx="6" cy="2" rx="4" ry="6" transform="rotate(72 6 2)" fill="#fb7185" opacity="0.7" />
              <ellipse cx="3.5" cy="8" rx="4" ry="6" transform="rotate(144 3.5 8)" fill="#f472b6" opacity="0.7" />
              <ellipse cx="-3.5" cy="8" rx="4" ry="6" transform="rotate(216 -3.5 8)" fill="#fb7185" opacity="0.7" />
              <ellipse cx="-6" cy="2" rx="4" ry="6" transform="rotate(288 -6 2)" fill="#f472b6" opacity="0.7" />
            </g>
          </svg>
        </div>

        {/* Subtle top heritage ribbon */}
        <div className="founder-card-topbar">
          <div className="founder-card-pill">
            <Sparkles size={13} className="founder-pill-icon" />
            <span>Honoring 35+ Years of Botanical Legacy</span>
          </div>
          <div className="founder-location-pill">
            <MapPin size={13} />
            <span>Kadiam, Godavari Delta • Andhra Pradesh</span>
          </div>
        </div>

        <div className="founder-grid">
          {/* Founder Portrait */}
          <div className="founder-portrait-col" ref={portraitCardRef}>
            <div className="founder-portrait-outer-ring">
              {/* Botanical Leaf Tendril on Frame */}
              <div className="founder-frame-leaf-accent" aria-hidden="true">
                <svg viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 40 C 15 25, 25 15, 40 5" stroke="#4f7f3a" strokeWidth="2" strokeLinecap="round" />
                  <path d="M22 24 C 18 16, 28 14, 30 22 Z" fill="#7fa868" />
                  <circle cx="39" cy="6" r="3.5" fill="#fcd34d" stroke="#163624" strokeWidth="0.8" />
                </svg>
              </div>

              <div className="founder-portrait-frame">
                <div className="founder-image-aspect">
                  <img
                    ref={imageRef}
                    alt="Sri Uppada Kumaraswamy, Master Horticulturist and Founder holding a blooming Jasmine sapling"
                    className="founder-portrait-img"
                    src="/sabsn-founder.webp"
                    loading="lazy"
                  />
                  <div className="founder-image-seal">
                    <Award size={18} />
                    <span>Est. 1980s</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="founder-caption">
              <span className="founder-tag">Kadiam Heritage Master</span>
              <p className="founder-subtext">35+ Years Horticultural Stewardship</p>
            </div>

            {/* Quick Botanical Badges */}
            <div className="founder-badges-row">
              <div className="founder-mini-badge">
                <Sprout size={13} className="founder-mini-badge-icon" />
                <span>Sapling Vigor Certified</span>
              </div>
              <div className="founder-mini-badge">
                <Trees size={13} className="founder-mini-badge-icon" />
                <span>Generational Soil Knowledge</span>
              </div>
            </div>
          </div>

          {/* Founder Narrative & Quote */}
          <div className="founder-narrative-col" ref={contentRef}>
            <div className="founder-quote-block">
              <div className="founder-quote-badge">
                <Quote size={22} className="founder-quote-icon-svg" />
              </div>
              <blockquote className="founder-quote-text">
                “Every sapling that leaves our soil carries the quiet patience of true horticulture.”
              </blockquote>
            </div>

            <div className="founder-prose">
              <p>
                Rooted in Kadiam’s generational agricultural ethos, Sri Uppada Kumaraswamy has devoted over three decades to the art of plant propagation. Under his discerning eye, SABSN has transformed from a revered local botanical nursery into an authoritative national destination for rare specimens, monumental avenues, and architectural flora.
              </p>
              <div className="founder-quote-card">
                <span className="founder-quote-card-leaf" aria-hidden="true">🌿</span>
                <p className="founder-prose-secondary">
                  “We do not merely supply foliage; we ensure that the genetic vigor, the root architecture, and the spirit of the plant flourish in its final home, whether that is a private sanctuary in Bengaluru or an estate in the Himalayan foothills.”
                </p>
              </div>
            </div>

            {/* Key Horticultural Milestones */}
            <div className="founder-milestones-grid">
              {milestones.map((m, idx) => (
                <div key={idx} className="founder-milestone-item">
                  <span className="founder-milestone-val">{m.value}</span>
                  <strong className="founder-milestone-lbl">{m.label}</strong>
                  <span className="founder-milestone-sub">{m.sub}</span>
                </div>
              ))}
            </div>

            {/* Signature & Assurance */}
            <div className="founder-footer-block">
              <div className="founder-signature-block">
                <div className="founder-signature-line" />
                <div className="founder-signature-details">
                  <p className="founder-name">Sri Uppada Kumaraswamy</p>
                  <p className="founder-title">Master Horticulturist &amp; Nursery Founder</p>
                </div>
              </div>
              
              <div className="founder-trust-pill">
                <CheckCircle2 size={16} />
                <span>Direct Farmer Cultivation</span>
              </div>
            </div>

            {/* Botanical Vine Flourish */}
            <div className="founder-ornament-wrap">
              <VineOrnament className="founder-vine-divider" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
