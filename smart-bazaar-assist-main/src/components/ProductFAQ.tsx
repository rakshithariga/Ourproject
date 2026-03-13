import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ProductFAQProps {
  category: string;
  productName: string;
}

interface FAQ {
  question: string;
  answer: string;
}

// Category-based FAQs
const categoryFAQs: Record<string, FAQ[]> = {
  Dairy: [
    { question: 'Is this product lactose-free?', answer: 'Please check the product label for lactose-free certification. Some dairy alternatives are available.' },
    { question: 'How should I store this?', answer: 'Keep refrigerated at 2-6°C. Consume within 2-3 days after opening.' },
    { question: 'Is this suitable for vegetarians?', answer: 'Yes, dairy products are suitable for lacto-vegetarians.' },
  ],
  Bakery: [
    { question: 'Is this gluten-free?', answer: 'Most bakery items contain gluten. Check the label for gluten-free options.' },
    { question: 'Does this contain nuts?', answer: 'May contain traces of nuts due to shared equipment. Check allergen info on packaging.' },
    { question: 'How long will this stay fresh?', answer: 'Best consumed within 2-3 days. Store in a cool, dry place or freeze for longer storage.' },
  ],
  Fruits: [
    { question: 'Are these organic?', answer: 'Check for organic certification on the product label. Organic options are available for select items.' },
    { question: 'How to check ripeness?', answer: 'Look for uniform color, slight give when pressed, and sweet aroma for ripe fruits.' },
    { question: 'How should I wash these?', answer: 'Rinse under running water. Use a produce brush for firm fruits. Pat dry before storing.' },
  ],
  Vegetables: [
    { question: 'Are these pesticide-free?', answer: 'We source from certified farms. Wash thoroughly before use. Organic options available.' },
    { question: 'How long can I store these?', answer: 'Most vegetables last 5-7 days refrigerated. Root vegetables last longer in cool, dark places.' },
    { question: 'Can I freeze these?', answer: 'Most vegetables can be blanched and frozen. Leafy greens should be consumed fresh.' },
  ],
  Beverages: [
    { question: 'Is this sugar-free?', answer: 'Check the nutrition label for sugar content. Sugar-free alternatives may be available.' },
    { question: 'Is this suitable for diabetics?', answer: 'Consult the nutrition information for carbohydrate content. Choose no-sugar-added options.' },
    { question: 'Should this be refrigerated after opening?', answer: 'Yes, refrigerate after opening and consume within 3-5 days for best quality.' },
  ],
  Snacks: [
    { question: 'Are these allergen-free?', answer: 'Check packaging for allergen information. May contain nuts, soy, or wheat.' },
    { question: 'What is the calorie content?', answer: 'Refer to the nutrition label on the package for detailed calorie information.' },
    { question: 'Are these suitable for children?', answer: 'Most snacks are family-friendly. Check for age recommendations on specific products.' },
  ],
  Grains: [
    { question: 'Is this whole grain?', answer: 'Check product label for whole grain certification. Whole grain options are available.' },
    { question: 'How should I store this?', answer: 'Store in airtight containers in a cool, dry place. Keeps for 6-12 months.' },
    { question: 'Is this suitable for a gluten-free diet?', answer: 'Rice and some specialty grains are gluten-free. Check labels for certification.' },
  ],
  Spreads: [
    { question: 'Does this contain preservatives?', answer: 'Check the ingredients list. Many natural options with no artificial preservatives available.' },
    { question: 'How long after opening can I use this?', answer: 'Most spreads last 1-3 months after opening when refrigerated. Check package instructions.' },
    { question: 'Is this vegan?', answer: 'Check ingredients for dairy or animal products. Vegan alternatives are available.' },
  ],
  Cooking: [
    { question: 'What is the smoke point?', answer: 'Olive oil: 190°C, Sunflower: 230°C, Coconut: 177°C. Choose based on cooking method.' },
    { question: 'Is this cold-pressed?', answer: 'Check label for "cold-pressed" or "extra virgin" designation for unrefined oils.' },
    { question: 'How should I store cooking oils?', answer: 'Store in a cool, dark place. Refrigerate after opening for longer shelf life.' },
  ],
};

const ProductFAQ = ({ category, productName }: ProductFAQProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqs = categoryFAQs[category] || [
    { question: 'What is the shelf life?', answer: 'Please check the expiry date printed on the product packaging.' },
    { question: 'Is this product returnable?', answer: 'Products can be returned within 24 hours of purchase with receipt.' },
    { question: 'Are there any allergens?', answer: 'Check the product label for complete allergen information.' },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="w-4 h-4 text-primary" />
        <span className="font-medium text-sm text-foreground">
          {t.frequentlyAsked || 'Frequently Asked'}
        </span>
      </div>

      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="border border-border rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
          >
            <span className="text-sm font-medium text-foreground pr-2">
              {faq.question}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-3 pb-3 text-sm text-muted-foreground border-t border-border pt-2">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductFAQ;
