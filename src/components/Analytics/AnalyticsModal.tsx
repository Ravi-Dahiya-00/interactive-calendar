// Full-screen analytics modal. Opens when clicking a stat card and shows a breakdown
// of events by priority, category, and a scrollable task list with all related notes.
'use client';

import { Note } from '@/types';
import { isoStringToDate, formatDateRange } from '@/utils/dateUtils';
import { useEffect, useRef } from 'react';

type AnalyticsView = 'totalEventsInMonth' | 'highPriorityEvents' | 'upcomingEvents';

interface AnalyticsModalProps {
  view: AnalyticsView;
  notes: Note[];
  monthName: string;
  currentMonth: number;
  currentYear: number;
  onClose: () => void;
}

function getNoteDate(note: Note): Date | null {
  if (!note.dateRange?.start) return null;
  return isoStringToDate(note.dateRange.start);
}

function formatNoteDate(note: Note): string {
  if (!note.dateRange) return 'General note';
  const start = note.dateRange.start ? isoStringToDate(note.dateRange.start) : null;
  const end = note.dateRange.end ? isoStringToDate(note.dateRange.end) : null;
  return formatDateRange(start, end);
}

const PRIORITY_CONFIG = {
  high: { label: 'High', dot: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  medium: { label: 'Medium', dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  low: { label: 'Low', dot: 'bg-green-500', badge: 'bg-green-500/10 text-green-500 border-green-500/20' },
};

const CATEGORY_COLORS: Record<string, string> = {
  work: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  personal: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  study: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const VIEW_META: Record<AnalyticsView, { title: string; icon: React.ReactNode; accentClass: string }> = {
  totalEventsInMonth: {
    title: 'Events This Month',
    accentClass: 'text-blue-400',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  highPriorityEvents: {
    title: 'High Priority Events',
    accentClass: 'text-rose-400',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86l-7.12 12.3A1 1 0 004.03 18h15.94a1 1 0 00.86-1.5l-7.12-12.3a1 1 0 00-1.72 0z" />
      </svg>
    ),
  },
  upcomingEvents: {
    title: 'Upcoming Events',
    accentClass: 'text-emerald-400',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
};

export function AnalyticsModal({ view, notes, monthName, currentMonth, currentYear, onClose }: AnalyticsModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handle); document.body.style.overflow = 'auto'; };
  }, [onClose]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Compute the filtered notes for the selected view
  const filteredNotes = notes.filter((note) => {
    const d = getNoteDate(note);
    if (view === 'totalEventsInMonth') {
      return d !== null && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }
    if (view === 'highPriorityEvents') {
      return d !== null && note.priority === 'high';
    }
    if (view === 'upcomingEvents') {
      return d !== null && d >= today;
    }
    return false;
  });

  // Compute category breakdown
  const categoryCounts: Record<string, number> = {};
  filteredNotes.forEach((n) => {
    const cat = n.category ?? 'other';
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  });

  // Priority breakdown for total view
  const priorityCounts = { high: 0, medium: 0, low: 0 };
  filteredNotes.forEach((n) => { if (n.priority) priorityCounts[n.priority]++; });

  const meta = VIEW_META[view];
  const total = filteredNotes.length;

  // Sort by date ascending for upcoming, else descending by creation
  const sorted = [...filteredNotes].sort((a, b) => {
    if (view === 'upcomingEvents') {
      const da = getNoteDate(a)?.getTime() ?? 0;
      const db = getNoteDate(b)?.getTime() ?? 0;
      return da - db;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={containerRef}
        className="relative w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] bg-cal-card border border-cal-border rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cal-border shrink-0">
          <div className="flex items-center gap-3">
            <span className={`${meta.accentClass}`}>{meta.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-cal-text font-display">{meta.title}</h2>
              <p className="text-xs text-cal-muted mt-0.5">{monthName} · {total} {total === 1 ? 'event' : 'events'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-cal-muted hover:bg-cal-border hover:text-cal-text transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Summary Breakdown */}
          {total > 0 && (
            <div className="px-6 pt-5 pb-3 grid grid-cols-2 gap-3">
              {/* Priority breakdown */}
              <div className="bg-cal-bg rounded-xl p-4 border border-cal-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cal-muted mb-3">Priority Split</p>
                <div className="space-y-2">
                  {(['high', 'medium', 'low'] as const).map((p) => {
                    const count = priorityCounts[p];
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    const cfg = PRIORITY_CONFIG[p];
                    return (
                      <div key={p} className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        <div className="flex-1 bg-cal-border/40 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full rounded-full ${cfg.dot} transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[11px] text-cal-muted font-semibold w-4 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category breakdown */}
              <div className="bg-cal-bg rounded-xl p-4 border border-cal-border/50">
                <p className="text-[10px] font-bold uppercase tracking-widest text-cal-muted mb-3">Categories</p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(categoryCounts).length > 0 ? Object.entries(categoryCounts).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${CATEGORY_COLORS[cat] ?? CATEGORY_COLORS.other}`}>
                        {cat}
                      </span>
                      <span className="text-xs font-bold text-cal-muted">{count}</span>
                    </div>
                  )) : (
                    <p className="text-[11px] text-cal-muted/50">No categories set</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Task List */}
          <div className="px-6 pb-6 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-cal-muted mb-3">
              {total > 0 ? 'All Events' : 'No Events Found'}
            </p>

            {total === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center">
                <span className={`text-5xl opacity-20 ${meta.accentClass}`}>{meta.icon}</span>
                <p className="text-cal-muted text-sm font-medium">Nothing to show here yet.</p>
                <p className="text-cal-muted/50 text-xs max-w-xs">
                  {view === 'totalEventsInMonth' && `No events have been added for ${monthName}.`}
                  {view === 'highPriorityEvents' && 'Great! You have no high priority events.'}
                  {view === 'upcomingEvents' && 'You\'re all caught up — no upcoming events scheduled.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {sorted.map((note) => {
                  const p = note.priority ?? 'medium';
                  const cfg = PRIORITY_CONFIG[p];
                  const d = getNoteDate(note);
                  const daysUntil = d ? Math.ceil((d.getTime() - today.getTime()) / 86400000) : null;

                  return (
                    <div key={note.id} className="group flex items-start gap-4 bg-cal-bg rounded-xl px-4 py-3.5 border border-cal-border/50 hover:border-cal-primary/30 hover:shadow-md transition-all duration-200">
                      <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${cfg.dot} opacity-80`} />
                      <div className="flex-1 min-w-0">
                        {note.title && (
                          <p className="text-sm font-bold text-cal-text truncate mb-0.5">{note.title}</p>
                        )}
                        {note.content && (
                          <p className={`text-sm leading-relaxed ${note.title ? 'text-cal-muted/70 line-clamp-2' : 'text-cal-text font-medium'}`}>
                            {note.content}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                          {note.category && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${CATEGORY_COLORS[note.category] ?? CATEGORY_COLORS.other}`}>
                              {note.category}
                            </span>
                          )}
                          {note.eventTime && (
                            <span className="text-[10px] text-cal-muted font-semibold flex items-center gap-1">
                              <svg className="w-3 h-3 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {note.eventTime}{note.eventEndTime ? ` – ${note.eventEndTime}` : ''}
                            </span>
                          )}
                          <span className="text-[10px] text-cal-muted/60">{formatNoteDate(note)}</span>
                        </div>
                      </div>

                      {/* Days Until badge for upcoming */}
                      {view === 'upcomingEvents' && daysUntil !== null && (
                        <div className={`flex-shrink-0 text-center rounded-xl px-2 py-1.5 ${
                          daysUntil === 0 ? 'bg-rose-500/10 text-rose-500' :
                          daysUntil <= 3 ? 'bg-amber-500/10 text-amber-500' :
                          'bg-emerald-500/10 text-emerald-500'
                        }`}>
                          <p className="text-lg font-extrabold leading-none">{daysUntil}</p>
                          <p className="text-[9px] font-bold uppercase tracking-wide opacity-80">{daysUntil === 1 ? 'day' : 'days'}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
