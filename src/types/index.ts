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

export interface Note {
  id: string;
  content: string;
  dateRange: SerializedDateRange | null;
  createdAt: string;
  color: string;
}

export type NavigationDirection = 'prev' | 'next';
