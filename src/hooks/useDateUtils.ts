'use client';

import { useMemo } from 'react';
// A simple hook that gives other components easy access to date formatting and calculation tools.
import {
  isPast,
  isFuture,
  isWithinRange,
} from '@/utils/dateUtils';

export function useDateUtils() {
  return useMemo(
    () => ({
      isPast,
      isFuture,
      isWithinRange,
    }),
    []
  );
}
