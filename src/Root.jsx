import React, { lazy, Suspense } from 'react';

// Every page, the home page included, is its own chunk, so a visit to /plants/ or /contact/ never downloads
// the home page's sections, styles or its GSAP-driven intro
const App = lazy(() => import('./App.jsx'));
const PotsPage = lazy(() => import('./pages/PotsPage.jsx'));
const PlantsPage = lazy(() => import('./pages/PlantsPage.jsx'));
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const LocationPage = lazy(() => import('./pages/LocationPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Pages, picked by path (canonical URLs end in a slash; the match ignores it). The two location pages are one
// component, configured from src/data/locations.js. Anything else is a 404, never a silent copy of the home page.
const PAGES = {
  '/pots': <PotsPage />,
  '/plants': <PlantsPage />,
  '/services': <ServicesPage />,
  '/gallery': <GalleryPage />,
  '/about': <AboutPage />,
  '/contact': <ContactPage />,
  '/plant-nursery-rajahmundry': <LocationPage locationKey="kadiyam" />,
  '/plant-nursery-visakhapatnam': <LocationPage locationKey="visakhapatnam" />,
};

export default function Root() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path === '' || path === '/index.html') {
    // while the home chunk loads, the loading screen's own background, so the wait runs straight into it
    return (
      <Suspense fallback={<div style={{ position: 'fixed', inset: 0, background: '#F7F8EF' }} aria-hidden="true" />}>
        <App />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d2a18' }} />}>
      {PAGES[path] || <NotFoundPage />}
    </Suspense>
  );
}
