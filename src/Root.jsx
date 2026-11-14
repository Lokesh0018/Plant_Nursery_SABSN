import React, { lazy, Suspense } from 'react';
import App from './App.jsx';

const PlantsPage = lazy(() => import('./pages/PlantsPage.jsx'));
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'));

// Pages, picked by path: the home page, the plants catalogue at /plants and the gallery at /gallery
const PAGES = { '/plants': PlantsPage, '/gallery': GalleryPage };

export default function Root() {
  const Page = PAGES[window.location.pathname.replace(/\/+$/, '')];
  if (!Page) return <App />;
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d2a18' }} />}>
      <Page />
    </Suspense>
  );
}
