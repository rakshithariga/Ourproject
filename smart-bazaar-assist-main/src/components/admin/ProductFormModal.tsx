import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/context/CartContext';
import { categories } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  editProduct?: Product | null;
}



const ProductFormModal = ({ isOpen, onClose, onSubmit, editProduct }: ProductFormModalProps) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    originalPrice: '',
    offer: '',
    category: 'Bakery',
    aisle: '',
    stock: '',
    expiryDate: '',
        image: '',
    description: '',
  });

  useEffect(() => {
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        brand: editProduct.brand,
        price: editProduct.price.toString(),
        originalPrice: editProduct.originalPrice?.toString() || '',
        offer: editProduct.offer || '',
        category: editProduct.category,
        aisle: editProduct.aisle,
        stock: editProduct.stock.toString(),
        expiryDate: editProduct.expiryDate,
        image: editProduct.image,
        description: '',
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        price: '',
        originalPrice: '',
        offer: '',
        category: 'Bakery',
        aisle: '',
        stock: '',
        expiryDate: '',
        image: '',
        description: '',
      });
    }
  }, [editProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      brand: formData.brand,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      offer: formData.offer || undefined,
      category: formData.category,
      aisle: formData.aisle,
      stock: parseInt(formData.stock),
      expiryDate: formData.expiryDate,
      image: formData.image,
    });
    onClose();
  };

  const availableCategories = categories.filter(c => c !== 'All');

  // Map categories to translated names
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, keyof typeof t> = {
      'Bakery': 'bakery',
      'Dairy': 'dairy',
      'Fruits': 'fruits',
      'Vegetables': 'vegetables',
      'Spreads': 'spreads',
      'Beverages': 'beverages',
      'Grains': 'grains',
      'Snacks': 'snacks',
      'Cooking': 'cooking',
    };
    const key = categoryMap[category];
    return key ? t[key] : category;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/60 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <Card variant="elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{editProduct ? t.editProduct : t.addNewProduct}</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t.productName} *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Organic Whole Wheat Bread"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t.brand} *</label>
                    <Input
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., Nature's Own"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.price} *</label>
                      <Input
                        required
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="45"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.originalPrice}</label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="55"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.stockQuantity} *</label>
                      <Input
                        required
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.offerTag}</label>
                      <Input
                        value={formData.offer}
                        onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                        placeholder="e.g., 18% OFF"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.category} *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">{t.aisle} *</label>
                      <Input
                        required
                        value={formData.aisle}
                        onChange={(e) => setFormData({ ...formData, aisle: e.target.value })}
                        placeholder="e.g., A1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t.expiryDate} *</label>
                    <Input
                      required
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">{t.imageUrl} *</label>
                    <Input
                      required
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-border"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    {editProduct ? t.updateProduct : t.addProduct}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductFormModal;