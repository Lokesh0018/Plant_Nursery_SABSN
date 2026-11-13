import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, ArrowRight, Loader2, Check } from 'lucide-react';
import './CartDrawer.css';

export default function CartDrawer({ isOpen, onClose, cartItems = [], updateQuantity, clearCart }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutSuccess(true);
      setTimeout(() => {
        setCheckoutSuccess(false);
        if (clearCart) clearCart();
      }, 2000); // clear cart after showing success for 2 seconds
    }, 1500);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <>
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button 
            className="cart-close-btn" 
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        <div className={`cart-content ${cartItems.length === 0 ? 'empty-state' : ''}`}>
          {cartItems.length === 0 ? (
            <>
              <div className="empty-cart-icon">
                <ShoppingBag size={48} strokeWidth={1} />
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added any plants or pots to your cart yet.</p>
              <button 
                className="continue-shopping-btn"
                onClick={() => {
                  onClose();
                  document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Continue Shopping</span>
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.map(item => (
                <div key={item.id} className="cart-item" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '8px' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: 'var(--color-text-dark)' }}>{item.name}</h4>
                      <span style={{ fontWeight: '600', color: 'var(--color-text-dark)' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.2rem 0.6rem', background: 'white', border: 'none', cursor: 'pointer' }}>-</button>
                        <span style={{ padding: '0 0.5rem', fontSize: '0.85rem' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.2rem 0.6rem', background: 'white', border: 'none', cursor: 'pointer' }}>+</button>
                      </div>
                      <button 
                        onClick={() => updateQuantity(item.id, -item.quantity)}
                        style={{ background: 'transparent', border: 'none', fontSize: '0.75rem', textDecoration: 'underline', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer" style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9', backgroundColor: 'white' }}>
            <div className="cart-subtotal" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600', color: 'var(--color-text-dark)' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <p className="shipping-note" style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Shipping and taxes calculated at checkout.</p>
            <button 
              className="checkout-btn" 
              onClick={handleCheckout}
              disabled={isCheckingOut || checkoutSuccess}
              style={{ 
                width: '100%', 
                background: checkoutSuccess ? '#10b981' : 'var(--color-text-dark)', 
                color: 'white', 
                padding: '1rem', 
                border: 'none', 
                borderRadius: '8px', 
                fontWeight: '600', 
                fontSize: '1rem', 
                cursor: (isCheckingOut || checkoutSuccess) ? 'default' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                opacity: isCheckingOut ? 0.9 : 1
              }}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Processing...</span>
                </>
              ) : checkoutSuccess ? (
                <>
                  <Check size={20} style={{ animation: 'scaleIn 0.3s ease-out' }} />
                  <span>Order Placed!</span>
                </>
              ) : (
                'Checkout'
              )}
            </button>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              @keyframes scaleIn {
                from { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); opacity: 1; }
                to { transform: scale(1); opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>
    </>
  );
}
