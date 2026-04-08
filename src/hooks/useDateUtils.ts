'use client';

import { useMemo } from 'react';
import {
  isSameDay,
  isToday,
  isPast,
  isFuture,
  isWithinRange,
} from '@/utils/dateUtils';

export function useDateUtils() {
  return useMemo(
    () => ({
      isSameDay,
      isToday,
      isPast,
      isFuture,
      isWithinRange,
    }),
    []
  );
}
