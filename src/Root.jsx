import React, { lazy, Suspense } from 'react';
import App from './App.jsx';

const PlantsPage = lazy(() => import('./pages/PlantsPage.jsx'));

// Two pages, picked by path: the home page and the full plants catalogue at /plants
export default function Root() {
  const isPlants = window.location.pathname.replace(/\/+$/, '') === '/plants';
  if (!isPlants) return <App />;
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0d2a18' }} />}>
      <PlantsPage />
    </Suspense>
  );
}
