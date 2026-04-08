// This file defines the main shapes of data used in the app, like what a Note or a CalendarDay looks like.

export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface SerializedDateRange {
  start: string | null;
  end: string | null;
}

export type NoteCategory = 'work' | 'personal' | 'study' | 'other';

export interface Note {
  id: string;
  title?: string;
  content: string;
  dateRange: SerializedDateRange | null;
  createdAt: string;
  color: string;
  priority?: 'high' | 'medium' | 'low';
  eventTime?: string; // Format "HH:mm"
  eventEndTime?: string; // Format "HH:mm"
  reminder?: number; // Minutes before event
  notified?: boolean;
  category?: NoteCategory;
}

export type NavigationDirection = 'prev' | 'next';
