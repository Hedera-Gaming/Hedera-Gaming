import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Sword, Target, Clock } from 'lucide-react';
import { useNFTRewards } from '@/hooks/useNFTRewards';
import { useWalletConnect } from '@/hooks/useWalletConnect';

interface NFTRewardsDisplayProps {
  limit?: number;
}

export const NFTRewardsDisplay = ({ limit = 5 }: NFTRewardsDisplayProps) => {
  const { wallet } = useWalletConnect();
  const { playerNFTs, isLoading } = useNFTRewards(wallet);

  if (isLoading) {
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
          Récompenses NFT ({playerNFTs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {playerNFTs.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Aucune récompense NFT pour le moment
          </div>
        ) : (
          <div className="space-y-3">
            {playerNFTs.slice(0, limit).map((nft) => (
              <div
                key={nft.tokenId}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                    {nft.achievement.achievementType === 'kills' ? (
                      <Sword className="h-5 w-5 text-primary-foreground" />
                    ) : nft.achievement.achievementType === 'accuracy' ? (
                      <Target className="h-5 w-5 text-primary-foreground" />
                    ) : nft.achievement.achievementType === 'time' ? (
                      <Clock className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <Award className="h-5 w-5 text-primary-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{nft.achievement.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {nft.achievement.rarity} · Token #{nft.tokenId}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={
                    nft.achievement.rarity === 'Legendary' ? 'destructive' :
                    nft.achievement.rarity === 'Epic' ? 'default' :
                    nft.achievement.rarity === 'Rare' ? 'secondary' :
                    'outline'
                  }
                >
                  {nft.achievement.rarity}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
