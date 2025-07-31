import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft, BookOpen, Layers, Clock, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { supabase } from "../lib/supabaseClient";

const skills = [
  {
    title: "Parts of Speech",
    description: "Learn about nouns, verbs, adjectives, adverbs, and more—the building blocks of English sentences.",
    icon: BookOpen,
    emoji: "🔤"
  },
  {
    title: "Articles and Determiners",
    description: "Master the use of a, an, the and other determiners to make your sentences precise and grammatically correct.",
    icon: BookOpen,
    emoji: "🧩"
  },
  {
    title: "Subject–Verb Agreement",
    description: "Learn how to make subjects and verbs agree in number and person.",
    icon: BookOpen,
    emoji: "📏"
  },
  {
    title: "Question Formation",
    description: "Understand how to form yes/no questions and WH-questions in English.",
    icon: BookOpen,
    emoji: "⛓️"
  },
  {
    title: "Negatives",
    description: "Learn how to correctly form negative sentences using not, never, no one, etc.",
    icon: BookOpen,
    emoji: "➕"
  },
  {
    title: "Countable and Uncountable Nouns",
    description: "Discover how to handle nouns that can or cannot be counted and how to use quantifiers correctly.",
    icon: BookOpen,
    emoji: "📚"
  }
];

const GrammarFundamentals = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProgress(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("quiz_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();
      setProgress(data || null);
      setLoading(false);
    };
    fetchProgress();
  }, []);

  const isLevelIIUnlocked = !loading && progress && progress.completed === true && progress.racing_game_completed === true && progress.grammar_runner_parts_of_speech_completed === true;

  const handleSkillClick = (skillTitle: string) => {
    switch (skillTitle) {
      case "Parts of Speech":
        navigate("/course/grammar-fundamentals/parts-of-speech");
        break;
      case "Articles and Determiners":
        navigate("/course/grammar-fundamentals/articles-and-determiners");
        break;
      default:
        // Coming soon for other skills
        break;
    }
  };

  const isSkillEnabled = (skillTitle: string) => {
    return skillTitle === "Parts of Speech" || skillTitle === "Articles and Determiners";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/10 py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              English Grammar <span className="text-gradient">Fundamentals</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
              Welcome to the English Grammar Fundamentals course! This page will soon contain lessons, exercises, and resources to help you master essential grammar rules and sentence structure.
            </p>
          </div>
          {/* Level I Fundamentals */}
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-left">Level I</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-8 md:mb-12">
            {skills.map((skill, idx) => (
              <Card key={skill.title} className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group relative">
                <CardHeader className="pb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {skill.emoji}
                  </div>
                  <CardTitle className="text-lg leading-tight flex items-center gap-2">
                    {skill.title}
                    {/* Show green tick if Parts of Speech is fully completed */}
                    {skill.title === "Parts of Speech" && progress && progress.completed && progress.racing_game_completed && progress.grammar_runner_parts_of_speech_completed && !loading && (
                      <CheckCircle2 className="text-green-600 w-6 h-6" />
                    )}
                    {/* Show green tick if Articles and Determiners is completed */}
                    {skill.title === "Articles and Determiners" && progress && progress.grammar_runner_articles_completed && !loading && (
                      <CheckCircle2 className="text-green-600 w-6 h-6" />
                    )}
                  </CardTitle>
                  <CardDescription className="text-sm">{skill.description}</CardDescription>
                  {/* Show progress for Parts of Speech */}
                  {skill.title === "Parts of Speech" && progress && !loading && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${progress.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Quiz completed (10 correct in a row)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${progress.racing_game_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Racing game completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${progress.grammar_runner_parts_of_speech_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Grammar Runner completed</span>
                      </div>
                    </div>
                  )}
                  {/* Show progress for Articles and Determiners */}
                  {skill.title === "Articles and Determiners" && progress && !loading && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded-full ${progress.grammar_runner_articles_completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span>Grammar Runner completed</span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className="w-full mt-4 hero-button"
                    onClick={() => handleSkillClick(skill.title)}
                    disabled={!isSkillEnabled(skill.title)}
                  >
                    <span>{isSkillEnabled(skill.title) ? "Start Lesson" : "Coming Soon"}</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Level II Placeholders */}
          {!isLevelIIUnlocked && (
            <div className="flex items-center gap-2 text-red-600 font-semibold mb-4 text-sm md:text-base">
              <Lock className="w-4 h-4 md:w-5 md:h-5" />
              Complete all Level I courses to unlock Level II.
            </div>
          )}
          <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-left mt-8 md:mt-12">Level II</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[...Array(6)].map((_, idx) => (
              <Card key={idx} className={!isLevelIIUnlocked ? "opacity-60" : ""}>
                <CardHeader className="pb-4 flex items-center gap-2">
                  <CardTitle className="text-lg leading-tight flex items-center gap-2">
                    Level II Course {idx + 1}
                    {!isLevelIIUnlocked && <Lock className="w-5 h-5 text-red-500" />}
                  </CardTitle>
                  <CardDescription className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque euismod, nisi vel consectetur euismod, nisl nisi consectetur nisi, euismod euismod nisi nisi euismod.</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full mt-4 hero-button" disabled={!isLevelIIUnlocked}>
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GrammarFundamentals; 