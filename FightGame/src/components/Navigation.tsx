import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Wallet, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  const navItems = [
    { name: 'GAME', path: '/game' },
    { name: 'MARKETPLACE', path: '/marketplace' },
    { name: 'LEADERBOARD', path: '/leaderboard' },
    { name: 'COMMUNITY', path: '/community' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">H</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold glow-text">HEDERA NEXUS</h1>
                <p className="text-xs text-muted-foreground">Play. Earn. Own Forever.</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Wallet Button */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowWalletModal(true)}
                variant="hero"
                size="lg"
                className="hidden md:flex"
              >
                <Wallet className="mr-2 h-5 w-5" />
                CONNECT WALLET
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border/50">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === item.path ? 'text-primary' : 'text-foreground/80'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <Button
                  onClick={() => {
                    setShowWalletModal(true);
                    setIsOpen(false);
                  }}
                  variant="hero"
                  className="w-full"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  CONNECT WALLET
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Wallet Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-md w-full mx-4 rounded-xl border-2 border-primary/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold glow-text">Connect Wallet</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowWalletModal(false)}
              >
                <X />
              </Button>
            </div>
            
            <div className="space-y-3">
              {['HashPack', 'MetaMask', 'Blade Wallet'].map((wallet) => (
                <Button
                  key={wallet}
                  variant="glass"
                  className="w-full justify-start text-left h-16 hover-glow"
                  onClick={() => {
                    // Wallet connection logic will be implemented here
                    alert(`Connecting to ${wallet}...`);
                    setShowWalletModal(false);
                  }}
                >
                  <Wallet className="mr-3 h-6 w-6" />
                  <span className="text-base">{wallet}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
