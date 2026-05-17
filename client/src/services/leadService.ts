import api from './api';
import {
  Lead,
  LeadFormData,
  LeadFilters,
  ApiResponse,
  PaginatedResponse
} from '../types';

export const leadService = {
  async getLeads(filters: LeadFilters = {}): Promise<PaginatedResponse<Lead>> {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.page) params.append('page', filters.page.toString());
    params.append('limit', '10');

    const response = await api.get<PaginatedResponse<Lead>>(
      `/leads?${params.toString()}`
    );
    return response.data;
  },

  async getLead(id: string): Promise<Lead> {
    const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to get lead');
  },

  async createLead(data: LeadFormData): Promise<Lead> {
    const response = await api.post<ApiResponse<Lead>>('/leads', data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to create lead');
  },

  async updateLead(id: string, data: Partial<LeadFormData>): Promise<Lead> {
    const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.error || 'Failed to update lead');
  },

  async deleteLead(id: string): Promise<void> {
    const response = await api.delete<ApiResponse>(`/leads/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete lead');
    }
  },

  async exportLeads(filters: LeadFilters = {}): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const response = await api.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};
