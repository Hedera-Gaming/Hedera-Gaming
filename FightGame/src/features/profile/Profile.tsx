import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useWalletConnect } from '@/shared/hooks/useWalletConnect';
import { useNFTRewards } from '@/shared/hooks/useNFTRewards';
import { useMarketplace } from '@/features/marketplace/hooks/useMarketplace';
import { WalletConnectModal } from '@/shared/components/WalletConnectModal';
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Award,
  TrendingUp, 
  Clock,
  Shield,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const Profile = () => {
  const { wallet, isConnecting, isInitialized, connectMetaMask, connectHashPack } = useWalletConnect();
  const { playerNFTs, isLoading, refreshPlayerNFTs } = useNFTRewards(wallet);
  const { listNFT } = useMarketplace(wallet);
  
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [listingPrice, setListingPrice] = useState('');
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);

  // Load game history from localStorage
  useEffect(() => {
    if (wallet?.address) {
      const historyKey = `game_history_${wallet.address}`;
      const savedHistory = localStorage.getItem(historyKey);
      if (savedHistory) {
        setGameHistory(JSON.parse(savedHistory));
      }
      refreshPlayerNFTs();
    }
  }, [wallet?.address]);

  const handleListNFT = async () => {
    if (!selectedNFT || !listingPrice) return;
    
    const success = await listNFT(selectedNFT.tokenId, listingPrice);
    if (success) {
      setIsListingDialogOpen(false);
      setListingPrice('');
      setSelectedNFT(null);
      toast.success('NFT listed on marketplace!');
    }
  };

  const showWalletModal = isInitialized && !wallet;

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      Bronze: 'text-orange-600',
      Silver: 'text-gray-400',
      Gold: 'text-yellow-500',
      Platinum: 'text-cyan-400',
      Diamond: 'text-purple-500',
      Common: 'text-gray-500',
      Rare: 'text-blue-500',
      Epic: 'text-purple-600',
      Legendary: 'text-orange-500',
      Mythic: 'text-pink-500'
    };
    return colors[rarity] || 'text-gray-400';
  };

  const getRarityIcon = (rarity: string) => {
    const icons: Record<string, string> = {
      Bronze: '🥉',
      Silver: '🥈',
      Gold: '🏆',
      Platinum: '💎',
      Diamond: '💎',
      Common: '⭐',
      Rare: '🌟',
      Epic: '✨',
      Legendary: '🔥',
      Mythic: '👑'
    };
    return icons[rarity] || '🎮';
  };

  if (showWalletModal) {
    return (
      <div className="min-h-screen pt-20">
        <WalletConnectModal
          open={showWalletModal}
          onMetaMaskConnect={connectMetaMask}
          onHashPackConnect={connectHashPack}
          isConnecting={isConnecting}
        />
        <div className="container mx-auto px-4 py-20 text-center">
          <Shield className="h-20 w-20 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl font-bold mb-4 glow-text">Connect Your Wallet</h1>
          <p className="text-lg text-muted-foreground">
            Connect your wallet to view your profile and NFT collection
          </p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return <div className="min-h-screen pt-20" />;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
              🎮
            </div>
            <div>
              <h1 className="text-3xl font-bold glow-text">Player Profile</h1>
              <p className="text-sm text-muted-foreground font-mono">
                {wallet.address.substring(0, 10)}...{wallet.address.substring(wallet.address.length - 8)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">NFTs Owned</p>
                  <p className="text-3xl font-bold text-primary">{playerNFTs.length}</p>
                </div>
                <Trophy className="h-10 w-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Games Played</p>
                  <p className="text-3xl font-bold">{gameHistory.length}</p>
                </div>
                <Target className="h-10 w-10 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {gameHistory.length > 0 
                      ? Math.max(...gameHistory.map(g => g.score || 0)).toLocaleString()
                      : 0
                    }
                  </p>
                </div>
                <Star className="h-10 w-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Kills</p>
                  <p className="text-3xl font-bold text-red-500">
                    {gameHistory.reduce((sum, g) => sum + (g.kills || 0), 0)}
                  </p>
                </div>
                <Zap className="h-10 w-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="nfts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nfts">My NFTs ({playerNFTs.length})</TabsTrigger>
            <TabsTrigger value="history">Game History ({gameHistory.length})</TabsTrigger>
          </TabsList>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading NFTs...</span>
              </div>
            ) : playerNFTs.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-20 text-center">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No NFTs Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Play the game and earn achievements to mint NFTs!
                  </p>
                  <Button onClick={() => window.location.href = '/game'} variant="hero">
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {playerNFTs.map((nft) => (
                  <Card key={nft.tokenId} className="glass-card hover-glow group">
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300">
                      {getRarityIcon(nft.achievement.rarity)}
                    </div>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">{nft.achievement.name}</h3>
                        <span className="text-sm text-muted-foreground">#{nft.tokenId}</span>
                      </div>
                      <p className={`text-sm font-semibold mb-2 ${getRarityColor(nft.achievement.rarity)}`}>
                        {getRarityIcon(nft.achievement.rarity)} {nft.achievement.rarity}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {nft.achievement.description}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="hero"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedNFT(nft);
                            setIsListingDialogOpen(true);
                          }}
                        >
                          List on Marketplace
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://hashscan.io/testnet/token/${nft.tokenId}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6">
            {gameHistory.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-20 text-center">
                  <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No Game History</h3>
                  <p className="text-muted-foreground mb-6">
                    Start playing to see your game history here!
                  </p>
                  <Button onClick={() => window.location.href = '/game'} variant="hero">
                    Play Game
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {gameHistory.sort((a, b) => b.timestamp - a.timestamp).map((game, index) => (
                  <Card key={index} className="glass-card hover-glow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                            {game.nftsEarned > 0 ? '🏆' : '🎮'}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              Game Session
                            </CardTitle>
                            <CardDescription>
                              {new Date(game.timestamp).toLocaleString()}
                            </CardDescription>
                          </div>
                        </div>
                        {game.nftsEarned > 0 && (
                          <div className="bg-green-500/20 px-3 py-1 rounded-full">
                            <span className="text-green-400 font-bold">
                              +{game.nftsEarned} NFT{game.nftsEarned > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="text-lg font-bold text-primary">
                            {game.score?.toLocaleString() || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Kills</p>
                          <p className="text-lg font-bold text-red-500">
                            {game.kills || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Accuracy</p>
                          <p className="text-lg font-bold text-cyan-400">
                            {game.accuracy?.toFixed(1) || 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Max Streak</p>
                          <p className="text-lg font-bold text-orange-500">
                            🔥 x{game.maxStreak || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Level</p>
                          <p className="text-lg font-bold text-yellow-500">
                            {game.level || 1}
                          </p>
                        </div>
                      </div>

                      {game.nftsList && game.nftsList.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-400" />
                            NFTs Earned in this Session:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {game.nftsList.map((nftInfo: string, i: number) => (
                              <div key={i} className="bg-primary/10 px-3 py-1 rounded-full text-sm">
                                {nftInfo}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Listing Dialog */}
      <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
        <DialogContent className="glass-card">
          <DialogHeader>
            <DialogTitle>List NFT for Sale</DialogTitle>
            <DialogDescription>
              Set a price for your NFT in HBAR
            </DialogDescription>
          </DialogHeader>
          {selectedNFT && (
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{getRarityIcon(selectedNFT.achievement.rarity)}</div>
                  <div>
                    <p className="font-bold">{selectedNFT.achievement.name}</p>
                    <p className={`text-sm ${getRarityColor(selectedNFT.achievement.rarity)}`}>
                      {selectedNFT.achievement.rarity}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="price">Price (HBAR)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(e.target.value)}
                  className="glass-card"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsListingDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleListNFT}>
              List NFT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
