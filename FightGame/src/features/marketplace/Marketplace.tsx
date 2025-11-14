import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/marketplace/ui/select';
import { Search, Filter, TrendingUp, Loader2 } from 'lucide-react';
import { useWalletConnect } from '@/shared/hooks/useWalletConnect';
import { useMarketplace } from '@/features/marketplace/hooks/useMarketplace';
import { useNFTRewards } from '@/shared/hooks/useNFTRewards';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Label } from '@/shared/components/ui/label';
import { WalletConnectModal } from '@/shared/components/WalletConnectModal';
import { ApprovalManager } from '@/shared/components/ApprovalManager';
import { toast } from 'sonner';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [listingPrice, setListingPrice] = useState('');
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { wallet, isConnecting, isInitialized, connectMetaMask, connectHashPack } = useWalletConnect();
  const { listings, isLoading, listNFT, buyNFT, cancelListing } = useMarketplace(wallet);
  const { playerNFTs, refreshPlayerNFTs } = useNFTRewards(wallet);

  // Combine listings with player's NFTs for UI
  const ownedTokenIds = new Set(playerNFTs.map(nft => nft.tokenId));
  const allNFTs = [...listings];

  useEffect(() => {
    if (wallet) {
      refreshPlayerNFTs();
    }
  }, [wallet]);

  const handleSort = (items: typeof allNFTs) => {
    switch (sortBy) {
      case 'price-low':
        return [...items].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'price-high':
        return [...items].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case 'recent':
        return [...items].sort((a, b) => b.listedAt - a.listedAt);
      default:
        return items;
    }
  };

  const filteredNFTs = handleSort(
    allNFTs.filter((nft) => {
      const matchesSearch = nft.nft?.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRarity = rarityFilter === 'all' || nft.nft?.rarity === rarityFilter;
      return matchesSearch && matchesRarity;
    })
  );

  const handleList = async () => {
    if (!selectedNFT || !listingPrice) return;
    
    if (!isApproved) {
      toast.error('Please approve the marketplace first');
      return;
    }
    
    const success = await listNFT(selectedNFT.tokenId, listingPrice);
    if (success) {
      setIsListingDialogOpen(false);
      setListingPrice('');
      setSelectedNFT(null);
    }
  };

  const handleBuy = async (listing: any) => {
    if (!wallet) {
      toast.error('Please connect your wallet first');
      return;
    }
    await buyNFT(listing.listingId, listing.price);
  };

  const handleCancel = async (listing: any) => {
    await cancelListing(listing.listingId);
  };

  const showWalletModal = isInitialized && !wallet;

  return (
    <div className="min-h-screen pt-20">
      <WalletConnectModal
        open={showWalletModal}
        onMetaMaskConnect={connectMetaMask}
        onHashPackConnect={connectHashPack}
        isConnecting={isConnecting}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">NFT Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Discover, collect, and trade unique space-themed NFTs
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Floor Price</p>
                <p className="text-2xl font-bold text-primary">
                  {listings.length > 0
                    ? Math.min(...listings.map(l => parseFloat(l.price))).toFixed(2)
                    : '0'} HBAR
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">
                  {listings.reduce((sum, l) => sum + parseFloat(l.price), 0).toFixed(2)} HBAR
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Listed NFTs</p>
                <p className="text-2xl font-bold">{listings.length}</p>
              </div>
              <Filter className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Approval Section */}
        {wallet && (
          <div className="mb-8">
            <ApprovalManager 
              wallet={wallet} 
              onApprovalStatusChange={setIsApproved}
              compact
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search NFTs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-card border-border"
            />
          </div>
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="w-full md:w-48 glass-card">
              <SelectValue placeholder="Filter by Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="Common">Common</SelectItem>
              <SelectItem value="Rare">Rare</SelectItem>
              <SelectItem value="Epic">Epic</SelectItem>
              <SelectItem value="Legendary">Legendary</SelectItem>
              <SelectItem value="Mythic">Mythic</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 glass-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Listed</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading NFTs...</span>
          </div>
        ) : (
          <>
            {/* NFT Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNFTs.map((nft, index) => (
                <Card
                  key={nft.listingId}
                  className="glass-card hover-glow cursor-pointer group animate-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300">
                    {nft.nft?.image || '🎮'}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{nft.nft?.name || `NFT #${nft.tokenId}`}</h3>
                    <p className={`text-sm mb-3 ${getRarityColor(nft.nft?.rarity)}`}>
                      {nft.nft?.rarity || 'Unknown'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-bold text-primary">{nft.price} HBAR</p>
                      </div>
                      {nft.seller.toLowerCase() === wallet?.address?.toLowerCase() ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(nft)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleBuy(nft)}
                          disabled={!wallet}
                        >
                          Buy Now
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* List NFT Dialog */}
            <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>List NFT for Sale</DialogTitle>
                  <DialogDescription>
                    {isApproved 
                      ? 'Set a price for your NFT in HBAR'
                      : 'You need to approve the marketplace first'}
                  </DialogDescription>
                </DialogHeader>

                {!isApproved ? (
                  <div className="py-4">
                    <ApprovalManager 
                      wallet={wallet} 
                      onApprovalStatusChange={setIsApproved}
                    />
                  </div>
                ) : (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Price in HBAR</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={listingPrice}
                        onChange={(e) => setListingPrice(e.target.value)}
                        placeholder="Enter price in HBAR"
                      />
                    </div>
                  </div>
                )}

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsListingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleList}
                    disabled={!isApproved || !listingPrice}
                  >
                    List NFT
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {filteredNFTs.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No NFTs found matching your criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const getRarityColor = (rarity: string = '') => {
  const colors: { [key: string]: string } = {
    Common: 'text-gray-400',
    Rare: 'text-blue-400',
    Epic: 'text-purple-400',
    Legendary: 'text-yellow-400',
    Mythic: 'text-red-400',
  };
  return colors[rarity] || 'text-gray-400';
};

export default Marketplace;