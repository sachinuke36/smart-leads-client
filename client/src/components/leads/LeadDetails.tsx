import { Lead, LeadStatus } from '../../types';
import { Badge, Button } from '../common';

interface LeadDetailsProps {
  lead: Lead;
  onEdit: () => void;
  onClose: () => void;
}

const statusVariants: Record<LeadStatus, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  [LeadStatus.NEW]: 'info',
  [LeadStatus.CONTACTED]: 'warning',
  [LeadStatus.QUALIFIED]: 'success',
  [LeadStatus.LOST]: 'danger'
};

export const LeadDetails = ({
  lead,
  onEdit,
  onClose
}: LeadDetailsProps): JSX.Element => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {lead.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{lead.email}</p>
        </div>
        <Badge variant={statusVariants[lead.status]} className="text-sm">
          {lead.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Source</p>
          <p className="font-medium text-gray-900 dark:text-white">{lead.source}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created At</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatDate(lead.createdAt)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created By</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {lead.createdBy?.name || 'Unknown'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatDate(lead.updatedAt)}
          </p>
        </div>

        {lead.assignedTo && (
          <div className="col-span-2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Assigned To
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {lead.assignedTo.name} ({lead.assignedTo.email})
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onEdit}>Edit Lead</Button>
      </div>
    </div>
  );
};
