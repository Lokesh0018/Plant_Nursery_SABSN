import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Menu, X } from 'lucide-react';
import './Navbar.css';
import { subscribeScroll } from '../lib/scrollStore';
import { products } from '../data/products';
import { pots } from '../data/pots';

// Section ids on the home page; from any other page a link reloads home and scrolls there
function goToSection(page, id) {
  if (page === 'home') {
    if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.location.href = id === 'home' ? '/' : `/?section=${id}`;
  }
}

export default function Navbar({ page = 'home' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  // One theme throughout: forest glass with cream text, matching the hero, scrollbar and WhatsApp button
  const light = true;
  const darkGreen = '#f4ecd9';
  const textMuted = 'rgba(244, 236, 217, 0.78)';

  // on the home page the active item follows the scroll; other pages light up their own item
  const [activeSection, setActiveSection] = useState(page === 'home' ? 'home' : page);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = React.useRef(null);
  const searchInputRef = React.useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const handleScroll = ({ y, vh, max }) => {
      setIsScrolled(y > 30);
      // progress hairline along the bar's bottom edge
      document.documentElement.style.setProperty('--nav-progress', `${max > 0 ? (y / max) * 100 : 0}%`);
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

  return (
    <>
    <nav className={`navbar-container ${isScrolled ? 'scrolled' : ''} on-dark ${isSearchOpen ? 'search-open' : ''}`}>

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
        <img
          src="/logo/logo-256.webp"
          alt="Sri Ayyappa Bala Sai Nursery logo"
          width="44"
          height="44"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#f8f6ee',
            boxShadow: '0 0 0 2px rgba(244, 236, 217, 0.35), 0 6px 16px rgba(0, 0, 0, 0.35)',
            transition: 'box-shadow 0.3s ease',
            flex: 'none',
          }}
        />
        <div className="nav-brand-text" style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: darkGreen,
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            SABSN
          </span>
          <span style={{
            fontSize: '0.45rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: textMuted,
            fontWeight: '600',
            marginTop: '3px'
          }}>
            Sri Ayyappa Bala Sai Nursery
          </span>
        </div>
      </a>

      {/* Center Nav Links */}
      <ul ref={navRef} className={`nav-links ${isMobileOpen ? 'mobile-open' : ''}`}>

        {/* Sliding Indicator Dot */}
        <div className="nav-indicator" style={{
          position: 'absolute',
          bottom: '-7px',
          height: '4px',
          backgroundColor: darkGreen,
          borderRadius: '50%',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: 'none',
          ...indicatorStyle
        }} />

        {['Home', 'About', 'Plants', 'Services', 'Pots', 'Gallery'].map((item) => {
          const isActive = activeSection === item.toLowerCase();
          return (
            <li
              key={item}
              className={isActive ? 'active-nav-item' : ''}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                fontWeight: isActive ? '600' : '500',
                color: isActive && !isMobileOpen ? darkGreen : (isMobileOpen ? '#fff' : textMuted),
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => { if(!isActive && !isMobileOpen) e.currentTarget.style.color = darkGreen }}
              onMouseLeave={(e) => { if(!isActive && !isMobileOpen) e.currentTarget.style.color = textMuted }}
              onClick={() => {
                setIsMobileOpen(false);
                setActiveSection(item.toLowerCase());
                // Plants and Gallery are their own pages (/plants, /gallery)
                const own = { Plants: 'plants', Gallery: 'gallery' }[item];
                if (own) {
                  if (page === own) window.scrollTo({ top: 0, behavior: 'smooth' });
                  else window.location.href = `/${own}`;
                } else {
                  goToSection(page, {
                    Home: 'home', Pots: 'pots-collection', About: 'about', Services: 'services',
                  }[item]);
                }
              }}
            >
              <span>{item}</span>
            </li>
          );
        })}
      </ul>

      {/* Right Controls */}
      <div className="nav-right">
        {/* Animated Search Bar Wrapper */}
        <div style={{ position: 'relative', width: '27px', height: '27px', display: 'flex', alignItems: 'center' }}>
          <div className={`nav-search ${isSearchOpen ? 'open' : ''}`} style={{
            position: 'absolute',
            right: 0,
            display: 'flex',
            alignItems: 'center',
            background: isSearchOpen ? 'rgba(244, 236, 217, 0.12)' : 'transparent',
            borderRadius: '100px',
            padding: isSearchOpen ? '0.4rem 0.8rem' : '4px',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            width: isSearchOpen ? (window.innerWidth <= 900 ? '130px' : '180px') : '27px',
            overflow: 'hidden'
          }}>
            <button style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: darkGreen,
              display: 'flex',
              alignItems: 'center',
              padding: 0,
              minWidth: '19px'
            }}
            aria-label="Search"
            onClick={() => {
              if (!isSearchOpen) {
                setIsSearchOpen(true);
                setTimeout(() => searchInputRef.current?.focus(), 100);
              }
            }}
            >
              <Search size={19} strokeWidth={1.8} />
            </button>

            <input
              ref={searchInputRef}
              type="text"
              placeholder="Find plants..."
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: isSearchOpen ? '100%' : '0',
                opacity: isSearchOpen ? 1 : 0,
                paddingLeft: isSearchOpen ? '0.6rem' : '0',
                color: darkGreen,
                fontSize: '0.85rem',
                fontWeight: '500',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim() !== '' && page === 'plants') {
                  // the plants page filters its own grid
                  window.dispatchEvent(new CustomEvent('plants-search', { detail: e.target.value.trim() }));
                  setIsSearchOpen(false);
                  e.target.blur();
                  e.target.value = '';
                } else if (e.key === 'Enter' && e.target.value.trim() !== '') {
                  const query = e.target.value.toLowerCase().trim();
                  const allItems = [...products, ...pots];

                  // Try to find exact match first, then partial match
                  const match = allItems.find(item => item.name.toLowerCase() === query)
                    || allItems.find(item => item.name.toLowerCase().includes(query));

                  if (match) {
                    const el = document.getElementById(`product-${match.id}`);
                    if (el) {
                      // Adjust scroll position slightly higher for navbar
                      const y = el.getBoundingClientRect().top + window.scrollY - 100;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                      setIsSearchOpen(false);
                      e.target.blur();
                      e.target.value = '';
                    }
                  }
                }
              }}
              onBlur={(e) => {
                if (e.target.value === '') {
                  setIsSearchOpen(false);
                }
              }}
            />
          </div>
        </div>

        <button className="shop-now-btn" style={{
          backgroundColor: darkGreen,
          color: light ? '#163624' : '#ffffff',
          padding: '0.65rem 1.3rem',
          borderRadius: '100px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(22, 54, 36, 0.15)',
          border: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.opacity = '0.94';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.opacity = '1';
        }}
        onClick={() => goToSection(page, 'contact')}>
          <span>Contact</span>
          <ArrowRight size={14} />
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn"
          style={{ color: isMobileOpen ? '#163624' : darkGreen }}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>
    </nav>
    </>
  );
}
