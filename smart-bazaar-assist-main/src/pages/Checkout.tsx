import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, CreditCard, ArrowLeft, Sparkles, Mail, Download, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRecommendations } from '@/data/products';
import MagicLinkAuth from '@/components/auth/MagicLinkAuth';
import { generateBillPDF } from '@/lib/generateBill';
import BillingCounterStatus from '@/components/BillingCounterStatus';
import FamilySyncMode from '@/components/FamilySyncMode';
import FindHelpButton from '@/components/FindHelpButton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatWeight } from '@/lib/productUtils';

const Checkout = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart, restoreCartFromAuth } = useCart();
  const { isAuthenticated, email } = useAuth();
  const { t } = useLanguage();
  const { products } = useProducts();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingPayment, setPendingPayment] = useState(false);
  const [billNumber, setBillNumber] = useState('');
  const hasRestoredCart = useRef(false);

  // Restore cart after magic link authentication
  useEffect(() => {
    if (isAuthenticated && !hasRestoredCart.current) {
      hasRestoredCart.current = true;
      const restored = restoreCartFromAuth();
      if (restored) {
        toast({
          title: t.loginSuccessful || 'Login successful',
          description: t.completePaymentMessage || 'You can complete the payment now.',
        });
      }
    }
  }, [isAuthenticated, restoreCartFromAuth, toast, t]);

  const recommendations = getRecommendations(items, products);
  const gst = totalPrice * 0.05;
  const finalTotal = totalPrice + gst;

  const generateBillNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SB-${dateStr}-${randomNum}`;
  };

  const saveBillingHistory = async (billNum: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get customer profile ID
      const { data: profile } = await supabase
        .from('customer_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      const billItems = items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        brand: item.brand,
      }));

      await supabase.from('billing_history').insert({
        bill_number: billNum,
        customer_email: email || '',
        customer_profile_id: profile?.id || null,
        items: billItems,
        subtotal: totalPrice,
        gst: gst,
        total: finalTotal,
        payment_method: 'Card',
        pdf_sent: false,
      });

      // Update customer profile stats
      if (profile?.id) {
        const { data: existingProfile } = await supabase
          .from('customer_profiles')
          .select('total_lifetime_value, visit_count')
          .eq('id', profile.id)
          .single();

        await supabase
          .from('customer_profiles')
          .update({
            total_lifetime_value: (existingProfile?.total_lifetime_value || 0) + finalTotal,
            visit_count: (existingProfile?.visit_count || 0) + 1,
            last_visit_at: new Date().toISOString(),
          })
          .eq('id', profile.id);
      }
    } catch (error) {
      console.error('Error saving billing history:', error);
    }
  };

  const sendBillEmail = async (billNum: string) => {
    try {
      const billItems = items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        brand: item.brand,
      }));

      const response = await supabase.functions.invoke('send-bill-email', {
        body: {
          customerEmail: email,
          billNumber: billNum,
          items: billItems,
          subtotal: totalPrice,
          gst: gst,
          total: finalTotal,
          paymentMethod: 'Card',
        },
      });

      if (response.error) {
        console.error('Error sending bill email:', response.error);
      } else {
        // Update billing history to mark pdf_sent as true
        await supabase
          .from('billing_history')
          .update({ pdf_sent: true })
          .eq('bill_number', billNum);
      }
    } catch (error) {
      console.error('Error sending bill email:', error);
    }
  };

  const processPayment = async () => {
    const newBillNumber = generateBillNumber();
    setBillNumber(newBillNumber);
    
    setShowScanner(true);
    setIsProcessing(true);

    // Simulate barcode scanning and payment
    setTimeout(async () => {
      setShowScanner(false);
      setIsComplete(true);
      
      // Save billing history and send email
      await saveBillingHistory(newBillNumber);
      await sendBillEmail(newBillNumber);
      
      // Confetti explosion!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34D399', '#FED7AA', '#DDD6FE'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    }, 3000);
  };

  const handlePayment = () => {
    if (!isAuthenticated) {
      setPendingPayment(true);
      setShowAuthModal(true);
    } else {
      processPayment();
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingPayment) {
      setPendingPayment(false);
      processPayment();
    }
  };

  const handleDownloadBill = () => {
    generateBillPDF({
      items,
      subtotal: totalPrice,
      gst,
      total: finalTotal,
      email: email || 'Guest',
      billNumber: billNumber,
    });
    toast({
      title: t.downloadBill,
      description: 'Your bill has been downloaded.',
    });
  };


  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-2xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              {/* Trolley Animation */}
              <motion.div
                initial={{ x: '-100vw' }}
                animate={{ x: '100vw' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                className="text-6xl mb-8"
              >
                🛒
              </motion.div>

              <div className="text-8xl mb-6">✅</div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                {t.paymentSuccessful}
              </h1>
              <p className="text-muted-foreground mb-4">
                {t.thankYouShopping}
              </p>
              
              {email && (
                <p className="text-sm text-muted-foreground mb-8">
                  <Mail className="w-4 h-4 inline mr-1" />
                  {t.billSentTo} {email}
                </p>
              )}

              <Card variant="elevated" className="mb-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-4">{t.orderSummary}</h3>
                  <div className="space-y-2 text-sm">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span className="text-muted-foreground">
                          {item.name} 
                          {item.weightInGrams ? ` (${formatWeight(item.weightInGrams)})` : ` x${item.quantity}`}
                        </span>
                        <span className="text-foreground">
                          Rs. {((item.calculatedPrice ?? item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="h-px bg-border my-3" />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.subtotal}</span>
                      <span className="text-foreground">Rs. {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.gst}</span>
                      <span className="text-foreground">Rs. {gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span className="text-foreground">{t.total}</span>
                      <span className="text-primary">Rs. {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="hero" size="lg" className="w-full" onClick={handleDownloadBill}>
                    <Download className="w-5 h-5 mr-2" />
                    {t.downloadBill}
                  </Button>
                </motion.div>
                
                
                <Link to="/products" className="w-full">
                  <Button variant="outline" size="lg" className="w-full" onClick={() => {
                    clearCart();
                    setIsComplete(false);
                    setIsProcessing(false);
                  }}>
                    {t.continueShopping}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />

      {/* Magic Link Auth Modal */}
      <MagicLinkAuth
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingPayment(false);
        }}
        onSuccess={handleAuthSuccess}
      />

      {/* Barcode Scanner Overlay */}
      <AnimatePresence>
        {showScanner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/80 flex items-center justify-center"
          >
            <div className="text-center">
              {/* Scanner Box */}
              <div className="relative w-64 h-40 border-4 border-primary rounded-xl mb-6 overflow-hidden">
                <motion.div
                  className="absolute left-0 right-0 h-1 bg-destructive"
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-primary text-sm">|||||||||||||||</span>
                </div>
              </div>
              <p className="text-primary-foreground font-medium">{t.scanningItems}</p>

              {/* Falling Coins */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-3xl"
                    initial={{ 
                      top: '-10%',
                      left: `${10 + i * 8}%`,
                      rotate: 0,
                    }}
                    animate={{
                      top: '110%',
                      rotate: 720,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      ease: 'linear',
                    }}
                  >
                    🪙
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header with Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.continueShopping}
                </Link>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                  {t.yourCart}
                </h1>
              </div>
              <div className="flex gap-2">
                <FamilySyncMode />
                <FindHelpButton />
              </div>
            </div>
          </motion.div>

          {/* Billing Counter Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <BillingCounterStatus />
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="text-8xl mb-6 block">🛒</span>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                {t.cartIsEmpty}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t.startAddingItems}
              </p>
              <Link to="/products">
                <Button variant="hero" size="lg">
                  {t.browseProductsBtn}
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                    >
                      <Card variant="default" className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {/* Product Image */}
                            <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                              {item.image.startsWith('http') ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-3xl">{item.image}</span>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">
                                {item.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.brand}
                              </p>
                              {item.weightInGrams ? (
                                <div className="flex items-center gap-1">
                                  <Scale className="w-3 h-3 text-primary" />
                                  <span className="text-xs text-muted-foreground">
                                    {formatWeight(item.weightInGrams)}
                                  </span>
                                  <span className="font-bold text-primary">
                                    Rs. {item.calculatedPrice?.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <p className="font-bold text-primary">
                                  Rs. {item.price}
                                </p>
                              )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Remove */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="font-display font-semibold text-foreground">
                        {t.frequentlyBoughtTogether}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {recommendations.map((product) => (
                        <Card key={product.id} variant="product" className="p-3">
                          <div className="h-12 flex items-center justify-center mb-2 overflow-hidden rounded">
                            {product.image.startsWith('http') ? (
                              <img src={product.image} alt={product.name} className="h-full object-contain" />
                            ) : (
                              <span className="text-3xl">{product.image}</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-primary font-bold">
                            Rs. {product.price}
                          </p>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card variant="elevated" className="sticky top-24">
                  <CardHeader>
                    <CardTitle>{t.orderSummary}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Verified Email Display */}
                    {isAuthenticated && email && (
                      <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-xl">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground truncate">{email}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">{t.verified}</Badge>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t.subtotal} ({items.length} {t.items})</span>
                      <span>Rs. {totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t.gst}</span>
                      <span>Rs. {gst.toFixed(2)}</span>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="flex justify-between font-bold text-lg text-foreground">
                      <span>{t.total}</span>
                      <span>Rs. {finalTotal.toFixed(2)}</span>
                    </div>

                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full mt-6"
                      onClick={handlePayment}
                      disabled={isProcessing}
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      {isProcessing ? 'Processing...' : isAuthenticated ? t.payNow : 'Verify & Pay'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Checkout;