import api from './axios';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    is_active: boolean;
    created_at: string;
  };
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { username, password });
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};
