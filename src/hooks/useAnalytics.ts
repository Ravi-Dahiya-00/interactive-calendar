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
  scopedNotes,
}: UseAnalyticsParams): AnalyticsStats {
  return useMemo(() => {
    const sourceNotes = scopedNotes ?? notes;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventNotes = sourceNotes.filter((note) => getEventStartDate(note) !== null);

    const totalEventsInMonth = eventNotes.filter((note) => {
      const startDate = getEventStartDate(note);
      return (
        startDate !== null &&
        startDate.getMonth() === currentMonth &&
        startDate.getFullYear() === currentYear
      );
    }).length;

    const highPriorityEvents = eventNotes.filter(
      (note) => note.priority === 'high'
    ).length;

    const upcomingEvents = eventNotes.filter((note) => {
      const startDate = getEventStartDate(note);
      return startDate !== null && startDate >= today;
    }).length;

    return {
      totalEventsInMonth,
      highPriorityEvents,
      upcomingEvents,
    };
  }, [notes, scopedNotes, currentMonth, currentYear]);
}
