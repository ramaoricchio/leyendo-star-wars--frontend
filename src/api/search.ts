import api from './axios';
import { Publication } from '../types/publication';

export interface SearchResults {
  items: Publication[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
  query: string;
}

export const search = async (params: {
  q: string;
  is_canon?: boolean;
  pub_type?: string;
  era?: string;
  year_from?: number;
  year_to?: number;
  page?: number;
  per_page?: number;
}): Promise<SearchResults> => {
  const response = await api.get('/search', { params });
  return response.data.data;
};
