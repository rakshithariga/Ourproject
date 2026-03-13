import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, MapPin, Scale, Info } from 'lucide-react';
import { Product, useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import ProductFAQ from './ProductFAQ';
import { getWeightInfo, calculateWeightPrice, formatWeight } from '@/lib/productUtils';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onShowMap: () => void;
}

// Unit size extraction and price per unit calculation
const extractUnitInfo = (productName: string, price: number) => {
  // Common patterns: (1kg), (500g), (1L), (500ml), (12 pack), etc.
  const kgMatch = productName.match(/\((\d+(?:\.\d+)?)\s*kg\)/i);
  const gMatch = productName.match(/\((\d+)\s*g\)/i);
  const literMatch = productName.match(/\((\d+(?:\.\d+)?)\s*L\)/i);
  const mlMatch = productName.match(/\((\d+)\s*ml\)/i);
  const countMatch = productName.match(/\((\d+)\s*(?:pack|pcs?|pieces?|count)?\)/i);

  if (kgMatch) {
    const kg = parseFloat(kgMatch[1]);
    const pricePerKg = price / kg;
    const pricePerGram = pricePerKg / 1000;
    return { 
      pricePerUnit: pricePerKg.toFixed(2), 
      unit: 'kg',
      pricePerSmallUnit: pricePerGram.toFixed(3),
      smallUnit: 'gram'
    };
  }
  
  if (gMatch) {
    const grams = parseInt(gMatch[1]);
    const pricePerGram = price / grams;
    const pricePer100g = pricePerGram * 100;
    return { 
      pricePerUnit: pricePer100g.toFixed(2), 
      unit: '100g',
      pricePerSmallUnit: pricePerGram.toFixed(3),
      smallUnit: 'gram'
    };
  }
  
  if (literMatch) {
    const liters = parseFloat(literMatch[1]);
    const pricePerLiter = price / liters;
    const pricePerMl = pricePerLiter / 1000;
    return { 
      pricePerUnit: pricePerLiter.toFixed(2), 
      unit: 'liter',
      pricePerSmallUnit: pricePerMl.toFixed(3),
      smallUnit: 'ml'
    };
  }
  
  if (mlMatch) {
    const ml = parseInt(mlMatch[1]);
    const pricePerMl = price / ml;
    const pricePer100ml = pricePerMl * 100;
    return { 
      pricePerUnit: pricePer100ml.toFixed(2), 
      unit: '100ml',
      pricePerSmallUnit: pricePerMl.toFixed(3),
      smallUnit: 'ml'
    };
  }
  
  if (countMatch) {
    const count = parseInt(countMatch[1]);
    const pricePerPiece = price / count;
    return { 
      pricePerUnit: pricePerPiece.toFixed(2), 
      unit: 'piece',
      pricePerSmallUnit: null,
      smallUnit: null
    };
  }

  return null;
};

const ProductDetailModal = ({ product, isOpen, onClose, onShowMap }: ProductDetailModalProps) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [weightInput, setWeightInput] = useState('');
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g');

  if (!product) return null;

  const unitInfo = extractUnitInfo(product.name, product.price);
  const weightInfo = getWeightInfo(product.name, product.price);
  const isWeightBased = !!weightInfo;
  const isImageUrl = product.image.startsWith('http');

  const getWeightInGrams = (): number => {
    const value = parseFloat(weightInput) || 0;
    return weightUnit === 'kg' ? value * 1000 : value;
  };

  const getCalculatedPrice = (): number => {
    if (!weightInfo) return product.price;
    const grams = getWeightInGrams();
    return calculateWeightPrice(weightInfo.pricePerGram, grams);
  };

  const handleAddToCart = () => {
    if (isWeightBased) {
      const grams = getWeightInGrams();
      if (grams <= 0) return;
      addToCart(product, grams);
    } else {
      addToCart(product);
    }
    setWeightInput('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-8">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Image */}
          <div className="relative h-48 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center overflow-hidden">
            {isImageUrl ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-8xl">{product.image}</span>
            )}

            {product.offer && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                {product.offer}
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-foreground">
                  Rs. {product.price}
                </span>
                {product.originalPrice && (
                  <span className="block text-sm text-muted-foreground line-through">
                    Rs. {product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {/* Price Per Unit - Transparent Pricing */}
            {unitInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-primary/10 rounded-xl border border-primary/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {t.pricePerUnit || 'Price Per Unit'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-primary">
                    Rs. {unitInfo.pricePerUnit}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {unitInfo.unit}
                  </span>
                </div>
                {unitInfo.pricePerSmallUnit && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Rs. {unitInfo.pricePerSmallUnit} / {unitInfo.smallUnit}
                  </p>
                )}
              </motion.div>
            )}

            {/* Stock & Expiry Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className={`flex items-center gap-1 ${product.stock < 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                <Info className="w-4 h-4" />
                {product.stock} {t.inStock || 'in stock'}
              </div>
              <div className="text-muted-foreground">
                {t.expires || 'Expires'}: {product.expiryDate}
              </div>
            </div>

            {/* Aisle Info */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">
                  {t.aisle || 'Aisle'} {product.aisle}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={onShowMap}>
                {t.showOnMap || 'Show on Map'}
              </Button>
            </div>

            {/* Weight Input for weight-based products */}
            {isWeightBased && weightInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-accent/30 rounded-xl border border-accent"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">
                    {t.enterWeight || 'Enter Weight'}
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="flex-1"
                    min="0"
                    step="any"
                  />
                  <div className="flex bg-background rounded-md border">
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-l-md transition-colors ${
                        weightUnit === 'g' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                      }`}
                      onClick={() => setWeightUnit('g')}
                    >
                      grams
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-r-md transition-colors ${
                        weightUnit === 'kg' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                      }`}
                      onClick={() => setWeightUnit('kg')}
                    >
                      kg
                    </button>
                  </div>
                </div>
                {getWeightInGrams() > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatWeight(getWeightInGrams())}
                    </span>
                    <span className="font-bold text-primary text-lg">
                      Rs. {getCalculatedPrice().toFixed(2)}
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Product FAQ Section */}
            <ProductFAQ category={product.category} productName={product.name} />

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                variant="hero" 
                className="flex-1" 
                onClick={handleAddToCart}
                disabled={isWeightBased && getWeightInGrams() <= 0}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.addToCart || 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
