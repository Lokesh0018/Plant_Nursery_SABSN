import React from 'react';
import CategoryCollection from './CategoryCollection';
import { potCategories } from '../data/categories';

export default function PotsCollection() {
  return <CategoryCollection kind="pots" categories={potCategories} />;
}
