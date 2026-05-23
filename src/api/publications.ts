import api from './axios';
import { Publication } from '../types/publication';

export const getPublications = async (params?: {
  page?: number;
  per_page?: number;
  is_canon?: boolean;
  pub_type?: string;
  era?: string;
  collection_id?: number;
}): Promise<{ items: Publication[]; total: number; pages: number }> => {
  const response = await api.get('/publications', { params });
  return response.data.data;
};

export const getPublication = async (id: number): Promise<Publication> => {
  const response = await api.get(`/publications/${id}`);
  return response.data.data;
};

export const createPublication = async (data: Partial<Publication>): Promise<Publication> => {
  const response = await api.post('/publications', data);
  return response.data.data;
};

export const updatePublication = async (id: number, data: Partial<Publication>): Promise<Publication> => {
  const response = await api.put(`/publications/${id}`, data);
  return response.data.data;
};

export const deletePublication = async (id: number): Promise<void> => {
  await api.delete(`/publications/${id}`);
};
