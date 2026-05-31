import api from './axios';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    roles: string[];
    is_active: boolean;
    email_verified: boolean;
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

export const register = async (username: string, email: string, password: string, youtubeUsername?: string): Promise<void> => {
  await api.post('/auth/register', { username, email, password, youtube_username: youtubeUsername || undefined });
};

export const verifyEmail = async (token: string): Promise<void> => {
  await api.get(`/auth/verify-email?token=${token}`);
};

export const resendVerification = async (email: string): Promise<void> => {
  await api.post('/auth/resend-verification', { email });
};
