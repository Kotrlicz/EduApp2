-- Add table for tracking presentation completion
CREATE TABLE IF NOT EXISTS presentation_completion (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    presentation_name VARCHAR(255) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, presentation_name)
);

-- Add RLS policies
ALTER TABLE presentation_completion ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own completion records
CREATE POLICY "Users can view their own presentation completion" ON presentation_completion
    FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own completion records
CREATE POLICY "Users can insert their own presentation completion" ON presentation_completion
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own completion records
CREATE POLICY "Users can update their own presentation completion" ON presentation_completion
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy to allow users to delete their own completion records
CREATE POLICY "Users can delete their own presentation completion" ON presentation_completion
    FOR DELETE USING (auth.uid() = user_id); 