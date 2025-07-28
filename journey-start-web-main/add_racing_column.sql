-- Add racing game completion column to quiz_progress table
-- Run this in your Supabase SQL Editor

ALTER TABLE quiz_progress 
ADD COLUMN IF NOT EXISTS racing_game_completed BOOLEAN DEFAULT FALSE; 