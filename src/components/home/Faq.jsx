import { useState } from 'react';
import { Plus, MessageCircle, Phone, Leaf } from 'lucide-react';
import VineOrnament from '../shared/VineOrnament';
import { FAQS } from '../../data/faqs';
import './Faq.css';

const WA_LINK = `https://wa.me/919849936169?text=${encodeURIComponent('Hello SABSN, I have a question about your plants.')}`;

// an answer that opens with "Yes." shows that word as the short answer, ahead of the detail
function Answer({ text }) {
  const yes = text.startsWith('Yes. ');
  if (!yes) return <p>{text}</p>;
  return <p><strong className="faq-yes">Yes.</strong> {text.slice(5)}</p>;
}

/*
 * Home-page FAQ. Built for answer engines as much as for people: every question is a real <h3>, every
 * answer sits in the page (native <details>, so a closed answer is still in the markup), and the same
 * questions are published as FAQPage JSON-LD in index.html (see src/data/faqs.js).
 * Left: a short intro and the ways to ask directly. Right: the questions, the first one open.
 * A vine divider above (App.jsx) brings the gallery's ivory into this section's light sage, which
 * eases back to ivory at the bottom for the contact divider.
 */
// `items`, `title`, `lede` and `id` let the location pages reuse the same accordion with their own questions
export default function Faq({ items = FAQS, id = 'faq', title = <>Questions, <em>answered.</em></>, lede = 'Plants, landscaping, delivery and visits: quick answers to what customers in Rajahmundry and Visakhapatnam ask us most.' }) {
  const [open, setOpen] = useState(0);

  return (
    <section id={id} className="faq" aria-labelledby={`${id}-title`}>
      {/* a large outline leaf, barely there, as on the page headers */}
      <Leaf className="faq-watermark" strokeWidth={0.6} aria-hidden="true" />

      <div className="faq-intro">
        <p className="faq-kicker">FAQ</p>
        <h2 id={`${id}-title`}>{title}</h2>
        <VineOrnament />
        <p className="faq-lede">{lede}</p>
        <p className="faq-count"><strong>{items.length}</strong> questions answered below</p>
        <div className="faq-ask">
          <span className="faq-ask-icon" aria-hidden="true"><MessageCircle size={20} strokeWidth={2} /></span>
          <p className="faq-ask-title">Still have a question?</p>
          <p className="faq-ask-text">Ask the nursery directly about plants, sizes, prices or delivery.</p>
          <div className="faq-ask-actions">
            <a className="faq-btn" href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} strokeWidth={2.2} aria-hidden="true" /> Ask on WhatsApp
            </a>
            <a className="faq-btn faq-btn--ghost" href="tel:+919849936169">
              <Phone size={16} strokeWidth={2.2} aria-hidden="true" /> +91 98499 36169
            </a>
          </div>
        </div>
      </div>

      <div className="faq-list">
        {items.map(({ q, a }, i) => (
          <details
            key={q}
            className="faq-item"
            open={open === i}
            onToggle={(e) => {
              // one answer open at a time; closing the open one leaves all closed
              if (e.currentTarget.open) setOpen(i);
              else if (open === i) setOpen(-1);
            }}
          >
            <summary>
              <span className="faq-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="faq-q">{q}</h3>
              <span className="faq-icon" aria-hidden="true"><Plus size={18} strokeWidth={2.2} /></span>
            </summary>
            <div className="faq-a">
              <Answer text={a} />
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
