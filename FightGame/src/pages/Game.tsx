import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { GameScene } from '@/components/game/GameScene';
import { GameHUDAdvanced } from '@/components/game/GameHUDAdvanced';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { ActivityFeed } from '@/components/ActivityFeed';
import { NFTRewardsDisplay } from '@/components/NFTRewardsDisplay';
import { useNFTRewards } from '@/hooks/useNFTRewards';
import { toast } from 'sonner';

const Game = () => {
  const {
    playerPosition,
    playerHealth,
    score,
    ammo,
    fuel,
    level,
    enemies,
    bullets,
    isPaused,
    gameOver,
    elapsedTime,
    enemiesKilled,
    totalShots,
    successfulHits,
    currentAccuracy,
    nftsEarned,
    killStreak,
    maxKillStreak,
    shoot,
    setIsPaused,
    setNftsEarned,
    resetGame,
  } = useGameLogic();

  const { 
    wallet, 
    isConnecting, 
    isInitialized,
    connectMetaMask, 
    connectHashPack,
    disconnect 
  } = useWalletConnect();

  // Hook that connects to contracts and exposes verify/mint
  const { verifyAndMintNFT } = useNFTRewards(wallet);

  const enemiesRemaining = enemies.filter(e => e.isActive).length;

  // Show wallet modal if not connected
  const showWalletModal = isInitialized && !wallet;

  // Track which kill thresholds we've already awarded to avoid duplicate mints
  const awardedThresholdsRef = useRef<Set<number>>(new Set());

  // Progressive NFT Rewards System
  useEffect(() => {
    if (!wallet || !verifyAndMintNFT) return;

    // More aggressive thresholds: every 10 kills
    const killThresholds = [10, 20, 30, 40, 50, 75, 100, 150, 200];

    (async () => {
      for (const t of killThresholds) {
        if (enemiesKilled >= t && !awardedThresholdsRef.current.has(t)) {
          awardedThresholdsRef.current.add(t);

          try {
            // Determine NFT rarity based on performance
            let nftType = 'Bronze Fighter';
            if (enemiesKilled >= 150) nftType = 'Diamond Ace 💎';
            else if (enemiesKilled >= 100) nftType = 'Platinum Elite 🏆';
            else if (enemiesKilled >= 75) nftType = 'Gold Master 👑';
            else if (enemiesKilled >= 50) nftType = 'Silver Hero ⭐';
            else if (enemiesKilled >= 30) nftType = 'Bronze Fighter 🥉';

            // Add to NFT earned list immediately
            setNftsEarned(prev => [...prev, `${nftType} (${t} kills)`]);
            
            // Show toast notification
            toast.success(`🎉 NFT Earned: ${nftType}!`, {
              description: `${t} enemies eliminated with ${currentAccuracy.toFixed(1)}% accuracy!`,
              duration: 5000,
            });

            // Verify and mint on blockchain
            await verifyAndMintNFT(score, enemiesKilled, currentAccuracy, Math.floor(elapsedTime));
          } catch (e) {
            // Allow retry on next kill
            awardedThresholdsRef.current.delete(t);
            console.error('Error minting NFT for threshold', t, e);
          }
        }
      }
    })();
  }, [enemiesKilled, wallet, verifyAndMintNFT, score, elapsedTime, currentAccuracy, setNftsEarned]);

  return (
    <div className="min-h-screen pt-16">
      {/* Wallet Connect Modal */}
      <WalletConnectModal
        open={showWalletModal}
        onMetaMaskConnect={connectMetaMask}
        onHashPackConnect={connectHashPack}
        isConnecting={isConnecting}
      />

      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {wallet && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-card">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{wallet.playerName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={disconnect}
                  className="h-6 px-2"
                >
                  ×
                </Button>
              </div>
            )}
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              disabled={!wallet}
            >
              {isPaused ? <Play className="h-4 w-4" /> : 'Pause'}
            </Button>
            {gameOver && (
              <Button variant="hero" size="sm" onClick={resetGame}>
                <RotateCcw className="mr-2 h-4 w-4" />
                New Game
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Game View - Takes 3 columns */}
          <div className="lg:col-span-3">
            {/* Game Container */}
            <div className="relative w-full h-[calc(100vh-180px)] rounded-lg overflow-hidden border border-primary/20 shadow-2xl">
              <GameScene
                playerPosition={playerPosition}
                playerHealth={playerHealth}
                enemies={enemies}
                bullets={bullets}
                onShoot={shoot}
              />
              
              <GameHUDAdvanced
                score={score}
                health={playerHealth}
                ammo={ammo}
                fuel={fuel}
                enemiesKilled={enemiesKilled}
                enemiesRemaining={enemiesRemaining}
                level={level}
                elapsedTime={elapsedTime}
                currentAccuracy={currentAccuracy}
                killStreak={killStreak}
                maxKillStreak={maxKillStreak}
                totalShots={totalShots}
                successfulHits={successfulHits}
                nftsEarned={nftsEarned}
              />

              {/* Pause Overlay */}
              {isPaused && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-md z-50">
                  <Card className="glass-card p-8">
                    <h2 className="text-4xl font-bold mb-6 text-center">PAUSED</h2>
                    <div className="space-y-4">
                      <Button variant="hero" onClick={() => setIsPaused(false)} className="w-full">
                        <Play className="mr-2" />
                        Resume Game
                      </Button>
                      <Button variant="outline" onClick={resetGame} className="w-full">
                        <RotateCcw className="mr-2" />
                        Restart
                      </Button>
                      <Link to="/">
                        <Button variant="ghost" className="w-full">
                          Exit to Menu
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              )}

              {/* Game Over Overlay */}
              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-md z-50">
                  <Card className="glass-card p-8 max-w-md">
                    <h2 className="text-4xl font-bold mb-2 text-center text-destructive">GAME OVER</h2>
                    <p className="text-center text-muted-foreground mb-6">
                      {playerHealth <= 0 ? 'Your health reached zero!' : 'You ran out of fuel!'}
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-lg">
                        <span className="text-muted-foreground">Final Score:</span>
                        <span className="font-bold text-primary">{score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Level Reached:</span>
                        <span className="font-bold">{level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Enemies Killed:</span>
                        <span className="font-bold">{enemiesKilled}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="font-bold text-cyan-400">{currentAccuracy.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Max Streak:</span>
                        <span className="font-bold text-orange-500">🔥 x{maxKillStreak}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">NFTs Earned:</span>
                        <span className="font-bold text-green-400">{nftsEarned.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time Survived:</span>
                        <span className="font-bold">{Math.floor(elapsedTime)}s</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Button variant="hero" onClick={resetGame} className="w-full">
                        <RotateCcw className="mr-2" />
                        Play Again
                      </Button>
                      <Link to="/leaderboard">
                        <Button variant="outline" className="w-full">
                          View Leaderboard
                        </Button>
                      </Link>
                      <Link to="/">
                        <Button variant="ghost" className="w-full">
                          Exit to Menu
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel - Activity Feed and NFT Rewards */}
          <div className="lg:col-span-1 space-y-4">
            {wallet && (
              <>
                <NFTRewardsDisplay limit={3} />
                <ActivityFeed />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
