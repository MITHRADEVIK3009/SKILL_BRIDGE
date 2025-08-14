
import { supabase } from '@/lib/supabase';

// User types
export interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  registration_date: string;
  last_login?: string;
  points: number;
  streak: number;
  badges: string[];
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  course_id: number;
  title: string;
  description?: string;
  difficulty?: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  lesson_id: number;
  course_id: number;
  title: string;
  content?: string;
  order: number;
  resources?: any[];
  created_at: string;
  updated_at: string;
}

export interface UserCourse {
  user_course_id: number;
  user_id: number;
  course_id: number;
  enrollment_date: string;
  progress: number;
  last_accessed?: string;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  challenge_id: number;
  title: string;
  description?: string;
  problem_statement?: string;
  solution_template?: string;
  difficulty?: string;
  points_reward?: number;
  created_at: string;
  updated_at: string;
}

export interface UserChallenge {
  user_challenge_id: number;
  user_id: number;
  challenge_id: number;
  completion_date?: string;
  solution?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  leaderboard_id: number;
  user_id: number;
  rank: number;
  total_points: number;
  last_updated: string;
  username?: string; // Joined from users table
}

export interface Badge {
  badge_id: number;
  name: string;
  description?: string;
  icon_url?: string;
  criteria?: string;
  created_at: string;
  updated_at: string;
}

export interface VoiceInteraction {
  interaction_id: number;
  user_id?: number;
  timestamp: string;
  voice_command: string;
  response?: string;
  intent?: string;
}

export interface LLMQuery {
  query_id: number;
  user_id?: number;
  query_text: string;
  response_text?: string;
  timestamp: string;
  source_documents?: any;
  llm_model?: string;
  created_at: string;
  updated_at: string;
}

export interface LearningPath {
  path_id: number;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CoursePath {
  course_path_id: number;
  path_id: number;
  course_id: number;
  order_in_path?: number;
  created_at: string;
  updated_at: string;
}

export const databaseService = {
  // User related operations
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    return data;
  },
  
  async getUserById(userId: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    
    return data;
  },
  
  async updateUserProfile(userId: number, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
    
    return data;
  },

  // Course related operations
  async getAllCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    
    return data;
  },
  
  async getCourseById(courseId: number): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('course_id', courseId)
      .single();
      
    if (error) {
      console.error('Error fetching course:', error);
      return null;
    }
    
    return data;
  },
  
  async getCourseLessons(courseId: number): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order', { ascending: true });
      
    if (error) {
      console.error('Error fetching course lessons:', error);
      return [];
    }
    
    return data;
  },

  // User course progress
  async enrollInCourse(userId: number, courseId: number): Promise<UserCourse | null> {
    const { data, error } = await supabase
      .from('user_courses')
      .insert([{ user_id: userId, course_id: courseId }])
      .select()
      .single();
      
    if (error) {
      console.error('Error enrolling in course:', error);
      return null;
    }
    
    return data;
  },
  
  async updateCourseProgress(userId: number, courseId: number, progress: number): Promise<UserCourse | null> {
    const { data, error } = await supabase
      .from('user_courses')
      .update({ 
        progress, 
        last_accessed: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating course progress:', error);
      return null;
    }
    
    return data;
  },
  
  async getUserCourses(userId: number): Promise<{course: Course, progress: number}[]> {
    const { data, error } = await supabase
      .from('user_courses')
      .select(`
        progress,
        course:courses(*)
      `)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching user courses:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      course: item.course,
      progress: item.progress
    }));
  },

  // Challenge related operations
  async getAllChallenges(): Promise<Challenge[]> {
    const { data, error } = await supabase
      .from('challenges')
      .select('*');
      
    if (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
    
    return data;
  },
  
  async submitChallengeAttempt(userId: number, challengeId: number, solution: string): Promise<UserChallenge | null> {
    const { data, error } = await supabase
      .from('user_challenges')
      .upsert({
        user_id: userId,
        challenge_id: challengeId,
        solution,
        is_completed: true,
        completion_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error submitting challenge:', error);
      return null;
    }
    
    return data;
  },

  // Leaderboard operations
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select(`
        *,
        username:users(username)
      `)
      .order('rank', { ascending: true })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
    
    return data.map((item: any) => ({
      ...item,
      username: item.username?.username
    }));
  },
  
  // Voice interaction logging
  async logVoiceInteraction(interaction: Omit<VoiceInteraction, 'interaction_id' | 'timestamp'>): Promise<VoiceInteraction | null> {
    const { data, error } = await supabase
      .from('voice_interactions')
      .insert([interaction])
      .select()
      .single();
      
    if (error) {
      console.error('Error logging voice interaction:', error);
      return null;
    }
    
    return data;
  },

  // LLM Query logging and retrieval
  async logLLMQuery(query: Omit<LLMQuery, 'query_id' | 'timestamp' | 'created_at' | 'updated_at'>): Promise<LLMQuery | null> {
    const { data, error } = await supabase
      .from('llm_queries')
      .insert([query])
      .select()
      .single();
      
    if (error) {
      console.error('Error logging LLM query:', error);
      return null;
    }
    
    return data;
  },
  
  async getUserLLMQueries(userId: number, limit: number = 10): Promise<LLMQuery[]> {
    const { data, error } = await supabase
      .from('llm_queries')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching LLM queries:', error);
      return [];
    }
    
    return data;
  },

  // Learning paths
  async getLearningPaths(): Promise<LearningPath[]> {
    const { data, error } = await supabase
      .from('learning_paths')
      .select('*');
      
    if (error) {
      console.error('Error fetching learning paths:', error);
      return [];
    }
    
    return data;
  },
  
  async getLearningPathCourses(pathId: number): Promise<Course[]> {
    const { data, error } = await supabase
      .from('course_paths')
      .select(`
        order_in_path,
        course:courses(*)
      `)
      .eq('path_id', pathId)
      .order('order_in_path', { ascending: true });
      
    if (error) {
      console.error('Error fetching learning path courses:', error);
      return [];
    }
    
    return data.map((item: any) => item.course);
  },
  
  // Badges
  async getUserBadges(userId: number): Promise<Badge[]> {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('badges')
      .eq('user_id', userId)
      .single();
      
    if (userError || !user) {
      console.error('Error fetching user badges:', userError);
      return [];
    }
    
    if (!user.badges || !user.badges.length) {
      return [];
    }
    
    const badgeIds = user.badges;
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .in('badge_id', badgeIds);
      
    if (error) {
      console.error('Error fetching badges:', error);
      return [];
    }
    
    return data;
  }
};
