import { useEffect, useState } from 'react';

export const SpaceFightersLogo = () => {
  const [glowIntensity, setGlowIntensity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => {
        const newValue = prev + 0.05;
        return newValue > 1.3 ? 0.7 : newValue;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none select-none">
      <div className="relative">
        {/* Effet de glow derrière le texte */}
        <div 
          className="absolute inset-0 blur-3xl opacity-60"
          style={{
            background: `radial-gradient(ellipse at center, rgba(0, 212, 255, ${glowIntensity * 0.8}) 0%, transparent 70%)`,
            transform: 'scale(1.5)',
          }}
        />
        
        {/* Logo principal */}
        <div className="relative text-center">
          <h1 
            className="text-7xl md:text-9xl font-bold tracking-wider mb-2"
            style={{
              fontFamily: '"Orbitron", "Rajdhani", sans-serif',
              textShadow: `
                0 0 10px rgba(0, 212, 255, ${glowIntensity}),
                0 0 20px rgba(0, 212, 255, ${glowIntensity * 0.8}),
                0 0 30px rgba(0, 212, 255, ${glowIntensity * 0.6}),
                0 0 40px rgba(0, 170, 255, ${glowIntensity * 0.4}),
                0 0 70px rgba(0, 170, 255, ${glowIntensity * 0.2}),
                0 0 80px rgba(0, 170, 255, ${glowIntensity * 0.1})
              `,
              background: 'linear-gradient(180deg, #00d4ff 0%, #0088ff 50%, #0066cc 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SPACE
          </h1>
          
          <h2 
            className="text-6xl md:text-8xl font-bold tracking-wider"
            style={{
              fontFamily: '"Orbitron", "Rajdhani", sans-serif',
              textShadow: `
                0 0 10px rgba(0, 212, 255, ${glowIntensity}),
                0 0 20px rgba(0, 212, 255, ${glowIntensity * 0.8}),
                0 0 30px rgba(0, 212, 255, ${glowIntensity * 0.6}),
                0 0 40px rgba(0, 170, 255, ${glowIntensity * 0.4}),
                0 0 70px rgba(0, 170, 255, ${glowIntensity * 0.2})
              `,
              background: 'linear-gradient(180deg, #00d4ff 0%, #0088ff 50%, #0055aa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            FIGHTERS
          </h2>

          {/* Lignes décoratives */}
          <div className="mt-4 flex justify-center items-center gap-4">
            <div 
              className="h-0.5 w-24 md:w-40"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, ${glowIntensity}) 50%, transparent 100%)`,
                boxShadow: `0 0 10px rgba(0, 212, 255, ${glowIntensity})`,
              }}
            />
            <div 
              className="w-3 h-3 rounded-full"
              style={{
                background: '#00d4ff',
                boxShadow: `0 0 15px rgba(0, 212, 255, ${glowIntensity}), 0 0 30px rgba(0, 212, 255, ${glowIntensity * 0.5})`,
              }}
            />
            <div 
              className="h-0.5 w-24 md:w-40"
              style={{
                background: `linear-gradient(90deg, transparent 0%, rgba(0, 212, 255, ${glowIntensity}) 50%, transparent 100%)`,
                boxShadow: `0 0 10px rgba(0, 212, 255, ${glowIntensity})`,
              }}
            />
          </div>

          {/* Particles autour du logo */}
          {[...Array(8)].map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 200;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const delay = i * 0.2;
            
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-pulse"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  background: '#00d4ff',
                  boxShadow: `0 0 10px rgba(0, 212, 255, ${glowIntensity})`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
