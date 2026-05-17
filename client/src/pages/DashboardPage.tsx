import { useState, useCallback } from 'react';
import { useLeads } from '../hooks';
import { leadService } from '../services';
import {
  Layout,
  Button,
  Modal,
  Spinner,
  Alert,
  EmptyState,
  LeadCard,
  LeadForm,
  LeadFilters,
  LeadDetails,
  Pagination
} from '../components';
import { Lead, LeadFormData, LeadFilters as LeadFiltersType } from '../types';
import { AxiosError } from 'axios';
import { ApiResponse } from '../types';

export const DashboardPage = (): JSX.Element => {
  const { leads, pagination, isLoading, error, filters, setFilters, refetch } =
    useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleCreateLead = () => {
    setSelectedLead(null);
    setFormError('');
    setIsFormModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setFormError('');
    setIsFormModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setFormError('');

    try {
      if (selectedLead) {
        await leadService.updateLead(selectedLead._id, data);
      } else {
        await leadService.createLead(data);
      }
      setIsFormModalOpen(false);
      setSelectedLead(null);
      await refetch();
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      setFormError(
        axiosError.response?.data?.error || 'An error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead) return;

    setIsSubmitting(true);

    try {
      await leadService.deleteLead(selectedLead._id);
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
      await refetch();
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      alert(axiosError.response?.data?.error || 'Failed to delete lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      const blob = await leadService.exportLeads(filters);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export leads');
    } finally {
      setIsExporting(false);
    }
  }, [filters]);

  const handleFilterChange = (newFilters: LeadFiltersType) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Leads Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track your leads
            </p>
          </div>
          <Button onClick={handleCreateLead}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Lead
          </Button>
        </div>

        {/* Filters */}
        <LeadFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          isExporting={isExporting}
        />

        {/* Content */}
        {isLoading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <Alert variant="error">{error}</Alert>
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            description={
              filters.search || filters.status || filters.source
                ? 'Try adjusting your filters'
                : 'Get started by creating your first lead'
            }
            icon={
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            action={
              !filters.search && !filters.status && !filters.source ? (
                <Button onClick={handleCreateLead}>Create Lead</Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leads.map((lead) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  onEdit={handleEditLead}
                  onDelete={handleDeleteLead}
                  onView={handleViewLead}
                />
              ))}
            </div>

            {pagination && (
              <Pagination pagination={pagination} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedLead ? 'Edit Lead' : 'Create Lead'}
      >
        {formError && (
          <Alert variant="error" className="mb-4">
            {formError}
          </Alert>
        )}
        <LeadForm
          lead={selectedLead}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Lead Details"
        size="lg"
      >
        {selectedLead && (
          <LeadDetails
            lead={selectedLead}
            onEdit={() => handleEditLead(selectedLead)}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Lead"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedLead?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
