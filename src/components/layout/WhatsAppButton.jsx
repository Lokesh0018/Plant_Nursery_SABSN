import React from 'react';
import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const NUMBER = '919849936169';
const DISPLAY = '+91 98499 36169';
const MESSAGE = 'Hello SABSN, I’d like to enquire about your plants.';

/* Fixed WhatsApp enquiry: collapsed to a round icon with a live dot, expands to a labelled pill on hover / focus */
export default function WhatsAppButton() {
  return (
    <a
      className="wa-fab"
      href={`https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with SABSN on WhatsApp, ${DISPLAY}`}
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
