import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ArrowRight, Menu, X } from 'lucide-react';
import './Navbar.css';
import CartDrawer from './CartDrawer';
import { products } from '../data/products';
import { pots } from '../data/pots';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  // One theme throughout: forest glass with cream text, matching the hero, scrollbar and WhatsApp button
  const light = true;
  const darkGreen = '#f4ecd9';
  const textMuted = 'rgba(244, 236, 217, 0.78)';

  const [activeSection, setActiveSection] = useState('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };
  
  const updateQuantity = (id, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean);
    });
    setCartCount(c => Math.max(0, c + delta));
  };
  const navRef = React.useRef(null);
  const searchInputRef = React.useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const handleCartUpdate = (e) => {
      const newItem = e.detail?.item;
      const quantity = e.detail?.quantity || 1;
      if (newItem) {
        setCartItems(prev => {
          const existing = prev.find(item => item.id === newItem.id);
          if (existing) {
            return prev.map(item => item.id === newItem.id ? { ...item, quantity: item.quantity + quantity } : item);
          }
          return [...prev, { ...newItem, quantity }];
        });
      }
      setCartCount(c => c + quantity);
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 30);
      // progress hairline along the bar's bottom edge
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--nav-progress', `${max > 0 ? (y / max) * 100 : 0}%`);

      // Active section = the last section whose top has passed the navbar line.
      // Measured against the same point for every section, so the highlight flips exactly
      // when a section's top reaches the bar, not at a different height for each one.
      // The reference point sits a third of the way down the viewport: a section becomes active
      // once it covers that point, which is robust to smooth-scroll easing landing a few pixels off.
      const line = Math.max(160, window.innerHeight * 0.34);
      const order = [
        ['collection', 'plants'],
        ['pots-collection', 'pots'],
        ['about', 'about'],
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
    // Poll the scroll position each frame instead of relying on scroll events: with Lenis smooth
    // scrolling and programmatic jumps, events can be coalesced or arrive before layout settles.
    let last = -1;
    let raf = 0;
    const tick = () => {
      const y = window.scrollY;
      if (y !== last) { last = y; handleScroll(); }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // scroll events as well: animation frames pause in background tabs, events do not
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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
      
      {/* Brand Logo */}
      <div className="nav-brand">
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
      </div>

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

        {['Home', 'Plants', 'Pots', 'About', 'Gallery'].map((item) => {
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
                if (item === 'Plants') {
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'Pots') {
                  document.getElementById('pots-collection')?.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'About') {
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'Gallery') {
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                } else if (item === 'Home') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
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
                if (e.key === 'Enter' && e.target.value.trim() !== '') {
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

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <button className="cart-icon-target" style={{
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: darkGreen,
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }} aria-label="Cart"
          onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={19} strokeWidth={1.8} />
          </button>
          {cartCount > 0 && (
            <span className="cart-badge" style={{
              position: 'absolute',
              top: '-6px',
              right: '-8px',
              /* lime accent from the theme (progress line, chips) with forest text; cream rim lifts it off the dark bar */
              background: 'linear-gradient(180deg, #d7e59c, #c9d98a)',
              color: '#0d2a18',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.64rem',
              lineHeight: 1,
              minWidth: '18px',
              height: '18px',
              padding: '0 5px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              letterSpacing: '0.01em',
              boxShadow: '0 0 0 2px #0d2a18, 0 0 0 3px rgba(244, 236, 217, 0.35), 0 3px 8px rgba(0, 0, 0, 0.35)',
              zIndex: 2,
              pointerEvents: 'none'
            }}
            aria-live="polite" aria-label={`${cartCount} item${cartCount === 1 ? '' : 's'} in cart`}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
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
        onClick={() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }}>
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
    <CartDrawer 
      isOpen={isCartOpen} 
      onClose={() => setIsCartOpen(false)} 
      cartItems={cartItems} 
      updateQuantity={updateQuantity}
      clearCart={clearCart}
    />
    </>
  );
}
