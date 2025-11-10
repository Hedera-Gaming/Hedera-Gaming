import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

interface NFTReward {
  id: string;
  token_id: string;
  serial_number: number;
  reward_type: string;
  metadata: any;
  created_at: string;
}

interface NFTRewardsDisplayProps {
  profileId?: string;
  limit?: number;
}

export const NFTRewardsDisplay = ({ profileId, limit = 5 }: NFTRewardsDisplayProps) => {
  const [rewards, setRewards] = useState<NFTReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      let query = supabase
        .from('nft_rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileId) {
        query = query.eq('profile_id', profileId);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data } = await query;
      if (data) setRewards(data);
      setLoading(false);
    };

    fetchRewards();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('nft-rewards')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'nft_rewards',
          filter: profileId ? `profile_id=eq.${profileId}` : undefined,
        },
        (payload) => {
          setRewards((prev) => [payload.new as NFTReward, ...prev.slice(0, limit - 1)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, limit]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Récompenses NFT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Récompenses NFT ({rewards.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rewards.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Aucune récompense NFT pour le moment
          </div>
        ) : (
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{reward.reward_type}</p>
                    <p className="text-xs text-muted-foreground">
                      Serial #{reward.serial_number}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {new Date(reward.created_at).toLocaleDateString('fr-FR')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
