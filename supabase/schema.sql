-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table with enhanced fields for authentication and gamification
create table public.users (
  user_id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  email text unique not null,
  password_hash text,
  registration_date timestamptz default now(),
  last_login timestamptz,
  points integer default 0,
  streak integer default 0,
  level integer default 1,
  experience_points integer default 0,
  badges text[] default array[]::text[],
  profile_picture text,
  preferred_language text default 'en-US',
  social_providers jsonb default '{}'::jsonb,
  is_email_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Courses table
create table public.courses (
  course_id serial primary key,
  title text not null,
  description text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  thumbnail_url text,
  category text,
  duration_hours integer,
  prerequisites text[],
  learning_objectives text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lessons table
create table public.lessons (
  lesson_id serial primary key,
  course_id integer references courses(course_id) on delete cascade,
  title text not null,
  content text,
  video_url text,
  order_index integer not null,
  duration_minutes integer,
  resources jsonb default '{}'::jsonb,
  quiz_questions jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User course enrollments and progress
create table public.user_courses (
  user_course_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  course_id integer references courses(course_id) on delete cascade,
  enrollment_date timestamptz default now(),
  progress integer default 0 check (progress >= 0 and progress <= 100),
  last_accessed timestamptz,
  completion_date timestamptz,
  certificate_earned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, course_id)
);

-- User lesson progress
create table public.user_lesson_progress (
  user_lesson_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  lesson_id integer references lessons(lesson_id) on delete cascade,
  is_completed boolean default false,
  time_spent integer default 0, -- in minutes
  completion_date timestamptz,
  quiz_score integer,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- Challenges/Coding Exercises
create table public.challenges (
  challenge_id serial primary key,
  title text not null,
  description text,
  problem_statement text not null,
  solution_template text,
  test_cases jsonb not null,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')),
  points_reward integer default 10,
  category text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User challenge attempts
create table public.user_challenges (
  user_challenge_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  challenge_id integer references challenges(challenge_id) on delete cascade,
  solution text,
  is_completed boolean default false,
  completion_date timestamptz,
  execution_time integer, -- in milliseconds
  attempts_count integer default 1,
  points_earned integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Badges system
create table public.badges (
  badge_id serial primary key,
  name text unique not null,
  description text,
  icon_url text,
  criteria jsonb not null, -- JSON defining the criteria for earning this badge
  rarity text check (rarity in ('common', 'rare', 'epic', 'legendary')),
  points_value integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User badges (many-to-many)
create table public.user_badges (
  user_badge_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  badge_id integer references badges(badge_id) on delete cascade,
  earned_date timestamptz default now(),
  unique(user_id, badge_id)
);

-- Leaderboard (materialized view will be created later)
create table public.leaderboard (
  leaderboard_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  rank integer,
  total_points integer,
  weekly_points integer,
  monthly_points integer,
  last_updated timestamptz default now(),
  unique(user_id)
);

-- Voice interactions logging
create table public.voice_interactions (
  interaction_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  voice_command text not null,
  response text,
  intent text,
  confidence_score real,
  language text default 'en-US',
  timestamp timestamptz default now()
);

-- LLM queries and responses
create table public.llm_queries (
  query_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  query_text text not null,
  response_text text,
  source_documents jsonb default '[]'::jsonb,
  llm_model text,
  response_time integer, -- in milliseconds
  tokens_used integer,
  language text default 'en-US',
  is_local_model boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Learning paths
create table public.learning_paths (
  path_id serial primary key,
  title text not null,
  description text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  estimated_hours integer,
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Course paths (many-to-many between learning_paths and courses)
create table public.course_paths (
  course_path_id serial primary key,
  path_id integer references learning_paths(path_id) on delete cascade,
  course_id integer references courses(course_id) on delete cascade,
  order_in_path integer not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(path_id, course_id)
);

-- User study sessions
create table public.study_sessions (
  session_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  session_type text not null, -- 'lesson', 'challenge', 'free_study'
  topic text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration integer, -- in minutes
  breaks_taken integer default 0,
  goals_set text[],
  goals_achieved text[],
  notes text
);

-- User notes
create table public.user_notes (
  note_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  title text not null,
  content text not null,
  topic text,
  tags text[],
  is_favorite boolean default false,
  lesson_id integer references lessons(lesson_id) on delete set null,
  challenge_id integer references challenges(challenge_id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Study materials
create table public.study_materials (
  material_id serial primary key,
  title text not null,
  description text,
  file_url text,
  file_type text,
  category text,
  topic text,
  difficulty text check (difficulty in ('beginner', 'intermediate', 'advanced')),
  size_mb real,
  download_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- User material downloads
create table public.user_material_downloads (
  download_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  material_id integer references study_materials(material_id) on delete cascade,
  downloaded_at timestamptz default now()
);

-- Password reset tokens
create table public.password_reset_tokens (
  token_id serial primary key,
  user_id uuid references users(user_id) on delete cascade,
  token text unique not null,
  expires_at timestamptz not null,
  used boolean default false,
  created_at timestamptz default now()
);

-- Create indexes for better performance
create index idx_users_email on users(email);
create index idx_users_username on users(username);
create index idx_user_courses_user_id on user_courses(user_id);
create index idx_user_courses_course_id on user_courses(course_id);
create index idx_user_lesson_progress_user_id on user_lesson_progress(user_id);
create index idx_user_challenges_user_id on user_challenges(user_id);
create index idx_voice_interactions_user_id on voice_interactions(user_id);
create index idx_llm_queries_user_id on llm_queries(user_id);
create index idx_study_sessions_user_id on study_sessions(user_id);
create index idx_user_notes_user_id on user_notes(user_id);

-- Enable Row Level Security (RLS)
alter table users enable row level security;
alter table user_courses enable row level security;
alter table user_lesson_progress enable row level security;
alter table user_challenges enable row level security;
alter table voice_interactions enable row level security;
alter table llm_queries enable row level security;
alter table study_sessions enable row level security;
alter table user_notes enable row level security;
alter table user_material_downloads enable row level security;

-- RLS Policies
create policy "Users can view own profile" on users for select using (auth.uid() = user_id);
create policy "Users can update own profile" on users for update using (auth.uid() = user_id);

create policy "Users can view own course enrollments" on user_courses for select using (auth.uid() = user_id);
create policy "Users can manage own course enrollments" on user_courses for all using (auth.uid() = user_id);

create policy "Users can view own lesson progress" on user_lesson_progress for select using (auth.uid() = user_id);
create policy "Users can manage own lesson progress" on user_lesson_progress for all using (auth.uid() = user_id);

create policy "Users can view own challenges" on user_challenges for select using (auth.uid() = user_id);
create policy "Users can manage own challenges" on user_challenges for all using (auth.uid() = user_id);

create policy "Users can view own voice interactions" on voice_interactions for select using (auth.uid() = user_id);
create policy "Users can create own voice interactions" on voice_interactions for insert with check (auth.uid() = user_id);

create policy "Users can view own LLM queries" on llm_queries for select using (auth.uid() = user_id);
create policy "Users can create own LLM queries" on llm_queries for insert with check (auth.uid() = user_id);

create policy "Users can view own study sessions" on study_sessions for select using (auth.uid() = user_id);
create policy "Users can manage own study sessions" on study_sessions for all using (auth.uid() = user_id);

create policy "Users can view own notes" on user_notes for select using (auth.uid() = user_id);
create policy "Users can manage own notes" on user_notes for all using (auth.uid() = user_id);

create policy "Users can view own downloads" on user_material_downloads for select using (auth.uid() = user_id);
create policy "Users can create own downloads" on user_material_downloads for insert with check (auth.uid() = user_id);

-- Functions for updating updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Add triggers for updated_at
create trigger update_users_updated_at before update on users for each row execute procedure update_updated_at_column();
create trigger update_courses_updated_at before update on courses for each row execute procedure update_updated_at_column();
create trigger update_lessons_updated_at before update on lessons for each row execute procedure update_updated_at_column();
create trigger update_user_courses_updated_at before update on user_courses for each row execute procedure update_updated_at_column();
create trigger update_user_lesson_progress_updated_at before update on user_lesson_progress for each row execute procedure update_updated_at_column();
create trigger update_challenges_updated_at before update on challenges for each row execute procedure update_updated_at_column();
create trigger update_user_challenges_updated_at before update on user_challenges for each row execute procedure update_updated_at_column();
create trigger update_badges_updated_at before update on badges for each row execute procedure update_updated_at_column();
create trigger update_learning_paths_updated_at before update on learning_paths for each row execute procedure update_updated_at_column();
create trigger update_course_paths_updated_at before update on course_paths for each row execute procedure update_updated_at_column();
create trigger update_study_materials_updated_at before update on study_materials for each row execute procedure update_updated_at_column();
create trigger update_user_notes_updated_at before update on user_notes for each row execute procedure update_updated_at_column();
create trigger update_llm_queries_updated_at before update on llm_queries for each row execute procedure update_updated_at_column();
