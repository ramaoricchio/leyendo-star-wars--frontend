import api from './axios';
import { Review } from '../types/review';

export const getReviews = async (params?: {
  page?: number;
  per_page?: number;
  publication_id?: number;
  min_score?: number;
}): Promise<{ items: Review[]; total: number; pages: number }> => {
  const response = await api.get('/reviews', { params });
  return response.data.data;
};

export const getReview = async (id: number): Promise<Review> => {
  const response = await api.get(`/reviews/${id}`);
  return response.data.data;
};

export const getReviewsByPublication = async (publicationId: number): Promise<{ items: Review[]; total: number; pages: number }> => {
  const response = await api.get(`/reviews/publication/${publicationId}`);
  return response.data.data;
};

export const createReview = async (data: Partial<Review>): Promise<Review> => {
  const response = await api.post('/reviews', data);
  return response.data.data;
};

export const updateReview = async (id: number, data: Partial<Review>): Promise<Review> => {
  const response = await api.put(`/reviews/${id}`, data);
  return response.data.data;
};

export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/reviews/${id}`);
};
