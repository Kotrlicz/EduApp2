import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Car, Gamepad2, Trophy } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const quizTypes = [
  {
    label: "Grammar Runner - Členy",
    value: "grammar-runner-articles",
    description: "Běhej a skákej přes překážky - odpovídej na otázky o členech a určovacích slovech.",
    route: "/grammar-runner/articles",
    icon: <Gamepad2 className="w-8 h-8" />,
    gradient: "from-purple-500 to-purple-600",
    completionKey: "grammar_runner_articles_completed"
  }
];

const ArticlesAndDeterminersQuizType = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user progress data
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: progressData } = await supabase
            .from('quiz_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          setProgress(progressData);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  const handleChoose = (type: string) => {
    const quiz = quizTypes.find(q => q.value === type);
    if (quiz && quiz.route) {
      navigate(quiz.route);
    } else {
      // For now, just navigate to a placeholder route for the selected quiz type
      navigate(`/course/grammar-fundamentals/articles-and-determiners/quiz/${type}`);
    }
  };

  const isQuizCompleted = (completionKey: string) => {
    if (!progress) return false;
    return progress[completionKey] === true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading quiz types...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Vyberte typ kvízu - Členy
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Zvolte si způsob, jakým se chcete učit o členech a určovacích slovech. Každý typ má jiný přístup k procvičování.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizTypes.map((quiz) => (
              <div 
                key={quiz.value} 
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group min-h-[250px] flex flex-col cursor-pointer border-2 border-opacity-50 rounded-lg ${
                  isQuizCompleted(quiz.completionKey) ? 'ring-2 ring-green-500' : 'border-gray-200'
                }`}
                onClick={() => handleChoose(quiz.value)}
              >
                {/* Completion Badge */}
                {isQuizCompleted(quiz.completionKey) && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      Dokončeno
                    </div>
                  </div>
                )}

                {/* Header with gradient */}
                <div className={`p-6 ${quiz.gradient} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-white/20">
                      {quiz.icon}
                    </div>
                  </div>
                </div>

                {/* Body content with dark text */}
                <div className="p-6 flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{quiz.label}</h3>
                  <p className="text-gray-600 text-sm">{quiz.description}</p>
                </div>

                {/* Action Button */}
                <div className="p-6 mt-auto h-16 flex items-center">
                  <Button 
                    className={`w-full bg-gradient-to-r ${quiz.gradient} text-white hover:opacity-90`}
                  >
                    Spustit
                  </Button>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${quiz.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ArticlesAndDeterminersQuizType;