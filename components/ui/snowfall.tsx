'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  size: number;
  speed: number;
  opacity: number;
  blur: number;
}

export function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Create initial snowflakes
    const initialSnowflakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Random x position (0-100%)
      size: Math.random() * 4 + 2, // Random size (2-6px)
      speed: Math.random() * 2 + 1, // Random speed (1-3s)
      opacity: Math.random() * 0.6 + 0.3, // Random opacity (0.3-0.9)
      blur: Math.random() > 0.5 ? 1 : 0, // Random blur effect
    }));

    setSnowflakes(initialSnowflakes);

    // Add new snowflakes periodically
    const interval = setInterval(() => {
      setSnowflakes(prev => {
        const newSnowflake = {
          id: Date.now(),
          x: Math.random() * 100,
          size: Math.random() * 4 + 2,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.3,
          blur: Math.random() > 0.5 ? 1 : 0,
        };
        return [...prev.slice(-49), newSnowflake]; // Keep max 50 snowflakes
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.x}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            filter: flake.blur ? 'blur(1px)' : 'none',
            animationDuration: `${flake.speed}s`,
            backgroundColor: 'white',
            borderRadius: '50%',
            transform: 'translateY(-100%)',
          }}
        />
      ))}
    </div>
  );
}
