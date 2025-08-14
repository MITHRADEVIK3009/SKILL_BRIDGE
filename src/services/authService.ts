import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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

class AuthService {
  private currentUser: User | null = null;
  private authStateCallbacks: ((user: User | null) => void)[] = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await this.loadUserProfile(session.user.id);
    }

    // Listen for auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await this.loadUserProfile(session.user.id);
      } else {
        this.setCurrentUser(null);
      }
    });
  }

  private async loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      this.setCurrentUser(data);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }

  private setCurrentUser(user: User | null) {
    this.currentUser = user;
    this.notifyAuthStateCallbacks(user);
  }

  private notifyAuthStateCallbacks(user: User | null) {
    this.authStateCallbacks.forEach(callback => callback(user));
  }

  // Public methods
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    this.authStateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.authStateCallbacks.indexOf(callback);
      if (index > -1) {
        this.authStateCallbacks.splice(index, 1);
      }
    };
  }

  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.username)
        .single();

      if (existingUser) {
        return {
          user: null,
          error: 'Username already exists',
          success: false
        };
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            username: userData.username,
            preferred_language: userData.preferred_language || 'en-US'
          }
        }
      });

      if (authError) {
        return {
          user: null,
          error: authError.message,
          success: false
        };
      }

      if (authData.user) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            user_id: authData.user.id,
            username: userData.username,
            email: userData.email,
            preferred_language: userData.preferred_language || 'en-US',
            points: 0,
            streak: 0,
            level: 1,
            experience_points: 0,
            badges: [],
            social_providers: {},
            is_email_verified: false
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return {
            user: null,
            error: 'Failed to create user profile',
            success: false
          };
        }

        toast.success('Account created successfully! Please check your email to verify your account.');
        
        return {
          user: null, // User will be loaded after email verification
          error: null,
          success: true
        };
      }

      return {
        user: null,
        error: 'Failed to create account',
        success: false
      };
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'An unexpected error occurred',
        success: false
      };
    }
  }

  async signIn(credentials: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return {
          user: null,
          error: error.message,
          success: false
        };
      }

      if (data.user) {
        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('user_id', data.user.id);

        await this.loadUserProfile(data.user.id);
        
        toast.success('Welcome back!');
        
        return {
          user: this.currentUser,
          error: null,
          success: true
        };
      }

      return {
        user: null,
        error: 'Failed to sign in',
        success: false
      };
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'An unexpected error occurred',
        success: false
      };
    }
  }

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        return {
          user: null,
          error: error.message,
          success: false
        };
      }

      // User will be redirected, so we return success
      return {
        user: null,
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'Google sign-in failed',
        success: false
      };
    }
  }

  async signInWithFacebook(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        return {
          user: null,
          error: error.message,
          success: false
        };
      }

      return {
        user: null,
        error: null,
        success: true
      };
    } catch (error: any) {
      return {
        user: null,
        error: error.message || 'Facebook sign-in failed',
        success: false
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Failed to sign out');
      } else {
        this.setCurrentUser(null);
        toast.success('Signed out successfully');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
      toast.error('An unexpected error occurred');
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      toast.success('Password reset email sent!');
      return {
        success: true,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send reset email'
      };
    }
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      toast.success('Password updated successfully!');
      return {
        success: true,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update password'
      };
    }
  }

  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', this.currentUser.user_id);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      // Reload user profile to get updated data
      await this.loadUserProfile(this.currentUser.user_id);
      
      toast.success('Profile updated successfully!');
      return {
        success: true,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  async deleteAccount(): Promise<{ success: boolean; error: string | null }> {
    try {
      if (!this.currentUser) {
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      // First delete user data from our tables (cascading will handle related data)
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('user_id', this.currentUser.user_id);

      if (deleteError) {
        return {
          success: false,
          error: deleteError.message
        };
      }

      // Then delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(
        this.currentUser.user_id
      );

      if (authError) {
        console.error('Error deleting auth user:', authError);
        // User data is already deleted, so we'll consider this a partial success
      }

      this.setCurrentUser(null);
      toast.success('Account deleted successfully');
      
      return {
        success: true,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete account'
      };
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  hasPermission(permission: string): boolean {
    // Add role-based permissions here if needed
    return this.isAuthenticated();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
