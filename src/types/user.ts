export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
