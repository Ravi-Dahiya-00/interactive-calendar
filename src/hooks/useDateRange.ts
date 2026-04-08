'use client';

// Manages selecting a range of dates on the calendar by clicking and dragging.
import { useState, useCallback, useEffect } from 'react';
import { DateRange } from '@/types';
import { isSameDay, normalizeDate, isBeforeDate, isDateInRange } from '@/utils/dateUtils';

export function useDateRange() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((date: Date) => {
    const normalized = normalizeDate(date);

    // If clicking same date that is already selection start/end, and it is a single-day range, clear it
    if (range.start && isSameDay(range.start, normalized) && (!range.end || isSameDay(range.end, normalized))) {
      setRange({ start: null, end: null });
      setHoveredDate(null);
      setIsDragging(false);
      return;
    }

    // Always start a new selection on mouse down
    setRange({ start: normalized, end: null });
    setHoveredDate(normalized);
    setIsDragging(true);
  }, [range]);

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

    if (isBeforeDate(end, start)) {
      setRange({ start: end, end: start });
    } else {
      setRange({ start, end });
    }
    
    setIsDragging(false);
    setHoveredDate(null);
  }, [isDragging, range.start, hoveredDate]);

  // Handle global mouseup to ensure drag ends even if released outside the calendar
  useEffect(() => {
    if (typeof window !== 'undefined' && isDragging) {
      const globalMouseUp = () => {
        handleMouseUp();
      };
      window.addEventListener('mouseup', globalMouseUp);
      return () => window.removeEventListener('mouseup', globalMouseUp);
    }
  }, [isDragging, handleMouseUp]);

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
    
    const [realStart, realEnd] = isBeforeDate(end, start) ? [end, start] : [start, end];
    return isDateInRange(date, realStart, realEnd);
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
