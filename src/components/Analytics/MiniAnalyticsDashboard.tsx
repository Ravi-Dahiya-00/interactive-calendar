// Three stat cards shown above the calendar: total events, high priority, and upcoming.
// Each card is clickable and opens the AnalyticsModal for a detailed breakdown.
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

  const totalEvents = stats.totalEventsInMonth;
  const highPct = totalEvents > 0 ? Math.round((stats.highPriorityEvents / totalEvents) * 100) : 0;
  const upcomingPct = totalEvents > 0 ? Math.round((stats.upcomingEvents / totalEvents) * 100) : 0;

  const cards: {
    key: AnalyticsView;
    title: string;
    subtitle: string;
    value: number;
    emptyHint: string;
    accent: string;
    barColor: string;
    barPct: number;
    urgent: boolean;
    icon: React.ReactNode;
  }[] = [
    {
      key: 'totalEventsInMonth',
      title: 'Events',
      subtitle: isFilteredView ? `Filtered · ${monthName}` : monthName,
      value: stats.totalEventsInMonth,
      emptyHint: 'Add one!',
      accent: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      barColor: 'bg-blue-500',
      barPct: Math.min((stats.totalEventsInMonth / 20) * 100, 100),
      urgent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: 'highPriorityEvents',
      title: 'High Priority',
      subtitle: stats.highPriorityEvents > 0 ? '⚡ Needs attention' : 'All clear!',
      value: stats.highPriorityEvents,
      emptyHint: 'All clear!',
      accent: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      barColor: 'bg-rose-500',
      barPct: highPct,
      urgent: stats.highPriorityEvents > 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-7.12 12.3A1 1 0 004.03 18h15.94a1 1 0 00.86-1.5l-7.12-12.3a1 1 0 00-1.72 0z" />
        </svg>
      ),
    },
    {
      key: 'upcomingEvents',
      title: 'Upcoming',
      subtitle: stats.upcomingEvents > 0 ? 'From today onward' : 'Plan ahead',
      value: stats.upcomingEvents,
      emptyHint: 'Plan ahead',
      accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      barColor: 'bg-emerald-500',
      barPct: upcomingPct,
      urgent: false,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <section className="mb-5 sm:mb-6">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {cards.map((card) => (
            <article
              key={card.key}
              onClick={() => setActiveView(card.key)}
              className={`group relative rounded-2xl border bg-cal-card px-3 py-3 sm:px-4 sm:py-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden cursor-pointer select-none ${
                card.value > 0
                  ? 'border-cal-border/80 shadow-md'
                  : 'border-cal-border/30 shadow-sm opacity-60 hover:opacity-90'
              }`}
            >
              {/* Ambient glow */}
              {card.value > 0 && (
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.08] blur-2xl pointer-events-none ${card.barColor}`} />
              )}

              {/* Icon + urgency dot */}
              <div className="flex items-start justify-between gap-1 mb-3">
                <span className={`inline-flex items-center justify-center rounded-xl border p-1.5 sm:p-2 flex-shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                  card.value > 0 ? card.accent : 'text-cal-muted/30 bg-cal-muted/5 border-cal-muted/10'
                }`}>
                  {card.icon}
                </span>
                {card.urgent && (
                  <span className="relative flex h-2.5 w-2.5 mt-1 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                  </span>
                )}
              </div>

              {/* Value */}
              {card.value > 0 ? (
                <p className="text-2xl sm:text-3xl font-extrabold text-cal-text tracking-tight font-display leading-none">
                  {card.value}
                </p>
              ) : (
                <p className="text-sm font-semibold text-cal-muted/40 font-display leading-none">
                  {card.emptyHint}
                </p>
              )}

              <p className={`mt-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-colors truncate ${
                card.value > 0 ? 'text-cal-muted/60 group-hover:text-cal-muted/90' : 'text-cal-muted/25'
              }`}>
                {card.title}
              </p>

              {/* Progress bar */}
              <div className="mt-3 h-[3px] w-full rounded-full bg-cal-border/40 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${card.barColor} ${card.value === 0 ? 'opacity-10' : ''}`}
                  style={{ width: `${Math.max(card.barPct, card.value > 0 ? 6 : 0)}%` }}
                />
              </div>

              <p className={`mt-1.5 text-[10px] leading-tight truncate transition-colors ${
                card.value > 0 ? 'text-cal-muted/55' : 'text-cal-muted/25'
              }`}>
                {card.subtitle}
              </p>

              {/* Tap to view hint */}
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-widest text-cal-primary/0 group-hover:text-cal-primary/60 transition-colors">
                Tap to view →
              </p>
            </article>
          ))}
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
