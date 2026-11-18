import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const NUMBER = '919849936169';
const DISPLAY = '+91 98499 36169';
const MESSAGE = 'Hello SABSN, I’d like to enquire about your plants.';

/*
 * Fixed WhatsApp enquiry: collapsed to a round icon with a live dot, expands to a labelled pill on hover / focus.
 * It tucks itself away while any other WhatsApp link is on screen (a hero's "Chat on WhatsApp", the contact
 * panel, the footer), so it never covers content right where the page already offers the same action.
 */
function useOtherWhatsAppLinkInView() {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const visible = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setInView(visible.size > 0);
    }, { threshold: 0.5 });
    const watched = new WeakSet();
    const scan = () => {
      document.querySelectorAll('a[href*="wa.me"]:not(.wa-fab)').forEach((a) => {
        if (!watched.has(a)) { watched.add(a); io.observe(a); }
      });
    };
    scan();
    // lower sections arrive later (lazy chunks, progressive catalogue), so pick up their links as they mount
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (!pending) pending = requestAnimationFrame(() => { pending = 0; scan(); });
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); cancelAnimationFrame(pending); };
  }, []);
  return inView;
}

export default function WhatsAppButton() {
  const tucked = useOtherWhatsAppLinkInView();
  return (
    <a
      className={`wa-fab${tucked ? ' is-tucked' : ''}`}
      href={`https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with SABSN on WhatsApp, ${DISPLAY}`}
      aria-hidden={tucked || undefined}
      tabIndex={tucked ? -1 : undefined}
    >
      <span className="wa-fab-dot" aria-hidden="true" />
      <span className="wa-fab-icon" aria-hidden="true">
        <MessageCircle size={26} strokeWidth={2} />
      </span>
      <span className="wa-fab-text">
        <strong>Chat on WhatsApp</strong>
        <small>{DISPLAY}</small>
      </span>
    </a>
  );
}
