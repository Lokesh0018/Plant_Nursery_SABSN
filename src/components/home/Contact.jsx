import React from 'react';
import { ArrowRight, MessageCircle, Phone, Clock, MapPin, Send } from 'lucide-react';
import './Contact.css';

const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I would like to know more about your plants and services.')}`;

/*
 * The home page's closing call to action: how to reach the nursery, with WhatsApp first (the quickest reply),
 * a direct call, and the full contact page. (It replaces a newsletter form that had no list behind it.)
 */
export default function Contact() {
  return (
    <section id="contact" className="contact-premium-section" aria-labelledby="contact-title">
      {/* Editorial Watermark & Ambient Atmosphere */}
      <div className="contact-watermark" aria-hidden="true">CONTACT</div>
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
            <Send size={14} className="contact-eyebrow-icon" aria-hidden="true" />
            Talk to the nursery
          </span>
          <h2 id="contact-title" className="contact-title contact-reveal">Let's grow together.</h2>
          <p className="contact-subtitle contact-reveal">
            Plants for your home, a landscape project or a bulk order: tell us what you have in mind and we will
            help you choose.
          </p>
          <ul className="contact-perks contact-reveal">
            <li><Clock size={14} aria-hidden="true" /> Open daily, 7 am – 6 pm</li>
            <li><MapPin size={14} aria-hidden="true" /> Kadiyam &amp; Visakhapatnam</li>
            <li><MessageCircle size={14} aria-hidden="true" /> Quickest reply on WhatsApp</li>
          </ul>
        </div>

        <div className="contact-form-col contact-reveal">
          <div className="form-glass-wrapper">
            <div className="contact-actions">
              <a className="premium-submit contact-action-main" href={WA_LINK} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
                <span className="submit-text">Chat on WhatsApp</span>
              </a>
              <a className="contact-action" href="tel:+919849936169">
                <Phone size={16} strokeWidth={2} aria-hidden="true" /> Call
              </a>
              <a className="contact-action" href="/contact/" aria-label="All contact options">
                All options <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="contact-form-note">+91 98499 36169 · +91 94903 78689 · uppadakumaraswamy@gmail.com</p>
        </div>

      </div>
    </section>
  );
}
