'use client';

import { useMemo } from 'react';

export type Season = 'summer' | 'rainy' | 'winter' | 'spring' | 'autumn' | 'none';

export function useSeasonalEffects(currentMonth: number): Season {
  return useMemo(() => {
    // Spring: March (2), April (3)
    if (currentMonth === 2 || currentMonth === 3) return 'spring';

    // Summer: May (4), June (5), July (6)
    if (currentMonth >= 4 && currentMonth <= 6) return 'summer';
    
    // Rainy: August (7), September (8)
    if (currentMonth === 7 || currentMonth === 8) return 'rainy';

    // Autumn: October (9), November (10)
    if (currentMonth === 9 || currentMonth === 10) return 'autumn';
    
    // Winter: December (11), January (0), February (1)
    if (currentMonth === 11 || currentMonth === 0 || currentMonth === 1) return 'winter';

    // Others
    return 'none';
  }, [currentMonth]);
}
