import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, CheckCircle, XCircle, Minus, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface BillingCounter {
  id: number;
  counter_number: number;
  status: 'available' | 'busy' | 'offline';
  wait_time_minutes: number;
  customers_in_queue: number;
  updated_at: string;
}

const CounterManagement = () => {
  const [counters, setCounters] = useState<BillingCounter[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    fetchCounters();

    const channel = supabase
      .channel('counter-management')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'billing_counters' },
        () => fetchCounters()
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

  const updateCounter = async (id: number, updates: Partial<BillingCounter>) => {
    await supabase
      .from('billing_counters')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    toast({ title: t.counterUpdated || 'Counter updated' });
  };

  const updateWaitTime = async (counter: BillingCounter, change: number) => {
    const newTime = Math.max(0, counter.wait_time_minutes + change);
    await updateCounter(counter.id, { wait_time_minutes: newTime });
  };

  const updateQueue = async (counter: BillingCounter, change: number) => {
    const newQueue = Math.max(0, counter.customers_in_queue + change);
    await updateCounter(counter.id, { customers_in_queue: newQueue });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'busy':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-muted rounded-xl h-64" />;
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          {t.counterManagement || 'Counter Management'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {counters.map((counter, index) => (
            <motion.div
              key={counter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(counter.status)}
                  <span className="font-bold text-lg">#{counter.counter_number}</span>
                </div>
                <Select
                  value={counter.status}
                  onValueChange={(value) => updateCounter(counter.id, { status: value as 'available' | 'busy' | 'offline' })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">{t.available || 'Available'}</SelectItem>
                    <SelectItem value="busy">{t.busy || 'Busy'}</SelectItem>
                    <SelectItem value="offline">{t.offline || 'Offline'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {/* Wait Time */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t.waitTime || 'Wait Time'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateWaitTime(counter, -5)}
                      disabled={counter.wait_time_minutes === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {counter.wait_time_minutes} {t.min || 'min'}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateWaitTime(counter, 5)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Queue */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t.inQueue || 'In Queue'}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQueue(counter, -1)}
                      disabled={counter.customers_in_queue === 0}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-12 text-center font-medium">
                      {counter.customers_in_queue}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7"
                      onClick={() => updateQueue(counter, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CounterManagement;
