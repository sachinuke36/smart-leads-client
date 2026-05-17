import api from './api';
import { ApiResponse, User, UserRole } from '../types';

export interface UsersResponse {
  users: User[];
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<UsersResponse>>('/auth/users');
    if (response.data.success && response.data.data) {
      return response.data.data.users;
    }
    throw new Error(response.data.error || 'Failed to fetch users');
  },

  async updateUserRole(userId: string, role: UserRole): Promise<User> {
    const response = await api.patch<ApiResponse<{ user: User }>>(
      `/auth/users/${userId}/role`,
      { role }
    );
    if (response.data.success && response.data.data) {
      return response.data.data.user;
    }
    throw new Error(response.data.error || 'Failed to update user role');
  }
};
