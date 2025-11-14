import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface EnemyProps {
  position: [number, number, number];
  id: string;
  isActive: boolean;
}

export const Enemy = ({ position, id, isActive }: EnemyProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && isActive) {
      // Aggressive movement pattern
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3 + parseFloat(id)) * 0.15;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  if (!isActive) return null;

  return (
    <group position={position}>
      {/* Enemy Astronaut Body - Red/Dark theme */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color="#ff0000" metalness={0.7} roughness={0.3} emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#330000" metalness={0.8} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      
      {/* Visor - Evil red */}
      <mesh position={[0, 0.7, 0.2]} castShadow>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#ff0000" metalness={1} roughness={0} emissive="#ff0000" emissiveIntensity={1} />
      </mesh>
      
      {/* Jet Pack */}
      <mesh position={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.3]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Jet Pack Flames - Red */}
      <mesh position={[0.15, -0.3, -0.5]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.15, -0.3, -0.5]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#ff0000" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#ff0000" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Weapon */}
      <mesh position={[0.5, 0, 0.3]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#ff3333" metalness={0.8} roughness={0.2} emissive="#ff0000" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Warning light */}
      <pointLight position={[0, 0.7, 0.2]} color="#ff0000" intensity={1.5} distance={3} />
    </group>
  );
};
