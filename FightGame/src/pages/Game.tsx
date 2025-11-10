import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, RotateCcw, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GameScene } from '@/components/game/GameScene';
import { GameHUD } from '@/components/game/GameHUD';
import { useGameLogic } from '@/hooks/useGameLogic';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { WalletConnectModal } from '@/components/WalletConnectModal';
import { ActivityFeed } from '@/components/ActivityFeed';
import { NFTRewardsDisplay } from '@/components/NFTRewardsDisplay';

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
    shoot,
    setIsPaused,
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

  const enemiesRemaining = enemies.filter(e => e.isActive).length;

  // Show wallet modal if not connected
  const showWalletModal = isInitialized && !wallet;

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
              
              <GameHUD
                score={score}
                health={playerHealth}
                ammo={ammo}
                fuel={fuel}
                enemiesKilled={enemiesKilled}
                enemiesRemaining={enemiesRemaining}
                level={level}
                elapsedTime={elapsedTime}
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
                <NFTRewardsDisplay profileId={wallet.profileId} limit={3} />
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
