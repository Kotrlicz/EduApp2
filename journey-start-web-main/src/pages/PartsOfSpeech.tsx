import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatAI from "@/components/ChatAI";
import Modal from "@/components/ui/Modal";
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

const partsOfSpeech = [
  {
    emoji: "🐶", // Nouns – dog icon
    title: "Nouns – podstatná jména",
    description: "Označují osoby, místa, věci nebo pojmy.",
    extra: "Mohou být konkrétní (cat) nebo abstraktní (freedom).",
    examples: "dog, London, happiness, car"
  },
  {
    emoji: "🗣️",
    title: "Pronouns – zájmena",
    description: "Nahrazují podstatná jména, aby se neopakovala.",
    extra: "Osobní, přivlastňovací, ukazovací, tázací, vztažná...",
    examples: "I, he, she, it, we, they, this, who, mine"
  },
  {
    emoji: "🏃", // Verbs – person running icon
    title: "Verbs – slovesa",
    description: "Vyjadřují děj, stav nebo existenci.",
    examples: "run, be, have, do, sleep, think"
  },
  {
    emoji: "🎨",
    title: "Adjectives – přídavná jména",
    description: "Popisují nebo upřesňují podstatná jména.",
    examples: "beautiful, fast, blue, tall"
  },
  {
    emoji: "⏰", // Adverbs – clock icon
    title: "Adverbs – příslovce",
    description: "Popisují slovesa, přídavná jména nebo jiná příslovce.",
    extra: "Říkají jak, kdy, kde, proč, jak často.",
    examples: "quickly, very, often, here, soon"
  },
  {
    emoji: "⬆️", // Prepositions – arrow up icon
    title: "Prepositions – předložky",
    description: "Vyjadřují vztah mezi slovy (čas, místo, směr).",
    examples: "in, on, under, with, about, before, between"
  },
  {
    emoji: "⚙️",
    title: "Conjunctions – spojky",
    description: "Spojují slova, věty nebo části vět.",
    examples: "and, but, or, because, although, while"
  },
  {
    emoji: "💬",
    title: "Interjections – citoslovce",
    description: "Vyjadřují emoce nebo zvuky. Často stojí samostatně.",
    examples: "wow!, oh!, ouch!, hey!, huh?"
  },
];

// Remove the hardcoded practiceData array

const PartsOfSpeech = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = intro cards, 1 = practice, 2 = next steps/quiz
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Practice state
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [selectedWords, setSelectedWords] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [correctInARow, setCorrectInARow] = useState(0);

  // Supabase state
  const [practiceData, setPracticeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz progress state
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
      setPracticeData(shuffleArray(mapped)); // Shuffle here!
      setPracticeIdx(0); // Reset index on new fetch
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

  // Practice logic
  const currentPractice = practiceData[practiceIdx];
  const isPractice = step === 1;

  const handleWordClick = (idx: number) => {
    if (feedback) return; // Don't allow changes after feedback
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
      // Update Supabase progress
      const completed = newStreak >= 10;
      // Determine new best_streak
      const newBestStreak = progress && progress.best_streak ? Math.max(progress.best_streak, newStreak) : newStreak;
      const { data, error } = await supabase
        .from("quiz_progress")
        .upsert([
          {
            user_id: user.id,
            streak: newStreak,
            completed,
            best_streak: newBestStreak,
            updated_at: new Date().toISOString(),
          },
        ], { onConflict: "user_id" })
        .select()
        .single();
      setProgress(data || null);
    } else {
      setFeedback("Zkus to znovu. ❌");
      setCorrectInARow(0);
      // Reset Supabase progress but keep best_streak
      const { data, error } = await supabase
        .from("quiz_progress")
        .upsert([
          {
            user_id: user.id,
            streak: 0,
            completed: false,
            best_streak: progress && progress.best_streak ? progress.best_streak : 0,
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
        // Reshuffle and start over
        setPracticeData((prev) => shuffleArray(prev));
        return 0;
      }
      return idx + 1;
    });
  };

  if (step === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">8 Parts of Speech</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {partsOfSpeech.map((part, idx) => (
                <div key={idx} className="bg-card rounded-lg shadow p-6 flex flex-col items-start">
                  <div className="text-3xl mb-2">{part.emoji}</div>
                  <div className="font-bold mb-1">{part.title}</div>
                  <div className="mb-1 text-muted-foreground">{part.description}</div>
                  {part.extra && <div className="mb-1 text-xs text-accent">{part.extra}</div>}
                  <div className="text-sm"><b>Příklady:</b> {part.examples}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <button
                className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/90"
                onClick={() => navigate("/course/grammar-fundamentals/parts-of-speech/choose-quiz")}
              >
                Pokračovat
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (isPractice) {
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
            <h2 className="text-2xl font-bold mb-6 text-center">Procvičování: části řeči</h2>
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
            {correctInARow >= 10 && (
              <div className="mt-8 flex flex-col items-center">
                <div className="text-green-600 font-bold mb-2">Výborně! Můžeš pokračovat dál.</div>
                <button
                  className="bg-primary text-white px-6 py-2 rounded shadow hover:bg-primary/90"
                  onClick={() => navigate("/course/grammar-fundamentals/parts-of-speech/choose-quiz")}
                >
                  Pokračovat
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // ...keep the rest of your navigation/quiz logic for now...
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content (next steps/quiz) */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/10 py-16">
        <div className="container mx-auto px-6">
          {/* Placeholder for next steps or quiz */}
          <Modal open={showQuizModal} onClose={() => setShowQuizModal(false)}>
            {/* Traditional quiz will go here instead of ChatAI */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Kvíz: Podstatná jména</h2>
              {/* Quiz content will be implemented here */}
            </div>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default PartsOfSpeech; 