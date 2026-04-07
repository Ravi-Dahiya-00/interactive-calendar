'use client';

import { useState, useCallback } from 'react';
import { DateRange } from '@/types';
import { isSameDay, normalizeDate, isBeforeDate, isDateInRange } from '@/utils/dateUtils';

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  const handleDayClick = useCallback((date: Date) => {
    const normalized = normalizeDate(date);

    if (!range.start || (range.start && range.end)) {
      // Start new selection
      setRange({ start: normalized, end: null });
      setIsSelectingEnd(true);
    } else {
      // Completing range selection
      if (isSameDay(normalized, range.start)) {
        setRange({ start: normalized, end: normalized });
        setIsSelectingEnd(false);
      } else if (isBeforeDate(normalized, range.start)) {
        setRange({ start: normalized, end: range.start });
        setIsSelectingEnd(false);
      } else {
        setRange({ start: range.start, end: normalized });
        setIsSelectingEnd(false);
      }
    }
  }, [range]);

  const handleDayHover = useCallback((date: Date) => {
    if (isSelectingEnd) {
      setHoveredDate(normalizeDate(date));
    }
  }, [isSelectingEnd]);

  const handleMouseLeave = useCallback(() => {
    setHoveredDate(null);
  }, []);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setHoveredDate(null);
    setIsSelectingEnd(false);
  }, []);

  const isRangeStart = useCallback((date: Date): boolean => {
    return !!range.start && isSameDay(date, range.start);
  }, [range.start]);

  const isRangeEnd = useCallback((date: Date): boolean => {
    return !!range.end && isSameDay(date, range.end);
  }, [range.end]);

  const isInRange = useCallback((date: Date): boolean => {
    return isDateInRange(date, range.start, range.end);
  }, [range]);

  const isInPreviewRange = useCallback((date: Date): boolean => {
    if (!isSelectingEnd || !range.start || !hoveredDate) return false;
    const start = range.start;
    const end = hoveredDate;
    if (isBeforeDate(end, start)) {
      return isDateInRange(date, end, start) || isSameDay(date, end);
    }
    return isDateInRange(date, start, end) || isSameDay(date, end);
  }, [isSelectingEnd, range.start, hoveredDate]);

  const isPreviewStart = useCallback((date: Date): boolean => {
    if (!isSelectingEnd || !hoveredDate || !range.start) return false;
    if (isBeforeDate(hoveredDate, range.start)) {
      return isSameDay(date, hoveredDate);
    }
    return isSameDay(date, range.start);
  }, [isSelectingEnd, hoveredDate, range.start]);

  const isPreviewEnd = useCallback((date: Date): boolean => {
    if (!isSelectingEnd || !hoveredDate || !range.start) return false;
    if (isBeforeDate(hoveredDate, range.start)) {
      return isSameDay(date, range.start);
    }
    return isSameDay(date, hoveredDate);
  }, [isSelectingEnd, hoveredDate, range.start]);

  return {
    range,
    hoveredDate,
    isSelectingEnd,
    handleDayClick,
    handleDayHover,
    handleMouseLeave,
    clearRange,
    isRangeStart,
    isRangeEnd,
    isInRange,
    isInPreviewRange,
    isPreviewStart,
    isPreviewEnd,
  };
}
