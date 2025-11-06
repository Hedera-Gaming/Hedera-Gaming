import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Trophy, Shield, Star } from 'lucide-react';

const Community = () => {
  const guilds = [
    { name: 'Cosmic Raiders', members: 1247, level: 25, icon: '🚀' },
    { name: 'Star Defenders', members: 980, level: 22, icon: '⭐' },
    { name: 'Nebula Warriors', members: 856, level: 20, icon: '💫' },
    { name: 'Galaxy Guardians', members: 723, level: 18, icon: '🌌' },
  ];

  const recentActivity = [
    { player: 'CryptoAce', action: 'earned', item: 'Legendary NFT', time: '2m ago' },
    { player: 'NebulaHunter', action: 'joined', item: 'Cosmic Raiders', time: '5m ago' },
    { player: 'StarCommander', action: 'reached', item: 'Level 50', time: '12m ago' },
    { player: 'VoidMaster', action: 'won', item: 'Tournament Match', time: '18m ago' },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 glow-text">Community</h1>
          <p className="text-lg text-muted-foreground">
            Connect with players, join guilds, and compete together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guilds Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Shield className="mr-2 text-primary" />
                  Top Guilds
                </h2>
                <Button variant="default">Create Guild</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guilds.map((guild, index) => (
                  <Card
                    key={index}
                    className="glass-card p-6 hover-glow cursor-pointer animate-slide-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-5xl">{guild.icon}</div>
                      <Button variant="outline" size="sm">
                        Join
                      </Button>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{guild.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {guild.members}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-primary" />
                        Lvl {guild.level}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MessageCircle className="mr-2 text-primary" />
                Recent Activity
              </h2>
              <Card className="glass-card divide-y divide-border/50">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-secondary/30 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-primary">{activity.player}</span>
                        <span className="text-muted-foreground"> {activity.action} </span>
                        <span className="font-medium">{activity.item}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Users className="mr-2 text-primary" />
                Community Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Online Players</p>
                  <p className="text-2xl font-bold text-primary">3,845</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Guilds</p>
                  <p className="text-2xl font-bold">147</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Matches</p>
                  <p className="text-2xl font-bold">892</p>
                </div>
              </div>
            </Card>

            {/* Upcoming Events */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Trophy className="mr-2 text-primary" />
                Upcoming Events
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                  <h4 className="font-medium mb-1">Weekly Tournament</h4>
                  <p className="text-xs text-muted-foreground">Starts in 2 hours</p>
                  <p className="text-sm text-primary mt-2">Prize: 5000 HBAR</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/30">
                  <h4 className="font-medium mb-1">Guild Wars</h4>
                  <p className="text-xs text-muted-foreground">Starts in 1 day</p>
                  <p className="text-sm text-accent mt-2">Prize: Legendary NFTs</p>
                </div>
              </div>
            </Card>

            {/* Discord */}
            <Card className="glass-card p-6 text-center">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Join Our Discord</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with players and stay updated
              </p>
              <Button variant="hero" className="w-full">
                Join Discord
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
