import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Target, BookOpen, Star, Zap, Play } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';

interface CourseMode {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  questions: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topics: string[];
}

const GrammarRunnerModeSelection = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);

  const courseModes: CourseMode[] = [
    {
      id: 'parts_of_speech',
      title: 'Parts of Speech',
      description: 'Learn about nouns, verbs, adjectives, adverbs, and more—the building blocks of English sentences.',
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
      questions: 10,
      difficulty: 'Beginner',
      topics: ['Nouns', 'Verbs', 'Adjectives', 'Adverbs', 'Pronouns']
    },
    {
      id: 'articles',
      title: 'Articles and Determiners',
      description: 'Master the use of a, an, the and other determiners to make your sentences precise and grammatically correct.',
      icon: <Target className="w-8 h-8" />,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
      questions: 10,
      difficulty: 'Beginner',
      topics: ['A/An', 'The', 'This/That', 'Some/Any', 'Much/Many']
    },
    {
      id: 'subject_verb',
      title: 'Subject–Verb Agreement',
      description: 'Learn how to make subjects and verbs agree in number and person.',
      icon: <Zap className="w-8 h-8" />,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      questions: 10,
      difficulty: 'Beginner',
      topics: ['Singular/Plural', 'He/She/It', 'Collective Nouns', 'Compound Subjects']
    },
    {
      id: 'questions_formation',
      title: 'Question Formation',
      description: 'Understand how to form yes/no questions and WH-questions in English.',
      icon: <Star className="w-8 h-8" />,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
      questions: 10,
      difficulty: 'Beginner',
      topics: ['Yes/No Questions', 'WH-Questions', 'Modal Questions', 'Tag Questions']
    },
    {
      id: 'negatives',
      title: 'Negatives',
      description: 'Learn how to correctly form negative sentences using not, never, no one, etc.',
      icon: <Target className="w-8 h-8" />,
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600',
      questions: 10,
      difficulty: 'Beginner',
      topics: ['Not', 'Never', 'No One', 'Neither/Nor', 'Hardly/Scarcely']
    },
    {
      id: 'countable',
      title: 'Countable and Uncountable Nouns',
      description: 'Discover how to handle nouns that can or cannot be counted and how to use quantifiers correctly.',
      icon: <Trophy className="w-8 h-8" />,
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
      questions: 10,
      difficulty: 'Beginner',
      topics: ['Countable Nouns', 'Uncountable Nouns', 'Much/Many', 'Some/Any', 'A Few/A Little']
    }
  ];

  // Load user and progress data
  useEffect(() => {
    const loadUserAndProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Load progress for all courses
          const { data: progressData } = await supabase
            .from('quiz_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          setProgress(progressData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndProgress();
  }, []);

  const handleCourseSelect = (courseId: string) => {
    console.log('Button clicked for course:', courseId);
    navigate(`/grammar-runner/${courseId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isCourseCompleted = (courseId: string) => {
    if (!progress) return false;
    const columnName = `grammar_runner_${courseId}_completed`;
    return progress[columnName] === true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading Grammar Runner Modes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Grammar Runner <span className="text-gradient">Modes</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your grammar challenge! Each mode focuses on different aspects of English grammar. 
              Run, jump, and learn as you progress through increasingly difficult obstacles.
            </p>
          </div>



          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseModes.map((course) => (
              <Card 
                key={course.id} 
                className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-80 flex flex-col cursor-pointer ${
                  isCourseCompleted(course.id) ? 'ring-2 ring-green-500' : ''
                }`}
                onClick={() => handleCourseSelect(course.id)}
              >
                {/* Completion Badge */}
                {isCourseCompleted(course.id) && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-green-500 text-white">
                      <Trophy className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className={`p-6 ${course.gradient} text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-white/20`}>
                      {course.icon}
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Level I
                      </Badge>
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                  <p className="text-white/90 text-sm">{course.description}</p>
                </div>

                {/* Action Button */}
                <div className="p-6 mt-auto">
                  <div 
                    className={`w-full py-3 px-4 rounded-lg text-center font-medium transition-all duration-200 ${
                      isCourseCompleted(course.id) 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : `bg-gradient-to-r ${course.gradient} text-white hover:opacity-90`
                    }`}
                  >
                    {isCourseCompleted(course.id) ? (
                      <>
                        <Trophy className="w-4 h-4 mr-2 inline" />
                        Completed
                      </>
                    ) : (
                      course.title === 'Parts of Speech' ? 'Slovní druhy' :
                      course.title === 'Articles and Determiners' ? 'Členy' :
                      course.title === 'Subject–Verb Agreement' ? 'Shoda podmětu s přísudkem' :
                      course.title === 'Question Formation' ? 'Tvoření otázek' :
                      course.title === 'Negatives' ? 'Zápor' :
                      course.title === 'Countable and Uncountable Nouns' ? 'Počitatelná a nepočitatelná podstatná jména' :
                      'Start Challenge'
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${course.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </Card>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <div className="bg-card rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold mb-3">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Click correct sentences to jump</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Speed increases every 50 points</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Unlimited gameplay until you crash</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarRunnerModeSelection; 