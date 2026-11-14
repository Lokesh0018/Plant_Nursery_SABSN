import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { plantCategories } from '../data/categories';
import CategoryCollection from './CategoryCollection';
import { Sun, Droplets, Star } from 'lucide-react';
import './Collection.css';

gsap.registerPlugin(ScrollTrigger);

export function ProductCard({ product, onOpen, showRating = false }) {
  const [isHovered, React_useState] = React.useState(false);
  const setIsHovered = React_useState;

  return (
    <article
      id={`product-${product.id}`}
      className={`product-card${isHovered ? ' is-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => onOpen(product, e.currentTarget)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(product, e.currentTarget); } }}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
    >
      {/* Stage: every plant stands on the same ground line, whatever its height */}
      <div className="product-stage">
        <span className="product-stage-glow" aria-hidden="true" />
        <span className="product-stage-shadow" aria-hidden="true" />
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" decoding="async" />
      </div>

      <div className="product-body">
        <p className="product-latin">{product.scientificName}</p>
        {showRating && product.rating && (
          <p className="product-rating" aria-label={`Rated ${product.rating} out of 5 from ${product.reviews} reviews`}>
            <Star size={12} strokeWidth={0} fill="currentColor" aria-hidden="true" />
            {product.rating.toFixed(1)}<span>({product.reviews})</span>
          </p>
        )}
        <h3 className="product-name">{product.name}</h3>
        <div className="product-foot">
          <p className="product-price">₹{product.price.toLocaleString()}</p>
          {product.care && (
            <div className="product-care">
              <span><Sun size={11} strokeWidth={2.5} />{product.care.light}</span>
              <span><Droplets size={11} strokeWidth={2.5} />{product.care.water}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Collection() {
  return <CategoryCollection kind="plants" categories={plantCategories} />;
}
