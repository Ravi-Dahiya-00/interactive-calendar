// Draws seasonal background animations (rain, snow, petals, fireflies, etc.) based on the current month.
// Runs entirely in CSS with pointer-events disabled so it never blocks clicks on the calendar.
'use client';

import { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useSeasonalEffects } from '@/hooks/useSeasonalEffects';

const Clouds = ({ season, variant }: { season: string; variant: 0 | 1 }) => {
  // Volumetric pure CSS clouds using radial gradients.
  // Their color strongly depends on the season and variant.
  let cloudColor = 'from-transparent via-white/5 to-white/10';
  if (season === 'rainy') {
    cloudColor = variant === 0 ? 'from-transparent via-purple-500/10 to-blue-500/10' : 'from-transparent via-gray-700/30 to-gray-900/40';
  } else if (season === 'winter') {
    cloudColor = 'from-transparent via-white/5 to-blue-100/10';
  } else if (season === 'summer') {
    cloudColor = variant === 0 ? 'from-transparent via-orange-500/5 to-red-500/5' : 'from-transparent via-indigo-900/10 to-black/20';
  } else if (season === 'autumn') {
    cloudColor = 'from-transparent via-amber-500/5 to-orange-800/10';
  } else if (season === 'spring') {
    cloudColor = variant === 0 ? 'from-transparent via-pink-400/5 to-white/10' : 'from-transparent via-emerald-400/5 to-green-600/5';
  }

  return (
    <div className="absolute inset-0 overflow-hidden mix-blend-overlay opacity-80" style={{ perspective: '800px' }}>
      <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] animate-[cloud-drift_120s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
        {/* Layer overlapping radial gradients to create cloud volume */}
        <div className={`absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-radial ${cloudColor} blur-[50px]`} />
        <div className={`absolute top-[30%] left-[40%] w-[60vw] h-[40vw] rounded-full bg-gradient-radial ${cloudColor} blur-[60px]`} />
        <div className={`absolute top-[5%] left-[70%] w-[45vw] h-[45vw] rounded-full bg-gradient-radial ${cloudColor} blur-[40px]`} />
        <div className={`absolute top-[50%] left-[80%] w-[70vw] h-[50vw] rounded-full bg-gradient-radial ${cloudColor} blur-[80px]`} />
      </div>
    </div>
  );
};

export function SeasonalEffects({ currentMonth }: { currentMonth: number }) {
  const { ambientEffects } = useTheme();
  const season = useSeasonalEffects(currentMonth);

  // Generate a random variant (0 or 1) every time the month (and thus the season) changes
  // This satisfies the "sometime this, sometime this" requirement.
  const [variant, setVariant] = useState<0 | 1>(0);
  
  useEffect(() => {
    setVariant(Math.random() > 0.5 ? 1 : 0);
  }, [currentMonth]);

  // Generate 80 particles, distributed across 3 depth layers for 3D parallax
  const particles = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => {
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
        duration: (5 + Math.random() * 5) * speedMultiplier, // Increased base duration significantly (from 3-7 to 5-10)
        scale,
        blur,
        maxOpacity,
        rotation: Math.random() * 360,
        drift: (Math.random() - 0.5) * 60, // Slower horizontal drift
        windDrift: 20 + Math.random() * 40, // Slower wind drift
      };
    });
  }, []);

  if (!ambientEffects || season === 'none') return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-[background] duration-2000 ease-in-out">
      
      {/* 3D Volumetric Drifting Clouds Backdrop */}
      <Clouds season={season} variant={variant} />

      {/* SUMMER */}
      {season === 'summer' && variant === 0 && ( /* Golden Hour Sunset */
        <div className="absolute inset-0 bg-yellow-600/10 mix-blend-overlay">
          {particles.slice(0, 40).map((p, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 shadow-[0_0_12px_3px_rgba(251,191,36,0.8)]"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity,
                '--drift': `${p.drift}px`,
                animation: `ambient-float ${p.duration * 3}s ease-in-out ${p.delay}s infinite alternate`
              } as React.CSSProperties}
            />
          ))}
          <div className="absolute bottom-[-10%] left-[-10%] w-[80vw] h-[60vw] rounded-full bg-orange-500/20 blur-[120px] animate-[ambient-sun-pulse_20s_ease-in-out_infinite]" />
        </div>
      )}
      {season === 'summer' && variant === 1 && ( /* Solar Eclipse / Midnight Sun */
        <div className="absolute inset-0 bg-indigo-950/30 mix-blend-multiply">
          <div className="absolute top-[10%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-white/10 blur-[80px] shadow-[0_0_100px_40px_rgba(255,255,255,0.2)] animate-[ambient-sun-pulse_12s_ease-in-out_infinite]" />
          {particles.slice(0, 30).map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-blue-300 shadow-[0_0_8px_2px_rgba(147,197,253,0.8)]"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity,
                '--drift': `${p.drift}px`,
                animation: `ambient-float ${p.duration * 4}s ease-in-out ${p.delay}s infinite alternate`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* RAINY */}
      {season === 'rainy' && variant === 0 && ( /* Neon Cyberpunk Rain */
        <div className="absolute inset-0 bg-purple-900/10 mix-blend-color-burn">
          {particles.map((p, i) => {
            const neonColors = ['from-cyan-400 via-cyan-400/50', 'from-fuchsia-500 via-fuchsia-500/50'];
            const color = neonColors[i % neonColors.length];
            return (
              <div
                key={i}
                className={`absolute top-0 w-[2px] h-[50px] bg-gradient-to-b ${color} to-transparent rounded-full shadow-[0_0_10px_2px_rgba(0,0,0,0.5)]`}
                style={{
                  left: `${p.left}%`,
                  filter: `blur(${p.blur}px)`,
                  '--stretch': p.scale * 2,
                  '--slant': `${-10 * p.scale}px`,
                  '--max-opacity': p.maxOpacity,
                  animation: `ambient-rain-fall ${p.duration * 1.5}s linear ${p.delay}s infinite`
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}
      {season === 'rainy' && variant === 1 && ( /* Thunderstorm */
        <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply">
          <div className="absolute inset-0 bg-white/60 mix-blend-overlay animate-[ambient-lightning_15s_ease-in-out_infinite]" />
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 w-[2px] h-[40px] bg-gradient-to-b from-transparent via-blue-200/80 to-blue-100 rounded-full"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                '--stretch': p.scale * 1.5,
                '--slant': `${-15 * p.scale}px`, // Reduced slant
                '--max-opacity': p.maxOpacity,
                animation: `ambient-rain-fall ${p.duration * 1.2}s linear ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* SPRING */}
      {season === 'spring' && variant === 0 && ( /* Cherry Blossom Breeze */
        <div className="absolute inset-0 bg-pink-100/10 mix-blend-overlay">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 w-3 h-2 bg-pink-300 rounded-full shadow-[0_2px_4px_rgba(244,114,182,0.4)]"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                borderRadius: '50% 0 50% 0', 
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity * 0.8,
                '--drift': `${p.drift * 2}px`,
                '--rotation': `${p.rotation + 360}deg`,
                animation: `ambient-snow-fall ${p.duration * 2.5}s ease-in-out ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      {season === 'spring' && variant === 1 && ( /* Enchanted Glade */
        <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-400/10 via-transparent to-transparent opacity-60 animate-[ambient-sun-pulse_20s_ease-in-out_infinite]" />
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 w-2 h-2 bg-green-300 rounded-full shadow-[0_0_8px_rgba(110,231,183,0.8)]"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                borderRadius: '50% 0 50% 0',
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity,
                '--drift': `${p.drift}px`,
                '--rotation': `${p.rotation + 180}deg`,
                animation: `ambient-snow-fall ${p.duration * 3.5}s ease-in-out ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* AUTUMN */}
      {season === 'autumn' && variant === 0 && ( /* Sunset Rust */
        <div className="absolute inset-0 bg-orange-900/5 mix-blend-overlay">
          {particles.map((p, i) => {
            const colors = ['bg-orange-500', 'bg-red-500', 'bg-amber-600', 'bg-orange-400'];
            const leafColor = colors[i % colors.length];
            return (
              <div
                key={i}
                className={`absolute top-0 w-3 h-3 ${leafColor} opacity-80 shadow-md`}
                style={{
                  left: `${p.left}%`,
                  filter: `blur(${p.blur}px)`,
                  borderRadius: '50% 0 50% 0',
                  '--scale': p.scale,
                  '--max-opacity': p.maxOpacity,
                  '--drift': `${p.drift}px`,
                  '--rotation': `${p.rotation + 180}deg`,
                  animation: `ambient-snow-fall ${p.duration * 2.8}s ease-in-out ${p.delay}s infinite`
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}
      {season === 'autumn' && variant === 1 && ( /* Windy Twilight */
        <div className="absolute inset-0 bg-indigo-900/10 mix-blend-color-burn">
          {particles.map((p, i) => {
            const colors = ['bg-yellow-600', 'bg-orange-600', 'bg-red-700'];
            const leafColor = colors[i % colors.length];
            return (
              <div
                key={i}
                className={`absolute top-0 w-3 h-3 ${leafColor} opacity-90 shadow-sm`}
                style={{
                  left: `${-20 + Math.random() * 50}%`, // Start off-screen left
                  filter: `blur(${p.blur}px)`,
                  borderRadius: '50% 0 50% 0',
                  '--scale': p.scale,
                  '--max-opacity': p.maxOpacity,
                  '--drift': `${p.windDrift}vw`,
                  '--rotation': `${p.rotation + 720}deg`,
                  animation: `ambient-windy-drift ${p.duration * 2.0}s linear ${p.delay}s infinite`
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* WINTER */}
      {season === 'winter' && variant === 0 && ( /* Blizzard */
        <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute top-0 w-2 h-2 bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.9)]"
              style={{
                left: `${-10 + Math.random() * 80}%`,
                filter: `blur(${p.blur}px)`,
                borderRadius: i % 2 === 0 ? '50%' : '1px',
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity,
                '--drift': `${p.windDrift * 0.4}vw`,
                '--rotation': `${p.rotation + 720}deg`,
                animation: `ambient-windy-drift ${p.duration * 1.8}s linear ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}
      {season === 'winter' && variant === 1 && ( /* Starry Frost */
        <div className="absolute inset-0 bg-slate-900/30 mix-blend-multiply">
          {particles.slice(0, 30).map((p, i) => ( // Very few snowflakes
            <div
              key={i}
              className="absolute top-0 w-2 h-2 bg-white shadow-[0_0_5px_1px_rgba(255,255,255,0.8)]"
              style={{
                left: `${p.left}%`,
                filter: `blur(${p.blur}px)`,
                borderRadius: '50%',
                '--scale': p.scale,
                '--max-opacity': p.maxOpacity * 0.6, // Dim
                '--drift': `${p.drift * 0.5}px`,
                '--rotation': `0deg`,
                animation: `ambient-snow-fall ${p.duration * 4.0}s ease-in-out ${p.delay}s infinite`
              } as React.CSSProperties}
            />
          ))}
          {/* Shooting stars */}
          <div className="absolute top-[20%] left-[80%] w-[100px] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_10px_2px_rgba(255,255,255,0.8)] opacity-0 animate-[shooting-star_25s_ease-out_infinite_2s]" />
          <div className="absolute top-[40%] left-[90%] w-[150px] h-[2px] bg-gradient-to-r from-transparent via-blue-200 to-transparent shadow-[0_0_10px_2px_rgba(191,219,254,0.8)] opacity-0 animate-[shooting-star_30s_ease-out_infinite_10s]" />
        </div>
      )}
    </div>
  );
}
