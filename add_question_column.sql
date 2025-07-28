-- Add question column to the table (if it doesn't exist)
ALTER TABLE grammar_runner_parts_of_speech_questions 
ADD COLUMN IF NOT EXISTS question text;

-- Update existing data with the question words for ALL rows
UPDATE grammar_runner_parts_of_speech_questions 
SET question = CASE 
    WHEN id = 1 THEN 'run'
    WHEN id = 2 THEN 'happy'
    WHEN id = 3 THEN 'quickly'
    WHEN id = 4 THEN 'book'
    WHEN id = 5 THEN 'jump'
    WHEN id = 6 THEN 'beautiful'
    WHEN id = 7 THEN 'slowly'
    WHEN id = 8 THEN 'house'
    WHEN id = 9 THEN 'write'
    WHEN id = 10 THEN 'smart'
    WHEN id = 11 THEN 'carefully'
    WHEN id = 12 THEN 'car'
    WHEN id = 13 THEN 'sing'
    WHEN id = 14 THEN 'tall'
    WHEN id = 15 THEN 'loudly'
    WHEN id = 16 THEN 'fast'
    WHEN id = 17 THEN 'big'
    WHEN id = 18 THEN 'quietly'
    WHEN id = 19 THEN 'tree'
    WHEN id = 20 THEN 'dance'
    WHEN id = 21 THEN 'clever'
    WHEN id = 22 THEN 'gently'
    WHEN id = 23 THEN 'bike'
    WHEN id = 24 THEN 'laugh'
    WHEN id = 25 THEN 'small'
    WHEN id = 26 THEN 'softly'
    WHEN id = 27 THEN 'table'
    WHEN id = 28 THEN 'swim'
    WHEN id = 29 THEN 'brave'
    WHEN id = 30 THEN 'easily'
    WHEN id = 31 THEN 'phone'
    WHEN id = 32 THEN 'read'
    WHEN id = 33 THEN 'kind'
    WHEN id = 34 THEN 'hard'
    WHEN id = 35 THEN 'door'
    WHEN id = 36 THEN 'walk'
    WHEN id = 37 THEN 'strong'
    WHEN id = 38 THEN 'well'
    WHEN id = 39 THEN 'window'
    WHEN id = 40 THEN 'talk'
    WHEN id = 41 THEN 'wise'
    WHEN id = 42 THEN 'badly'
    WHEN id = 43 THEN 'chair'
    WHEN id = 44 THEN 'sleep'
    WHEN id = 45 THEN 'young'
    WHEN id = 46 THEN 'early'
    WHEN id = 47 THEN 'computer'
    WHEN id = 48 THEN 'eat'
    WHEN id = 49 THEN 'old'
    WHEN id = 50 THEN 'late'
    ELSE 'word' -- fallback for any other rows
END;

-- Now make the question column NOT NULL after all rows are updated
ALTER TABLE grammar_runner_parts_of_speech_questions 
ALTER COLUMN question SET NOT NULL; 