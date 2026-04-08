// Calculates stats like total events, high priority count, and upcoming items for the dashboard.
import { useMemo } from 'react';
import { Note } from '@/types';
import { isoStringToDate } from '@/utils/dateUtils';

interface UseAnalyticsParams {
  notes: Note[];
  currentMonth: number;
  currentYear: number;
  scopedNotes?: Note[];
}

export interface AnalyticsStats {
  totalEventsInMonth: number;
  highPriorityEvents: number;
  upcomingEvents: number;
}

function getEventStartDate(note: Note): Date | null {
  if (!note.dateRange?.start) return null;
  return isoStringToDate(note.dateRange.start);
}

export function useAnalytics({
  notes,
  currentMonth,
  currentYear,
}: UseAnalyticsParams): AnalyticsStats {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    // 1. Total Events: Count dated events overlapping the month OR general notes created in this month
    const totalEventsInMonth = notes.filter((note) => {
      const startDate = getEventStartDate(note);
      
      if (startDate) {
        const start = startDate;
        const endDateIso = note.dateRange?.end;
        const end = endDateIso ? isoStringToDate(endDateIso) : start;
        return start <= monthEnd && end >= monthStart;
      }
      
      // For general notes, count if they were created within this visual month range
      const createdAt = new Date(note.createdAt);
      return createdAt >= monthStart && createdAt <= monthEnd;
    }).length;

    // 2. High Priority: Global count of all high priority items (Always visible/connected)
    const highPriorityEvents = notes.filter(
      (note) => note.priority === 'high'
    ).length;

    // 3. Upcoming: Any dated event in the future
    const upcomingEvents = notes.filter((note) => {
      const startDate = getEventStartDate(note);
      return startDate !== null && startDate >= today;
    }).length;

    return {
      totalEventsInMonth,
      highPriorityEvents,
      upcomingEvents,
    };
  }, [notes, currentMonth, currentYear]);
}
