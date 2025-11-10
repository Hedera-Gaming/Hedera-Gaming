import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Transaction {
  id: string;
  transaction_type: string;
  status: string;
  hedera_tx_id: string | null;
  created_at: string;
  metadata: any;
  token_id: string | null;
}

export const ActivityFeed = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch initial transactions
    const fetchTransactions = async () => {
      const { data } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) setTransactions(data);
    };

    fetchTransactions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('blockchain-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blockchain_transactions',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTransactions((prev) => [payload.new as Transaction, ...prev.slice(0, 19)]);
          } else if (payload.eventType === 'UPDATE') {
            setTransactions((prev) =>
              prev.map((tx) => (tx.id === payload.new.id ? payload.new as Transaction : tx))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      mint: 'Mint NFT',
      transfer: 'Transfert',
      reward: 'Récompense',
      update_score: 'Score Mis à Jour',
    };
    return labels[type] || type;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Console d'Activité Blockchain
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {transactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Aucune transaction pour le moment
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(tx.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {getTypeLabel(tx.transaction_type)}
                        </span>
                        <Badge variant={tx.status === 'success' ? 'default' : 'secondary'}>
                          {tx.status}
                        </Badge>
                      </div>
                      {tx.hedera_tx_id && (
                        <a
                          href={`https://hashscan.io/testnet/transaction/${tx.hedera_tx_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          {tx.hedera_tx_id.slice(0, 20)}...
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {tx.metadata && tx.metadata.serialNumber && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Serial: #{tx.metadata.serialNumber}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatTime(tx.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
