// Demo User System for SkillBridge
import { supabase } from '@/integrations/supabase/client';

const DEMO_USER = {
  email: 'demo@skillbridge.com',
  password: 'Demo123!@#',
  username: 'SkillBridge_Demo',
  display_name: 'Demo User',
  country: 'IN',
  preferred_language: 'en-US'
};

export const createDemoUser = async () => {
  try {
    // Check if demo user already exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });

    if (existingUser.user) {
      console.log('Demo user already exists');
      return existingUser;
    }
  } catch (error) {
    console.log('Demo user does not exist, creating new one...');
  }

  try {
    // Create demo user
    const { data, error } = await supabase.auth.signUp({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
      options: {
        data: {
          username: DEMO_USER.username,
          display_name: DEMO_USER.display_name,
          country: DEMO_USER.country,
          preferred_language: DEMO_USER.preferred_language
        }
      }
    });

    if (error) throw error;

    // Auto-confirm demo user (skip email verification)
    if (data.user) {
      // Add some demo progress and badges
      await initializeDemoProgress(data.user.id);
    }

    console.log('Demo user created successfully');
    return data;
  } catch (error) {
    console.error('Error creating demo user:', error);
    throw error;
  }
};

const initializeDemoProgress = async (userId: string) => {
  try {
    // Add demo points and level
    await supabase
      .from('profiles')
      .update({
        points: 150,
        level: 3,
        streak: 5
      })
      .eq('id', userId);

    // Add some demo badges
    const { data: badges } = await supabase
      .from('badges')
      .select('id, name')
      .in('name', ['First Steps', 'Voice Explorer', 'Quick Learner']);

    if (badges) {
      const userBadges = badges.map(badge => ({
        user_id: userId,
        badge_id: badge.id
      }));

      await supabase
        .from('user_badges')
        .insert(userBadges);
    }

    // Add demo course progress
    const { data: courses } = await supabase
      .from('courses')
      .select('id')
      .eq('title', 'Python Fundamentals')
      .single();

    if (courses) {
      await supabase
        .from('user_course_progress')
        .insert({
          user_id: userId,
          course_id: courses.id,
          progress_percentage: 35,
          completed_lessons: 2,
          total_lessons: 6
        });
    }

    console.log('Demo progress initialized');
  } catch (error) {
    console.error('Error initializing demo progress:', error);
  }
};

export const signInDemoUser = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });

    if (error) {
      // If demo user doesn't exist, create it
      if (error.message?.includes('Invalid login credentials')) {
        console.log('Creating demo user...');
        return await createDemoUser();
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error signing in demo user:', error);
    throw error;
  }
};

export const isDemoUser = (email?: string) => {
  return email === DEMO_USER.email;
};

export { DEMO_USER };
