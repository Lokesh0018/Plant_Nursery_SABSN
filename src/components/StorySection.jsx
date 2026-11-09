import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './StorySection.css';

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const imageContainerRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const organicRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Image Parallax
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: '15%',
        ease: 'none'
      });

      // Organic Shape Parallax (slower)
      gsap.to(organicRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: '25%',
        rotation: 15,
        ease: 'none'
      });

      // Content Entrance Animation
      
      // 1. Heading Mask Reveal
      gsap.fromTo('.story-heading-text', 
        { y: '120%' },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: 'power4.out'
        }
      );

      // 2. Paragraphs & Elements Fade In
      const otherContent = Array.from(contentRef.current.children).filter(el => !el.classList.contains('story-heading'));
      
      gsap.fromTo(otherContent, 
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2
        }
      );

      // Subtle Text Parallax
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: '-10%',
        ease: 'none'
      });

      // Image Wrapper Entrance
      gsap.fromTo(wrapperRef.current, 
        { y: 60, opacity: 0 },
        {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power2.out'
        }
      );

    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e) => {
    if (!wrapperRef.current || !imageContainerRef.current) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    
    gsap.to(imageContainerRef.current, {
      rotateY: x * 8,
      rotateX: -y * 8,
      ease: 'power2.out',
      duration: 0.6
    });
  };

  const handleMouseLeave = () => {
    if (!imageContainerRef.current) return;
    gsap.to(imageContainerRef.current, {
      rotateY: 0,
      rotateX: 0,
      ease: 'power3.out',
      duration: 1
    });
  };

  return (
    <section ref={containerRef} className="story-section" id="about">
      
      <div 
        className="story-image-wrapper" 
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="story-organic-shape" ref={organicRef} />
        
        <div className="story-image-container" ref={imageContainerRef}>
          <img 
            ref={imageRef}
            src="/nursery.webp" 
            alt="Botanical setup" 
            className="story-image"
          />
        </div>
        
        <div className="story-badge">
          Growing happiness, naturally.
        </div>
      </div>
      
      <div className="story-content" ref={contentRef}>
        <div className="story-eyebrow">
          <svg className="story-leaf-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="M12 22c5-3.5 8-8 8-13 0-4-3-7-8-7-5 0-8 3-8 7 0 5 3 9.5 8 13z" />
            <path d="M12 8c-2 1-3 3-3 5" />
          </svg>
          Our Story
        </div>
        <h2 className="story-heading">
          <span className="story-heading-line">
            <span className="story-heading-text">Bring nature</span>
          </span>
          <span className="story-heading-line">
            <span className="story-heading-text"><span className="story-italic">closer</span> to home.</span>
          </span>
        </h2>
        <p className="story-paragraph">
          Every plant in our collection is carefully selected from sustainable growers who share our commitment to quality. We believe that caring for plants should be a joyful experience, not a stressful one.
        </p>
        <p className="story-paragraph">
          That's why we don't just send you a plant—we provide the guidance, tools, and ongoing support you need to help your indoor garden thrive for years to come.
        </p>
        <a 
          href="#care" 
          className="story-link"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('care')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Discover Our Philosophy <span>&rarr;</span>
        </a>
      </div>
    </section>
  );
}
