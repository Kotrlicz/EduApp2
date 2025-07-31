-- Add parts_of_speech_course_completed column to quiz_progress table
-- Run this in your Supabase SQL Editor

ALTER TABLE quiz_progress 
ADD COLUMN IF NOT EXISTS parts_of_speech_course_completed BOOLEAN DEFAULT FALSE;