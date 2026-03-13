import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HandHelping, MapPin, Package, MessageSquare, Check, Bell, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface HelpRequest {
  id: string;
  request_type: 'aisle' | 'product' | 'general';
  aisle_location: string | null;
  product_name: string | null;
  message: string | null;
  customer_identifier: string;
  status: 'pending' | 'assigned' | 'resolved';
  assigned_to: string | null;
  created_at: string;
  resolved_at: string | null;
}

const HelpRequestsPanel = () => {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('help-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'help_requests',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Play notification sound or show alert for new requests
            toast({ title: t.newHelpRequest || 'New help request received!' });
          }
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from('help_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setRequests(data as HelpRequest[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'assigned' | 'resolved') => {
    const updates: Partial<HelpRequest> = {
      status,
      ...(status === 'resolved' && { resolved_at: new Date().toISOString() }),
    };

    await supabase.from('help_requests').update(updates).eq('id', id);
    toast({ title: status === 'resolved' ? t.requestResolved || 'Request marked as resolved' : t.requestAssigned || 'Request assigned' });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'aisle':
        return <MapPin className="w-4 h-4" />;
      case 'product':
        return <Package className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-yellow-50';
      case 'assigned':
        return 'bg-blue-500 text-blue-50';
      case 'resolved':
        return 'bg-green-500 text-green-50';
      default:
        return 'bg-gray-500 text-gray-50';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) {
    return <div className="animate-pulse bg-muted rounded-xl h-64" />;
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HandHelping className="w-5 h-5 text-primary" />
            {t.helpRequests || 'Help Requests'}
          </div>
          {pendingCount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground animate-pulse">
              <Bell className="w-3 h-3 mr-1" />
              {pendingCount} {t.pending || 'pending'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {requests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t.noHelpRequests || 'No help requests at the moment'}
              </p>
            ) : (
              requests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-xl border ${
                    request.status === 'pending'
                      ? 'border-yellow-500/30 bg-yellow-500/5'
                      : request.status === 'assigned'
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-green-500/30 bg-green-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(request.request_type)}
                        <span className="font-medium text-foreground capitalize">
                          {request.request_type === 'aisle'
                            ? `${t.aisleHelp || 'Aisle Help'}: ${request.aisle_location || 'Unknown'}`
                            : request.request_type === 'product'
                            ? `${t.findProduct || 'Find Product'}: ${request.product_name || 'Unknown'}`
                            : t.generalHelp || 'General Help'}
                        </span>
                        <Badge className={`${getStatusColor(request.status)} text-xs`}>
                          {request.status}
                        </Badge>
                      </div>

                      {request.message && (
                        <p className="text-sm text-muted-foreground mb-2">
                          "{request.message}"
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {formatTime(request.created_at)}
                        <span className="text-muted-foreground/50">•</span>
                        <span className="font-mono">{request.customer_identifier.slice(-6)}</span>
                      </div>
                    </div>

                    {request.status !== 'resolved' && (
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(request.id, 'assigned')}
                          >
                            {t.assign || 'Assign'}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => updateStatus(request.id, 'resolved')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpRequestsPanel;
