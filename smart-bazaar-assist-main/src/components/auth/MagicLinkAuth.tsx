import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
export interface MagicLinkAuthProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  redirectTo?: string;
}

const MagicLinkAuth = ({ isOpen, onClose, onSuccess, redirectTo = '/checkout' }: MagicLinkAuthProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { persistCartForAuth } = useCart();

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        onSuccess?.();
      }
    });

    return () => subscription.unsubscribe();
  }, [onSuccess]);

  // If user is already authenticated, call onSuccess
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onSuccess?.();
    }
  }, [isAuthenticated, isOpen, onSuccess]);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t.error || 'Error',
        description: t.pleaseEnterEmail || 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Persist cart before sending magic link
      persistCartForAuth();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      if (error) throw error;

      setIsSent(true);
      toast({
        title: t.magicLinkSent || 'Magic Link Sent!',
        description: t.checkYourEmail || 'Check your email for the login link',
      });
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast({
        title: t.error || 'Error',
        description: error.message || t.failedToSendLink || 'Failed to send magic link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const content = isSent ? (
    <Card variant="elevated" className="w-full border-0 shadow-none">
      <CardContent className="pt-8 pb-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          {t.checkYourInbox || 'Check Your Inbox'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {t.magicLinkSentTo || "We've sent a magic link to"}
        </p>
        <p className="font-semibold text-foreground mb-6">{email}</p>
        <p className="text-sm text-muted-foreground mb-6">
          {t.clickLinkToLogin || 'Click the link in the email to log in'}
        </p>
        <Button variant="outline" onClick={() => setIsSent(false)}>
          {t.tryDifferentEmail || 'Try a different email'}
        </Button>
      </CardContent>
    </Card>
  ) : (
    <Card variant="elevated" className="w-full border-0 shadow-none">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="font-display text-2xl">
          {t.signInToCheckout || 'Sign in to Checkout'}
        </CardTitle>
        <CardDescription>
          {t.enterEmailForMagicLink || 'Enter your email to receive a magic link'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendMagicLink} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              {t.email || 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pl-10 h-12"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button
            type="submit"
            variant="hero"
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t.sending || 'Sending...'}
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                {t.sendMagicLink || 'Send Magic Link'}
              </>
            )}
          </Button>

          {onClose && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={onClose}
            >
              {t.cancel || 'Cancel'}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );

  // If isOpen is provided, render as a modal dialog
  if (isOpen !== undefined) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise, render inline
  return <div className="w-full max-w-md mx-auto">{content}</div>;
};

export default MagicLinkAuth;
