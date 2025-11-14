import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { Player } from './Player';
import { Enemy } from './Enemy';
import { Bullet } from './Bullet';
import { Suspense } from 'react';

interface BulletData {
  id: string;
  position: [number, number, number];
  direction: [number, number, number];
  isPlayerBullet: boolean;
}

interface EnemyData {
  id: string;
  position: [number, number, number];
  health: number;
  isActive: boolean;
}

interface GameSceneProps {
  playerPosition: [number, number, number];
  playerHealth: number;
  enemies: EnemyData[];
  bullets: BulletData[];
  onShoot: () => void;
}

export const GameScene = ({
  playerPosition,
  playerHealth,
  enemies,
  bullets,
  onShoot,
}: GameSceneProps) => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 5, 15], fov: 60 }}
      style={{ background: 'linear-gradient(to bottom, #000000, #0a0a1a)' }}
    >
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[0, 10, 0]} intensity={0.5} color="#00d4ff" />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
        
        {/* Space platform/ground */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#0a0a1a" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#000033"
            emissiveIntensity={0.1}
          />
        </mesh>
        
        {/* Grid lines for depth */}
        <gridHelper args={[100, 50, '#00d4ff', '#001a33']} position={[0, -1.9, 0]} />
        
        {/* Player */}
        <Player position={playerPosition} onShoot={onShoot} health={playerHealth} />
        
        {/* Enemies */}
        {enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            id={enemy.id}
            position={enemy.position}
            isActive={enemy.isActive}
          />
        ))}
        
        {/* Bullets */}
        {bullets.map((bullet) => (
          <Bullet
            key={bullet.id}
            position={bullet.position}
            direction={bullet.direction}
            isPlayerBullet={bullet.isPlayerBullet}
          />
        ))}
        
        {/* Camera controls - limited for gameplay */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Suspense>
    </Canvas>
  );
};
