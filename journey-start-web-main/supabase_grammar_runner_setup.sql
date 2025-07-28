-- Grammar Runner Tables Setup

-- 1. Grammar Runner Questions Table
CREATE TABLE IF NOT EXISTS grammar_runner_questions (
  id SERIAL PRIMARY KEY,
  incorrect TEXT NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Grammar Runner Progress Table
CREATE TABLE IF NOT EXISTS grammar_runner_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_time DECIMAL(10,2),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Grammar Runner Results Table
CREATE TABLE IF NOT EXISTS grammar_runner_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_time DECIMAL(10,2) NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample questions
INSERT INTO grammar_runner_questions (incorrect, correct, explanation) VALUES
('I goed to school', 'I went to school', 'The past tense of "go" is "went", not "goed"'),
('She have a cat', 'She has a cat', 'Use "has" with he/she/it in present tense'),
('Its raining', 'It''s raining', 'Use "it''s" (it is) for contractions'),
('They was happy', 'They were happy', 'Use "were" with "they" in past tense'),
('I am going to the store yesterday', 'I went to the store yesterday', 'Use past tense for completed actions in the past'),
('He don''t like pizza', 'He doesn''t like pizza', 'Use "doesn''t" with he/she/it in negative present tense'),
('We was late', 'We were late', 'Use "were" with "we" in past tense'),
('The book is their', 'The book is theirs', 'Use "theirs" as a possessive pronoun'),
('I seen that movie', 'I saw that movie', 'The past tense of "see" is "saw", not "seen"'),
('She is more tall than me', 'She is taller than me', 'Use comparative form "taller" instead of "more tall"'),
('I have been to Paris last year', 'I went to Paris last year', 'Use simple past for completed actions with specific time'),
('The weather is good today, isn''t it?', 'The weather is good today, isn''t it?', 'This is correct - tag questions match the main verb'),
('I will going to the party', 'I will go to the party', 'Use base form after "will", not -ing form'),
('He have been working hard', 'He has been working hard', 'Use "has" with he/she/it in present perfect'),
('The children is playing', 'The children are playing', 'Use "are" with plural subjects'),
('I am study English', 'I am studying English', 'Use -ing form after "am" in present continuous'),
('She don''t know the answer', 'She doesn''t know the answer', 'Use "doesn''t" with he/she/it in negative present tense'),
('We was at the beach', 'We were at the beach', 'Use "were" with "we" in past tense'),
('The car is her', 'The car is hers', 'Use "hers" as a possessive pronoun'),
('I have ate dinner', 'I have eaten dinner', 'Use past participle "eaten" after "have" in present perfect');

-- Enable Row Level Security
ALTER TABLE grammar_runner_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Questions: Anyone can read (public)
CREATE POLICY "Questions are viewable by everyone" ON grammar_runner_questions
  FOR SELECT USING (true);

-- Progress: Users can only access their own data
CREATE POLICY "Users can view own progress" ON grammar_runner_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON grammar_runner_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON grammar_runner_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Results: Users can only access their own data
CREATE POLICY "Users can view own results" ON grammar_runner_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON grammar_runner_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add grammar_runner_completed column to quiz_progress table
ALTER TABLE quiz_progress
ADD COLUMN IF NOT EXISTS grammar_runner_completed BOOLEAN DEFAULT FALSE; 