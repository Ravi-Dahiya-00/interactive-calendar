import { memo } from 'react';
import { AnalyticsStats } from '@/hooks/useAnalytics';

interface MiniAnalyticsDashboardProps {
  stats: AnalyticsStats;
  monthName: string;
  isFilteredView?: boolean;
}

const statCards = [
  {
    key: 'totalEventsInMonth',
    title: 'Events This Month',
    accent: 'text-blue-600 bg-blue-50 border-blue-100',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    key: 'highPriorityEvents',
    title: 'High Priority',
    accent: 'text-rose-600 bg-rose-50 border-rose-100',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-7.12 12.3A1 1 0 004.03 18h15.94a1 1 0 00.86-1.5l-7.12-12.3a1 1 0 00-1.72 0z" />
      </svg>
    ),
  },
  {
    key: 'upcomingEvents',
    title: 'Upcoming',
    accent: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
] as const;

function MiniAnalyticsDashboardComponent({
  stats,
  monthName,
  isFilteredView = false,
}: MiniAnalyticsDashboardProps) {
  const subtextByKey = {
    totalEventsInMonth: isFilteredView
      ? `Filtered ${monthName} view`
      : `${monthName} view`,
    highPriorityEvents:
      stats.highPriorityEvents > 0 ? 'Needs attention' : 'All priorities balanced',
    upcomingEvents: 'From today onward',
  } as const;

  return (
    <section className="mb-5 sm:mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statCards.map((card) => (
          <article key={card.key} className="rounded-xl border border-cal-border bg-cal-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-cal-muted tracking-wide">{card.title}</p>
              <span className={`inline-flex items-center justify-center rounded-md border p-1.5 ${card.accent}`}>
                {card.icon}
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-cal-text">
              {stats[card.key]}
            </p>
            <p className="mt-1 text-xs text-cal-muted">
              {subtextByKey[card.key]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const MiniAnalyticsDashboard = memo(MiniAnalyticsDashboardComponent);
