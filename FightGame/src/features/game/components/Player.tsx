import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface PlayerProps {
  position: [number, number, number];
  onShoot: () => void;
  health: number;
}

export const Player = ({ position, onShoot, health }: PlayerProps) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Astronaut Body */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
        <meshStandardMaterial color={health > 50 ? "#00d4ff" : "#ff4444"} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} transparent opacity={0.8} />
      </mesh>
      
      {/* Visor */}
      <mesh position={[0, 0.7, 0.2]} castShadow>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#0099ff" metalness={1} roughness={0} emissive="#0099ff" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Jet Pack */}
      <mesh position={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.4, 0.6, 0.3]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.3} />
      </mesh>
      
      {/* Jet Pack Flames */}
      <mesh position={[0.15, -0.3, -0.5]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={2} />
      </mesh>
      <mesh position={[-0.15, -0.3, -0.5]}>
        <coneGeometry args={[0.08, 0.3, 8]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff6600" emissiveIntensity={2} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
        <meshStandardMaterial color="#00d4ff" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Gun */}
      <mesh position={[0.5, 0, 0.3]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Point light for glow effect */}
      <pointLight position={[0, 0.7, 0.2]} color="#0099ff" intensity={1} distance={2} />
    </group>
  );
};
