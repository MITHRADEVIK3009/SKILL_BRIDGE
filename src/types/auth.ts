export interface User {
  user_id: string;
  username: string;
  email: string;
  points: number;
  streak: number;
  level: number;
  experience_points: number;
  badges: string[];
  profile_picture?: string;
  preferred_language: string;
  social_providers: any;
  is_email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
  success: boolean;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
  preferred_language?: string;
}

export interface SignInData {
  email: string;
  password: string;
}
