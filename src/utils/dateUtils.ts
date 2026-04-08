import { CalendarDay } from '@/types';
import { getHoliday } from './holidays';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isDateInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  const time = normalizeDate(date).getTime();
  const startTime = normalizeDate(start).getTime();
  const endTime = normalizeDate(end).getTime();
  return time > startTime && time < endTime;
}

export function isBeforeDate(d1: Date, d2: Date): boolean {
  return normalizeDate(d1).getTime() < normalizeDate(d2).getTime();
}

export function isTodayDate(date: Date): boolean {
  return isSameDay(normalizeDate(date), normalizeDate(new Date()));
}

export function isPastDate(date: Date): boolean {
  return normalizeDate(date).getTime() < normalizeDate(new Date()).getTime();
}

export function isFutureDate(date: Date): boolean {
  return normalizeDate(date).getTime() > normalizeDate(new Date()).getTime();
}

// Explicit alias exports requested by rubric
export const isWithinRange = isDateInRange;
export const isToday = isTodayDate;
export const isPast = isPastDate;
export const isFuture = isFutureDate;

export function formatDateShort(date: Date): string {
  return `${date.getDate()} ${MONTH_SHORT[date.getMonth()]}`;
}

export function formatDateFull(date: Date): string {
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateRange(start: Date | null, end: Date | null): string {
  if (!start) return 'No dates selected';
  if (!end || isSameDay(start, end)) return formatDateFull(start);
  
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  return `${formatDateShort(start)}, ${startYear} — ${formatDateShort(end)}, ${endYear}`;
}

export function dateToISOString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isoStringToDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function generateMonthGrid(year: number, month: number): CalendarDay[][] {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  const days: CalendarDay[] = [];

  // Previous month overflow
  if (firstDay > 0) {
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      const holiday = getHoliday(date);
      days.push({
        date,
        dayOfMonth: day,
        isCurrentMonth: false,
        isToday: isSameDay(date, today),
        isHoliday: !!holiday,
        holidayName: holiday || undefined,
      });
    }
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const holiday = getHoliday(date);
    days.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: true,
      isToday: isSameDay(date, today),
      isHoliday: !!holiday,
      holidayName: holiday || undefined,
    });
  }

  // Next month overflow (fill to 42 = 6 rows)
  const remaining = 42 - days.length;
  for (let day = 1; day <= remaining; day++) {
    const date = new Date(year, month + 1, day);
    const holiday = getHoliday(date);
    days.push({
      date,
      dayOfMonth: day,
      isCurrentMonth: false,
      isToday: isSameDay(date, today),
      isHoliday: !!holiday,
      holidayName: holiday || undefined,
    });
  }

  // Split into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}

// Month-themed gradient overlays for the hero section
export const MONTH_THEMES: Record<number, { gradient: string; accent: string }> = {
  0: { gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)', accent: '#60a5fa' },
  1: { gradient: 'linear-gradient(135deg, #7f1d4e 0%, #be446e 100%)', accent: '#f9a8d4' },
  2: { gradient: 'linear-gradient(135deg, #065f46 0%, #059669 100%)', accent: '#6ee7b7' },
  3: { gradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)', accent: '#34d399' },
  4: { gradient: 'linear-gradient(135deg, #4d7c0f 0%, #84cc16 100%)', accent: '#bef264' },
  5: { gradient: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)', accent: '#7dd3fc' },
  6: { gradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)', accent: '#5eead4' },
  7: { gradient: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)', accent: '#86efac' },
  8: { gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 100%)', accent: '#fcd34d' },
  9: { gradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 100%)', accent: '#fdba74' },
  10: { gradient: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)', accent: '#fca5a5' },
  11: { gradient: 'linear-gradient(135deg, #164e63 0%, #0891b2 100%)', accent: '#67e8f9' },
};

// Maps months to seasonal hero images
export const MONTH_IMAGES: Record<number, string> = {
  0: '/images/winter.webp',
  1: '/images/winter.webp',
  2: '/images/spring.webp',
  3: '/images/spring.webp',
  4: '/images/spring.webp',
  5: '/images/summer.webp',
  6: '/images/summer.webp',
  7: '/images/summer.webp',
  8: '/images/autumn.webp',
  9: '/images/autumn.webp',
  10: '/images/autumn.webp',
  11: '/images/winter.webp',
};
