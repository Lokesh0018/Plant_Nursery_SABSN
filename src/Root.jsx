import React, { lazy, Suspense } from 'react';
import App from './App.jsx';

const PlantsPage = lazy(() => import('./pages/PlantsPage.jsx'));
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));

// Pages, picked by path: the home page, the plants catalogue at /plants, the gallery at /gallery and the company profile at /about
const PAGES = { '/plants': PlantsPage, '/gallery': GalleryPage, '/about': AboutPage };

export default function Root() {
  const Page = PAGES[window.location.pathname.replace(/\/+$/, '')];
  if (!Page) return <App />;
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d2a18' }} />}>
      <Page />
    </Suspense>
  );
}
