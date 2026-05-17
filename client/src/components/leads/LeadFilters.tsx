import { LeadFilters as LeadFiltersType, LeadStatus, LeadSource } from '../../types';
import { Input, Select, Button } from '../common';

interface LeadFiltersProps {
  filters: LeadFiltersType;
  onFilterChange: (filters: LeadFiltersType) => void;
  onExport: () => void;
  isExporting?: boolean;
}

const statusOptions = [
  { value: '', label: 'All Statuses' },
  ...Object.values(LeadStatus).map((status) => ({
    value: status,
    label: status
  }))
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  ...Object.values(LeadSource).map((source) => ({
    value: source,
    label: source
  }))
];

const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' }
];

export const LeadFilters = ({
  filters,
  onFilterChange,
  onExport,
  isExporting = false
}: LeadFiltersProps): JSX.Element => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            placeholder="Search by name or email..."
            value={filters.search || ''}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value, page: 1 })
            }
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              status: e.target.value as LeadStatus | '',
              page: 1
            })
          }
          options={statusOptions}
        />

        {/* Source Filter */}
        <Select
          value={filters.source || ''}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              source: e.target.value as LeadSource | '',
              page: 1
            })
          }
          options={sourceOptions}
        />

        {/* Sort */}
        <Select
          value={filters.sortBy || 'latest'}
          onChange={(e) =>
            onFilterChange({
              ...filters,
              sortBy: e.target.value as 'latest' | 'oldest'
            })
          }
          options={sortOptions}
        />
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            onFilterChange({
              status: '',
              source: '',
              search: '',
              sortBy: 'latest',
              page: 1
            })
          }
        >
          Clear Filters
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={onExport}
          isLoading={isExporting}
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Export CSV
        </Button>
      </div>
    </div>
  );
};
