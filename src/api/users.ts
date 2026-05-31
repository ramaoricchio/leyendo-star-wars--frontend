import api from './axios';
import { User } from '../types/user';

export interface UsersPage {
  users: User[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export const listUsers = async (page: number, perPage: number, q?: string): Promise<UsersPage> => {
  const params: Record<string, string | number> = { page, per_page: perPage };
  if (q) params.q = q;
  const response = await api.get('/users', { params });
  return response.data.data;
};

export const updateUserRole = async (userId: number, role: string): Promise<User> => {
  const response = await api.put(`/users/${userId}/role`, { role });
  return response.data.data;
};
