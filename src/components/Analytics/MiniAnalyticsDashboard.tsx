// Three stat cards shown above the calendar: total events, high priority, and upcoming.
// Final restoration to match the original "nice" theme and layout 100%.
'use client';

import { memo, useState } from 'react';
import { Note } from '@/types';
import { AnalyticsStats } from '@/hooks/useAnalytics';
import { AnalyticsModal } from './AnalyticsModal';

type AnalyticsView = 'totalEventsInMonth' | 'highPriorityEvents' | 'upcomingEvents';

interface MiniAnalyticsDashboardProps {
  stats: AnalyticsStats;
  monthName: string;
  isFilteredView?: boolean;
  notes: Note[];
  currentMonth: number;
  currentYear: number;
}

function MiniAnalyticsDashboardComponent({
  stats,
  monthName,
  isFilteredView = false,
  notes,
  currentMonth,
  currentYear,
}: MiniAnalyticsDashboardProps) {
  const [activeView, setActiveView] = useState<AnalyticsView | null>(null);

  const cardConfig: {
    key: AnalyticsView;
    title: string;
    value: number;
    accent: string;
    icon: React.ReactNode;
    subtext: string;
  }[] = [
    {
      key: 'totalEventsInMonth',
      title: 'EVENTS',
      value: stats.totalEventsInMonth,
      accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      subtext: isFilteredView ? `Filtered · ${monthName}` : monthName,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'highPriorityEvents',
      title: 'HIGH PRIORITY',
      value: stats.highPriorityEvents,
      accent: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      subtext: stats.highPriorityEvents > 0 ? 'Needs attention' : 'All clear',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-7.12 12.3A1 1 0 004.03 18h15.94a1 1 0 00.86-1.5l-7.12-12.3a1 1 0 00-1.72 0z" />
        </svg>
      ),
    },
    {
      key: 'upcomingEvents',
      title: 'UPCOMING',
      value: stats.upcomingEvents,
      accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/10',
      subtext: 'Plan ahead',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="mb-6 sm:mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cardConfig.map((card) => {
            const hasData = card.value > 0;
            return (
              <article
                key={card.key}
                onClick={() => setActiveView(card.key)}
                className={`group calendar-card p-5 cursor-pointer flex flex-col justify-between h-full ${
                  !hasData && 'opacity-60 grayscale hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-cal-muted tracking-widest group-hover:text-cal-text transition-colors">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-xl border transition-all duration-300 group-hover:scale-110 ${card.accent}`}>
                    {card.icon}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <p className={`text-3xl font-extrabold font-display tracking-tight leading-none ${hasData ? 'text-cal-text' : 'text-cal-muted'}`}>
                      {card.value}
                    </p>
                  </div>
                  <p className="mt-2 text-[11px] font-medium text-cal-muted uppercase tracking-widest">
                    {card.subtext}
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-cal-border flex items-center justify-between">
                  <span className="text-[10px] font-bold text-cal-primary group-hover:opacity-100 opacity-60 transition-opacity uppercase tracking-wider">
                    Tap to view →
                  </span>
                  {hasData && card.key === 'highPriorityEvents' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {activeView && (
        <AnalyticsModal
          view={activeView}
          notes={notes}
          monthName={monthName}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onClose={() => setActiveView(null)}
        />
      )}
    </>
  );
}

export const MiniAnalyticsDashboard = memo(MiniAnalyticsDashboardComponent);
