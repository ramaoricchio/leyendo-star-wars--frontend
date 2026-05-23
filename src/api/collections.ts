import api from './axios';
import { Collection } from '../types/collection';

export const getCollections = async (params?: {
  page?: number;
  per_page?: number;
  is_canon?: boolean;
}): Promise<{ items: Collection[]; total: number; pages: number }> => {
  const response = await api.get('/collections', { params });
  return response.data.data;
};

export const getCollection = async (id: number): Promise<Collection> => {
  const response = await api.get(`/collections/${id}`);
  return response.data.data;
};

export const createCollection = async (data: Partial<Collection>): Promise<Collection> => {
  const response = await api.post('/collections', data);
  return response.data.data;
};

export const updateCollection = async (id: number, data: Partial<Collection>): Promise<Collection> => {
  const response = await api.put(`/collections/${id}`, data);
  return response.data.data;
};

export const deleteCollection = async (id: number): Promise<void> => {
  await api.delete(`/collections/${id}`);
};
