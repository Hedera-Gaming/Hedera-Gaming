import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, TrendingUp } from 'lucide-react';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');

  // Mock NFT data
  const nfts = [
    { id: 1, name: 'Space Ace', rarity: 'Legendary', price: '150 HBAR', image: '🚀' },
    { id: 2, name: 'Nebula Hunter', rarity: 'Epic', price: '85 HBAR', image: '⭐' },
    { id: 3, name: 'Cosmic Warrior', rarity: 'Rare', price: '45 HBAR', image: '🛸' },
    { id: 4, name: 'Star Defender', rarity: 'Epic', price: '95 HBAR', image: '💫' },
    { id: 5, name: 'Galaxy Explorer', rarity: 'Rare', price: '50 HBAR', image: '🌌' },
    { id: 6, name: 'Void Master', rarity: 'Mythic', price: '250 HBAR', image: '🌠' },
    { id: 7, name: 'Stellar Knight', rarity: 'Legendary', price: '175 HBAR', image: '⚔️' },
    { id: 8, name: 'Comet Chaser', rarity: 'Common', price: '20 HBAR', image: '☄️' },
  ];

  const getRarityColor = (rarity: string) => {
    const colors: { [key: string]: string } = {
      Common: 'text-gray-400',
      Rare: 'text-blue-400',
      Epic: 'text-purple-400',
      Legendary: 'text-yellow-400',
      Mythic: 'text-red-400',
    };
    return colors[rarity] || 'text-gray-400';
  };

  const filteredNFTs = nfts.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'all' || nft.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="min-h-screen pt-20">
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
                <p className="text-2xl font-bold text-primary">20 HBAR</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">2.4M HBAR</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Listed NFTs</p>
                <p className="text-2xl font-bold">45,892</p>
              </div>
              <Filter className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

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
          <Select defaultValue="recent">
            <SelectTrigger className="w-full md:w-48 glass-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Listed</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredNFTs.map((nft, index) => (
            <Card
              key={nft.id}
              className="glass-card hover-glow cursor-pointer group animate-slide-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-300">
                {nft.image}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{nft.name}</h3>
                <p className={`text-sm mb-3 ${getRarityColor(nft.rarity)}`}>
                  {nft.rarity}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-bold text-primary">{nft.price}</p>
                  </div>
                  <Button variant="default" size="sm">
                    Buy Now
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredNFTs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No NFTs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
