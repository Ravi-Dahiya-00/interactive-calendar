'use client';

import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSeasonalEffects } from '@/hooks/useSeasonalEffects';

export function SeasonalEffects({ currentMonth }: { currentMonth: number }) {
  const { ambientEffects } = useTheme();
  const season = useSeasonalEffects(currentMonth);

  // Generate 60 particles, distributed across 3 depth layers for 3D parallax
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => {
      const isForeground = i % 3 === 0;
      const isBackground = i % 3 === 1;
      
      let scale = 1;
      let blur = 0;
      let speedMultiplier = 2.0; // relaxed midground
      let maxOpacity = 0.8;

      if (isForeground) {
        scale = 2;
        blur = 2; // close to camera = blurry
        speedMultiplier = 1.2; // faster than rest, but still relaxed
        maxOpacity = 0.9;
      } else if (isBackground) {
        scale = 0.5;
        blur = 1; // far = slightly blurry
        speedMultiplier = 3.5; // very slow drift
        maxOpacity = 0.4;
      }

      return {
        left: Math.random() * 100,
        delay: Math.random() * -10, // negative delay so they start already on screen
        duration: (3 + Math.random() * 4) * speedMultiplier,
        scale,
        blur,
        maxOpacity,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 80, // -40px to 40px drift
        isCurrent: true,
      };
    });
  }, []); // Static random generation

  if (!ambientEffects || season === 'none') return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ease-in-out">
      
      {/* Summer Effect - 3D Floating Fireflies/Dust */}
      {season === 'summer' && (
        <div className="absolute inset-0 bg-yellow-500/5 mix-blend-overlay">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_8px_2px_rgba(253,224,71,0.8)]"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity,
                '--drift': `${p.drift}px`,
                animation: `ambient-float ${p.duration * 2}s ease-in-out ${p.delay}s infinite alternate`
              } as React.CSSProperties}
            />
          ))}
          <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-yellow-400/10 blur-[100px] animate-[ambient-sun-pulse_12s_ease-in-out_infinite]" />
        </div>
      )}

      {/* Rainy Effect - 3D Slanted Heavy Rain */}
      {season === 'rainy' && (
        <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 w-[2px] h-[40px] bg-gradient-to-b from-transparent via-blue-300/60 to-blue-200/80 rounded-full"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                '--stretch': p.scale * 1.5,
                '--slant': `${-20 * p.scale}px`,
                '--max-opacity': p.maxOpacity,
                animation: `ambient-rain-fall ${p.duration * 0.3}s linear ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Spring Effect - 3D Cherry Blossoms */}
      {season === 'spring' && (
        <div className="absolute inset-0 bg-pink-100/5 mix-blend-overlay">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 w-3 h-2 bg-pink-300/80 rounded-full"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                borderRadius: '50% 0 50% 0', // Petal shape
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity,
                '--drift': `${p.drift * 2}px`,
                '--rotation': `${p.rotation + 360}deg`,
                animation: `ambient-snow-fall ${p.duration * 2}s ease-in-out ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Autumn Effect - 3D Falling Leaves */}
      {season === 'autumn' && (
        <div className="absolute inset-0 bg-orange-900/5 mix-blend-overlay">
          {particles.map((p, i) => {
            const colors = ['bg-orange-400', 'bg-orange-500', 'bg-red-400', 'bg-amber-600'];
            const leafColor = colors[i % colors.length];
            return (
              <div
                key={i}
                className={`absolute top-0 w-3 h-3 ${leafColor} opacity-80`}
                style={{
                  left: `${p.left}%`,
                  filter: `blur(${p.blur}px)`,
                  borderRadius: '50% 0 50% 0', // Leaf shape
                  '--scale': p.scale,
                  '--max-opacity': p.maxOpacity,
                  '--drift': `${p.drift * 1.5}px`,
                  '--rotation': `${p.rotation + 180}deg`,
                  animation: `ambient-snow-fall ${p.duration * 2}s ease-in-out ${p.delay}s infinite`
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* Winter Effect - 3D Spinning Snow/Ice crystals */}
      {season === 'winter' && (
        <div className="absolute inset-0 bg-blue-100/5 mix-blend-overlay">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 w-2 h-2 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.9)]"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                borderRadius: i % 2 === 0 ? '50%' : '1px', // Mix of soft dots and sharp crystals
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity,
                '--drift': `${p.drift}px`,
                '--rotation': `${p.rotation + 360}deg`,
                animation: `ambient-snow-fall ${p.duration * 1.5}s linear ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
    </div>
  );
}
