import React, { useEffect, useRef } from 'react';
import { ArrowRight, Leaf, Heart, Truck, Sparkles, Star } from 'lucide-react';
import { products } from '../data/products';
import gsap from 'gsap';
import './LandingHero.css';

export default function LandingHero() {
  const darkGreen = '#163624';

  const heroRef = useRef(null);
  const circleRef = useRef(null);
  const badgeRef = useRef(null);
  const monsteraRef = useRef(null);
  const pothosRef = useRef(null);
  const snakePlantRef = useRef(null);
  const succulentRef = useRef(null);
  const hangLeftRef = useRef(null);
  const hangRightRef = useRef(null);
  const leavesRef = useRef(null);
  const sunlightRef = useRef(null);
  const particlesRef = useRef(null);
  const decorativeLeavesRef = useRef(null);
  const hangLightRef = useRef(null);
  const hangLightRef2 = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(hangLeftRef.current, { scaleX: -1 });

      const onMouseMove = (e) => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768) {
          return;
        }

        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 2;
        const y = (clientY / window.innerHeight - 0.5) * 2;

        // Background Sage Circle (Soft Counter-Parallax)
        gsap.to(circleRef.current, {
          x: -x * 12,
          y: -y * 8,
          duration: 1.2,
          ease: 'power2.out'
        });

        // Layer 2: Main Monstera (Central Elevated Focal Point)
        gsap.to(monsteraRef.current, {
          x: x * 14,
          y: y * 9,
          rotateY: x * 3,
          rotateX: -y * 2,
          transformPerspective: 1000,
          duration: 0.9,
          ease: 'power2.out'
        });

        // Layer 3: Right Plant (Ground Level Right)
        gsap.to(snakePlantRef.current, {
          x: x * 20,
          y: y * 13,
          rotateZ: -x * 1.2,
          duration: 0.85,
          ease: 'power2.out'
        });

        // Layer 4: Golden Pothos (Foreground Left)
        gsap.to(pothosRef.current, {
          x: x * 24,
          y: y * 16,
          rotateZ: x * 1.2,
          duration: 0.8,
          ease: 'power2.out'
        });

        // Layer 5: Small Succulent (Foreground Center/Right)
        gsap.to(succulentRef.current, {
          x: x * 28,
          y: y * 18,
          rotateZ: -x * 2,
          duration: 0.75,
          ease: 'power2.out'
        });

        // Handwritten Badge
        gsap.to(badgeRef.current, {
          x: x * 10,
          y: y * 12,
          duration: 1,
          ease: 'power2.out'
        });

        // Hanging Plants (do not animate y to prevent conflicts with scroll parallax)
        gsap.to(hangLeftRef.current, { rotateZ: x * 1.5, x: x * 2, scaleX: -1, duration: 1.5, ease: 'power2.out' });
        gsap.to(hangRightRef.current, { rotateZ: x * 2, x: x * 3, duration: 1.4, ease: 'power2.out' });
        // Sunlight & Particles (slow, background)
        gsap.to(sunlightRef.current, { x: x * 5, y: y * 5, duration: 2, ease: 'power2.out' });
        gsap.to(particlesRef.current, { x: x * 8, y: y * 8, duration: 2.5, ease: 'power2.out' });


        // Floating Leaves
        gsap.to(leavesRef.current, { x: x * 30, y: y * 25, rotateZ: x * 5, duration: 1, ease: 'power2.out' });
        
        // Bottom Right Decorative Leaves
        gsap.to(decorativeLeavesRef.current, { x: x * 20, y: y * 15, rotateZ: -x * 2, duration: 1.2, ease: 'power2.out' });
      };

      const onMouseLeave = () => {
        gsap.to([
          circleRef.current, monsteraRef.current, snakePlantRef.current, 
          pothosRef.current, succulentRef.current, badgeRef.current, 
          leavesRef.current, decorativeLeavesRef.current,
          sunlightRef.current, particlesRef.current
        ], {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          duration: 1.5,
          ease: 'power3.out'
        });
        
        // Hanging plants reset (without y)
        gsap.to(hangLeftRef.current, {
          x: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          scaleX: -1,
          duration: 1.5,
          ease: 'power3.out'
        });
        gsap.to(hangRightRef.current, {
          x: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0,
          duration: 1.5,
          ease: 'power3.out'
        });
      };

      const onScroll = () => {
        const scrollY = window.scrollY;
        gsap.to(heroRef.current, {
          backgroundPosition: `50% ${scrollY * 0.2}px`,
          duration: 0.5,
          ease: 'power1.out'
        });
        gsap.to(monsteraRef.current, { y: scrollY * -0.15, duration: 0.5 });
        gsap.to(snakePlantRef.current, { y: scrollY * -0.25, duration: 0.5 });
        gsap.to(pothosRef.current, { y: scrollY * -0.3, duration: 0.5 });
        gsap.to(succulentRef.current, { y: scrollY * -0.35, duration: 0.5 });
        
        // Let the hanging plants drop down just enough to clear the navbar, then stay fixed
        const additionalDrop = Math.min(scrollY * 0.3, 100);
        gsap.to(hangLeftRef.current, { y: scrollY + additionalDrop, duration: 0.5 });
        gsap.to(hangRightRef.current, { y: scrollY + additionalDrop, duration: 0.5 });
        
        gsap.to(leavesRef.current, { y: scrollY * -0.4, duration: 0.5 });
        gsap.to(sunlightRef.current, { y: scrollY * -0.05, duration: 0.5 });
        gsap.to(particlesRef.current, { y: scrollY * -0.1, duration: 0.5 });
      };

      // Gentle floating animation (using yPercent to avoid conflict with mouse/scroll y)
      gsap.to(monsteraRef.current, { yPercent: 2, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(snakePlantRef.current, { yPercent: 1.5, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 });
      gsap.to(pothosRef.current, { yPercent: 2.5, duration: 3.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1 });
      gsap.to(succulentRef.current, { yPercent: 1.5, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2 });
      gsap.to(leavesRef.current, { yPercent: 3, rotateZ: '+=3', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.7 });

      // Subtle swaying for hanging elements
      gsap.to(hangLeftRef.current, { rotateZ: '+=1', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(hangRightRef.current, { rotateZ: '+=1.2', duration: 4.5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.5 });
      gsap.to(hangLightRef.current, { rotateZ: '+=0.8', duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.2 });
      gsap.to(hangLightRef2.current, { rotateZ: '-=1.1', duration: 4.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.8 });

      if (heroRef.current) {
        heroRef.current.addEventListener('mousemove', onMouseMove);
        heroRef.current.addEventListener('mouseleave', onMouseLeave);
      }
      window.addEventListener('scroll', onScroll);

      return () => {
        if (heroRef.current) {
          heroRef.current.removeEventListener('mousemove', onMouseMove);
          heroRef.current.removeEventListener('mouseleave', onMouseLeave);
        }
        window.removeEventListener('scroll', onScroll);
      };
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      {/* Hanging Elements */ }
      <img ref={hangLeftRef} src="/hang.webp" className="hero-hang hero-hang-left" alt="" aria-hidden="true" />
      <img ref={hangRightRef} src="/hang.webp" className="hero-hang hero-hang-right" alt="" aria-hidden="true" />
      <img ref={hangLightRef} src="/hang-light.webp" className="hero-hang-light" alt="" aria-hidden="true" />
      <img ref={hangLightRef2} src="/hang-light.webp" className="hero-hang-light-2" alt="" aria-hidden="true" />

      {/* Main Hero Row: Left (38%) & Right (62%) */}
      <div className="hero-main-row">
        {/* Left Column - Typography & CTA (38%) */}
        <div className="hero-left-column">
          {/* Eyebrow / Tagline */}
          <div className="hero-eyebrow">
            <span>INDOOR PLANTS</span>
            <span className="hero-eyebrow-dot">•</span>
            <span>HOME DECOR</span>
            <span className="hero-eyebrow-dot">•</span>
            <span>BETTER LIVING</span>
          </div>
          
          {/* Main Title */}
          <h1 className="hero-title">
            Greener<br />
            Spaces<br />
            Happier You
          </h1>
          
          {/* Subtitle description */}
          <p className="hero-subtitle">
            Bring nature home with our handpicked indoor plants, beautiful pots and easy care essentials — because a little green goes a long way.
          </p>
          
          {/* CTA & Trust/Social Proof */}
          <div>
            <button 
              className="hero-cta-button"
              onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>Explore Collection</span>
              <ArrowRight size={16} className="cta-arrow" />
            </button>

            {/* Social Proof Rating */}
            <div className="hero-rating-container">
              <div className="hero-rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} fill="#e5a93b" strokeWidth={0} />
                ))}
              </div>
              <span className="hero-rating-score">
                4.9 / 5.0
              </span>
              <span className="hero-rating-text">
                from 2,400+ plant lovers
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Plant Stage Composition & Floating Cards (62%) */}
        <div className="hero-right-column">
          {/* Sage Green Circular Backdrop behind the center plant composition */}
          <div ref={circleRef} className="hero-sage-circle" />
          
          {/* Sunlight & Particles */}
          <div ref={sunlightRef} className="hero-sunlight" />
          <div ref={particlesRef} className="hero-particles">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`hero-particle particle-${i + 1}`} />
            ))}
          </div>
          
          {/* Reconstructed Multi-Layer Botanical Composition */}
          <div className="hero-plant-composition">
            {/* 2. Main Monstera (Centered on top of the Pedestal) */}
            <img 
              ref={monsteraRef}
              src="/hero-main/Main Monstera.webp"
              alt="Monstera Deliciosa"
              className="hero-plant-monstera"
            />

            {/* 3. Right Plant (Ground Level Right) */}
            <img 
              ref={snakePlantRef}
              src="/hero-main/Snake plant.webp"
              alt="Indoor Plant"
              className="hero-plant-snake"
            />

            {/* 4. Golden Pothos (Foreground Left on the ground) */}
            <img 
              ref={pothosRef}
              src="/hero-main/Pothos plant.webp"
              alt="Golden Pothos"
              className="hero-plant-pothos"
            />
            
            {/* 5. Small Accent Succulent */}
            <img 
              ref={succulentRef}
              src="/Small accent succulent.webp"
              alt="Small Succulent"
              className="hero-plant-succulent"
            />
          </div>

          {/* Whimsical Handwritten Tag & Curved Arrow ("Good Vibes Grow Here ♡") */}
          <div ref={badgeRef} className="hero-badge">
            <div className="hero-badge-text">
              Good<br/>
              Vibes<br/>
              Grow Here ♡
            </div>
            {/* Custom Curved Hand-drawn SVG Arrow pointing down-left */}
            <svg width="32" height="26" viewBox="0 0 45 40" fill="none" stroke={darkGreen} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="hero-badge-svg">
              <path d="M 38 6 C 30 22, 22 28, 8 30" />
              <path d="M 14 24 L 7 30 L 15 35" />
            </svg>
          </div>

          <div className="hero-floating-cards-wrapper">
            {/* Right Floating Card 1: Low Maintenance Plants */}
            <div 
              className="hero-floating-card hero-floating-card-1"
              style={{ cursor: 'pointer' }}
              onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {/* Background Blob/Circle behind the image */}
              <div className="hero-card-blob hero-card-blob-1" />

              <div className="hero-card-content">
                {/* Left Column: Text & Button */}
                <div className="hero-card-left">
                  <div>
                    <h3 className="hero-card-title hero-card-title-1">
                      Low<br/>Maintenance<br/>Plants
                    </h3>
                    <p className="hero-card-desc hero-card-desc-1">
                      Perfect for<br/>busy lives.
                    </p>
                  </div>

                  <div className="hero-card-btn hero-card-btn-1">
                    <ArrowRight size={13} strokeWidth={2} />
                  </div>
                </div>

                {/* Right Column: Image */}
                <div className="hero-card-right">
                  <img 
                    className="hero-card-img hero-card-img-1"
                    src={products[4]?.image || "/plants/plant5-Photoroom.webp"} 
                    alt="Low Maintenance Plant"
                  />
                </div>
              </div>
            </div>

            {/* Right Floating Card 2: Stylish Plant Pots */}
            <div className="hero-floating-card hero-floating-card-2"
                 onClick={() => document.getElementById('pots')?.scrollIntoView({ behavior: 'smooth' })}
                 style={{ cursor: 'pointer' }}
            >
              {/* Background Blob/Circle behind the image */}
              <div className="hero-card-blob hero-card-blob-2" />

              <div className="hero-card-content">
                {/* Left Column: Text & Button */}
                <div className="hero-card-left">
                  <div>
                    <h3 className="hero-card-title hero-card-title-2">
                      Stylish<br/>Plant Pots
                    </h3>
                    <p className="hero-card-desc hero-card-desc-2">
                      Modern designs<br/>for every space.
                    </p>
                  </div>

                  <div className="hero-card-btn hero-card-btn-2">
                    <ArrowRight size={13} strokeWidth={2} />
                  </div>
                </div>

                {/* Right Column: Image */}
                <div className="hero-card-right">
                  <img 
                    className="hero-card-img hero-card-img-2"
                    src="/pots.webp" 
                    alt="Stylish Plant Pot"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Features Row */}
      <div className="hero-features-row">
        {[
          { icon: Leaf, title: "Fresh &", subtitle: "Healthy Plants" },
          { icon: Heart, title: "Easy Care", subtitle: "Guide" },
          { icon: Truck, title: "Fast & Safe", subtitle: "Delivery" },
          { icon: Sparkles, title: "Sustainable", subtitle: "Choices" },
        ].map((feature, i) => (
          <div key={i} className="hero-feature-item">
            <div className="hero-feature-badge">
              <feature.icon size={17} strokeWidth={1.8} />
            </div>
            <div className="hero-feature-text-container">
              <div>{feature.title}</div>
              <div>{feature.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Right Decorative Section: Blob, Text & Foliage */}
      <div className="hero-bottom-decorative">
        {/* Organic Background Blob */}
        <div className="hero-decorative-blob" />

        {/* Handwritten text with curved underline */}
        <div className="hero-decorative-text-container">
          <div className="hero-decorative-text">
            Plants make<br />life better <span style={{fontSize: '1rem'}}>♡</span>
          </div>
          {/* Hand-drawn swoosh underline */}
          <svg width="130" height="15" viewBox="0 0 200 24" fill="none" className="hero-decorative-text-svg">
            <path d="M 5 20 Q 90 -4 195 10" stroke={darkGreen} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        {/* Botanical Leaves overlapping the right edge */}
        <img 
          ref={decorativeLeavesRef}
          src="/leaves/vecteezy_lush-green-tropical-foliage-arrangement-featuring-monstera_60578533.webp"
          alt="Fresh Botanical Foliage"
          className="hero-decorative-leaves"
        />
      </div>
    </section>
  );
}
