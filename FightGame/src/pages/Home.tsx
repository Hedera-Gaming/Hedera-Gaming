import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trophy, Shield, Rocket, TrendingUp, Users, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: <Trophy className="h-12 w-12 text-primary" />,
      title: 'NFT Rewards',
      description: 'Earn unique NFTs for achievements and victories in epic space battles.',
    },
    {
      icon: <Shield className="h-12 w-12 text-accent" />,
      title: 'Permanent Assets',
      description: 'Your NFTs persist on Hedera blockchain forever, even if servers go offline.',
    },
    {
      icon: <Rocket className="h-12 w-12 text-primary" />,
      title: 'Trade & Showcase',
      description: 'Buy, sell, and showcase your NFTs in our integrated marketplace.',
    },
  ];

  const stats = [
    { icon: <Users />, label: 'Active Players', value: '10,247' },
    { icon: <Coins />, label: 'NFTs Minted', value: '45,892' },
    { icon: <TrendingUp />, label: 'Trading Volume', value: '$2.4M' },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
              HEDERA NEXUS
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-primary">
              Play. Earn. Own Forever.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Experience true ownership of your in-game achievements with NFT rewards on
              Hedera network. Your assets persist forever, even if the game server goes offline.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/game">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Rocket className="mr-2 h-6 w-6" />
                  LAUNCH GAME
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="glass" size="xl" className="w-full sm:w-auto hover-glow">
                  EXPLORE MARKETPLACE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary/10 rounded-full">
                  <div className="text-primary">{stat.icon}</div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Hedera Nexus?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of gaming with blockchain-powered ownership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass-card p-8 hover-glow animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect your wallet and begin earning NFT rewards in epic space battles
          </p>
          <Link to="/game">
            <Button variant="hero" size="xl">
              <Rocket className="mr-2 h-6 w-6" />
              START PLAYING NOW
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
