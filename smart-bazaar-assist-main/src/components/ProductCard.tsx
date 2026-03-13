import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, AlertTriangle, Eye, Scale } from 'lucide-react';
import { Product, useCart } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AisleMap from './AisleMap';
import ProductDetailModal from './ProductDetailModal';
import { useLanguage } from '@/context/LanguageContext';
import { getWeightInfo, calculateWeightPrice, formatWeight } from '@/lib/productUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [flyingEmoji, setFlyingEmoji] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightUnit, setWeightUnit] = useState<'g' | 'kg'>('g');
  const cardRef = useRef<HTMLDivElement>(null);

  const weightInfo = getWeightInfo(product.name, product.price);
  const isWeightBased = !!weightInfo;

  const isLowStock = product.stock < 5;
  const daysUntilExpiry = Math.ceil(
    (new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const isNearExpiry = daysUntilExpiry <= 5;
  const showPulse = isLowStock || isNearExpiry;

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
      setFlyingEmoji(true);
      setTimeout(() => {
        addToCart(product, grams);
        setFlyingEmoji(false);
        setWeightInput('');
      }, 600);
    } else {
      setFlyingEmoji(true);
      setTimeout(() => {
        addToCart(product);
        setFlyingEmoji(false);
      }, 600);
    }
  };

  const isImageUrl = product.image.startsWith('http');

  return (
    <>
      <Card 
        ref={cardRef}
        variant="product" 
        className={`relative ${showPulse ? 'animate-pulse-glow' : ''}`}
      >
        {/* Offer Badge */}
        {product.offer && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground z-10">
            {product.offer}
          </Badge>
        )}

        {/* Warnings */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
          {isLowStock && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              {t.onlyLeft} {product.stock} {t.left}
            </Badge>
          )}
          {isNearExpiry && (
            <Badge variant="outline" className="text-xs bg-warning/20 border-warning text-warning-foreground">
              {t.expiresIn} {daysUntilExpiry} {t.days}
            </Badge>
          )}
        </div>

        {/* Product Image */}
        <div className="relative h-32 bg-gradient-to-br from-secondary to-accent flex items-center justify-center overflow-hidden">
          {isImageUrl ? (
            <motion.img 
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
            />
          ) : (
            <motion.span 
              className="text-6xl"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {product.image}
            </motion.span>
          )}

          {/* Flying Animation */}
          <AnimatePresence>
            {flyingEmoji && (
              <motion.div
                className="absolute z-20 w-12 h-12 rounded-full bg-primary flex items-center justify-center"
                initial={{ scale: 1, x: 0, y: 0 }}
                animate={{
                  scale: 0.3,
                  x: 150,
                  y: -150,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <Plus className="w-6 h-6 text-primary-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <CardContent className="p-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {product.brand}
            </span>
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-foreground">
              Rs. {isWeightBased && getWeightInGrams() > 0 
                ? getCalculatedPrice().toFixed(2) 
                : product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                Rs. {product.originalPrice}
              </span>
            )}
          </div>

          {/* Weight Input for weight-based products */}
          {isWeightBased && weightInfo && (
            <div className="mb-3 p-2 bg-muted rounded-lg">
              <div className="flex items-center gap-1 mb-2">
                <Scale className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {t.enterWeight || 'Enter weight'} (Rs. {(weightInfo.pricePerGram * 1000).toFixed(2)}/kg)
                </span>
              </div>
              <div className="flex gap-1">
                <Input
                  type="number"
                  placeholder="0"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="h-8 text-sm flex-1"
                  min="0"
                  step="any"
                />
                <div className="flex bg-background rounded-md border">
                  <button
                    className={`px-2 py-1 text-xs rounded-l-md transition-colors ${
                      weightUnit === 'g' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    }`}
                    onClick={() => setWeightUnit('g')}
                  >
                    g
                  </button>
                  <button
                    className={`px-2 py-1 text-xs rounded-r-md transition-colors ${
                      weightUnit === 'kg' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    }`}
                    onClick={() => setWeightUnit('kg')}
                  >
                    kg
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="hero"
              size="sm"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isWeightBased && getWeightInGrams() <= 0}
            >
              <Plus className="w-4 h-4" />
              {t.addToCart}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetail(true)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMap(true)}
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>

          {/* Aisle Info */}
          <div className="mt-3 text-xs text-muted-foreground text-center">
            {t.aisle} {product.aisle}
          </div>
        </CardContent>
      </Card>

      {/* Aisle Map Modal */}
      <AisleMap
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        aisle={product.aisle}
        productName={product.name}
      />

      {/* Product Detail Modal with FAQ and Price Per Unit */}
      <ProductDetailModal
        product={product}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        onShowMap={() => {
          setShowDetail(false);
          setShowMap(true);
        }}
      />
    </>
  );
};

export default ProductCard;
