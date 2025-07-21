import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft, BookOpen, Layers, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const skills = [
  {
    title: "Parts of Speech",
    description: "Learn about nouns, verbs, adjectives, adverbs, and more—the building blocks of English sentences.",
    icon: BookOpen,
    emoji: "🔤"
  },
  {
    title: "Sentence Structure",
    description: "Understand how to form clear and correct sentences, including word order and subject-verb agreement.",
    icon: Layers,
    emoji: "📝"
  },
  {
    title: "Tenses and Verb Forms",
    description: "Master present, past, and future tenses, as well as regular and irregular verb forms.",
    icon: Clock,
    emoji: "⏳"
  }
];

const GrammarFundamentals = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gradient">EnglishMaster</h1>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                My Lessons
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Speaking Practice
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Progress
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Profile
              </a>
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/10 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              English Grammar <span className="text-gradient">Fundamentals</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Welcome to the English Grammar Fundamentals course! This page will soon contain lessons, exercises, and resources to help you master essential grammar rules and sentence structure.
            </p>
          </div>
          {/* Skill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {skills.map((skill, idx) => (
              <Card key={skill.title} className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {skill.emoji}
                  </div>
                  <CardTitle className="text-lg leading-tight">{skill.title}</CardTitle>
                  <CardDescription className="text-sm">{skill.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className="w-full mt-4 hero-button"
                    onClick={skill.title === "Parts of Speech" ? () => navigate("/course/grammar-fundamentals/parts-of-speech") : undefined}
                    disabled={skill.title !== "Parts of Speech"}
                  >
                    <span>{skill.title === "Parts of Speech" ? "Start Lesson" : "Coming Soon"}</span>
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