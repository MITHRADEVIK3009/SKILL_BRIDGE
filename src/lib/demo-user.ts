// Demo user functionality for testing
import { supabase } from '@/integrations/supabase/client';

export const signInDemoUser = async () => {
  try {
    // For demo purposes, we'll create a mock user session
    // In a real implementation, this would create a temporary demo account
    
    // Simulate successful login
    const demoUser = {
      id: 'demo-user-123',
      email: 'demo@skillbridge.com',
      username: 'DemoUser',
      points: 150,
      level: 3,
      streak: 5,
      preferred_language: 'en-US'
    };
    
    // Store demo user in localStorage for session management
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Simulate a delay to make it feel more realistic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return demoUser;
  } catch (error) {
    console.error('Demo user sign in error:', error);
    throw new Error('Failed to load demo account');
  }
};

export const getDemoUser = () => {
  const demoUserStr = localStorage.getItem('demoUser');
  return demoUserStr ? JSON.parse(demoUserStr) : null;
};

export const clearDemoUser = () => {
  localStorage.removeItem('demoUser');
  localStorage.removeItem('isLoggedIn');
};
