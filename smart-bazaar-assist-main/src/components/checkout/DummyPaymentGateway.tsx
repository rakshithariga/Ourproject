import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Check, ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { Card } from '@/components/ui/card';

export interface DummyPaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

const DummyPaymentGateway = ({ isOpen, onClose, onSuccess, amount }: DummyPaymentGatewayProps) => {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Secure Payment</h2>
                  <p className="text-xs text-muted-foreground">Smart Bazar Checkout</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-full transition-colors"
                disabled={isProcessing || isSuccess}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {!isSuccess ? (
                <>
                  <div className="mb-6 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
                    <p className="text-4xl font-bold text-foreground">Rs. {amount.toFixed(2)}</p>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-border/80 text-muted-foreground'
                      }`}
                      disabled={isProcessing}
                    >
                      <CreditCard className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('upi')}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-border/80 text-muted-foreground'
                      }`}
                      disabled={isProcessing}
                    >
                      <Smartphone className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">UPI</span>
                    </button>
                  </div>

                  {/* Payment Details Form (Dummy) */}
                  <div className="space-y-4 mb-8">
                    {paymentMethod === 'card' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">Card Number</label>
                          <input 
                            type="text" 
                            placeholder="4000 1234 5678 9010" 
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            defaultValue="4242 4242 4242 4242"
                            disabled={isProcessing}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">Expiry</label>
                            <input 
                              type="text" 
                              placeholder="MM/YY" 
                              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              defaultValue="12/26"
                              disabled={isProcessing}
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">CVV</label>
                            <input 
                              type="password" 
                              placeholder="•••" 
                              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              defaultValue="123"
                              disabled={isProcessing}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground ml-1 mb-1 block">UPI ID</label>
                          <input 
                            type="text" 
                            placeholder="username@bank" 
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            defaultValue="customer@okbank"
                            disabled={isProcessing}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Button 
                    className="w-full py-6 text-lg rounded-xl relative overflow-hidden"
                    onClick={handlePay}
                    disabled={isProcessing}
                  >
                    <AnimatePresence mode="wait">
                      {isProcessing ? (
                        <motion.div
                          key="processing"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center"
                        >
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="pay"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          Pay Rs. {amount.toFixed(2)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h3>
                  <p className="text-muted-foreground">Redirecting to order confirmation...</p>
                </motion.div>
              )}
            </div>
            
            {!isSuccess && (
              <div className="bg-muted/30 p-4 text-center border-t border-border">
                <p className="text-xs flex items-center justify-center text-muted-foreground gap-1">
                   Secured by <span className="font-bold text-foreground">DummyPay</span>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DummyPaymentGateway;
