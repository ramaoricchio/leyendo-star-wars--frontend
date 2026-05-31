export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  roles: string[];
  youtube_username: string | null;
  is_active: boolean;
  email_verified: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
