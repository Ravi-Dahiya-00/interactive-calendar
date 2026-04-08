'use client';

interface EmptyStateProps {
  title: string;
  description: string;
  hint?: string;
  shortcuts?: Array<{ key: string; label: string }>;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title,
  description,
  hint,
  shortcuts,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-cal-border bg-cal-bg/50 px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cal-card text-cal-primary shadow-sm">
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <h4 className="text-base font-semibold text-cal-text">{title}</h4>
      <p className="mt-1 text-sm text-cal-muted">{description}</p>
      {hint ? <p className="mt-2 text-xs text-cal-muted">{hint}</p> : null}
      {shortcuts && shortcuts.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-cal-muted/80">
          {shortcuts.map((shortcut) => (
            <span key={`${shortcut.key}-${shortcut.label}`} className="inline-flex items-center gap-1">
              <kbd className="rounded border border-cal-border bg-cal-card px-1.5 py-0.5 text-[10px] font-semibold text-cal-text shadow-sm">
                {shortcut.key}
              </kbd>
              <span>{shortcut.label}</span>
            </span>
          ))}
        </div>
      ) : null}
      {(actionLabel && onAction) || (secondaryActionLabel && onSecondaryAction) ? (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {secondaryActionLabel && onSecondaryAction ? (
            <button
              onClick={onSecondaryAction}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-cal-border bg-cal-card px-4 py-2 text-sm font-medium text-cal-text transition-colors hover:bg-cal-bg"
            >
              <svg className="mr-1.5 h-4 w-4 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {secondaryActionLabel}
            </button>
          ) : null}
          {actionLabel && onAction ? (
            <button
              onClick={onAction}
              className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-cal-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-cal-primary-dark"
            >
              <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {actionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
