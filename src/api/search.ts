import api from './axios';
import { Publication } from '../types/publication';
import { Collection } from '../types/collection';

export interface SearchResults {
  publications: Publication[];
  collections: Collection[];
  total: number;
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
