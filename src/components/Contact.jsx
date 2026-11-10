import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Mail, ShieldCheck, Leaf, Sprout } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success'
  const sectionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance animation
      gsap.fromTo('.contact-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        }
      );

      // Handwriting accent animation (draws in)
      gsap.fromTo('.contact-handwriting',
        { opacity: 0, rotation: -10, scale: 0.8 },
        {
          opacity: 1, rotation: -5, scale: 1,
          duration: 1.5,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic button on mouse move
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;

    // Magnetic Button logic
    if (isHovered && buttonRef.current) {
      const btnRect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = btnRect.left + btnRect.width / 2;
      const btnCenterY = btnRect.top + btnRect.height / 2;

      const distX = (e.clientX - btnCenterX) * 0.3;
      const distY = (e.clientY - btnCenterY) * 0.3;

      gsap.to(buttonRef.current, {
        x: distX,
        y: distY,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && status === 'idle') {
      setStatus('submitting');
      // Simulate network request
      setTimeout(() => {
        setStatus('success');
        setEmail('');
        // Reset after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      }, 800);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-premium-section"
      onMouseMove={handleMouseMove}
    >
      {/* Editorial Watermark & Ambient Atmosphere */}
      <div className="contact-watermark" aria-hidden="true">JOURNAL</div>
      <div className="contact-ambient-orb contact-ambient-orb--left" aria-hidden="true" />
      <div className="contact-ambient-orb contact-ambient-orb--right" aria-hidden="true" />

      {/* Decorative Botanical Corner Leaves, matching the other sections */}
      <div className="contact-corner-leaf contact-corner-leaf-top" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>
      <div className="contact-corner-leaf contact-corner-leaf-bottom" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0C40 20 80 60 120 120C60 100 20 60 0 0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="contact-premium-container">

        <div className="contact-text-col">
          <div className="contact-handwriting">Stay rooted.</div>
          <span className="contact-eyebrow contact-reveal">
            <Mail size={14} className="contact-eyebrow-icon" />
            The Nursery Journal
          </span>
          <h2 className="contact-title contact-reveal">Let's grow together.</h2>
          <p className="contact-subtitle contact-reveal">
            Subscribe to our journal for botanical insights, expert care guides, and exclusive early access to new collections.
          </p>
          <ul className="contact-perks contact-reveal">
            <li><Leaf size={14} /> Seasonal care guides</li>
            <li><Sprout size={14} /> First look at new stock</li>
            <li><ShieldCheck size={14} /> No spam, unsubscribe anytime</li>
          </ul>
        </div>

        <div className="contact-form-col contact-reveal">
          <div className="form-glass-wrapper">
            <form className="premium-form" onSubmit={handleSubmit}>
              <div className="premium-input-group">
                <label htmlFor="contact-email" className="contact-sr-only">Email address</label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="premium-input"
                />
                <button
                  ref={buttonRef}
                  type="submit"
                  className={`premium-submit ${status !== 'idle' ? status : ''}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={handleMouseLeave}
                  disabled={status !== 'idle'}
                >
                  <span className="submit-text">
                    {status === 'idle' ? 'Subscribe' : status === 'submitting' ? 'Sending...' : 'Subscribed!'}
                  </span>
                  <span className={`submit-icon-wrapper ${isHovered && status === 'idle' ? 'hovered' : ''}`}>
                    {status === 'success' ? (
                      <Check size={18} strokeWidth={2} className="success-icon" />
                    ) : (
                      <ArrowRight size={18} strokeWidth={1.5} />
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
          <p className="contact-form-note" aria-live="polite">
            {status === 'success'
              ? 'Welcome to the journal. Your first issue is on its way.'
              : 'One short letter a month from the Kadiam nursery floor.'}
          </p>
        </div>

      </div>
    </section>
  );
}
