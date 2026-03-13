import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Link2, Copy, Check, X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/context/CartContext';

interface SharedCartItem {
  id: string;
  session_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  quantity: number;
  is_checked: boolean;
  added_by: string;
  added_at: string;
}

interface SessionMember {
  id: string;
  session_id: string;
  member_name: string;
  joined_at: string;
}

const FamilySyncMode = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionCode, setSessionCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [sharedItems, setSharedItems] = useState<SharedCartItem[]>([]);
  const [members, setMembers] = useState<SessionMember[]>([]);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const savedSession = localStorage.getItem('smartbazaar-family-session');
    const savedName = localStorage.getItem('smartbazaar-member-name');
    
    if (savedSession && savedName) {
      setActiveSession(savedSession);
      setMemberName(savedName);
      fetchSessionData(savedSession);
    }
  }, []);

  useEffect(() => {
    if (!activeSession) return;

    // Subscribe to real-time updates for shared cart
    const cartChannel = supabase
      .channel('shared-cart')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shared_cart_items',
          filter: `session_id=eq.${activeSession}`,
        },
        () => fetchSessionData(activeSession)
      )
      .subscribe();

    const membersChannel = supabase
      .channel('session-members')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'session_members',
          filter: `session_id=eq.${activeSession}`,
        },
        () => fetchSessionData(activeSession)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(cartChannel);
      supabase.removeChannel(membersChannel);
    };
  }, [activeSession]);

  const fetchSessionData = async (sessionId: string) => {
    const [itemsRes, membersRes] = await Promise.all([
      supabase.from('shared_cart_items').select('*').eq('session_id', sessionId),
      supabase.from('session_members').select('*').eq('session_id', sessionId),
    ]);

    if (itemsRes.data) setSharedItems(itemsRes.data as SharedCartItem[]);
    if (membersRes.data) setMembers(membersRes.data as SessionMember[]);
  };

  const generateSessionCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createSession = async () => {
    if (!memberName.trim()) {
      toast({ title: t.enterYourName || 'Please enter your name', variant: 'destructive' });
      return;
    }

    const code = generateSessionCode();
    
    const { data: session, error } = await supabase
      .from('shopping_sessions')
      .insert({ session_code: code, created_by: memberName })
      .select()
      .single();

    if (error) {
      toast({ title: t.errorCreatingSession || 'Error creating session', variant: 'destructive' });
      return;
    }

    // Add creator as member
    await supabase.from('session_members').insert({
      session_id: session.id,
      member_name: memberName,
    });

    setSessionCode(code);
    setActiveSession(session.id);
    localStorage.setItem('smartbazaar-family-session', session.id);
    localStorage.setItem('smartbazaar-member-name', memberName);
    
    toast({ title: t.sessionCreated || 'Session created! Share the code with family.' });
  };

  const joinSession = async () => {
    if (!memberName.trim() || !joinCode.trim()) {
      toast({ title: t.enterNameAndCode || 'Please enter your name and session code', variant: 'destructive' });
      return;
    }

    const { data: session, error } = await supabase
      .from('shopping_sessions')
      .select('*')
      .eq('session_code', joinCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !session) {
      toast({ title: t.invalidSessionCode || 'Invalid session code', variant: 'destructive' });
      return;
    }

    await supabase.from('session_members').insert({
      session_id: session.id,
      member_name: memberName,
    });

    setActiveSession(session.id);
    setSessionCode(joinCode.toUpperCase());
    localStorage.setItem('smartbazaar-family-session', session.id);
    localStorage.setItem('smartbazaar-member-name', memberName);
    
    toast({ title: t.joinedSession || 'Joined family session!' });
  };

  const addToSharedCart = async (product: Product) => {
    if (!activeSession) return;

    const existing = sharedItems.find(item => item.product_id === product.id);
    
    if (existing) {
      await supabase
        .from('shared_cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
    } else {
      await supabase.from('shared_cart_items').insert({
        session_id: activeSession,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image,
        quantity: 1,
        added_by: memberName,
      });
    }
  };

  const updateItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await supabase.from('shared_cart_items').delete().eq('id', itemId);
    } else {
      await supabase.from('shared_cart_items').update({ quantity: newQuantity }).eq('id', itemId);
    }
  };

  const toggleItemChecked = async (itemId: string, isChecked: boolean) => {
    await supabase.from('shared_cart_items').update({ is_checked: !isChecked }).eq('id', itemId);
  };

  const leaveSession = () => {
    setActiveSession(null);
    setSessionCode('');
    setSharedItems([]);
    setMembers([]);
    localStorage.removeItem('smartbazaar-family-session');
    localStorage.removeItem('smartbazaar-member-name');
    toast({ title: t.leftSession || 'Left family session' });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPrice = sharedItems.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="w-4 h-4" />
          {activeSession ? (
            <Badge variant="secondary" className="text-xs">
              {members.length} {t.members || 'members'}
            </Badge>
          ) : (
            t.familySync || 'Family Sync'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t.familySyncMode || 'Family Sync Mode'}
          </DialogTitle>
        </DialogHeader>

        {!activeSession ? (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t.yourName || 'Your Name'}
              </label>
              <Input
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                placeholder={t.enterYourName || 'Enter your name'}
              />
            </div>

            <div className="space-y-3">
              <Button onClick={createSession} variant="hero" className="w-full">
                <Link2 className="w-4 h-4 mr-2" />
                {t.createNewSession || 'Create New Session'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">{t.or || 'or'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder={t.enterSessionCode || 'Enter session code'}
                  className="text-center uppercase tracking-widest"
                  maxLength={6}
                />
                <Button onClick={joinSession} variant="outline" className="w-full">
                  {t.joinExistingSession || 'Join Existing Session'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Session Code */}
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground">{t.sessionCode || 'Session Code'}</p>
                <p className="font-mono font-bold text-lg tracking-widest">{sessionCode}</p>
              </div>
              <Button variant="outline" size="icon" onClick={copyCode}>
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            {/* Members */}
            <div className="flex flex-wrap gap-2">
              {members.map((member) => (
                <Badge key={member.id} variant="secondary">
                  {member.member_name}
                </Badge>
              ))}
            </div>

            {/* Shared Cart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  {t.sharedCart || 'Shared Cart'} ({sharedItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-48 overflow-y-auto">
                <AnimatePresence>
                  {sharedItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center gap-2 p-2 rounded-lg ${
                        item.is_checked ? 'bg-green-500/10' : 'bg-secondary'
                      }`}
                    >
                      <button
                        onClick={() => toggleItemChecked(item.id, item.is_checked)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          item.is_checked
                            ? 'bg-green-500 border-green-500'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {item.is_checked && <Check className="w-3 h-3 text-white" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${item.is_checked ? 'line-through text-muted-foreground' : ''}`}>
                          {item.product_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.addedBy || 'by'} {item.added_by}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {sharedItems.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t.noItemsYet || 'No items yet. Add from product pages!'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Total */}
            {sharedItems.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-muted rounded-xl">
                <span className="font-medium">{t.total || 'Total'}</span>
                <span className="font-bold text-primary">Rs. {totalPrice.toFixed(2)}</span>
              </div>
            )}

            {/* Leave Session */}
            <Button variant="outline" className="w-full text-destructive" onClick={leaveSession}>
              <X className="w-4 h-4 mr-2" />
              {t.leaveSession || 'Leave Session'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FamilySyncMode;
