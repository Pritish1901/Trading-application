// User and Authentication types
export interface User {
  id: number;
  email: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface JWTPayload {
  id: number;
  email: string;
  iat: number;
  exp: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
