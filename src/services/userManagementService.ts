import { supabase } from '@/lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  preferred_language: string;
  points: number;
  level: number;
  streak: number;
  created_at: string;
  last_login: string;
}

export interface UserStats {
  total_users: number;
  max_users: number;
  is_limit_reached: boolean;
}

class UserManagementService {
  private readonly MAX_USERS = 30; // MVP user limit

  // Get current user profile
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      return profile;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Sign up new user
  async signUp(email: string, password: string, username: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check user limit before allowing signup
      const userStats = await this.getUserStats();
      if (userStats.is_limit_reached) {
        return {
          success: false,
          error: 'User limit reached. Please try again later. Thank you for your interest in SkillBridge!'
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            preferred_language: 'en-US'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            username,
            preferred_language: 'en-US',
            points: 0,
            level: 1,
            streak: 0,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString()
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return { success: false, error: 'Failed to create user profile' };
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Sign in user
  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Update last login
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      return { success: true };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Signout error:', error);
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get user statistics (for admin/limit checking)
  async getUserStats(): Promise<UserStats> {
    try {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error getting user count:', error);
        return {
          total_users: 0,
          max_users: this.MAX_USERS,
          is_limit_reached: false
        };
      }

      const totalUsers = count || 0;
      
      return {
        total_users: totalUsers,
        max_users: this.MAX_USERS,
        is_limit_reached: totalUsers >= this.MAX_USERS
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        total_users: 0,
        max_users: this.MAX_USERS,
        is_limit_reached: false
      };
    }
  }

  // Add points to user
  async addPoints(points: number): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      // Get current user data
      const { data: profile } = await supabase
        .from('profiles')
        .select('points, level')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return { success: false, error: 'User profile not found' };
      }

      const newPoints = (profile.points || 0) + points;
      const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points

      const { error } = await supabase
        .from('profiles')
        .update({ 
          points: newPoints,
          level: newLevel
        })
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Add points error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  // Get user leaderboard
  async getLeaderboard(limit: number = 10): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, points, level, streak')
        .order('points', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting leaderboard:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Leaderboard error:', error);
      return [];
    }
  }

  // Check if user can access the application
  async canAccess(): Promise<{ canAccess: boolean; reason?: string }> {
    try {
      const userStats = await this.getUserStats();
      
      if (userStats.is_limit_reached) {
        return {
          canAccess: false,
          reason: 'User limit reached. Please try again later. Thank you for your interest in SkillBridge!'
        };
      }

      return { canAccess: true };
    } catch (error) {
      console.error('Access check error:', error);
      return { canAccess: true }; // Allow access if check fails
    }
  }
}

export const userManagementService = new UserManagementService();
