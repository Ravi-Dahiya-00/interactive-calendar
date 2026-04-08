'use client';

// Handles main calendar logic like switching months, jumping to today, and building the month day grid.
import { useState, useMemo, useCallback, useEffect } from 'react';
import { generateMonthGrid, MONTH_NAMES } from '@/utils/dateUtils';
import { CalendarDay, NavigationDirection } from '@/types';

export function useCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [direction, setDirection] = useState<NavigationDirection>('next');

  const monthGrid = useMemo<CalendarDay[][]>(() => {
    return generateMonthGrid(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const navigateMonth = useCallback((dir: NavigationDirection) => {
    setDirection(dir);
    if (dir === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    }
  }, [currentMonth]);

  const goToToday = useCallback(() => {
    const now = new Date();
    const targetMonth = now.getMonth();
    const targetYear = now.getFullYear();
    if (targetYear > currentYear || (targetYear === currentYear && targetMonth > currentMonth)) {
      setDirection('next');
    } else {
      setDirection('prev');
    }
    setCurrentMonth(targetMonth);
    setCurrentYear(targetYear);
  }, [currentMonth, currentYear]);

  const jumpToDate = useCallback((month: number, year: number) => {
    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      setDirection('next');
    } else {
      setDirection('prev');
    }
    setCurrentMonth(month);
    setCurrentYear(year);
  }, [currentMonth, currentYear]);

  const monthName = MONTH_NAMES[currentMonth];

  return {
    currentMonth,
    currentYear,
    monthName,
    monthGrid,
    direction,
    navigateMonth,
    goToToday,
    jumpToDate,
  };
}
