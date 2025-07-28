import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const quizTypes = [
  {
    label: "Poznej slovní druhy",
    value: "highlight-correct-words",
    description: "Označ správné slovní druhy v každé větě.",
    route: "/course/grammar-fundamentals/parts-of-speech/highlight-quiz"
  }
];

const ChooseQuizType = () => {
  const navigate = useNavigate();

  const handleChoose = (type: string) => {
    const quiz = quizTypes.find(q => q.value === type);
    if (quiz && quiz.route) {
      navigate(quiz.route);
    } else {
      // For now, just navigate to a placeholder route for the selected quiz type
      navigate(`/course/grammar-fundamentals/parts-of-speech/quiz/${type}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">Vyberte typ kvízu</h2>
          <div className="grid gap-4 md:gap-6">
            {quizTypes.map((quiz) => (
              <div key={quiz.value} className="bg-card rounded-lg shadow p-4 md:p-6 flex flex-col items-start">
                <div className="font-bold text-lg mb-2">{quiz.label}</div>
                <div className="mb-4 text-muted-foreground text-sm md:text-base">{quiz.description}</div>
                <Button onClick={() => handleChoose(quiz.value)} className="w-full">
                  Spustit
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChooseQuizType; 