import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

interface AisleMapProps {
  isOpen: boolean;
  onClose: () => void;
  aisle: string;
  productName: string;
}

const aislePositions: Record<string, { row: number; col: number }> = {
  'A1': { row: 0, col: 0 },
  'A2': { row: 0, col: 1 },
  'B1': { row: 1, col: 0 },
  'B2': { row: 1, col: 1 },
  'B3': { row: 1, col: 2 },
  'C1': { row: 2, col: 0 },
  'C2': { row: 2, col: 1 },
  'C3': { row: 2, col: 2 },
  'D1': { row: 3, col: 0 },
  'D2': { row: 3, col: 1 },
  'E1': { row: 4, col: 0 },
  'F1': { row: 5, col: 0 },
  'G1': { row: 6, col: 0 },
  'G2': { row: 6, col: 1 },
};

const AisleMap = ({ isOpen, onClose, aisle, productName }: AisleMapProps) => {
  const { t } = useLanguage();
  const targetPosition = aislePositions[aisle] || { row: 0, col: 0 };

  // Get translated aisle labels
  const getAisleLabel = (aisleId: string): string => {
    const aisleLabelsMap: Record<string, keyof typeof t> = {
      'A1': 'bakery',
      'A2': 'bakery',
      'B1': 'dairy',
      'B2': 'dairy',
      'B3': 'dairy',
      'C1': 'vegetables',
      'C2': 'vegetables',
      'C3': 'fruits',
      'D1': 'cooking',
      'D2': 'spreads',
      'E1': 'beverages',
      'F1': 'grains',
      'G1': 'snacks',
      'G2': 'snacks',
    };
    const key = aisleLabelsMap[aisleId];
    return key ? t[key] : aisleId;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card rounded-3xl p-6 max-w-lg w-full shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">{t.storeMap}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.finding} {productName}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Store Floor Plan */}
            <div className="bg-muted rounded-2xl p-4 mb-4">
              {/* Entrance */}
              <div className="text-center mb-4">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  🚪 {t.entrance}
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(aislePositions).map(([aisleId, pos]) => {
                  const isTarget = aisleId === aisle;
                  return (
                    <motion.div
                      key={aisleId}
                      className={`
                        relative p-3 rounded-lg text-center text-xs font-medium
                        ${isTarget 
                          ? 'bg-primary text-primary-foreground shadow-glow' 
                          : 'bg-card text-muted-foreground'
                        }
                      `}
                      animate={isTarget ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        gridRow: pos.row + 1,
                        gridColumn: pos.col + 1,
                      }}
                    >
                      {isTarget && (
                        <MapPin className="w-4 h-4 absolute -top-1 -right-1 text-primary" />
                      )}
                      <div className="font-bold">{aisleId}</div>
                      <div className="text-[10px] mt-1 opacity-75">
                        {getAisleLabel(aisleId)}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Checkout */}
              <div className="text-center mt-4">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  💳 {t.checkout}
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span className="text-muted-foreground">{t.yourItem}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-card border"></div>
                <span className="text-muted-foreground">{t.otherAisles}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AisleMap;