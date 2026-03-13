import { Product } from '@/context/CartContext';

// Sample products are now loaded from the database
// This file only contains helper functions

export const categories = [
  'All',
  'Bakery',
  'Dairy',
  'Fruits',
  'Vegetables',
  'Spreads',
  'Beverages',
  'Grains',
  'Snacks',
  'Cooking',
];

export const getRecommendations = (cartItems: Product[], allProducts: Product[]): Product[] => {
  const cartCategories = cartItems.map(item => item.category);
  
  const recommendations: { [key: string]: string[] } = {
    'Bakery': ['Spreads', 'Dairy'],
    'Dairy': ['Bakery', 'Fruits'],
    'Fruits': ['Dairy', 'Snacks'],
    'Vegetables': ['Cooking', 'Grains'],
    'Spreads': ['Bakery', 'Dairy'],
    'Beverages': ['Snacks', 'Dairy'],
    'Grains': ['Cooking', 'Vegetables'],
    'Snacks': ['Beverages', 'Dairy'],
    'Cooking': ['Grains', 'Vegetables'],
  };

  const recommendedCategories = new Set<string>();
  cartCategories.forEach(cat => {
    recommendations[cat]?.forEach(rec => recommendedCategories.add(rec));
  });

  const cartIds = cartItems.map(item => item.id);
  return allProducts
    .filter(p => recommendedCategories.has(p.category) && !cartIds.includes(p.id))
    .slice(0, 4);
};
