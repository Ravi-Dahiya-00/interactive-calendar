interface Holiday {
  month: number; // 0-indexed
  day: number;
  name: string;
  type: 'national' | 'cultural' | 'religious';
}

const FIXED_HOLIDAYS: Holiday[] = [
  { month: 0, day: 1, name: "New Year's Day", type: 'cultural' },
  { month: 0, day: 26, name: 'Republic Day', type: 'national' },
  { month: 3, day: 14, name: 'Ambedkar Jayanti', type: 'national' },
  { month: 4, day: 1, name: 'May Day', type: 'national' },
  { month: 7, day: 15, name: 'Independence Day', type: 'national' },
  { month: 9, day: 2, name: 'Gandhi Jayanti', type: 'national' },
  { month: 10, day: 14, name: "Children's Day", type: 'national' },
  { month: 11, day: 25, name: 'Christmas', type: 'religious' },
];

const VARIABLE_HOLIDAYS: Record<number, Holiday[]> = {
  2025: [
    { month: 2, day: 14, name: 'Holi', type: 'religious' },
    { month: 2, day: 31, name: 'Eid ul-Fitr', type: 'religious' },
    { month: 3, day: 6, name: 'Ram Navami', type: 'religious' },
    { month: 3, day: 10, name: 'Mahavir Jayanti', type: 'religious' },
    { month: 3, day: 18, name: 'Good Friday', type: 'religious' },
    { month: 7, day: 16, name: 'Janmashtami', type: 'religious' },
    { month: 9, day: 2, name: 'Dussehra', type: 'religious' },
    { month: 9, day: 20, name: 'Diwali', type: 'religious' },
    { month: 10, day: 5, name: 'Guru Nanak Jayanti', type: 'religious' },
  ],
  2026: [
    { month: 2, day: 4, name: 'Holi', type: 'religious' },
    { month: 2, day: 20, name: 'Eid ul-Fitr', type: 'religious' },
    { month: 2, day: 26, name: 'Ram Navami', type: 'religious' },
    { month: 3, day: 3, name: 'Good Friday', type: 'religious' },
    { month: 3, day: 30, name: 'Mahavir Jayanti', type: 'religious' },
    { month: 4, day: 27, name: 'Eid ul-Adha', type: 'religious' },
    { month: 7, day: 6, name: 'Janmashtami', type: 'religious' },
    { month: 8, day: 21, name: 'Dussehra', type: 'religious' },
    { month: 9, day: 8, name: 'Diwali', type: 'religious' },
    { month: 10, day: 25, name: 'Guru Nanak Jayanti', type: 'religious' },
  ],
};

export function getHoliday(date: Date): string | null {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  const fixed = FIXED_HOLIDAYS.find(h => h.month === month && h.day === day);
  if (fixed) return fixed.name;

  const yearHolidays = VARIABLE_HOLIDAYS[year];
  if (yearHolidays) {
    const variable = yearHolidays.find(h => h.month === month && h.day === day);
    if (variable) return variable.name;
  }

  return null;
}

export function getHolidayType(date: Date): 'national' | 'cultural' | 'religious' | null {
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  const fixed = FIXED_HOLIDAYS.find(h => h.month === month && h.day === day);
  if (fixed) return fixed.type;

  const yearHolidays = VARIABLE_HOLIDAYS[year];
  if (yearHolidays) {
    const variable = yearHolidays.find(h => h.month === month && h.day === day);
    if (variable) return variable.type;
  }

  return null;
}
