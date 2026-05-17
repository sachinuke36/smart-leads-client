import { useState, FormEvent, useEffect } from 'react';
import { Lead, LeadFormData, LeadStatus, LeadSource } from '../../types';
import { Button, Input, Select } from '../common';

interface LeadFormProps {
  lead?: Lead | null;
  onSubmit: (data: LeadFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusOptions = Object.values(LeadStatus).map((status) => ({
  value: status,
  label: status
}));

const sourceOptions = Object.values(LeadSource).map((source) => ({
  value: source,
  label: source
}));

export const LeadForm = ({
  lead,
  onSubmit,
  onCancel,
  isLoading = false
}: LeadFormProps): JSX.Element => {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    status: LeadStatus.NEW,
    source: LeadSource.WEBSITE
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source
      });
    }
  }, [lead]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.source) {
      newErrors.source = 'Source is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
        placeholder="Enter lead name"
        disabled={isLoading}
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={errors.email}
        placeholder="Enter email address"
        disabled={isLoading}
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) =>
          setFormData({ ...formData, status: e.target.value as LeadStatus })
        }
        options={statusOptions}
        disabled={isLoading}
      />

      <Select
        label="Source"
        value={formData.source}
        onChange={(e) =>
          setFormData({ ...formData, source: e.target.value as LeadSource })
        }
        options={sourceOptions}
        error={errors.source}
        disabled={isLoading}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};
