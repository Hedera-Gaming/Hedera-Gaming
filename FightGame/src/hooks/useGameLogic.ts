import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useGameLogic = () => {
  const [playerPosition, setPlayerPosition] = useState<[number, number, number]>([0, 0, 0]);
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
  
  const keysPressed = useRef<Set<string>>(new Set());
  const gameStartTime = useRef(Date.now());
  const lastEnemySpawn = useRef(Date.now());

  // Spawn enemies based on level
  const spawnEnemies = useCallback(() => {
    const now = Date.now();
    const spawnInterval = Math.max(1000, 3000 - (level * 200)); // Faster spawns at higher levels
    
    if (now - lastEnemySpawn.current > spawnInterval && enemies.filter(e => e.isActive).length < level * 3) {
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

  // Player shooting
  const shoot = useCallback(() => {
    if (ammo <= 0 || isPaused || gameOver) return;
    
    setAmmo((prev) => Math.max(0, prev - 1));
    const bulletId = `bullet-${Date.now()}-${Math.random()}`;
    const newBullet: BulletData = {
      id: bulletId,
      position: [playerPosition[0], playerPosition[1], playerPosition[2]],
      direction: [0, 0, -0.5],
      isPlayerBullet: true,
      createdAt: Date.now(),
    };
    setBullets((prev) => [...prev, newBullet]);
  }, [ammo, playerPosition, isPaused, gameOver]);

  // Enemy shooting
  const enemyShoot = useCallback((enemy: EnemyData) => {
    const now = Date.now();
    if (now - enemy.lastShot < 2000) return; // Shoot every 2 seconds
    
    const bulletId = `enemy-bullet-${now}-${Math.random()}`;
    const direction: [number, number, number] = [
      (playerPosition[0] - enemy.position[0]) * 0.05,
      (playerPosition[1] - enemy.position[1]) * 0.05,
      (playerPosition[2] - enemy.position[2]) * 0.05,
    ];
    
    const newBullet: BulletData = {
      id: bulletId,
      position: [enemy.position[0], enemy.position[1], enemy.position[2]],
      direction,
      isPlayerBullet: false,
      createdAt: now,
    };
    
    setBullets((prev) => [...prev, newBullet]);
    setEnemies((prev) =>
      prev.map((e) =>
        e.id === enemy.id ? { ...e, lastShot: now } : e
      )
    );
  }, [playerPosition]);

  // Collision detection
  const checkCollisions = useCallback(() => {
    const now = Date.now();
    
    // Remove old bullets
    setBullets((prev) =>
      prev.filter((bullet) => now - bullet.createdAt < 5000)
    );

    // Check bullet-enemy collisions
    bullets.forEach((bullet) => {
      if (!bullet.isPlayerBullet) return;
      
      enemies.forEach((enemy) => {
        if (!enemy.isActive) return;
        
        const distance = Math.sqrt(
          Math.pow(bullet.position[0] - enemy.position[0], 2) +
          Math.pow(bullet.position[1] - enemy.position[1], 2) +
          Math.pow(bullet.position[2] - enemy.position[2], 2)
        );
        
        if (distance < 0.8) {
          // Hit!
          setBullets((prev) => prev.filter((b) => b.id !== bullet.id));
          setEnemies((prev) =>
            prev.map((e) => {
              if (e.id === enemy.id) {
                const newHealth = e.health - 50;
                if (newHealth <= 0) {
                  setScore((s) => s + 100);
                  setEnemiesKilled((k) => k + 1);
                  toast.success('+100 points!');
                  return { ...e, isActive: false };
                }
                return { ...e, health: newHealth };
              }
              return e;
            })
          );
        }
      });
    });

    // Check enemy bullet-player collisions
    bullets.forEach((bullet) => {
      if (bullet.isPlayerBullet) return;
      
      const distance = Math.sqrt(
        Math.pow(bullet.position[0] - playerPosition[0], 2) +
        Math.pow(bullet.position[1] - playerPosition[1], 2) +
        Math.pow(bullet.position[2] - playerPosition[2], 2)
      );
      
      if (distance < 0.8) {
        // Player hit!
        setBullets((prev) => prev.filter((b) => b.id !== bullet.id));
        setPlayerHealth((h) => Math.max(0, h - 10));
        toast.error('-10 HP!');
      }
    });

    // Move enemies forward
    setEnemies((prev) =>
      prev.map((enemy) => {
        if (!enemy.isActive) return enemy;
        
        const newZ = enemy.position[2] + 0.05;
        
        // Enemy reached player - damage player
        if (newZ > playerPosition[2]) {
          setPlayerHealth((h) => Math.max(0, h - 20));
          toast.error('Enemy reached you! -20 HP!');
          return { ...enemy, isActive: false };
        }
        
        return {
          ...enemy,
          position: [enemy.position[0], enemy.position[1], newZ] as [number, number, number],
        };
      })
    );
  }, [bullets, enemies, playerPosition]);

  // Player movement
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

  // Game loop
  useEffect(() => {
    if (isPaused || gameOver) return;

    const interval = setInterval(() => {
      // Update elapsed time
      setElapsedTime((Date.now() - gameStartTime.current) / 1000);

      // Move player
      setPlayerPosition((pos) => {
        let [x, y, z] = pos;
        const speed = 0.2;

        if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) x -= speed;
        if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) x += speed;
        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) y += speed;
        if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) y -= speed;

        // Boundaries
        x = Math.max(-10, Math.min(10, x));
        y = Math.max(-1, Math.min(6, y));

        return [x, y, z];
      });

      // Consume fuel slowly
      setFuel((f) => Math.max(0, f - 0.05));

      // Spawn enemies
      spawnEnemies();

      // Enemies shoot
      enemies.forEach((enemy) => {
        if (enemy.isActive && Math.random() < 0.02) {
          enemyShoot(enemy);
        }
      });

      // Check collisions
      checkCollisions();

      // Check level progression
      if (enemiesKilled >= level * 10) {
        setLevel((l) => l + 1);
        setEnemiesKilled(0);
        setAmmo((a) => a + 50);
        toast.success(`Level ${level + 1}! +50 Ammo`);
      }

      // Check game over
      if (playerHealth <= 0 || fuel <= 0) {
        setGameOver(true);
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [isPaused, gameOver, spawnEnemies, enemyShoot, checkCollisions, playerHealth, fuel, enemiesKilled, level, enemies]);

  // Save game session when game over
  useEffect(() => {
    if (!gameOver) return;

    const saveSession = async () => {
      try {
        // Get wallet from localStorage
        const walletData = localStorage.getItem('wallet');
        if (!walletData) {
          toast.error('Wallet non connecté');
          return;
        }

        const wallet = JSON.parse(walletData);
        
        // Call update-score edge function
        const { data, error } = await supabase.functions.invoke('update-score', {
          body: {
            profileId: wallet.profileId,
            score,
            kills: enemiesKilled,
            duration: Math.floor(elapsedTime),
          },
        });

        if (error) throw error;

        console.log('Game session saved:', data);
        toast.success('Score enregistré sur la blockchain!');

        // Award NFT if score is high enough (e.g., > 1000)
        if (score > 1000) {
          const { data: nftData, error: nftError } = await supabase.functions.invoke('mint-nft-reward', {
            body: {
              profileId: wallet.profileId,
              rewardType: 'Victory NFT',
              metadata: {
                score,
                kills: enemiesKilled,
                level,
                timestamp: new Date().toISOString(),
              },
            },
          });

          if (nftError) {
            console.error('Error minting NFT:', nftError);
          } else {
            console.log('NFT minted:', nftData);
            toast.success(`🎉 Félicitations ${wallet.playerName}! Vous avez reçu une récompense NFT!`);
          }
        }
      } catch (error) {
        console.error('Error saving session:', error);
        toast.error('Erreur lors de l\'enregistrement');
      }
    };

    saveSession();
  }, [gameOver, score, enemiesKilled, elapsedTime, level]);

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
    gameStartTime.current = Date.now();
    lastEnemySpawn.current = Date.now();
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
    shoot,
    setIsPaused,
    resetGame,
  };
};
