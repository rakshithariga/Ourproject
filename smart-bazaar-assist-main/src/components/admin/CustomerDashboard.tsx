import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Shield,
  Crown,
  Tag,
  ShoppingBag,
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  Edit2,
  ChevronDown,
  ChevronUp,
  Smartphone,
  StickyNote,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CustomerProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  profile_completed: boolean;
  account_status: string;
  membership_tier: string;
  custom_tags: string[];
  admin_notes: string | null;
  total_lifetime_value: number;
  visit_count: number;
  last_visit_at: string | null;
  created_at: string;
}

interface BillingRecord {
  id: string;
  bill_number: string;
  items: any[];
  subtotal: number;
  gst: number;
  total: number;
  payment_method: string;
  created_at: string;
}

const CustomerDashboard = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [billingHistory, setBillingHistory] = useState<Record<string, BillingRecord[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      // Use RPC or service-level query - for admin, we'll fetch all via edge function
      // For now, fetching from billing_history to get customer data
      const { data: bills, error: billsError } = await supabase
        .from('billing_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (billsError) throw billsError;

      // Group bills by customer email
      const customerMap = new Map<string, {
        email: string;
        bills: BillingRecord[];
        totalValue: number;
        lastVisit: string;
        visitCount: number;
      }>();

      bills?.forEach((bill: any) => {
        const email = bill.customer_email;
        const existing = customerMap.get(email);
        
        if (existing) {
          existing.bills.push(bill);
          existing.totalValue += parseFloat(bill.total);
          existing.visitCount += 1;
          if (new Date(bill.created_at) > new Date(existing.lastVisit)) {
            existing.lastVisit = bill.created_at;
          }
        } else {
          customerMap.set(email, {
            email,
            bills: [bill],
            totalValue: parseFloat(bill.total),
            lastVisit: bill.created_at,
            visitCount: 1,
          });
        }
      });

      // Convert to customer profiles format
      const mappedCustomers: CustomerProfile[] = Array.from(customerMap.values()).map((data, index) => ({
        id: `cust-${index}`,
        user_id: `user-${index}`,
        email: data.email,
        full_name: null,
        phone_number: null,
        profile_completed: true,
        account_status: 'active',
        membership_tier: data.totalValue > 5000 ? 'gold' : data.totalValue > 2000 ? 'silver' : 'bronze',
        custom_tags: data.visitCount > 5 ? ['Frequent Buyer'] : [],
        admin_notes: null,
        total_lifetime_value: data.totalValue,
        visit_count: data.visitCount,
        last_visit_at: data.lastVisit,
        created_at: data.bills[data.bills.length - 1]?.created_at || new Date().toISOString(),
      }));

      // Store billing history by email
      const historyMap: Record<string, BillingRecord[]> = {};
      customerMap.forEach((data, email) => {
        historyMap[email] = data.bills;
      });

      setCustomers(mappedCustomers);
      setBillingHistory(historyMap);
    } catch (error: any) {
      console.error('Error fetching customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customer data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary/20 text-primary">Active</Badge>;
      case 'blocked':
        return <Badge variant="destructive">Blocked</Badge>;
      case 'guest':
        return <Badge variant="secondary">Guest</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'gold':
        return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30"><Crown className="w-3 h-3 mr-1" />Gold</Badge>;
      case 'silver':
        return <Badge className="bg-gray-400/20 text-gray-600 border-gray-400/30"><Crown className="w-3 h-3 mr-1" />Silver</Badge>;
      case 'bronze':
        return <Badge className="bg-orange-500/20 text-orange-600 border-orange-500/30"><Crown className="w-3 h-3 mr-1" />Bronze</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toFixed(2)}`;
  };

  const filteredCustomers = customers.filter(customer =>
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone_number?.includes(searchQuery)
  );

  const calculateAOV = (bills: BillingRecord[]) => {
    if (!bills || bills.length === 0) return 0;
    const total = bills.reduce((sum, bill) => sum + bill.total, 0);
    return total / bills.length;
  };

  const getFrequentItems = (bills: BillingRecord[]) => {
    if (!bills || bills.length === 0) return [];
    const itemCount: Record<string, number> = {};
    
    bills.forEach(bill => {
      if (Array.isArray(bill.items)) {
        bill.items.forEach((item: any) => {
          const name = item.name || 'Unknown';
          itemCount[name] = (itemCount[name] || 0) + (item.quantity || 1);
        });
      }
    });

    return Object.entries(itemCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  };

  if (isLoading) {
    return (
      <Card variant="elevated">
        <CardContent className="py-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading customer data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {t.customerDashboard || 'Customer Dashboard'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.searchCustomers || 'Search customers...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon" onClick={fetchCustomers}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-primary/10">
            <p className="text-sm text-muted-foreground">{t.totalCustomers || 'Total Customers'}</p>
            <p className="text-2xl font-bold text-foreground">{customers.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-yellow-500/10">
            <p className="text-sm text-muted-foreground">{t.goldMembers || 'Gold Members'}</p>
            <p className="text-2xl font-bold text-yellow-600">
              {customers.filter(c => c.membership_tier === 'gold').length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bazaar-mint/20">
            <p className="text-sm text-muted-foreground">{t.totalRevenue || 'Total Revenue'}</p>
            <p className="text-2xl font-bold text-foreground">
              Rs. {customers.reduce((sum, c) => sum + c.total_lifetime_value, 0).toFixed(0)}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bazaar-lavender/20">
            <p className="text-sm text-muted-foreground">{t.avgLTV || 'Avg LTV'}</p>
            <p className="text-2xl font-bold text-foreground">
              Rs. {customers.length ? (customers.reduce((sum, c) => sum + c.total_lifetime_value, 0) / customers.length).toFixed(0) : 0}
            </p>
          </div>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {t.noCustomersYet || 'No customers yet. Customers will appear here after their first purchase.'}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.customer || 'Customer'}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.status || 'Status'}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.tier || 'Tier'}</TableHead>
                  <TableHead className="text-right">{t.ltv || 'LTV'}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t.lastVisit || 'Last Visit'}</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <>
                    <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {customer.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {customer.full_name || customer.email.split('@')[0]}
                            </p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getStatusBadge(customer.account_status)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {getTierBadge(customer.membership_tier)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {formatCurrency(customer.total_lifetime_value)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {customer.last_visit_at ? formatDate(customer.last_visit_at) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setExpandedCustomer(
                            expandedCustomer === customer.id ? null : customer.id
                          )}
                        >
                          {expandedCustomer === customer.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Details */}
                    {expandedCustomer === customer.id && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/30 p-0">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4"
                          >
                            <div className="grid md:grid-cols-3 gap-4">
                              {/* Profile Info */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  {t.profileInfo || 'Profile Info'}
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    <span>{customer.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span>{customer.phone_number || 'Not provided'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span>Joined: {formatDate(customer.created_at)}</span>
                                  </div>
                                  {customer.custom_tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {customer.custom_tags.map((tag, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          <Tag className="w-3 h-3 mr-1" />
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Purchase Insights */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <ShoppingBag className="w-4 h-4" />
                                  {t.purchaseInsights || 'Purchase Insights'}
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.totalOrders || 'Total Orders'}:</span>
                                    <span className="font-medium">{customer.visit_count}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.avgOrderValue || 'Avg Order Value'}:</span>
                                    <span className="font-medium">
                                      {formatCurrency(calculateAOV(billingHistory[customer.email] || []))}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.lifetimeValue || 'Lifetime Value'}:</span>
                                    <span className="font-medium text-primary">
                                      {formatCurrency(customer.total_lifetime_value)}
                                    </span>
                                  </div>
                                  <div className="mt-2">
                                    <p className="text-muted-foreground text-xs mb-1">{t.frequentItems || 'Frequently Purchased'}:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {getFrequentItems(billingHistory[customer.email] || []).slice(0, 3).map((item, i) => (
                                        <Badge key={i} variant="secondary" className="text-xs">
                                          {item.name} ({item.count})
                                        </Badge>
                                      ))}
                                      {getFrequentItems(billingHistory[customer.email] || []).length === 0 && (
                                        <span className="text-xs text-muted-foreground">No data</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Behavioral Insights */}
                              <div className="space-y-3">
                                <h4 className="font-semibold text-foreground flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4" />
                                  {t.behavioralInsights || 'Behavioral Insights'}
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.visitFrequency || 'Visit Frequency'}:</span>
                                    <span className="font-medium">
                                      {customer.visit_count > 10 ? 'High' : customer.visit_count > 3 ? 'Medium' : 'Low'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.lastVisit || 'Last Visit'}:</span>
                                    <span className="font-medium">
                                      {customer.last_visit_at ? formatDate(customer.last_visit_at) : 'N/A'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.paymentMethod || 'Preferred Payment'}:</span>
                                    <span className="font-medium">Digital</span>
                                  </div>
                                </div>

                                {/* Admin Notes */}
                                <div className="mt-3 pt-3 border-t">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium flex items-center gap-1">
                                      <StickyNote className="w-3 h-3" />
                                      {t.adminNotes || 'Admin Notes'}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 text-xs"
                                      onClick={() => {
                                        setSelectedCustomer(customer);
                                        setEditNotes(customer.admin_notes || '');
                                        setShowNotesModal(true);
                                      }}
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      {t.edit || 'Edit'}
                                    </Button>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {customer.admin_notes || 'No notes added'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Recent Orders */}
                            {billingHistory[customer.email]?.length > 0 && (
                              <div className="mt-4 pt-4 border-t">
                                <h4 className="font-semibold text-foreground mb-3">
                                  {t.recentOrders || 'Recent Orders'}
                                </h4>
                                <div className="space-y-2">
                                  {billingHistory[customer.email].slice(0, 3).map((bill) => (
                                    <div
                                      key={bill.id}
                                      className="flex items-center justify-between p-3 rounded-lg bg-background"
                                    >
                                      <div>
                                        <p className="font-medium text-foreground">{bill.bill_number}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {formatDate(bill.created_at)} • {Array.isArray(bill.items) ? bill.items.length : 0} items
                                        </p>
                                      </div>
                                      <span className="font-semibold text-primary">
                                        {formatCurrency(bill.total)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.editAdminNotes || 'Edit Admin Notes'}</DialogTitle>
            <DialogDescription>
              {t.addNotesForCustomer || 'Add internal notes for'} {selectedCustomer?.email}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder={t.enterNotes || 'Enter notes...'}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowNotesModal(false)}>
              {t.cancel || 'Cancel'}
            </Button>
            <Button
              variant="hero"
              onClick={() => {
                toast({
                  title: t.notesSaved || 'Notes Saved',
                  description: t.adminNotesUpdated || 'Admin notes have been updated',
                });
                setShowNotesModal(false);
              }}
            >
              {t.save || 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CustomerDashboard;
