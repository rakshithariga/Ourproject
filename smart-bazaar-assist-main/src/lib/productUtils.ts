// Utility functions for product handling

export interface WeightInfo {
  isWeightBased: boolean;
  baseWeight: number; // in grams
  baseUnit: 'kg' | 'g';
  pricePerGram: number;
  displayUnit: string;
}

// Check if product is sold by weight (kg/g) based on name pattern
export const getWeightInfo = (productName: string, price: number): WeightInfo | null => {
  const kgMatch = productName.match(/\((\d+(?:\.\d+)?)\s*kg\)/i);
  const gMatch = productName.match(/\((\d+)\s*g\)/i);

  if (kgMatch) {
    const kg = parseFloat(kgMatch[1]);
    const baseWeightGrams = kg * 1000;
    return {
      isWeightBased: true,
      baseWeight: baseWeightGrams,
      baseUnit: 'kg',
      pricePerGram: price / baseWeightGrams,
      displayUnit: `${kg} kg`,
    };
  }

  if (gMatch) {
    const grams = parseInt(gMatch[1]);
    return {
      isWeightBased: true,
      baseWeight: grams,
      baseUnit: 'g',
      pricePerGram: price / grams,
      displayUnit: `${grams} g`,
    };
  }

  return null;
};

// Calculate price based on weight
export const calculateWeightPrice = (pricePerGram: number, weightInGrams: number): number => {
  return Math.round(pricePerGram * weightInGrams * 100) / 100;
};

// Format weight for display
export const formatWeight = (grams: number): string => {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
  return `${grams} g`;
};
