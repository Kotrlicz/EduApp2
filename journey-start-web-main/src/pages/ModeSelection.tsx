import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const ModeSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-xl">
          <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">What would you like to do?</h2>
          <div className="grid gap-6 md:gap-8">
            <div className="bg-card rounded-lg shadow p-4 md:p-6 flex flex-col items-center">
              <div className="font-bold text-lg mb-2">Courses</div>
              <div className="mb-4 text-muted-foreground text-center text-sm md:text-base">Follow structured lessons and track your progress through English grammar fundamentals.</div>
              <Button onClick={() => navigate("/learn")}
                className="hero-button w-full sm:w-auto"
              >Go to Courses</Button>
            </div>
            <div className="bg-card rounded-lg shadow p-4 md:p-6 flex flex-col items-center">
              <div className="font-bold text-lg mb-2">Games</div>
              <div className="mb-4 text-muted-foreground text-center text-sm md:text-base">Play fun language games to practice and reinforce your skills.</div>
              <div className="space-y-2 w-full">
                <Button onClick={() => navigate("/racing-game")}
                  className="hero-button w-full"
                >Racing Game</Button>
                <Button onClick={() => navigate("/grammar-runner")}
                  className="hero-button w-full"
                >Grammar Runner</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModeSelection; 