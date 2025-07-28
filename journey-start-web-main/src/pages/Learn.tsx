import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MessageCircle, 
  Volume2, 
  BookOpen, 
  Users, 
  Award,
  Clock,
  Star,
  Headphones,
  ArrowLeft,
  Mic
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";

const Learn = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Levels", icon: BookOpen },
    { id: "grammar", name: "Grammar", icon: MessageCircle },
    { id: "vocabulary", name: "Vocabulary", icon: Star },
    { id: "speaking", name: "Speaking", icon: Mic },
    { id: "listening", name: "Listening", icon: Headphones },
  ];

  const courses = [
    {
      id: 1,
      title: "English Grammar Fundamentals",
      description: "Master essential grammar rules, sentence structure, and common patterns in English.",
      category: "grammar",
      duration: "6 weeks",
      students: 3240,
      rating: 4.9,
      level: "Beginner",
      image: "📚"
    },
    {
      id: 2,
      title: "Conversational English Practice",
      description: "Build confidence in speaking through interactive dialogues and real-world scenarios.",
      category: "speaking",
      duration: "8 weeks",
      students: 2156,
      rating: 4.8,
      level: "Intermediate",
      image: "💬"
    },
    {
      id: 3,
      title: "Essential Vocabulary Builder",
      description: "Expand your vocabulary with 2000+ most common English words and phrases.",
      category: "vocabulary",
      duration: "4 weeks",
      students: 4521,
      rating: 4.7,
      level: "Beginner",
      image: "📖"
    },
    {
      id: 4,
      title: "English Listening Skills",
      description: "Improve comprehension with native speaker audio, podcasts, and exercises.",
      category: "listening",
      duration: "10 weeks",
      students: 1823,
      rating: 4.9,
      level: "Intermediate",
      image: "🎧"
    },
    {
      id: 5,
      title: "Business English Communication",
      description: "Professional English for workplace conversations, emails, and presentations.",
      category: "speaking",
      duration: "12 weeks",
      students: 967,
      rating: 4.8,
      level: "Advanced",
      image: "💼"
    },
    {
      id: 6,
      title: "Pronunciation & Accent Training",
      description: "Perfect your pronunciation with speech recognition technology and expert feedback.",
      category: "speaking",
      duration: "8 weeks",
      students: 1456,
      rating: 4.9,
      level: "Intermediate",
      image: "🎤"
    },
  ];

  const filteredCourses = selectedCategory === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const stats = [
    { label: "English Students", value: "50,000+", icon: Users },
    { label: "Lessons Available", value: "500+", icon: BookOpen },
    { label: "Native Speakers", value: "25+", icon: Award },
    { label: "Hours of Audio", value: "2,000+", icon: Volume2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/10 py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
              Master English <span className="text-gradient">Step by Step</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 px-4">
              From basic grammar to fluent conversation. Choose your learning path and start speaking English confidently.
            </p>
            {/* Stats section hidden for early stage */}
            {/*
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
            */}
          </div>
        </div>
      </section>

      {/* English Course Catalog */}
      <section className="py-8 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 md:gap-4 mb-8 md:mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full border transition-all duration-300 text-sm md:text-base ${
                  selectedCategory === category.id
                    ? "bg-primary text-white border-primary shadow-lg"
                    : "bg-card border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="flex flex-col h-full hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group">
                <CardHeader className="pb-4 flex-grow">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {course.image}
                  </div>
                  <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                  <CardDescription className="text-sm">{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 flex flex-col flex-1">
                  <div className="mt-auto">
                    <Button
                      className="w-full hero-button"
                      onClick={course.title === "English Grammar Fundamentals" ? () => navigate("/course/grammar-fundamentals") : undefined}
                    >
                      <span>Start Course</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Learn;