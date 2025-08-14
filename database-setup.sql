-- SkillBridge Complete Database Setup
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  bio TEXT,
  avatar_url TEXT,
  preferred_language VARCHAR(10) DEFAULT 'en-US',
  country VARCHAR(3) DEFAULT 'US',
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20) DEFAULT 'beginner',
  category VARCHAR(50),
  image_url TEXT,
  duration_hours INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  content TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  points_reward INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_course_progress table
CREATE TABLE IF NOT EXISTS user_course_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0,
  completed_lessons INTEGER DEFAULT 0,
  total_lessons INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  category VARCHAR(50),
  points_required INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create voice_interactions table
CREATE TABLE IF NOT EXISTS voice_interactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  command TEXT NOT NULL,
  response TEXT,
  language VARCHAR(10) DEFAULT 'en-US',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.points,
  p.level,
  p.streak,
  RANK() OVER (ORDER BY p.points DESC) as rank,
  COUNT(ub.badge_id) as total_badges
FROM profiles p
LEFT JOIN user_badges ub ON p.id = ub.user_id
GROUP BY p.id, p.username, p.display_name, p.avatar_url, p.points, p.level, p.streak
ORDER BY p.points DESC;

-- Create functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add unique constraints for ON CONFLICT
ALTER TABLE courses ADD CONSTRAINT IF NOT EXISTS unique_course_title UNIQUE (title);
ALTER TABLE lessons ADD CONSTRAINT IF NOT EXISTS unique_lesson_title_per_course UNIQUE (course_id, title);

-- Insert sample badges (name is already UNIQUE)
INSERT INTO badges (name, description, icon_url, category, points_required) VALUES
('First Steps', 'Complete your first lesson', '🎯', 'achievement', 0),
('Voice Explorer', 'Use voice assistant 5 times', '🎤', 'voice', 5),
('Quick Learner', 'Complete 5 lessons in one day', '⚡', 'speed', 50),
('Code Master', 'Complete 3 different courses', '👨‍💻', 'mastery', 150),
('Streak Keeper', 'Maintain 7-day learning streak', '🔥', 'consistency', 70),
('Early Bird', 'Complete lesson before 9 AM', '🌅', 'time', 25),
('Night Owl', 'Complete lesson after 9 PM', '🦉', 'time', 25),
('Social Butterfly', 'Refer 3 friends', '🦋', 'social', 100),
('Persistent', 'Complete 50 lessons total', '💪', 'persistence', 500),
('Multilingual', 'Use voice assistant in 3 languages', '🌍', 'language', 30),
('Challenge Accepted', 'Complete 10 coding challenges', '🏆', 'challenge', 200),
('Perfect Score', 'Get 100% on 5 lessons', '⭐', 'excellence', 100),
('Speed Runner', 'Complete lesson in under 5 minutes', '🏃', 'speed', 50),
('Dedicated', 'Use platform for 30 consecutive days', '📅', 'dedication', 300),
('Knowledge Seeker', 'Complete all available courses', '🎓', 'completion', 1000)
ON CONFLICT (name) DO NOTHING;

-- Insert sample courses
INSERT INTO courses (title, description, difficulty, category, duration_hours) VALUES
('Python Fundamentals', 'Learn Python programming from scratch with hands-on examples', 'beginner', 'programming', 20),
('JavaScript Essentials', 'Master JavaScript for web development', 'beginner', 'web-development', 25),
('React Development', 'Build modern web applications with React', 'intermediate', 'frontend', 30),
('Node.js Backend', 'Create server-side applications with Node.js', 'intermediate', 'backend', 35),
('Data Structures & Algorithms', 'Essential CS concepts for technical interviews', 'advanced', 'computer-science', 40),
('Machine Learning Basics', 'Introduction to ML concepts and Python libraries', 'intermediate', 'data-science', 45)
ON CONFLICT (title) DO NOTHING;

-- Insert sample lessons for Python course
INSERT INTO lessons (course_id, title, description, order_index, duration_minutes, points_reward)
SELECT 
  c.id,
  lesson.title,
  lesson.description,
  lesson.order_index,
  lesson.duration_minutes,
  lesson.points_reward
FROM courses c
CROSS JOIN (
  VALUES 
    ('Getting Started with Python', 'Install Python and write your first program', 1, 30, 10),
    ('Variables and Data Types', 'Learn about Python variables and basic data types', 2, 25, 10),
    ('Control Flow', 'Master if statements, loops, and conditions', 3, 35, 15),
    ('Functions and Modules', 'Create reusable code with functions', 4, 40, 15),
    ('Working with Lists', 'Understand Python lists and list operations', 5, 30, 10),
    ('File Handling', 'Read and write files in Python', 6, 35, 15)
) AS lesson(title, description, order_index, duration_minutes, points_reward)
WHERE c.title = 'Python Fundamentals'
ON CONFLICT (course_id, title) DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_course_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lesson progress" ON user_lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own lesson progress" ON user_lesson_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own voice interactions" ON voice_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own voice interactions" ON voice_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for courses, lessons, and badges
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Anyone can view lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, email, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

GRANT SELECT ON courses, lessons, badges TO anon;
GRANT SELECT ON leaderboard TO anon, authenticated;

-- Success message
SELECT 'Database setup completed successfully! You can now use SkillBridge.' AS result;
