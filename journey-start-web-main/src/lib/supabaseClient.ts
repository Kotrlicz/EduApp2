import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zmcvquuxyltrnjjnhish.supabase.co'; // your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptY3ZxdXV4eWx0cm5qam5oaXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzEzNjYsImV4cCI6MjA2ODcwNzM2Nn0.MRUgqibPr4ciqAynMMb2-ErEvB7V2NVYwJOlfMM0F7c'; // your anon public key

export const supabase = createClient(supabaseUrl, supabaseKey);