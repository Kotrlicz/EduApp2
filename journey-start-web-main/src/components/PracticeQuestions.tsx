import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Define the type for a practice question
interface PracticeQuestion {
  id: number;
  created_at: string;
  part_of_speech: string;
  sentence_text: string;
  correct_indices: number[];
}

const PracticeQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('practice_questions')
        .select('*');
      if (error) {
        setError(error.message);
      } else if (data) {
        setQuestions(data as PracticeQuestion[]);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  if (loading) return <div>Loading practice questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Practice Questions</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.id} style={{ marginBottom: '1em' }}>
            <strong>Part of Speech:</strong> {q.part_of_speech} <br />
            <strong>Sentence:</strong> {q.sentence_text} <br />
            <strong>Correct Indices:</strong> {q.correct_indices.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PracticeQuestions; 