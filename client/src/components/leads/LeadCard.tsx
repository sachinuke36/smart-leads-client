import { Lead, LeadStatus } from '../../types';
import { Badge, Button } from '../common';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onView: (lead: Lead) => void;
}

const statusVariants: Record<LeadStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  [LeadStatus.NEW]: 'info',
  [LeadStatus.CONTACTED]: 'warning',
  [LeadStatus.QUALIFIED]: 'success',
  [LeadStatus.LOST]: 'danger'
};

export const LeadCard = ({
  lead,
  onEdit,
  onDelete,
  onView
}: LeadCardProps): JSX.Element => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {lead.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</p>
        </div>
        <Badge variant={statusVariants[lead.status]}>{lead.status}</Badge>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          {lead.source}
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {formatDate(lead.createdAt)}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        <Button variant="ghost" size="sm" onClick={() => onView(lead)}>
          View
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onEdit(lead)}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => onDelete(lead)}>
          Delete
        </Button>
      </div>
    </div>
  );
};
