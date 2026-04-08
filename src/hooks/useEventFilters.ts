import { useState, useMemo, useEffect } from 'react';
import { Note, NoteCategory } from '@/types';
import { isSameDay, isoStringToDate } from '@/utils/dateUtils';

interface FilterState {
  searchQuery: string;
  startDate: string | null;
  endDate: string | null;
  categories: Set<NoteCategory>;
  priorities: Set<string>;
}

export function useEventFilters(initialNotes: Note[]) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    startDate: null,
    endDate: null,
    categories: new Set(),
    priorities: new Set(),
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [filters.searchQuery]);

  const updateSearchQuery = (q: string) => setFilters(p => ({ ...p, searchQuery: q }));
  const updateDateRange = (start: string | null, end: string | null) => {
    // If both are provided and start is after end, automatically swap them
    // This assumes ISO string formats like YYYY-MM-DD which allow direct string comparison
    if (start && end && start > end) {
      setFilters(p => ({ ...p, startDate: end, endDate: start }));
    } else {
      setFilters(p => ({ ...p, startDate: start, endDate: end }));
    }
  };
  
  const toggleCategory = (cat: NoteCategory) => {
    setFilters(p => {
      const next = new Set(p.categories);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return { ...p, categories: next };
    });
  };

  const togglePriority = (pri: string) => {
    setFilters(p => {
      const next = new Set(p.priorities);
      if (next.has(pri)) next.delete(pri);
      else next.add(pri);
      return { ...p, priorities: next };
    });
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      startDate: null,
      endDate: null,
      categories: new Set(),
      priorities: new Set(),
    });
  };

  const filteredNotes = useMemo(() => {
    return initialNotes.filter(note => {
      // 1. Priority Filtering
      if (filters.priorities.size > 0) {
        if (!note.priority || !filters.priorities.has(note.priority)) {
          return false;
        }
      }

      // 2. Category Filtering
      if (filters.categories.size > 0) {
        if (!note.category || !filters.categories.has(note.category)) {
          return false;
        }
      }

      // 3. Search text Filtering
      if (debouncedSearch) {
        const query = debouncedSearch.toLowerCase();
        if (!note.content.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 4. Date Range Filtering
      if (filters.startDate || filters.endDate) {
        if (!note.dateRange || !note.dateRange.start) return false;
        const noteStart = isoStringToDate(note.dateRange.start);
        
        if (filters.startDate) {
           const filterStart = new Date(filters.startDate);
           filterStart.setHours(0,0,0,0);
           if (noteStart < filterStart) return false;
        }
        if (filters.endDate) {
           const filterEnd = new Date(filters.endDate);
           filterEnd.setHours(23,59,59,999);
           if (noteStart > filterEnd) return false;
        }
      }

      return true;
    });
  }, [initialNotes, filters.priorities, filters.categories, filters.startDate, filters.endDate, debouncedSearch]);

  const hasActiveFilters = 
    filters.searchQuery !== '' || 
    filters.startDate !== null || 
    filters.endDate !== null || 
    filters.categories.size > 0 || 
    filters.priorities.size > 0;

  return {
    filters,
    debouncedSearch,
    filteredNotes,
    updateSearchQuery,
    updateDateRange,
    toggleCategory,
    togglePriority,
    clearFilters,
    hasActiveFilters
  };
}
