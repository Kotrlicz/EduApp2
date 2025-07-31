import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { supabase } from "../lib/supabaseClient";

function shuffleArray(array: any[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const partOfSpeechLabels: Record<string, { en: string; cs: string }> = {
  noun: { en: 'nouns', cs: 'podstatná jména' },
  verb: { en: 'verbs', cs: 'slovesa' },
  adjective: { en: 'adjectives', cs: 'přídavná jména' },
  adverb: { en: 'adverbs', cs: 'příslovce' },
  pronoun: { en: 'pronouns', cs: 'zájmena' },
  preposition: { en: 'prepositions', cs: 'předložky' },
  conjunction: { en: 'conjunctions', cs: 'spojky' },
  interjection: { en: 'interjections', cs: 'citoslovce' },
};

const HighlightQuiz = () => {
  const [practiceData, setPracticeData] = useState<any[]>([]);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctInARow, setCorrectInARow] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabase progress state
  const [progress, setProgress] = useState<any>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  useEffect(() => {
    const fetchPracticeQuestions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('practice_questions')
        .select('*');
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      const mapped = (data || [])
        .filter((q: any) => q.sentence_text && q.correct_indices)
        .map((q: any) => {
          const label = partOfSpeechLabels[q.part_of_speech];
          return {
            instruction: label
              ? `Highlight all ${label.en} (${label.cs})`
              : 'Highlight the correct words',
            sentence: q.sentence_text.split(' '),
            correct: q.correct_indices,
          };
        });
      setPracticeData(shuffleArray(mapped));
      setPracticeIdx(0);
      setLoading(false);
    };
    fetchPracticeQuestions();
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      setProgressLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProgress(null);
        setProgressLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("quiz_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProgress(data || null);
      setProgressLoading(false);
    };
    fetchProgress();
  }, []);

  const currentPractice = practiceData[practiceIdx];

  const handleWordClick = (idx: number) => {
    if (feedback) return;
    setSelectedWords((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const checkPractice = async () => {
    const correct = currentPractice.correct.sort().join(",");
    const selected = selectedWords.sort().join(",");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setFeedback("Musíš být přihlášen pro ukládání postupu.");
      return;
    }
    if (correct === selected) {
      setFeedback("Správně! ✅");
      const newStreak = correctInARow + 1;
      setCorrectInARow(newStreak);
      const completed = newStreak >= 10;
      const newBestStreak = progress && progress.best_streak ? Math.max(progress.best_streak, newStreak) : newStreak;
      
      // Check if all three quiz types are completed
      const allQuizzesCompleted = completed && 
        progress?.racing_game_completed === true && 
        progress?.grammar_runner_parts_of_speech_completed === true;
      
      const { data, error } = await supabase
        .from("quiz_progress")
        .upsert([
          {
            user_id: user.id,
            streak: newStreak,
            completed,
            best_streak: newBestStreak,
            parts_of_speech_course_completed: allQuizzesCompleted, // New field for overall course completion
            updated_at: new Date().toISOString(),
          },
        ], { onConflict: "user_id" })
        .select()
        .single();
      setProgress(data || null);
    } else {
      setFeedback("Zkus to znovu. ❌");
      setCorrectInARow(0);
      const { data, error } = await supabase
        .from("quiz_progress")
        .upsert([
          {
            user_id: user.id,
            streak: 0,
            completed: false,
            best_streak: progress && progress.best_streak ? progress.best_streak : 0,
            parts_of_speech_course_completed: false, // Reset overall completion
            updated_at: new Date().toISOString(),
          },
        ], { onConflict: "user_id" })
        .select()
        .single();
      setProgress(data || null);
    }
  };

  const nextPractice = () => {
    setSelectedWords([]);
    setFeedback(null);
    setPracticeIdx((idx) => {
      if (practiceData.length === 0) return 0;
      if (idx + 1 >= practiceData.length) {
        setPracticeData((prev) => shuffleArray(prev));
        return 0;
      }
      return idx + 1;
    });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Header /><div>Loading practice questions...</div></div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><Header /><div>Error: {error}</div></div>;
  }
  if (!currentPractice) {
    return <div className="min-h-screen flex items-center justify-center"><Header /><div>No practice questions available.</div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-12">
        <div className="container mx-auto px-6 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Highlight the correct word(s)</h2>
          <div className="mb-4 text-lg text-center font-semibold">{currentPractice.instruction}</div>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {currentPractice.sentence.map((word: string, idx: number) => (
              <button
                key={idx}
                className={`px-3 py-2 rounded border text-base transition-all duration-150 ${selectedWords.includes(idx) ? "bg-primary text-white border-primary" : "bg-card border-border hover:bg-accent"} ${feedback && currentPractice.correct.includes(idx) ? "ring-2 ring-green-400" : ""}`}
                onClick={() => handleWordClick(idx)}
                disabled={!!feedback}
              >
                {word}
              </button>
            ))}
          </div>
          {feedback && (
            <div className={`mb-4 text-center font-semibold ${feedback.startsWith("Správně") ? "text-green-600" : "text-red-500"}`}>{feedback}</div>
          )}
          {!feedback && (
            <button
              className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/90"
              onClick={checkPractice}
              disabled={selectedWords.length === 0}
            >
              Zkontrolovat
            </button>
          )}
          {feedback && (
            <button
              className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/90"
              onClick={nextPractice}
            >
              Další věta
            </button>
          )}
          <div className="mt-6 text-center text-muted-foreground">
            Správných odpovědí v řadě: <b>{correctInARow}</b> / 10
          </div>
          {/* Show Supabase progress info */}
          <div className="mt-2 text-center text-muted-foreground">
            {progressLoading ? (
              <span>Načítání postupu...</span>
            ) : progress ? (
              <>
                <div>Uložený postup: <b>{progress.streak}</b> v řadě</div>
                <div>Nejlepší série: <b>{progress.best_streak}</b></div>
                <div>Status: {progress.completed ? <span className="text-green-600 font-bold">Dokončeno</span> : <span>Nedokončeno</span>}</div>
              </>
            ) : (
              <span>Žádný uložený postup</span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HighlightQuiz; 