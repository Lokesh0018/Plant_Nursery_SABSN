import React from 'react';
import { plantCategories } from '../../data/categories';
import CategoryCollection from './CategoryCollection';

export default function Collection() {
  return <CategoryCollection kind="plants" categories={plantCategories} />;
}
