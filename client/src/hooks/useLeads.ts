import { useState, useEffect, useCallback } from 'react';
import { leadService } from '../services';
import { Lead, LeadFilters, PaginationInfo } from '../types';
import { useDebounce } from './useDebounce';

interface UseLeadsReturn {
  leads: Lead[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  filters: LeadFilters;
  setFilters: React.Dispatch<React.SetStateAction<LeadFilters>>;
  refetch: () => Promise<void>;
}

export function useLeads(initialFilters: LeadFilters = {}): UseLeadsReturn {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>(initialFilters);

  const debouncedSearch = useDebounce(filters.search, 300);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await leadService.getLeads({
        ...filters,
        search: debouncedSearch
      });

      if (response.success && response.data) {
        setLeads(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.error || 'Failed to fetch leads');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      setLeads([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [filters.status, filters.source, filters.sortBy, filters.page, debouncedSearch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  return {
    leads,
    pagination,
    isLoading,
    error,
    filters,
    setFilters,
    refetch: fetchLeads
  };
}
