import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBlockchainIntegration } from './useBlockchainIntegration';
import { contractService } from '../lib/hedera/contract-integration';
import { toast } from 'sonner';

interface EnemyData {
  id: string;
  position: [number, number, number];
  health: number;
  isActive: boolean;
  lastShot: number;
}

interface BulletData {
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
  isPlayerBullet: boolean;
  createdAt: number;
}

export const useEnhancedGameLogic = () => {
  const [playerPosition, setPlayerPosition] = useState<
    [number, number, number]
  >([0, 0, 0]);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [score, setScore] = useState(0);
  const [ammo, setAmmo] = useState(200);
  const [fuel, setFuel] = useState(100);
  const [level, setLevel] = useState(1);
  const [enemies, setEnemies] = useState<EnemyData[]>([]);
  const [bullets, setBullets] = useState<BulletData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [enemiesKilled, setEnemiesKilled] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [shotsFired, setShotsFired] = useState(0);
  const [shotsHit, setShotsHit] = useState(0);

  const [wallet, setWallet] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const keysPressed = useRef<Set<string>>(new Set());
  const gameStartTime = useRef(Date.now());
  const lastEnemySpawn = useRef(Date.now());
  const lastScoreSync = useRef(Date.now());

  const blockchain = useBlockchainIntegration(
    wallet?.address || null,
    wallet?.profileId || null
  );

  useEffect(() => {
    const initializeWallet = async () => {
      const walletData = localStorage.getItem('wallet');
      if (walletData) {
        const parsedWallet = JSON.parse(walletData);
        setWallet(parsedWallet);

        try {
          const privateKey =
            import.meta.env.VITE_HEDERA_OPERATOR_KEY ||
            '0x59a5ebca2a6a2f3827e51714dc1e85f17c4ebf24c2fb6051d23284c0d45b2fb6';
          await contractService.connectWallet(privateKey);
          setIsInitialized(true);
        } catch (error) {
          console.error('Failed to initialize contracts:', error);
        }
      }
    };

    initializeWallet();
  }, []);

  const syncScoreToBlockchain = useCallback(async () => {
    if (!isInitialized || !wallet) return;

    const now = Date.now();
    if (now - lastScoreSync.current < 30000) return;
    lastScoreSync.current = now;

    const gameStats = {
      score,
      kills: enemiesKilled,
      accuracy: accuracy / 100,
      survivalTime: elapsedTime,
    };

    await blockchain.submitScoreToBlockchain(gameStats);
  }, [
    score,
    enemiesKilled,
    accuracy,
    elapsedTime,
    isInitialized,
    wallet,
    blockchain,
  ]);

  const spawnEnemies = useCallback(() => {
    const now = Date.now();
    const spawnInterval = Math.max(1000, 3000 - level * 200);

    if (
      now - lastEnemySpawn.current > spawnInterval &&
      enemies.filter((e) => e.isActive).length < level * 3
    ) {
      lastEnemySpawn.current = now;
      const newEnemy: EnemyData = {
        id: `enemy-${now}-${Math.random()}`,
        position: [
          (Math.random() - 0.5) * 20,
          Math.random() * 5,
          -20 - Math.random() * 10,
        ],
        health: 100,
        isActive: true,
        lastShot: now,
      };
      setEnemies((prev) => [...prev, newEnemy]);
    }
  }, [level, enemies]);

  const shoot = useCallback(() => {
    if (ammo <= 0 || isPaused || gameOver) return;

    setAmmo((prev) => Math.max(0, prev - 1));
    setShotsFired((prev) => prev + 1);

    const newBullet: BulletData = {
      id: `bullet-${Date.now()}-${Math.random()}`,
      position: [playerPosition[0], playerPosition[1], playerPosition[2]],
      direction: [0, 0, -1],
      isPlayerBullet: true,
      createdAt: Date.now(),
    };

    setBullets((prev) => [...prev, newBullet]);
  }, [ammo, isPaused, gameOver, playerPosition]);

  const enemyShoot = useCallback(
    (enemy: EnemyData) => {
      const now = Date.now();
      if (now - enemy.lastShot < 2000) return;

      enemy.lastShot = now;
      const direction: [number, number, number] = [
        (playerPosition[0] - enemy.position[0]) * 0.1,
        (playerPosition[1] - enemy.position[1]) * 0.1,
        (playerPosition[2] - enemy.position[2]) * 0.1,
      ];

      const newBullet: BulletData = {
        id: `enemy-bullet-${now}`,
        position: [...enemy.position],
        direction,
        isPlayerBullet: false,
        createdAt: now,
      };

      setBullets((prev) => [...prev, newBullet]);
    },
    [playerPosition]
  );

  const checkCollisions = useCallback(() => {
    setBullets((prevBullets) => {
      const remainingBullets = prevBullets.filter((bullet) => {
        const now = Date.now();
        if (now - bullet.createdAt > 5000) return false;

        if (!bullet.isPlayerBullet) return true;

        let hit = false;
        setEnemies((prevEnemies) =>
          prevEnemies.map((enemy) => {
            if (!enemy.isActive) return enemy;

            const distance = Math.sqrt(
              Math.pow(bullet.position[0] - enemy.position[0], 2) +
                Math.pow(bullet.position[1] - enemy.position[1], 2) +
                Math.pow(bullet.position[2] - enemy.position[2], 2)
            );

            if (distance < 1) {
              hit = true;
              const newHealth = enemy.health - 50;

              if (newHealth <= 0) {
                setScore((s) => s + 100);
                setEnemiesKilled((k) => k + 1);
                setShotsHit((prev) => prev + 1);
                toast.success('+100 points!');
                return { ...enemy, isActive: false };
              }

              return { ...enemy, health: newHealth };
            }
            return enemy;
          })
        );

        return !hit;
      });

      return remainingBullets;
    });

    bullets.forEach((bullet) => {
      if (bullet.isPlayerBullet) return;

      const distance = Math.sqrt(
        Math.pow(bullet.position[0] - playerPosition[0], 2) +
          Math.pow(bullet.position[1] - playerPosition[1], 2) +
          Math.pow(bullet.position[2] - playerPosition[2], 2)
      );

      if (distance < 0.8) {
        setBullets((b) => b.filter((bu) => bu.id !== bullet.id));
        setPlayerHealth((h) => Math.max(0, h - 10));
        toast.error('-10 HP!');
      }
    });

    setEnemies((prevEnemies) =>
      prevEnemies.map((enemy) => {
        if (!enemy.isActive) return enemy;

        const newZ = enemy.position[2] + 0.05;
        if (newZ > playerPosition[2]) {
          setPlayerHealth((h) => Math.max(0, h - 20));
          toast.error('Enemy reached you! -20 HP!');
          return { ...enemy, isActive: false };
        }

        return {
          ...enemy,
          position: [enemy.position[0], enemy.position[1], newZ],
        };
      })
    );
  }, [bullets, enemies, playerPosition]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key === ' ') {
        e.preventDefault();
        shoot();
      }
      if (e.key === 'p' || e.key === 'P') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, gameOver, shoot]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      setElapsedTime((Date.now() - gameStartTime.current) / 1000);

      setPlayerPosition((pos) => {
        let [x, y, z] = pos;
        const speed = 0.2;

        if (
          keysPressed.current.has('a') ||
          keysPressed.current.has('arrowleft')
        )
          x -= speed;
        if (
          keysPressed.current.has('d') ||
          keysPressed.current.has('arrowright')
        )
          x += speed;
        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup'))
          y += speed;
        if (
          keysPressed.current.has('s') ||
          keysPressed.current.has('arrowdown')
        )
          y -= speed;

        x = Math.max(-10, Math.min(10, x));
        y = Math.max(-1, Math.min(6, y));

        return [x, y, z];
      });

      setFuel((f) => Math.max(0, f - 0.05));
      spawnEnemies();
      enemies.forEach((enemy) => {
        if (enemy.isActive && Math.random() < 0.02) {
          enemyShoot(enemy);
        }
      });
      checkCollisions();

      if (enemiesKilled >= level * 10) {
        setLevel((l) => l + 1);
        setEnemiesKilled(0);
        setAmmo((a) => a + 50);
        toast.success(`Level ${level + 1}! +50 Ammo`);
      }

      if (playerHealth <= 0 || fuel <= 0) {
        setGameOver(true);
      }

      if (shotsFired > 0) {
        setAccuracy(Math.floor((shotsHit / shotsFired) * 100));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [
    isPaused,
    gameOver,
    spawnEnemies,
    enemyShoot,
    checkCollisions,
    playerHealth,
    fuel,
    enemiesKilled,
    level,
    enemies,
    shotsFired,
    shotsHit,
  ]);

  useEffect(() => {
    if (!gameOver || !isInitialized || !wallet) return;

    const handleGameOver = async () => {
      const gameStats = {
        score,
        kills: enemiesKilled,
        accuracy: accuracy / 100,
        survivalTime: elapsedTime,
      };

      try {
        toast.info('Finalizing game session...');

        await supabase.functions.invoke('update-score', {
          body: {
            profileId: wallet.profileId,
            score,
            kills: enemiesKilled,
            duration: Math.floor(elapsedTime),
          },
        });

        const [sessionTxHash] = await Promise.all([
          blockchain.verifyAndSubmitSession(gameStats),
          blockchain.submitScoreToBlockchain(gameStats),
        ]);

        const achievements = await blockchain.checkAndClaimAchievements(
          gameStats
        );

        if (score > 5000 && achievements.length > 0) {
          for (const achievement of achievements) {
            await blockchain.mintNFTReward(achievement.id, {
              score,
              kills: enemiesKilled,
              level,
              accuracy,
              survivalTime: elapsedTime,
            });
          }
        }

        await blockchain.syncPlayerData();

        toast.success('Game session completed and recorded!');
      } catch (error) {
        console.error('Game over handling error:', error);
        toast.error('Failed to finalize game session');
      }
    };

    handleGameOver();
  }, [
    gameOver,
    score,
    enemiesKilled,
    accuracy,
    elapsedTime,
    level,
    isInitialized,
    wallet,
    blockchain,
  ]);

  useEffect(() => {
    if (score > 0 && score % 1000 === 0) {
      syncScoreToBlockchain();
    }
  }, [score, syncScoreToBlockchain]);

  const resetGame = () => {
    setPlayerPosition([0, 0, 0]);
    setPlayerHealth(100);
    setScore(0);
    setAmmo(200);
    setFuel(100);
    setLevel(1);
    setEnemies([]);
    setBullets([]);
    setGameOver(false);
    setIsPaused(false);
    setElapsedTime(0);
    setEnemiesKilled(0);
    setAccuracy(100);
    setShotsFired(0);
    setShotsHit(0);
    gameStartTime.current = Date.now();
    lastEnemySpawn.current = Date.now();
    lastScoreSync.current = Date.now();
  };

  return {
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
    accuracy,
    shoot,
    setIsPaused,
    resetGame,
    isBlockchainProcessing: blockchain.isProcessing,
    pendingTransactions: blockchain.pendingTransactions,
  };
};
