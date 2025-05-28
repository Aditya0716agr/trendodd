
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, Database } from 'lucide-react';

const PriceHistoryBackfill = () => {
  const [isRunning, setIsRunning] = useState(false);

  const handleBackfill = async () => {
    setIsRunning(true);
    try {
      toast.loading('Running price history backfill...');
      
      const { data, error } = await supabase.functions.invoke('daily-price-update', {
        body: { backfill: true }
      });

      if (error) {
        console.error('Backfill error:', error);
        toast.dismiss();
        toast.error('Failed to run backfill');
        return;
      }

      toast.dismiss();
      toast.success(`Backfill completed! ${data.totalPointsAdded} price points added across ${data.marketsUpdated} markets.`);
      
    } catch (error) {
      console.error('Error running backfill:', error);
      toast.dismiss();
      toast.error('Failed to run backfill');
    } finally {
      setIsRunning(false);
    }
  };

  const handleDailyUpdate = async () => {
    setIsRunning(true);
    try {
      toast.loading('Running daily price update...');
      
      const { data, error } = await supabase.functions.invoke('daily-price-update');

      if (error) {
        console.error('Daily update error:', error);
        toast.dismiss();
        toast.error('Failed to run daily update');
        return;
      }

      toast.dismiss();
      toast.success(`Daily update completed! ${data.marketsUpdated} markets updated.`);
      
    } catch (error) {
      console.error('Error running daily update:', error);
      toast.dismiss();
      toast.error('Failed to run daily update');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Price History Management
        </CardTitle>
        <CardDescription>
          Manually trigger price history updates for market charts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleBackfill} 
          disabled={isRunning}
          className="w-full"
          variant="default"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            'Run Backfill (Fill Missing Days)'
          )}
        </Button>
        
        <Button 
          onClick={handleDailyUpdate} 
          disabled={isRunning}
          className="w-full"
          variant="outline"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            'Run Daily Update (Today Only)'
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground">
          The backfill will add daily price points for all missing days between the last recorded price and yesterday. 
          The cron job will automatically run daily updates going forward.
        </p>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryBackfill;
