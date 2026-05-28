import api from './axios';

export interface Stats {
  publications_count: number;
  eras_count: number;
  reviews_count: number;
  collections_count: number;
}

export const getStats = async (): Promise<Stats> => {
  const response = await api.get('/stats');
  return response.data.data;
};
