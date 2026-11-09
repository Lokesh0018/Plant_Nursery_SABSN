import React, { useState, useEffect } from 'react';
import { Bean, Sprout, TreeDeciduous, Flower2, Apple } from 'lucide-react';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const icons = [
    { icon: Bean, label: 'Planting seeds...' },
    { icon: Sprout, label: 'Sprouting leaves...' },
    { icon: TreeDeciduous, label: 'Growing branches...' },
    { icon: Flower2, label: 'Blooming flowers...' },
    { icon: Apple, label: 'Harvesting nature...' },
  ];
  
  useEffect(() => {
    // 5 stages, 500ms each = 2500ms total
    const interval = setInterval(() => {
      setStage(prev => {
        if (prev >= icons.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              onComplete();
            }, 800); // Wait for smooth fade out
          }, 400);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [onComplete, icons.length]);

  const CurrentIcon = icons[stage].icon;
  const currentLabel = icons[stage].label;

  return (
    <div className={`loading-screen-container ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-icon-wrapper">
          <CurrentIcon key={`icon-${stage}`} size={44} strokeWidth={1.5} className="loading-icon" />
          <div className="loading-ring"></div>
        </div>
        <div className="loading-text-container">
          <h2 className="loading-brand">SABSN</h2>
          <p key={`text-${stage}`} className="loading-label">{currentLabel}</p>
        </div>
        <div className="loading-progress-container">
          <div 
            className="loading-progress-bar" 
            style={{ width: `${((stage + 1) / icons.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
