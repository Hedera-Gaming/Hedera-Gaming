import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Trophy, Zap, Flame } from 'lucide-react';

interface GameHUDAdvancedProps {
  score: number;
  health: number;
  ammo: number;
  fuel: number;
  enemiesKilled: number;
  enemiesRemaining: number;
  level: number;
  elapsedTime: number;
  currentAccuracy: number;
  killStreak: number;
  maxKillStreak: number;
  totalShots: number;
  successfulHits: number;
  nftsEarned: string[];
}

export const GameHUDAdvanced = ({
  score,
  health,
  ammo,
  fuel,
  enemiesKilled,
  enemiesRemaining,
  level,
  elapsedTime,
  currentAccuracy,
  killStreak,
  maxKillStreak,
  totalShots,
  successfulHits,
  nftsEarned,
}: GameHUDAdvancedProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 70) return 'text-green-400';
    if (acc >= 50) return 'text-yellow-400';
    if (acc >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 10) return 'text-red-500 animate-pulse';
    if (streak >= 5) return 'text-orange-500';
    return 'text-primary';
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Left - Main Stats */}
      <div className="absolute top-4 left-4 space-y-2">
        <Card className="glass-card p-3 pointer-events-auto">
          <div className="space-y-1.5">
            {/* Score */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-400" />
                <span className="text-xs text-muted-foreground">SCORE</span>
              </div>
              <span className="font-bold text-lg text-primary">{score.toLocaleString()}</span>
            </div>

            {/* Kill Streak */}
            {killStreak > 0 && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Flame className={`h-4 w-4 ${getStreakColor(killStreak)}`} />
                  <span className="text-xs text-muted-foreground">STREAK</span>
                </div>
                <span className={`font-bold text-lg ${getStreakColor(killStreak)}`}>
                  x{killStreak}
                  {killStreak >= 5 && ' 🔥'}
                </span>
              </div>
            )}

            {/* Accuracy */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-cyan-400" />
                <span className="text-xs text-muted-foreground">ACCURACY</span>
              </div>
              <span className={`font-bold ${getAccuracyColor(currentAccuracy)}`}>
                {currentAccuracy.toFixed(1)}%
              </span>
            </div>

            {/* Hits/Shots */}
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="text-muted-foreground">Hits</span>
              <span className="font-mono">
                {successfulHits}/{totalShots}
              </span>
            </div>

            {/* Kills */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">KILLS</span>
              <span className="font-bold text-destructive">
                {enemiesKilled}
                {enemiesRemaining > 0 && <span className="text-muted-foreground text-xs ml-1">({enemiesRemaining})</span>}
              </span>
            </div>

            {/* Time */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-muted-foreground">TIME</span>
              <span className="font-mono font-bold text-primary">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </Card>

        {/* Ammo & Fuel */}
        <Card className="glass-card p-3 pointer-events-auto">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">AMMO</span>
              <span className={`font-bold font-mono ${ammo < 20 ? 'text-red-500 animate-pulse' : 'text-accent'}`}>
                {ammo}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">FUEL</span>
              <span className={`font-bold font-mono ${fuel < 20 ? 'text-red-500 animate-pulse' : 'text-warning'}`}>
                {fuel.toFixed(0)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top Right - Level & NFTs */}
      <div className="absolute top-4 right-4 space-y-2">
        {/* Level */}
        <Card className="glass-card px-6 py-3 pointer-events-auto">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">LEVEL</div>
            <div className="text-3xl font-bold text-primary">{level}</div>
          </div>
        </Card>

        {/* NFTs Earned */}
        {nftsEarned.length > 0 && (
          <Card className="glass-card p-3 pointer-events-auto max-w-[200px]">
            <div className="text-xs text-muted-foreground mb-2">NFTs EARNED</div>
            <div className="space-y-1">
              {nftsEarned.slice(0, 3).map((nft, i) => (
                <div key={i} className="text-xs font-semibold text-green-400 flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {nft}
                </div>
              ))}
              {nftsEarned.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{nftsEarned.length - 3} more...
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Max Streak Record */}
        {maxKillStreak > 5 && (
          <Card className="glass-card p-3 pointer-events-auto">
            <div className="text-xs text-muted-foreground">BEST STREAK</div>
            <div className="text-xl font-bold text-orange-500">
              🔥 x{maxKillStreak}
            </div>
          </Card>
        )}
      </div>

      {/* Bottom - Health & Fuel Bars */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <div className="flex gap-4 items-center">
          <span className="text-sm font-mono text-muted-foreground min-w-[60px]">HEALTH</span>
          <Progress 
            value={health} 
            className={`flex-1 h-4 ${health < 30 ? 'animate-pulse' : ''}`} 
          />
          <span className={`text-sm font-mono font-bold min-w-[50px] text-right ${
            health < 30 ? 'text-red-500' : 'text-primary'
          }`}>
            {health}%
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-mono text-muted-foreground min-w-[60px]">FUEL</span>
          <Progress 
            value={fuel} 
            className={`flex-1 h-4 ${fuel < 30 ? 'animate-pulse' : ''}`}
          />
          <span className={`text-sm font-mono font-bold min-w-[50px] text-right ${
            fuel < 30 ? 'text-red-500' : 'text-warning'
          }`}>
            {fuel.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Controls help */}
      <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground space-y-1 text-right opacity-50 hover:opacity-100 transition-opacity">
        <div>WASD / Arrows: Move</div>
        <div>Space: Shoot</div>
        <div>P: Pause</div>
      </div>

      {/* Combo Multiplier Flash */}
      {killStreak >= 5 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="text-6xl font-bold text-orange-500 animate-pulse drop-shadow-[0_0_20px_rgba(255,165,0,0.8)]">
            x{killStreak}
          </div>
          <div className="text-center text-sm text-orange-400 mt-2">
            COMBO!
          </div>
        </div>
      )}
    </div>
  );
};
