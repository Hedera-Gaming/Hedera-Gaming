import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GameHUDProps {
  score: number;
  health: number;
  ammo: number;
  fuel: number;
  enemiesKilled: number;
  enemiesRemaining: number;
  level: number;
  elapsedTime: number;
}

export const GameHUD = ({
  score,
  health,
  ammo,
  fuel,
  enemiesKilled,
  enemiesRemaining,
  level,
  elapsedTime,
}: GameHUDProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Stats */}
      <div className="absolute top-4 left-4 space-y-2 font-mono text-sm">
        <div className="text-primary font-bold">Elapsed: {formatTime(elapsedTime)}</div>
        <div className="text-destructive">Enemies: {enemiesKilled}/{enemiesKilled + enemiesRemaining}</div>
        <div className="text-warning">Fuel: {fuel.toFixed(1)}</div>
        <div className="text-accent">Ammo: {ammo}</div>
        <div className="text-primary font-bold text-lg">Score: {score}</div>
      </div>

      {/* Level indicator */}
      <div className="absolute top-4 right-4">
        <Card className="glass-card px-6 py-3 pointer-events-auto">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">LEVEL</div>
            <div className="text-3xl font-bold text-primary">{level}</div>
          </div>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="absolute bottom-4 left-4 right-4 space-y-2">
        <div className="flex gap-4 items-center">
          <span className="text-sm font-mono text-muted-foreground min-w-[60px]">HEALTH</span>
          <Progress value={health} className="flex-1 h-3" />
          <span className="text-sm font-mono text-primary min-w-[50px] text-right">{health}%</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-sm font-mono text-muted-foreground min-w-[60px]">FUEL</span>
          <Progress value={fuel} className="flex-1 h-3" />
          <span className="text-sm font-mono text-warning min-w-[50px] text-right">{fuel.toFixed(0)}%</span>
        </div>
      </div>

      {/* Controls help */}
      <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground space-y-1 text-right">
        <div>WASD / Arrows: Move</div>
        <div>Space: Shoot</div>
        <div>P: Pause</div>
      </div>
    </div>
  );
};
