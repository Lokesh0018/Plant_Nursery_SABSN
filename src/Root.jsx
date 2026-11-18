import React, { lazy, Suspense } from 'react';
import App from './App.jsx';

const PotsPage = lazy(() => import('./pages/PotsPage.jsx'));
const PlantsPage = lazy(() => import('./pages/PlantsPage.jsx'));
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));

// Pages, picked by path: the home page, the plants catalogue at /plants, the services at /services, the gallery at /gallery, the company profile at /about and the contact page at /contact
const PAGES = { '/pots': PotsPage, '/plants': PlantsPage, '/services': ServicesPage, '/gallery': GalleryPage, '/about': AboutPage, '/contact': ContactPage };

export default function Root() {
  const Page = PAGES[window.location.pathname.replace(/\/+$/, '')];
  if (!Page) return <App />;
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d2a18' }} />}>
      <Page />
    </Suspense>
  );
}
