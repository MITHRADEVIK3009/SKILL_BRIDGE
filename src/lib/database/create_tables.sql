
-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    points INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    badges JSONB DEFAULT '[]'::JSONB,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50),
    thumbnail_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons Table
CREATE TABLE lessons (
    lesson_id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(course_id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    "order" INTEGER NOT NULL,
    resources JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, "order")
);

-- UserCourses Table
CREATE TABLE user_courses (
    user_course_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    course_id INTEGER REFERENCES courses(course_id) NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress FLOAT DEFAULT 0,
    last_accessed TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Challenges Table
CREATE TABLE challenges (
    challenge_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    problem_statement TEXT,
    solution_template TEXT,
    difficulty VARCHAR(50),
    points_reward INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UserChallenges Table
CREATE TABLE user_challenges (
    user_challenge_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    challenge_id INTEGER REFERENCES challenges(challenge_id) NOT NULL,
    completion_date TIMESTAMP,
    solution TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, challenge_id)
);

-- Leaderboard Table
CREATE TABLE leaderboard (
    leaderboard_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) NOT NULL,
    rank INTEGER,
    total_points INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Badges Table
CREATE TABLE badges (
    badge_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VoiceInteractions Table
CREATE TABLE voice_interactions (
    interaction_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    voice_command TEXT,
    response TEXT,
    intent VARCHAR(255)
);

-- LLMQueries Table
CREATE TABLE llm_queries (
    query_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    query_text TEXT,
    response_text TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    source_documents JSONB,
    llm_model VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LearningPaths Table
CREATE TABLE learning_paths (
    path_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CoursePaths Table
CREATE TABLE course_paths (
    course_path_id SERIAL PRIMARY KEY,
    path_id INTEGER REFERENCES learning_paths(path_id) NOT NULL,
    course_id INTEGER REFERENCES courses(course_id) NOT NULL,
    order_in_path INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(path_id, course_id)
);

-- Add Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_paths ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies
-- Example: Allow users to see only their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = user_id);

-- Example: Allow users to see all courses
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT USING (true);

-- More policies would be needed based on your specific access requirements
