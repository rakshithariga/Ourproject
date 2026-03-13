import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface BillingCounter {
  id: number;
  counter_number: number;
  status: 'available' | 'busy' | 'offline';
  wait_time_minutes: number;
  customers_in_queue: number;
  updated_at: string;
}

interface BillingCounterStatusProps {
  compact?: boolean;
}

const BillingCounterStatus = ({ compact = false }: BillingCounterStatusProps) => {
  const [counters, setCounters] = useState<BillingCounter[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    fetchCounters();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('billing-counters')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'billing_counters',
        },
        () => {
          fetchCounters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCounters = async () => {
    const { data, error } = await supabase
      .from('billing_counters')
      .select('*')
      .order('counter_number');

    if (!error && data) {
      setCounters(data as BillingCounter[]);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'busy':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (counter: BillingCounter) => {
    if (counter.status === 'available') {
      return t.counterAvailable || 'Empty';
    } else if (counter.status === 'busy') {
      return `${counter.wait_time_minutes} ${t.minWait || 'min wait'}`;
    } else {
      return t.counterOffline || 'Offline';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-muted rounded-xl h-24" />
    );
  }

  // Compact view for home page
  if (compact) {
    const availableCount = counters.filter(c => c.status === 'available').length;
    const fastestCounter = counters
      .filter(c => c.status !== 'offline')
      .sort((a, b) => a.wait_time_minutes - b.wait_time_minutes)[0];

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            {availableCount} {t.countersAvailable || 'counters available'}
          </span>
        </div>
        {fastestCounter && (
          <Badge variant="secondary" className="text-xs">
            {t.fastest || 'Fastest'}: #{fastestCounter.counter_number}
          </Badge>
        )}
      </motion.div>
    );
  }

  // Full view for checkout page
  return (
    <Card variant="elevated">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          {t.billingCounterStatus || 'Billing Counter Status'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {counters.map((counter, index) => (
            <motion.div
              key={counter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-3 rounded-xl border ${
                counter.status === 'available'
                  ? 'border-green-500/30 bg-green-500/10'
                  : counter.status === 'busy'
                  ? 'border-yellow-500/30 bg-yellow-500/10'
                  : 'border-gray-300/30 bg-gray-100/10'
              }`}
            >
              {/* Live indicator */}
              <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${getStatusColor(counter.status)} ${counter.status !== 'offline' ? 'animate-pulse' : ''}`} />
              
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(counter.status)}
                <span className="font-bold text-foreground">
                  #{counter.counter_number}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getStatusLabel(counter)}
              </p>
              
              {counter.customers_in_queue > 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {counter.customers_in_queue} {t.inQueue || 'in queue'}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          {t.liveUpdates || 'Live updates • Choose the fastest counter'}
        </p>
      </CardContent>
    </Card>
  );
};

export default BillingCounterStatus;
