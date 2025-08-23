-- =====================================================
-- SKILLBRIDGE FIXED DATABASE SCHEMA
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. CORE USER MANAGEMENT
-- =====================================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    -- Gamification fields
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    experience_points INTEGER DEFAULT 0 CHECK (experience_points >= 0),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    badges JSONB DEFAULT '[]'::JSONB,
    profile_picture VARCHAR(255),
    
    -- Voice AI preferences
    voice_enabled BOOLEAN DEFAULT true,
    preferred_voice VARCHAR(50) DEFAULT 'en-US',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. RAG KNOWLEDGE BASE SYSTEM
-- =====================================================
CREATE TABLE programming_concepts (
    concept_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER CHECK (estimated_time > 0),
    prerequisites TEXT[],
    related_concepts TEXT[],
    
    roadmap_url VARCHAR(500),
    tools JSONB DEFAULT '[]'::JSONB,
    timeline JSONB DEFAULT '{}'::JSONB,
    resources JSONB DEFAULT '{}'::JSONB,
    
    tags TEXT[],
    search_index tsvector,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function + Trigger to keep search_index updated
CREATE OR REPLACE FUNCTION update_programming_concepts_search_index()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_index :=
    to_tsvector('english',
      COALESCE(NEW.title, '') || ' ' ||
      COALESCE(NEW.content, '') || ' ' ||
      array_to_string(COALESCE(NEW.tags, '{}'), ' ')
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_programming_concepts_search
BEFORE INSERT OR UPDATE ON programming_concepts
FOR EACH ROW EXECUTE FUNCTION update_programming_concepts_search_index();

-- =====================================================
-- 3. REAL-TIME CACHING SYSTEM
-- =====================================================
CREATE TABLE cache_store (
    cache_key VARCHAR(255) PRIMARY KEY,
    cache_value JSONB NOT NULL,
    cache_type VARCHAR(50) NOT NULL CHECK (cache_type IN ('api', 'rag', 'user', 'challenge')),
    expiration_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 0 CHECK (access_count >= 0)
);

CREATE TABLE cache_statistics (
    stat_id SERIAL PRIMARY KEY,
    cache_type VARCHAR(50) NOT NULL,
    hit_count INTEGER DEFAULT 0 CHECK (hit_count >= 0),
    miss_count INTEGER DEFAULT 0 CHECK (miss_count >= 0),
    total_requests INTEGER DEFAULT 0 CHECK (total_requests >= 0),
    avg_response_time_ms DECIMAL(10,2) CHECK (avg_response_time_ms >= 0),
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cache_type, date)
);

-- =====================================================
-- 4. DAILY CHALLENGE SYSTEM
-- =====================================================
CREATE TABLE challenges (
    challenge_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    solution_template TEXT,
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100) NOT NULL,
    points_reward INTEGER NOT NULL CHECK (points_reward > 0),
    input_example TEXT,
    expected_output TEXT,
    hints TEXT[],
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_challenge_assignments (
    assignment_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    challenge_id INTEGER REFERENCES challenges(challenge_id) ON DELETE CASCADE NOT NULL,
    assignment_date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    user_answer TEXT,
    points_earned INTEGER DEFAULT 0 CHECK (points_earned >= 0),
    repetition_count INTEGER DEFAULT 1 CHECK (repetition_count >= 1),
    last_shown_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, assignment_date),
    CHECK ((completed = FALSE) OR (completed = TRUE AND completed_at IS NOT NULL))
);

-- =====================================================
-- 5. VOICE AI ASSISTANT
-- =====================================================
CREATE TABLE voice_interactions (
    interaction_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    voice_command TEXT,
    audio_file_url VARCHAR(500),
    language_detected VARCHAR(10),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    response_text TEXT,
    response_audio_url VARCHAR(500),
    intent_detected VARCHAR(100),
    entities_extracted JSONB,
    processing_time_ms INTEGER CHECK (processing_time_ms >= 0),
    llm_model_used VARCHAR(100),
    tokens_used INTEGER CHECK (tokens_used >= 0),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE voice_ai_sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    total_interactions INTEGER DEFAULT 0 CHECK (total_interactions >= 0),
    session_context JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_time IS NULL OR end_time >= start_time)
);

-- =====================================================
-- 6. GAMIFICATION SYSTEM
-- =====================================================
CREATE TABLE leaderboard (
    leaderboard_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    rank INTEGER CHECK (rank > 0),
    total_points INTEGER DEFAULT 0 CHECK (total_points >= 0),
    weekly_points INTEGER DEFAULT 0 CHECK (weekly_points >= 0),
    monthly_points INTEGER DEFAULT 0 CHECK (monthly_points >= 0),
    all_time_points INTEGER DEFAULT 0 CHECK (all_time_points >= 0),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE badges (
    badge_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    criteria TEXT,
    points_reward INTEGER DEFAULT 0 CHECK (points_reward >= 0),
    badge_type VARCHAR(50) CHECK (badge_type IN ('achievement', 'streak', 'special')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_badges (
    user_badge_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    badge_id INTEGER REFERENCES badges(badge_id) ON DELETE CASCADE NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context JSONB,
    UNIQUE(user_id, badge_id)
);

CREATE TABLE user_progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    level INTEGER DEFAULT 1 CHECK (level >= 1),
    experience_points INTEGER DEFAULT 0 CHECK (experience_points >= 0),
    points_to_next_level INTEGER DEFAULT 100 CHECK (points_to_next_level > 0),
    total_lessons_completed INTEGER DEFAULT 0 CHECK (total_lessons_completed >= 0),
    total_challenges_completed INTEGER DEFAULT 0 CHECK (total_challenges_completed >= 0),
    longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    last_activity_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- =====================================================
-- 7. COURSE & LEARNING
-- =====================================================
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    thumbnail_url VARCHAR(255),
    concept_id INTEGER REFERENCES programming_concepts(concept_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(course_id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    "order" INTEGER NOT NULL CHECK ("order" > 0),
    resources JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, "order")
);

CREATE TABLE user_courses (
    user_course_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE NOT NULL,
    course_id INTEGER REFERENCES courses(course_id) ON DELETE CASCADE NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
    last_accessed TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- =====================================================
-- 8. FEEDBACK
-- =====================================================
CREATE TABLE user_feedback (
    feedback_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    feedback_type VARCHAR(50) CHECK (feedback_type IN ('general', 'bug', 'feature', 'content')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    technical_details JSONB,
    user_agent TEXT,
    page_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 9. INDEXES
-- =====================================================
CREATE INDEX idx_programming_concepts_search ON programming_concepts USING GIN(search_index);
CREATE INDEX idx_programming_concepts_tags ON programming_concepts USING GIN(tags);

-- =====================================================
-- 11. TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programming_concepts_updated_at BEFORE UPDATE ON programming_concepts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON challenges
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_challenge_assignments_updated_at BEFORE UPDATE ON daily_challenge_assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_courses_updated_at BEFORE UPDATE ON user_courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
