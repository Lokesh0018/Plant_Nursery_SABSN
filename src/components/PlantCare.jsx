import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Droplets, Sprout, Leaf } from 'lucide-react';
import './PlantCare.css';

gsap.registerPlugin(ScrollTrigger);

const careData = [
  {
    image: '/perfect-light.webp',
    number: '01',
    title: 'Perfect Light',
    description: 'Find the ideal spot. Most of our plants thrive in bright, indirect sunlight to maintain their vibrant foliage.'
  },
  {
    image: '/hydration.webp',
    number: '02',
    title: 'Hydration',
    description: 'Consistent moisture is key. We provide tailored watering schedules so your plants never go thirsty or get overwatered.'
  },
  {
    image: '/rich-soil.webp',
    number: '03',
    title: 'Rich Soil',
    description: 'Our custom potting mix ensures proper drainage and aeration, creating the perfect foundation for healthy roots.'
  }
];

export default function PlantCare() {
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Badge Reveal
      gsap.fromTo('.plantcare-badge', 
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out'
        }
      );

      // 2. Heading Mask Reveal
      gsap.fromTo('.plantcare-heading-text', 
        { y: '120%', rotateZ: 2, transformOrigin: 'left top' },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play reverse play reverse'
          },
          y: 0,
          rotateZ: 0,
          duration: 1.4,
          stagger: 0.15,
          ease: 'expo.out'
        }
      );

      // 3. Cards Stagger Entrance & Image Subtle Reveal
      const cards = gsap.utils.toArray(cardsRef.current.children);
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { y: 40, opacity: 0 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse'
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            delay: i * 0.15,
            ease: 'power3.out'
          }
        );

        gsap.fromTo(card.querySelector('.plantcare-image-wrapper'),
          { scale: 0.9, opacity: 0, y: 10 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              toggleActions: 'play reverse play reverse'
            },
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: i * 0.15 + 0.3,
            ease: 'power2.out'
          }
        );
      });

      // 4. Grid subtle vertical parallax
      gsap.to(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        y: '-10%',
        ease: 'none'
      });

      // 5. Subtle continuous breathing for illustrations
      gsap.to('.plantcare-illustration', {
        y: -6,
        duration: 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleCardMouseMove = (e, cardRef) => {
    const rect = cardRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    cardRef.style.setProperty('--mouse-x', `${x}px`);
    cardRef.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleCardMouseLeave = (cardRef) => {
    cardRef.style.setProperty('--mouse-x', `-1000px`);
    cardRef.style.setProperty('--mouse-y', `-1000px`);
  };

  return (
    <section ref={sectionRef} className="plantcare-section" id="care">
      <div className="plantcare-container">
        <div className="plantcare-badge-wrapper">
          <span className="plantcare-badge">Expert Care</span>
        </div>
        <h2 className="plantcare-heading">
          <span className="plantcare-heading-line">
            <span className="plantcare-heading-text">Growing happiness,</span>
          </span>
          <span className="plantcare-heading-line">
            <span className="plantcare-heading-text"><span className="plantcare-italic">one leaf</span> at a time.</span>
          </span>
        </h2>

        <div ref={cardsRef} className="plantcare-grid">
          {careData.map((item, index) => (
            <div 
              key={index} 
              className="plantcare-card"
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget)}
            >
              <div className="plantcare-card-glare" />
              <div className="plantcare-card-number-wrapper">
                <span className="plantcare-card-number">{item.number}</span>
                <span className="plantcare-card-line"></span>
              </div>
              <div className="plantcare-card-content">
                <div className="plantcare-image-wrapper">
                  <img src={item.image} alt={item.title} className="plantcare-illustration" />
                </div>
                <h3 className="plantcare-card-title">{item.title}</h3>
                <p className="plantcare-card-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
