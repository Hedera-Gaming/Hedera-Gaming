import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Composant pour un astéroïde animé
function Asteroid({ position, scale, rotationSpeed }: { position: [number, number, number], scale: number, rotationSpeed: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += rotationSpeed[0];
    meshRef.current.rotation.y += rotationSpeed[1];
    meshRef.current.rotation.z += rotationSpeed[2];
    
    // Mouvement lent de dérive
    meshRef.current.position.x += Math.sin(state.clock.elapsedTime * 0.1) * 0.001;
    meshRef.current.position.y += Math.cos(state.clock.elapsedTime * 0.15) * 0.001;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <dodecahedronGeometry args={[scale, 1]} />
      <meshStandardMaterial
        color="#6b7280"
        roughness={0.9}
        metalness={0.1}
        emissive="#1a1a1a"
      />
    </mesh>
  );
}

// Composant pour un vaisseau spatial
function Spaceship({ position, speed, direction }: { position: [number, number, number], speed: number, direction: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Mouvement du vaisseau
    groupRef.current.position.x += Math.cos(direction) * speed;
    groupRef.current.position.z += Math.sin(direction) * speed;
    
    // Réapparition quand il sort de la scène
    if (groupRef.current.position.x > 50) groupRef.current.position.x = -50;
    if (groupRef.current.position.x < -50) groupRef.current.position.x = 50;
    if (groupRef.current.position.z > 50) groupRef.current.position.z = -50;
    if (groupRef.current.position.z < -50) groupRef.current.position.z = 50;
    
    // Légère oscillation
    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Corps du vaisseau */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.3, 1.5, 4]} />
        <meshStandardMaterial
          color="#4a9eff"
          emissive="#0066ff"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Ailes */}
      <mesh position={[0.5, 0, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.8, 0.05, 0.3]} />
        <meshStandardMaterial
          color="#2d5a8f"
          emissive="#0044aa"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[-0.5, 0, 0.2]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.8, 0.05, 0.3]} />
        <meshStandardMaterial
          color="#2d5a8f"
          emissive="#0044aa"
          emissiveIntensity={0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {/* Moteurs lumineux */}
      <pointLight position={[0, 0, -0.5]} color="#00d4ff" intensity={2} distance={3} />
    </group>
  );
}

// Particules de débris spatiaux
function SpaceDebris() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y += 0.0005;
    particlesRef.current.rotation.x += 0.0002;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Soleil/Étoile lumineuse
function SunFlare() {
  return (
    <group position={[30, 10, -40]}>
      <pointLight color="#ff8844" intensity={50} distance={100} />
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial color="#ffaa44" />
      </mesh>
      {/* Glow effect */}
      <mesh scale={[3, 3, 3]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ff6622"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// Scène principale
function Scene() {
  // Génération des astéroïdes
  const asteroids = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60,
      ] as [number, number, number],
      scale: Math.random() * 2 + 1,
      rotationSpeed: [
        Math.random() * 0.01,
        Math.random() * 0.01,
        Math.random() * 0.01,
      ] as [number, number, number],
    }));
  }, []);

  // Génération des vaisseaux
  const spaceships = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 40,
      ] as [number, number, number],
      speed: Math.random() * 0.05 + 0.02,
      direction: Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {/* Lumière ambiante */}
      <ambientLight intensity={0.3} />
      
      {/* Étoiles en arrière-plan */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Particules scintillantes */}
      <Sparkles
        count={200}
        scale={[100, 100, 100]}
        size={2}
        speed={0.3}
        color="#00d4ff"
        opacity={0.8}
      />

      {/* Soleil/Étoile */}
      <SunFlare />

      {/* Astéroïdes */}
      {asteroids.map((asteroid, i) => (
        <Asteroid key={`asteroid-${i}`} {...asteroid} />
      ))}

      {/* Vaisseaux */}
      {spaceships.map((ship, i) => (
        <Spaceship key={`ship-${i}`} {...ship} />
      ))}

      {/* Débris spatiaux */}
      <SpaceDebris />

      {/* Lumières directionnelles */}
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#4a9eff" />
    </>
  );
}

export const SpaceBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 75 }}
        style={{ background: 'radial-gradient(circle at center, #1a0b2e 0%, #0a0014 100%)' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
