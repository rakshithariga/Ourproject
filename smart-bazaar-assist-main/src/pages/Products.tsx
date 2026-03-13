import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Mic, Camera } from 'lucide-react';
import Navbar from '@/components/Navbar';
import FloatingEmojis from '@/components/FloatingEmojis';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/context/ProductContext';
import { categories } from '@/data/products';
import { useLanguage } from '@/context/LanguageContext';
import FamilySyncMode from '@/components/FamilySyncMode';
import FindHelpButton from '@/components/FindHelpButton';
import { toast } from 'sonner';

const Products = () => {
  const { products } = useProducts();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isListening, setIsListening] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser.');
    }
  };

  const handleImageSearch = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsProcessingImage(true);

    try {
      // Create a canvas to extract dominant colors from the image
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Simple image analysis - detect if it's a common grocery item based on colors
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          const colors = analyzeImageColors(imageData);
          const suggestedCategory = suggestCategoryFromColors(colors);
          
          if (suggestedCategory && suggestedCategory !== 'All') {
            setSelectedCategory(suggestedCategory);
            toast.success(`Found products matching: ${suggestedCategory}`);
          } else {
            // Fall back to showing all products
            toast.info('Showing all products. Try a clearer image of a grocery item.');
          }
        }
        
        setIsProcessingImage(false);
      };

      img.onerror = () => {
        toast.error('Failed to process image');
        setIsProcessingImage(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Image search error:', error);
      toast.error('Failed to process image');
      setIsProcessingImage(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Analyze dominant colors in the image
  const analyzeImageColors = (imageData: ImageData): { r: number; g: number; b: number }[] => {
    const data = imageData.data;
    const colorCounts: Record<string, { count: number; r: number; g: number; b: number }> = {};

    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = Math.floor(data[i] / 32) * 32;
      const g = Math.floor(data[i + 1] / 32) * 32;
      const b = Math.floor(data[i + 2] / 32) * 32;
      const key = `${r}-${g}-${b}`;

      if (!colorCounts[key]) {
        colorCounts[key] = { count: 0, r, g, b };
      }
      colorCounts[key].count++;
    }

    // Get top 5 colors
    return Object.values(colorCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(({ r, g, b }) => ({ r, g, b }));
  };

  // Suggest category based on dominant colors
  const suggestCategoryFromColors = (colors: { r: number; g: number; b: number }[]): string => {
    // Check for green (vegetables, fruits)
    const hasGreen = colors.some(c => c.g > c.r && c.g > c.b && c.g > 100);
    // Check for yellow/orange (fruits, bakery)
    const hasYellow = colors.some(c => c.r > 150 && c.g > 100 && c.b < 100);
    // Check for red (fruits)
    const hasRed = colors.some(c => c.r > 150 && c.g < 100 && c.b < 100);
    // Check for brown (bakery, grains)
    const hasBrown = colors.some(c => c.r > 100 && c.r < 180 && c.g > 60 && c.g < 140 && c.b < 100);
    // Check for white (dairy)
    const hasWhite = colors.some(c => c.r > 200 && c.g > 200 && c.b > 200);

    if (hasGreen) return 'Vegetables';
    if (hasRed) return 'Fruits';
    if (hasYellow) return 'Fruits';
    if (hasBrown) return 'Bakery';
    if (hasWhite) return 'Dairy';

    return 'All';
  };

  // Map categories to translated names
  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, keyof typeof t> = {
      'All': 'all',
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
    <div className="min-h-screen bg-background relative">
      <FloatingEmojis />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {t.browseProducts}
                </h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} {t.productsAvailable}
                </p>
              </div>
              <div className="flex gap-2">
                <FamilySyncMode />
                <FindHelpButton />
              </div>
            </div>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t.searchForProducts}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl bg-card border-border/50 text-foreground"
                />
              </div>
              <Button
                variant={isListening ? 'hero' : 'outline'}
                size="icon"
                className="h-12 w-12"
                onClick={handleVoiceSearch}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>
              <Button 
                variant={isProcessingImage ? 'hero' : 'outline'} 
                size="icon" 
                className="h-12 w-12"
                onClick={handleImageSearch}
                disabled={isProcessingImage}
              >
                <Camera className={`w-5 h-5 ${isProcessingImage ? 'animate-pulse' : ''}`} />
              </Button>
              {/* Hidden file input for image upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`cursor-pointer whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryLabel(category)}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {t.noProductsFound}
              </h3>
              <p className="text-muted-foreground">
                {t.tryAdjusting}
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;