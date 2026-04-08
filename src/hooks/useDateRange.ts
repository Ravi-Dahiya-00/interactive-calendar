'use client';

import { useState, useCallback } from 'react';
import { DateRange } from '@/types';
import { isSameDay, normalizeDate, isBeforeDate, isDateInRange } from '@/utils/dateUtils';

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const setOrderedRange = useCallback((first: Date, second: Date) => {
    if (isBeforeDate(second, first)) {
      setRange({ start: second, end: first });
    } else {
      setRange({ start: first, end: second });
    }
  }, []);

  const handleMouseDown = useCallback((date: Date) => {
    const normalized = normalizeDate(date);

    // Toggle off when user clicks the same selected date again.
    if (
      range.start &&
      isSameDay(range.start, normalized) &&
      (
        (range.end === null) ||
        isSameDay(range.end, normalized)
      )
    ) {
      setRange({ start: null, end: null });
      setHoveredDate(null);
      setIsDragging(false);
      return;
    }

    // If a multi-day range already exists, clicking anywhere starts a new selection.
    if (range.start && range.end && !isSameDay(range.start, range.end)) {
      setRange({ start: normalized, end: null });
      setHoveredDate(normalized);
      setIsDragging(true);
      return;
    }

    // If a single-day selection already exists, next click completes a range.
    // This enables cross-month/year selection after navigation.
    if (
      range.start &&
      range.end &&
      isSameDay(range.start, range.end) &&
      !isSameDay(range.start, normalized)
    ) {
      setOrderedRange(range.start, normalized);
      setHoveredDate(null);
      setIsDragging(false);
      return;
    }

    setRange({ start: normalized, end: null });
    setHoveredDate(normalized);
    setIsDragging(true);
  }, [range.start, range.end, setOrderedRange]);

  const handleMouseEnterDay = useCallback((date: Date) => {
    const normalized = normalizeDate(date);
    setHoveredDate(normalized);
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !range.start || !hoveredDate) {
      setIsDragging(false);
      return;
    }

    const start = range.start;
    const end = hoveredDate;

    setOrderedRange(start, end);
    
    setIsDragging(false);
    setHoveredDate(null);
  }, [isDragging, range.start, hoveredDate, setOrderedRange]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setHoveredDate(null);
    }
  }, [isDragging]);

  const clearRange = useCallback(() => {
    setRange({ start: null, end: null });
    setHoveredDate(null);
    setIsDragging(false);
  }, []);

  const isRangeStart = useCallback((date: Date): boolean => {
    return !!range.start && !isDragging && isSameDay(date, range.start);
  }, [range.start, isDragging]);

  const isRangeEnd = useCallback((date: Date): boolean => {
    return !!range.end && !isDragging && isSameDay(date, range.end);
  }, [range.end, isDragging]);

  const isInRange = useCallback((date: Date): boolean => {
    if (isDragging) return false;
    return isDateInRange(date, range.start, range.end);
  }, [range, isDragging]);

  const isInPreviewRange = useCallback((date: Date): boolean => {
    if (!isDragging || !range.start || !hoveredDate) return false;
    const start = range.start;
    const end = hoveredDate;
    if (isBeforeDate(end, start)) {
      return isDateInRange(date, end, start);
    }
    return isDateInRange(date, start, end);
  }, [isDragging, range.start, hoveredDate]);

  const isPreviewStart = useCallback((date: Date): boolean => {
    if (!isDragging || !hoveredDate || !range.start) return false;
    const start = isBeforeDate(hoveredDate, range.start) ? hoveredDate : range.start;
    return isSameDay(date, start);
  }, [isDragging, hoveredDate, range.start]);

  const isPreviewEnd = useCallback((date: Date): boolean => {
    if (!isDragging || !hoveredDate || !range.start) return false;
    const end = isBeforeDate(hoveredDate, range.start) ? range.start : hoveredDate;
    return isSameDay(date, end);
  }, [isDragging, hoveredDate, range.start]);

  return {
    range,
    hoveredDate,
    isDragging,
    handleMouseDown,
    handleMouseEnterDay,
    handleMouseUp,
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
