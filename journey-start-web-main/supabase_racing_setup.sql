-- Racing Game Database Setup
-- Run these commands in your Supabase SQL Editor

-- 1. Create racing_game_questions table
CREATE TABLE IF NOT EXISTS racing_game_questions (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  options TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Create racing_game_progress table
CREATE TABLE IF NOT EXISTS racing_game_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  best_time DECIMAL,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create racing_game_results table
CREATE TABLE IF NOT EXISTS racing_game_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  game_time DECIMAL NOT NULL,
  won BOOLEAN NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP DEFAULT NOW()
);

-- 4. Insert sample questions
INSERT INTO racing_game_questions (word, correct_answer, options) VALUES
  ('run', 'verb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('happy', 'adjective', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('quickly', 'adverb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('book', 'noun', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('jump', 'verb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('beautiful', 'adjective', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('slowly', 'adverb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('house', 'noun', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('sing', 'verb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('bright', 'adjective', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('loudly', 'adverb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('tree', 'noun', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('dance', 'verb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('soft', 'adjective', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('quietly', 'adverb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('car', 'noun', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('write', 'verb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('tall', 'adjective', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('carefully', 'adverb', ARRAY['noun', 'verb', 'adjective', 'adverb']),
  ('phone', 'noun', ARRAY['noun', 'verb', 'adjective', 'adverb']);

-- 5. Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE racing_game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE racing_game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE racing_game_results ENABLE ROW LEVEL SECURITY;

-- Questions: Everyone can read
CREATE POLICY "Questions are viewable by everyone" ON racing_game_questions
  FOR SELECT USING (true);

-- Progress: Users can only see their own progress
CREATE POLICY "Users can view own progress" ON racing_game_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON racing_game_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON racing_game_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Results: Users can only see their own results
CREATE POLICY "Users can view own results" ON racing_game_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON racing_game_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. Add unique constraint for upsert operations
ALTER TABLE racing_game_progress ADD CONSTRAINT racing_game_progress_user_id_unique UNIQUE (user_id); 