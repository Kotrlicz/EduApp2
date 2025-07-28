-- Grammar Runner Courses Setup - Separate Tables for Each Course
-- This replaces the old single grammar_runner tables with course-specific ones

-- ========================================
-- CLEANUP: Drop old unused tables
-- ========================================

-- Drop old single grammar runner tables (if they exist)
DROP TABLE IF EXISTS grammar_runner_questions CASCADE;
DROP TABLE IF EXISTS grammar_runner_progress CASCADE;
DROP TABLE IF EXISTS grammar_runner_results CASCADE;

-- Remove old columns from quiz_progress (if they exist)
ALTER TABLE quiz_progress DROP COLUMN IF EXISTS grammar_runner_completed;

-- ========================================
-- PARTS OF SPEECH COURSE
-- ========================================

-- 1. Parts of Speech Questions
CREATE TABLE IF NOT EXISTS grammar_runner_parts_of_speech_questions (
  id SERIAL PRIMARY KEY,
  incorrect TEXT NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Parts of Speech Progress
CREATE TABLE IF NOT EXISTS grammar_runner_parts_of_speech_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_time DECIMAL(10,2),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Parts of Speech Results
CREATE TABLE IF NOT EXISTS grammar_runner_parts_of_speech_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_time DECIMAL(10,2) NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ARTICLES AND DETERMINERS COURSE
-- ========================================

-- 1. Articles Questions
CREATE TABLE IF NOT EXISTS grammar_runner_articles_questions (
  id SERIAL PRIMARY KEY,
  incorrect TEXT NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Articles Progress
CREATE TABLE IF NOT EXISTS grammar_runner_articles_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_time DECIMAL(10,2),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Articles Results
CREATE TABLE IF NOT EXISTS grammar_runner_articles_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_time DECIMAL(10,2) NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SUBJECT-VERB AGREEMENT COURSE
-- ========================================

-- 1. Subject-Verb Agreement Questions
CREATE TABLE IF NOT EXISTS grammar_runner_subject_verb_questions (
  id SERIAL PRIMARY KEY,
  incorrect TEXT NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Subject-Verb Agreement Progress
CREATE TABLE IF NOT EXISTS grammar_runner_subject_verb_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_time DECIMAL(10,2),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Subject-Verb Agreement Results
CREATE TABLE IF NOT EXISTS grammar_runner_subject_verb_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_time DECIMAL(10,2) NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- QUESTION FORMATION COURSE
-- ========================================

-- 1. Question Formation Questions
CREATE TABLE IF NOT EXISTS grammar_runner_questions_formation_questions (
  id SERIAL PRIMARY KEY,
  incorrect TEXT NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Question Formation Progress
CREATE TABLE IF NOT EXISTS grammar_runner_questions_formation_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_time DECIMAL(10,2),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Question Formation Results
CREATE TABLE IF NOT EXISTS grammar_runner_questions_formation_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_time DECIMAL(10,2) NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- NEGATIVES COURSE
-- ========================================

-- 1. Negatives Questions
CREATE TABLE IF NOT EXISTS grammar_runner_negatives_questions (
  id SERIAL PRIMARY KEY,
  incorrect TEXT NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Negatives Progress
CREATE TABLE IF NOT EXISTS grammar_runner_negatives_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_time DECIMAL(10,2),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Negatives Results
CREATE TABLE IF NOT EXISTS grammar_runner_negatives_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_time DECIMAL(10,2) NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- COUNTABLE/UNCOUNTABLE NOUNS COURSE
-- ========================================

-- 1. Countable/Uncountable Questions
CREATE TABLE IF NOT EXISTS grammar_runner_countable_questions (
  id SERIAL PRIMARY KEY,
  incorrect TEXT NOT NULL,
  correct TEXT NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Countable/Uncountable Progress
CREATE TABLE IF NOT EXISTS grammar_runner_countable_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  best_time DECIMAL(10,2),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Countable/Uncountable Results
CREATE TABLE IF NOT EXISTS grammar_runner_countable_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_time DECIMAL(10,2) NOT NULL,
  score INTEGER NOT NULL,
  questions_answered INTEGER NOT NULL,
  date_played TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- SAMPLE QUESTIONS FOR EACH COURSE
-- ========================================

-- Parts of Speech Sample Questions (existing ones)
INSERT INTO grammar_runner_parts_of_speech_questions (incorrect, correct, explanation) VALUES
('I goed to school', 'I went to school', 'The past tense of "go" is "went", not "goed"'),
('She have a cat', 'She has a cat', 'Use "has" with he/she/it in present tense'),
('Its raining', 'It''s raining', 'Use "it''s" (it is) for contractions'),
('They was happy', 'They were happy', 'Use "were" with "they" in past tense'),
('I am going to the store yesterday', 'I went to the store yesterday', 'Use past tense for completed actions in the past'),
('He don''t like pizza', 'He doesn''t like pizza', 'Use "doesn''t" with he/she/it in negative present tense'),
('We was late', 'We were late', 'Use "were" with "we" in past tense'),
('The book is their', 'The book is theirs', 'Use "theirs" as a possessive pronoun'),
('I seen that movie', 'I saw that movie', 'The past tense of "see" is "saw", not "seen"'),
('She is more tall than me', 'She is taller than me', 'Use comparative form "taller" instead of "more tall"');

-- Articles and Determiners Sample Questions
INSERT INTO grammar_runner_articles_questions (incorrect, correct, explanation) VALUES
('I saw elephant', 'I saw an elephant', 'Use "an" before words starting with vowel sounds'),
('She is teacher', 'She is a teacher', 'Use "a" before singular countable nouns'),
('I went to university', 'I went to the university', 'Use "the" when referring to a specific university'),
('I have apple', 'I have an apple', 'Use "an" before words starting with vowel sounds'),
('He is honest man', 'He is an honest man', 'Use "an" before "honest" (h is silent)'),
('I saw movie yesterday', 'I saw a movie yesterday', 'Use "a" before singular countable nouns'),
('She works in hospital', 'She works in the hospital', 'Use "the" when referring to a specific hospital'),
('I need umbrella', 'I need an umbrella', 'Use "an" before words starting with vowel sounds'),
('He is European', 'He is a European', 'Use "a" before "European" (y sound)'),
('I visited museum', 'I visited the museum', 'Use "the" when referring to a specific museum');

-- Subject-Verb Agreement Sample Questions
INSERT INTO grammar_runner_subject_verb_questions (incorrect, correct, explanation) VALUES
('The children is playing', 'The children are playing', 'Use "are" with plural subjects'),
('He have been working hard', 'He has been working hard', 'Use "has" with he/she/it in present perfect'),
('The weather are good', 'The weather is good', 'Use "is" with singular subjects'),
('My friends was at the party', 'My friends were at the party', 'Use "were" with plural subjects'),
('She don''t know the answer', 'She doesn''t know the answer', 'Use "doesn''t" with he/she/it'),
('The books is on the table', 'The books are on the table', 'Use "are" with plural subjects'),
('He were late for class', 'He was late for class', 'Use "was" with singular subjects'),
('The team are winning', 'The team is winning', 'Use "is" with collective nouns'),
('They has finished the work', 'They have finished the work', 'Use "have" with plural subjects'),
('The news are good', 'The news is good', 'Use "is" with uncountable nouns');

-- Question Formation Sample Questions
INSERT INTO grammar_runner_questions_formation_questions (incorrect, correct, explanation) VALUES
('You like pizza?', 'Do you like pizza?', 'Use "do" to form yes/no questions'),
('Where you went?', 'Where did you go?', 'Use "did" for past tense WH-questions'),
('What time you wake up?', 'What time do you wake up?', 'Use "do" for present tense WH-questions'),
('You are student?', 'Are you a student?', 'Invert subject and verb for "be" questions'),
('How long you been here?', 'How long have you been here?', 'Use "have" for present perfect questions'),
('You can swim?', 'Can you swim?', 'Invert subject and modal verb'),
('What you doing?', 'What are you doing?', 'Use "are" for present continuous questions'),
('You will come?', 'Will you come?', 'Invert subject and modal verb'),
('Where you live?', 'Where do you live?', 'Use "do" for present tense WH-questions'),
('You have finished?', 'Have you finished?', 'Invert subject and "have" for present perfect');

-- Negatives Sample Questions
INSERT INTO grammar_runner_negatives_questions (incorrect, correct, explanation) VALUES
('I not like coffee', 'I don''t like coffee', 'Use "don''t" for negative present tense'),
('She not went to school', 'She didn''t go to school', 'Use "didn''t" for negative past tense'),
('He not is working', 'He is not working', 'Use "is not" for negative present continuous'),
('They not have money', 'They don''t have money', 'Use "don''t" for negative present tense'),
('I not can swim', 'I cannot swim', 'Use "cannot" for negative modal'),
('She not will come', 'She will not come', 'Use "will not" for negative future'),
('We not are ready', 'We are not ready', 'Use "are not" for negative present tense'),
('He not has been here', 'He has not been here', 'Use "has not" for negative present perfect'),
('They not do homework', 'They don''t do homework', 'Use "don''t" for negative present tense'),
('I not am tired', 'I am not tired', 'Use "am not" for negative present tense');

-- Countable/Uncountable Nouns Sample Questions
INSERT INTO grammar_runner_countable_questions (incorrect, correct, explanation) VALUES
('I need advices', 'I need advice', 'Advice is uncountable - no plural form'),
('She has many informations', 'She has much information', 'Information is uncountable - use "much"'),
('I bought two breads', 'I bought two loaves of bread', 'Bread is uncountable - use "loaves of bread"'),
('He has few money', 'He has little money', 'Money is uncountable - use "little"'),
('I need some advices', 'I need some advice', 'Advice is uncountable - no plural'),
('She has many furnitures', 'She has much furniture', 'Furniture is uncountable - use "much"'),
('I bought three milks', 'I bought three bottles of milk', 'Milk is uncountable - use "bottles of milk"'),
('He has few knowledge', 'He has little knowledge', 'Knowledge is uncountable - use "little"'),
('I need some equipments', 'I need some equipment', 'Equipment is uncountable - no plural'),
('She has many luggages', 'She has much luggage', 'Luggage is uncountable - use "much"');

-- ========================================
-- ENABLE ROW LEVEL SECURITY
-- ========================================

-- Enable RLS on all tables
ALTER TABLE grammar_runner_parts_of_speech_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_parts_of_speech_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_parts_of_speech_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE grammar_runner_articles_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_articles_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_articles_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE grammar_runner_subject_verb_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_subject_verb_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_subject_verb_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE grammar_runner_questions_formation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_questions_formation_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_questions_formation_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE grammar_runner_negatives_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_negatives_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_negatives_results ENABLE ROW LEVEL SECURITY;

ALTER TABLE grammar_runner_countable_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_countable_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_runner_countable_results ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS POLICIES
-- ========================================

-- Questions: Anyone can read (public)
CREATE POLICY "Parts of Speech questions are viewable by everyone" ON grammar_runner_parts_of_speech_questions FOR SELECT USING (true);
CREATE POLICY "Articles questions are viewable by everyone" ON grammar_runner_articles_questions FOR SELECT USING (true);
CREATE POLICY "Subject-Verb questions are viewable by everyone" ON grammar_runner_subject_verb_questions FOR SELECT USING (true);
CREATE POLICY "Question Formation questions are viewable by everyone" ON grammar_runner_questions_formation_questions FOR SELECT USING (true);
CREATE POLICY "Negatives questions are viewable by everyone" ON grammar_runner_negatives_questions FOR SELECT USING (true);
CREATE POLICY "Countable questions are viewable by everyone" ON grammar_runner_countable_questions FOR SELECT USING (true);

-- Progress: Users can only access their own data
CREATE POLICY "Users can view own parts of speech progress" ON grammar_runner_parts_of_speech_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own parts of speech progress" ON grammar_runner_parts_of_speech_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own parts of speech progress" ON grammar_runner_parts_of_speech_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own articles progress" ON grammar_runner_articles_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own articles progress" ON grammar_runner_articles_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own articles progress" ON grammar_runner_articles_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subject-verb progress" ON grammar_runner_subject_verb_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subject-verb progress" ON grammar_runner_subject_verb_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subject-verb progress" ON grammar_runner_subject_verb_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own question formation progress" ON grammar_runner_questions_formation_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own question formation progress" ON grammar_runner_questions_formation_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own question formation progress" ON grammar_runner_questions_formation_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own negatives progress" ON grammar_runner_negatives_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own negatives progress" ON grammar_runner_negatives_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own negatives progress" ON grammar_runner_negatives_progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own countable progress" ON grammar_runner_countable_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own countable progress" ON grammar_runner_countable_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own countable progress" ON grammar_runner_countable_progress FOR UPDATE USING (auth.uid() = user_id);

-- Results: Users can only access their own data
CREATE POLICY "Users can view own parts of speech results" ON grammar_runner_parts_of_speech_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own parts of speech results" ON grammar_runner_parts_of_speech_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own articles results" ON grammar_runner_articles_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own articles results" ON grammar_runner_articles_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own subject-verb results" ON grammar_runner_subject_verb_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subject-verb results" ON grammar_runner_subject_verb_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own question formation results" ON grammar_runner_questions_formation_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own question formation results" ON grammar_runner_questions_formation_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own negatives results" ON grammar_runner_negatives_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own negatives results" ON grammar_runner_negatives_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own countable results" ON grammar_runner_countable_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own countable results" ON grammar_runner_countable_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- UPDATE QUIZ_PROGRESS TABLE
-- ========================================

-- Add completion columns for each course
ALTER TABLE quiz_progress
ADD COLUMN IF NOT EXISTS grammar_runner_parts_of_speech_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS grammar_runner_articles_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS grammar_runner_subject_verb_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS grammar_runner_questions_formation_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS grammar_runner_negatives_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS grammar_runner_countable_completed BOOLEAN DEFAULT FALSE; 