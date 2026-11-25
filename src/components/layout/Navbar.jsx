import React, { useState, useEffect } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import './Navbar.css';
import { subscribeScroll } from '../../lib/scrollStore';

// Section ids on the home page; from any other page a link reloads home and scrolls there
function goToSection(page, id) {
  if (page === 'home') {
    if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = id === 'home' ? '/' : `/?section=${id}`;
  }
}

// the menu: `key` matches the active-section names; every item but Home is its own page
const NAV_ITEMS = [
  { label: 'Home', key: 'home', href: '/' },
  { label: 'About', key: 'about', href: '/about/' },
  { label: 'Plants', key: 'plants', href: '/plants/' },
  { label: 'Services', key: 'services', href: '/services/' },
  { label: 'Pots', key: 'pots', href: '/pots/' },
  { label: 'Gallery', key: 'gallery', href: '/gallery/' },
];

export default function Navbar({ page = 'home' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  // One theme throughout: forest glass with cream text, matching the hero, scrollbar and WhatsApp button (see Navbar.css)

  // on the home page the active item follows the scroll; other pages light up their own item
  const [activeSection, setActiveSection] = useState(page === 'home' ? 'home' : page);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = React.useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const handleScroll = ({ y, vh, max }) => {
      setIsScrolled(y > 30);
      if (page !== 'home') return; // other pages keep their own item active

      // Active section = the last section whose top has passed the navbar line.
      // Measured against the same point for every section, so the highlight flips exactly
      // when a section's top reaches the bar, not at a different height for each one.
      // The reference point sits a third of the way down the viewport: a section becomes active
      // once it covers that point, which is robust to smooth-scroll easing landing a few pixels off.
      const line = Math.max(160, vh * 0.34);
      const order = [
        ['about', 'about'],
        ['collection', 'plants'],
        ['services', 'services'],
        ['pots-collection', 'pots'],
        ['gallery', 'gallery'],
        // the FAQ has no menu item: reaching it clears the highlight (Gallery no longer stays lit)
        ['faq', 'faq'],
        ['contact', 'contact'],
      ];
      let active = 'home';
      for (const [id, key] of order) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) active = key;
      }
      // at the very bottom of the page the last section is active even if its top never reaches the line
      if (y >= max - 2) active = 'contact';
      setActiveSection(active);
    };
    // The shared scroll store runs the one animation-frame loop for the whole app and only calls
    // back when the position actually changed (it also listens to scroll events for background tabs).
    return subscribeScroll(handleScroll);
  }, [page]);

  useEffect(() => {
    if (navRef.current && !isMobileOpen) {
      const activeItem = navRef.current.querySelector('.active-nav-item');
      if (activeItem) {
        setIndicatorStyle({
          left: activeItem.offsetLeft + (activeItem.offsetWidth / 2) - 2,
          width: 4,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    }
  }, [activeSection, isScrolled, isMobileOpen]);

  // While the mobile menu is open: lock page scroll, close on Escape, and close if the viewport grows to desktop
  useEffect(() => {
    if (!isMobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setIsMobileOpen(false); };
    const mq = window.matchMedia('(min-width: 901px)');
    const onMq = (e) => { if (e.matches) setIsMobileOpen(false); };
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [isMobileOpen]);

  // shared click behaviour for desktop and mobile links
  const handleNavClick = (e, key, href) => {
    e.preventDefault();
    setIsMobileOpen(false);
    setActiveSection(key);
    // About, Plants, Services, Pots and Gallery are their own pages; Home scrolls on the home page
    if (key !== 'home') {
      if (page === key) window.scrollTo({ top: 0, behavior: 'smooth' });
      else window.location.href = href;
    } else {
      goToSection(page, 'home');
    }
  };

  return (
    <>
    <nav className={`navbar-container ${isScrolled ? 'scrolled' : ''} on-dark`}>

      {/* Brand Logo: links back to the hero */}
      <a
        className="nav-brand"
        href={page === 'home' ? '#home' : '/'}
        aria-label={page === 'home' ? 'SABSN, back to top' : 'SABSN home'}
        onClick={(e) => {
          if (page !== 'home') return; // plain link back to the home page
          e.preventDefault();
          setIsMobileOpen?.(false);
          const hero = document.getElementById('home');
          if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
          else window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <img className="nav-logo" src="/images/brand/logo-256.webp" alt="Sri Ayyappa Bala Sai Nursery logo" width="44" height="44" />
        <div className="nav-brand-text">
          <div className="nav-brand-row">
            <span className="nav-brand-name">SABSN</span>
            <img className="nav-blessing" src="/images/brand/sai-baba.webp" alt="" width="34" height="32" decoding="async" />
          </div>
          <span className="nav-brand-sub">Sri Ayyappa Bala Sai Nursery</span>
        </div>
      </a>

      {/* Center Nav Links: real links, so they are reachable by keyboard and open in a new tab if asked */}
      <ul ref={navRef} className="nav-links">

        {/* Sliding Indicator Dot (position comes from the active item) */}
        <div className="nav-indicator" style={indicatorStyle} />

        {NAV_ITEMS.map(({ label, key, href }) => {
          const isActive = activeSection === key;
          return (
            <li key={label} className={isActive ? 'active-nav-item' : ''}>
              <a
                className="nav-link"
                href={href}
                aria-current={isActive && page === key ? 'page' : undefined}
                onClick={(e) => handleNavClick(e, key, href)}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Right Controls */}
      <div className="nav-right">
        <button
          type="button"
          className="shop-now-btn"
          // the contact page; already there, it scrolls back to the top
          aria-current={page === 'contact' ? 'page' : undefined}
          onClick={() => { if (page === 'contact') window.scrollTo({ top: 0, behavior: 'smooth' }); else window.location.href = '/contact/'; }}
        >
          <span>Contact</span>
          <ArrowRight size={14} />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className={`mobile-menu-btn${isMobileOpen ? ' is-open' : ''}`}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>
    </nav>

    {/* Mobile menu: rendered OUTSIDE the <nav>. The scrolled nav uses transform, backdrop-filter and
        contain: paint, which turn it into the containing block for fixed children and clip them to the
        capsule, so a menu nested inside it could only appear at the very top of the page. */}
    <div
      id="mobile-menu"
      className={`mobile-menu${isMobileOpen ? ' is-open' : ''}`}
      aria-hidden={!isMobileOpen}
      inert={!isMobileOpen}
    >
      <div className="mobile-menu-backdrop" onClick={() => setIsMobileOpen(false)} />
      <div className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Site menu">
        <p className="mobile-menu-eyebrow">Menu</p>
        <ul className="mobile-menu-list">
          {NAV_ITEMS.map(({ label, key, href }, i) => {
            const isActive = activeSection === key;
            return (
              <li key={label} style={{ '--i': i }}>
                <a
                  className={`mobile-menu-link${isActive ? ' is-active' : ''}`}
                  href={href}
                  aria-current={isActive && page === key ? 'page' : undefined}
                  onClick={(e) => handleNavClick(e, key, href)}
                >
                  <span className="mobile-menu-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mobile-menu-label">{label}</span>
                  <ArrowRight className="mobile-menu-arrow" size={18} strokeWidth={1.8} />
                </a>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="mobile-menu-cta"
          style={{ '--i': NAV_ITEMS.length }}
          onClick={() => {
            setIsMobileOpen(false);
            if (page === 'contact') window.scrollTo({ top: 0, behavior: 'smooth' });
            else window.location.href = '/contact/';
          }}
        >
          <span>Contact Us</span>
          <ArrowRight size={16} />
        </button>
        <p className="mobile-menu-foot">Sri Ayyappa Bala Sai Nursery</p>
      </div>
    </div>
    </>
  );
}
