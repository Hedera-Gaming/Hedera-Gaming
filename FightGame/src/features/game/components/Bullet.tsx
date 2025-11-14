import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface BulletProps {
  position: [number, number, number];
  direction: [number, number, number];
  isPlayerBullet: boolean;
}

export const Bullet = ({ position, direction, isPlayerBullet }: BulletProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x += direction[0];
      meshRef.current.position.y += direction[1];
      meshRef.current.position.z += direction[2];
    }
  });

  const color = isPlayerBullet ? "#00ffff" : "#ff0000";
  const emissiveColor = isPlayerBullet ? "#00ffff" : "#ff0000";

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={emissiveColor} 
          emissiveIntensity={2}
          metalness={1}
          roughness={0}
        />
      </mesh>
      <pointLight color={color} intensity={2} distance={2} />
      
      {/* Trail effect */}
      <mesh position={[-direction[0] * 2, -direction[1] * 2, -direction[2] * 2]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial 
          color={color} 
          emissive={emissiveColor} 
          emissiveIntensity={1}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
};
