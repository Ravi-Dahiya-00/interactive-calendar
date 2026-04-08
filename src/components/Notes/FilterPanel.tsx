import { useState, useRef, useEffect } from 'react';
import { NoteCategory } from '@/types';
import { FilterDatePicker } from './FilterDatePicker';

interface FilterPanelProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  startDate: string | null;
  endDate: string | null;
  onDateRangeChange: (start: string | null, end: string | null) => void;
  categories: Set<NoteCategory>;
  onToggleCategory: (cat: NoteCategory) => void;
  priorities: Set<string>;
  onTogglePriority: (pri: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const CATEGORIES: NoteCategory[] = ['work', 'personal', 'study', 'other'];
const PRIORITIES: string[] = ['high', 'medium', 'low'];

export function FilterPanel({
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onDateRangeChange,
  categories,
  onToggleCategory,
  priorities,
  onTogglePriority,
  onClear,
  hasActiveFilters,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const advancedFiltersActive = startDate !== null || endDate !== null || categories.size > 0 || priorities.size > 0;

  return (
    <div className="relative mb-5" ref={panelRef}>
      {/* Search Bar Row */}
      <div className="flex items-center gap-2 px-4 sm:px-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cal-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events... (e.g. meeting)"
            className="w-full pl-9 pr-3 py-2 min-h-[44px] text-sm rounded-lg border border-cal-border bg-cal-card text-cal-text focus:border-cal-primary focus:ring-1 focus:ring-cal-primary outline-none transition-all placeholder:text-cal-muted shadow-sm"
          />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-2 min-h-[44px] min-w-[44px] rounded-lg border transition-all flex items-center justify-center shadow-sm ${
              advancedFiltersActive || isOpen
                ? 'bg-cal-primary text-white border-cal-primary'
                : 'bg-cal-card border-cal-border text-cal-muted hover:bg-cal-bg hover:text-cal-text'
            }`}
            aria-label="Toggle Advanced Filters"
            title="Advanced Filters"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0H4.5m4.5 12h9.75M10.5 18a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0H4.5m4.5-6h9.75M10.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm0 0H4.5" />
            </svg>
          </button>
          {advancedFiltersActive && !isOpen && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-cal-card z-10" />
          )}
        </div>
      </div>

      {/* Advanced Filters Dropdown */}
      {isOpen && (
        <>
          {/* Mobile Overlay Background */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden" onClick={() => setIsOpen(false)} />
          
          <div className="fixed sm:absolute bottom-0 sm:bottom-auto left-0 right-0 sm:top-12 sm:left-auto sm:right-0 w-full sm:w-[400px] bg-[#1e293b] sm:bg-black/80 sm:backdrop-blur-xl sm:border border-t border-white/10 rounded-t-3xl sm:rounded-2xl shadow-2xl z-50 p-5 sm:p-5 animate-slide-up sm:origin-top text-white max-h-[85vh] overflow-y-auto">
            
            {/* Mobile Drag Handle */}
            <div className="flex justify-center sm:hidden mb-4">
              <div className="w-12 h-1.5 bg-white/20 rounded-full" />
            </div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-cal-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Advanced Filters
            </h4>
            {advancedFiltersActive && (
              <button
                onClick={onClear}
                className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                title="Clear advanced filters"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Date Filters */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/60 mb-1 font-medium">Start Date</label>
                <FilterDatePicker
                  value={startDate}
                  onChange={(val) => onDateRangeChange(val, endDate)}
                  placeholder="Select Date"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1 font-medium">End Date</label>
                <FilterDatePicker
                  value={endDate}
                  onChange={(val) => onDateRangeChange(startDate, val)}
                  placeholder="Select Date"
                  align="right"
                />
              </div>
            </div>

            {/* Categories & Priorities */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              
              <div>
                <span className="block text-xs text-white/60 mb-2 font-medium">Category</span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => {
                    const isActive = categories.has(cat);
                    const colorMap: Record<string, string> = {
                      work: isActive ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-blue-400',
                      personal: isActive ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-purple-400',
                      study: isActive ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-emerald-400',
                      other: isActive ? 'bg-gray-500 border-gray-500 text-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-gray-300',
                    };
                    return (
                      <button
                        key={cat}
                        onClick={() => onToggleCategory(cat)}
                        className={`px-3 py-1.5 flex-1 sm:flex-none flex items-center justify-center text-xs font-medium rounded-lg border transition-all duration-200 capitalize hover:scale-105 active:scale-95 ${colorMap[cat] || ''}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="block text-xs text-white/60 mb-2 font-medium">Priority</span>
                <div className="flex flex-wrap gap-1.5">
                  {PRIORITIES.map(pri => {
                    const isActive = priorities.has(pri);
                    const colorMap: Record<string, string> = {
                      high: isActive ? 'bg-red-500 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-red-400',
                      medium: isActive ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-amber-400',
                      low: isActive ? 'bg-green-500 border-green-500 text-white' : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-green-400',
                    };
                    
                    return (
                      <button
                        key={pri}
                        onClick={() => onTogglePriority(pri)}
                        className={`px-3 py-1.5 flex-1 sm:flex-none flex items-center justify-center text-xs font-medium rounded-lg border transition-all duration-200 capitalize hover:scale-105 active:scale-95 ${colorMap[pri] || ''}`}
                      >
                        {pri}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
