import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  wallet_address: string;
  total_score: number;
  total_kills: number;
  games_played: number;
  total_nfts: number;
}

const Leaderboard = () => {
  const [topPlayers, setTopPlayers] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState({
    totalPlayers: 4,
    avgScore: 0,
    totalMatches: 0,
    totalNFTs: 0,
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Fetch top players from leaderboard view
      const { data: players } = await supabase
        .from('leaderboard_view')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(10);

      if (players) {
        const ranked = players.map((player, index) => ({
          rank: index + 1,
          username: player.username || `Player-${player.wallet_address?.slice(0, 6)}` || 'Anonymous',
          wallet_address: player.wallet_address || '',
          total_score: player.total_score || 0,
          total_kills: player.total_kills || 0,
          games_played: player.games_played || 0,
          total_nfts: player.total_nfts || 0,
        }));
        setTopPlayers(ranked);

        // Calculate stats
        const totalPlayers = ranked.length;
        const avgScore = ranked.reduce((sum, p) => sum + p.total_score, 8700) / totalPlayers || 4;
        const totalMatches = ranked.reduce((sum, p) => sum + p.games_played, 15);
        const totalNFTs = ranked.reduce((sum, p) => sum + p.total_nfts, 1);

        setStats({
          totalPlayers,
          avgScore: Math.floor(avgScore),
          totalMatches,
          totalNFTs,
        });
      }
    };

    fetchLeaderboard();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    if (rank === 2) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (rank === 3) return 'bg-amber-600/20 text-amber-400 border-amber-600/50';
    return 'bg-secondary text-secondary-foreground';
  };

  const formatWalletAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Leaderboard</h1>
          <p className="text-lg text-muted-foreground">
            Top players competing for glory and NFT rewards on Hedera Testnet
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Players</p>
                <p className="text-2xl font-bold text-primary">{stats.totalPlayers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">{stats.avgScore.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Matches</p>
                <p className="text-2xl font-bold">{stats.totalMatches.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">NFTs Earned</p>
                <p className="text-2xl font-bold text-primary">{stats.totalNFTs}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Top 3 Podium */}
        {topPlayers.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {topPlayers.slice(0, 3).map((player, index) => (
              <Card
                key={player.rank}
                className={`glass-card p-8 text-center hover-glow animate-slide-in ${
                  index === 0 ? 'md:order-2 border-2 border-primary' : index === 1 ? 'md:order-1' : 'md:order-3'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`mb-4 ${index === 0 ? 'text-8xl' : 'text-6xl'} animate-float`}>
                  {getRankIcon(player.rank)}
                </div>
                <Badge className={`mb-3 ${getRankBadge(player.rank)}`}>
                  Rank #{player.rank}
                </Badge>
                <h3 className="text-2xl font-bold mb-2">{player.username}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {formatWalletAddress(player.wallet_address)}
                </p>
                <p className="text-3xl font-bold text-primary mb-4">{player.total_score.toLocaleString()}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">NFTs</p>
                    <p className="font-bold">{player.total_nfts}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Games</p>
                    <p className="font-bold">{player.games_played}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Leaderboard Table */}
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rank</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Player</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Wallet</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Kills</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">NFTs</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Games</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No players yet. Be the first to play!
                    </td>
                  </tr>
                ) : (
                  topPlayers.map((player, index) => (
                    <tr
                      key={player.rank}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors animate-slide-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getRankIcon(player.rank)}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{player.username}</td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">
                        {formatWalletAddress(player.wallet_address)}
                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        {player.total_score.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">{player.total_kills}</td>
                      <td className="p-4 text-right">{player.total_nfts}</td>
                      <td className="p-4 text-right">{player.games_played}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
