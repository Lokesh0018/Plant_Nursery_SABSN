import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Footer.css';

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Staggered reveal for columns
      gsap.fromTo('.footer-reveal', 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          }
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="premium-footer">
      <div className="footer-bg-images">
        <img src="/leaves/Aralia-Photoroom.webp" alt="" className="footer-bg-img aralia" />
        <img src="/pots-green.webp" alt="" className="footer-bg-img pots" />
        <img src="/Small accent succulent.webp" alt="" className="footer-bg-img succulent" />
      </div>
      <div className="premium-footer-container">
        
        <div className="footer-top-grid footer-reveal">
          <div className="footer-brand-col">
            <div className="footer-brand-row">
              <img src="/logo/logo-256.webp" alt="Sri Ayyappa Bala Sai Nursery logo" className="footer-brand-logo" width="64" height="64" />
              <h3 className="footer-brand-name">SABSN</h3>
            </div>
            <p className="footer-brand-desc">
              Sri Ayyappa Bala Sai Nursery — hybrid flowering plants, fruit saplings, ornamental, revenue and lawn plants, grown with care.
            </p>
          </div>
          
          <div className="footer-links-col">
            <h4 className="footer-col-header">Shop</h4>
            <a href="#collection" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}>All Plants</a>
            <a href="#collection" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' }); }}>Collections</a>
            <a href="#pots" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('pots')?.scrollIntoView({ behavior: 'smooth' }); }}>Planters</a>
            <a href="#care" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('care')?.scrollIntoView({ behavior: 'smooth' }); }}>Care Tools</a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-header">About</h4>
            <a href="#about" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>Our Story</a>
            <a href="#about" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}>Journal</a>
            <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Careers</a>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-header">Support</h4>
            <a href="#care" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('care')?.scrollIntoView({ behavior: 'smooth' }); }}>Plant Care</a>
            <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>FAQ</a>
            <a href="#contact" className="footer-link" onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>Contact Us</a>
          </div>
        </div>

        <div className="footer-divider footer-reveal" />

        <div className="footer-bottom footer-reveal">
          <p className="footer-copyright">&copy; {new Date().getFullYear()} Sri Ayyappa Bala Sai Nursery. All rights reserved.</p>

          <div className="footer-socials">
            <a href="https://wa.me/919849936169" target="_blank" rel="noopener noreferrer" className="social-link">WhatsApp</a>
            <a href="tel:+919849936169" className="social-link">+91 98499 36169</a>
            <a href="mailto:uppadakumaraswamy@gmail.com" className="social-link">uppadakumaraswamy@gmail.com</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
