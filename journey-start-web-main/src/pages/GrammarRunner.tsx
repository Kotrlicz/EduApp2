import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Trophy, Clock } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  incorrect: string;
  correct: string;
  explanation: string;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  question: Question;
  type: 'obstacle' | 'bonus';
}

const GrammarRunner = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastUpdateTime = useRef<number | null>(null);
  
  // Game state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [playerX, setPlayerX] = useState(50);
  const [playerY, setPlayerY] = useState(320);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<{text: string, isCorrect: boolean}[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [jumpHeight, setJumpHeight] = useState(0);
  const [jumpVelocity, setJumpVelocity] = useState(0);
  const [currentObstacle, setCurrentObstacle] = useState<Obstacle | null>(null);
  
  // Animation states
  const [runnerSprite, setRunnerSprite] = useState<HTMLImageElement | null>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [frameCounter, setFrameCounter] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Device detection for speed adjustment
  const isMobile = window.innerWidth <= 768;
  const obstacleSpeed = isMobile ? 1.25 : 2.5; // 2x slower (was 2.5/5, now 1.25/2.5)
  const jumpGravity = isMobile ? -0.25 : -0.5; // Stronger gravity on desktop to prevent floating
  
  // Game constants
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 400;
  const PLAYER_WIDTH = 60; // Increased from 40
  const PLAYER_HEIGHT = 80; // Increased from 60
  const OBSTACLE_WIDTH = 20; // Increased from 6
  const OBSTACLE_HEIGHT = 20; // Reduced to 1/4 of original 50
  const FINISH_LINE = 750;
  const GAME_SPEED = 2;
  const PLAYER_Y = 300; // Adjusted to accommodate larger player
  
  // Supabase data
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Sample questions (fallback)
  const sampleQuestions: Question[] = [
    {
      id: 1,
      question: "run",
      incorrect: "noun",
      correct: "verb",
      explanation: "'Run' is an action word, so it's a verb"
    },
    {
      id: 2,
      question: "happy",
      incorrect: "adverb",
      correct: "adjective",
      explanation: "'Happy' describes a person or thing, so it's an adjective"
    },
    {
      id: 3,
      question: "quickly",
      incorrect: "adjective",
      correct: "adverb",
      explanation: "'Quickly' describes how an action is done, so it's an adverb"
    },
    {
      id: 4,
      question: "book",
      incorrect: "verb",
      correct: "noun",
      explanation: "'Book' is a person, place, or thing, so it's a noun"
    },
    {
      id: 5,
      question: "jump",
      incorrect: "noun",
      correct: "verb",
      explanation: "'Jump' is an action word, so it's a verb"
    }
  ];

  // Load user and questions from Supabase
  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        console.log('Loading data for courseId:', courseId);
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user && courseId) {
          // Load best time for specific course
          const progressTableName = `grammar_runner_${courseId}_progress`;
          const { data: bestTimeData, error: progressError } = await supabase
            .from(progressTableName)
            .select('best_time')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (bestTimeData?.best_time) {
            setBestTime(bestTimeData.best_time);
          }
          
          // Load questions for specific course
          const questionsTableName = `grammar_runner_${courseId}_questions`;
          const { data: questionsData, error: questionsError } = await supabase
            .from(questionsTableName)
            .select('*')
            .order('id');
          
          console.log('Questions data:', questionsData);
          console.log('Questions error:', questionsError);
          
                      if (questionsData && questionsData.length > 0) {
              const mappedQuestions = questionsData.map((q: any) => ({
                id: q.id,
                question: q.question,
                incorrect: q.incorrect,
                correct: q.correct,
                explanation: q.explanation
              }));
              setQuestions(mappedQuestions);
          } else {
            console.log('No questions found, using sample questions');
            setQuestions(sampleQuestions);
          }
        } else {
          console.log('No user or courseId, using sample questions');
          setQuestions(sampleQuestions);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setQuestions(sampleQuestions);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndData();
  }, [courseId]);

  // Load runner sprite
  useEffect(() => {
    const loadRunnerSprite = () => {
      const img = new Image();
      img.onload = () => {
        setRunnerSprite(img);
        setImagesLoaded(true);
        console.log('✅ Runner sprite loaded!');
      };
      img.onerror = () => {
        console.error('❌ Failed to load runner sprite');
        setImagesLoaded(false);
      };
      img.src = '/runner-spritesheet.png';
    };

    loadRunnerSprite();
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      // Player stays in fixed position (no movement)
      // setPlayerX(prev => prev + 2); // REMOVED - player stays static
      
      // Move obstacles with progressive speed based on score
      setObstacles(prev => 
        prev.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - (obstacleSpeed * speedMultiplier) // Speed increases with score
        })).filter(obstacle => obstacle.x > -OBSTACLE_WIDTH)
      );

      // Animation frame update (10 FPS)
      setFrameCounter(prev => {
        const newCounter = prev + 1;
        if (newCounter >= 6) { // Change frame every 6 game ticks (60/6 = 10 FPS)
          setCurrentFrame(prevFrame => (prevFrame + 1) % 4); // 4 frames total
          return 0;
        }
        return newCounter;
      });

      // Check collision with obstacles and successful jumps
      obstacles.forEach(obstacle => {
                 // Check for collision (only if not jumping or if jump isn't high enough)
         if (
           playerX < obstacle.x + OBSTACLE_WIDTH &&
           playerX + PLAYER_WIDTH > obstacle.x &&
           playerY < obstacle.y + OBSTACLE_HEIGHT &&
           playerY + PLAYER_HEIGHT > obstacle.y &&
           (!isJumping || jumpHeight < 30) // Reduced from 60 to 30 (half height)
         ) {
          // Collision detected - game over
          setGameState('finished');
          endGame();
          return;
        }
        
                 // Check for successful jump over obstacle
         if (
           isJumping && 
           jumpHeight >= 30 && // Reduced from 60 to 30 (half height)
           playerX < obstacle.x + OBSTACLE_WIDTH &&
           playerX + PLAYER_WIDTH > obstacle.x &&
           obstacle.x < playerX // Obstacle has passed under the player
         ) {
           // Successful jump - award points and remove obstacle
           setScore(prev => prev + 10);
           setObstacles(prev => 
             prev.filter(obs => obs.question.id !== obstacle.question.id)
           );
         }
      });

      // Progressive difficulty - speed increases every 50 points
      const speedMultiplier = 1 + (Math.floor(score / 50) * 0.25); // 1x at 0-49, 1.25x at 50-99, 1.5x at 100-149, etc.

      // Generate new obstacles - only if there are no obstacles on screen and no current question
      if (obstacles.length === 0 && !showQuestion && Math.random() < 0.02) { // 2% chance per frame when no obstacles
        generateObstacle();
      }

      // Handle jumping animation with gravity
      if (isJumping) {
        setJumpHeight(prev => {
          const newHeight = prev + jumpVelocity;
          
          // Apply gravity (back to original working values)
          setJumpVelocity(prevVelocity => prevVelocity - 0.25);
          
          // Check if landed
          if (newHeight <= 0) {
            setIsJumping(false);
            setJumpVelocity(0);
            return 0;
          }
          
          return newHeight;
        });
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, playerX, playerY, obstacles, isJumping, score]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setGameTime(prev => prev + 0.1);
    }, 100);

    return () => clearInterval(timer);
  }, [gameState]);

  const generateObstacle = () => {
    if (questions.length === 0) return;
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const newObstacle: Obstacle = {
      x: GAME_WIDTH,
      y: PLAYER_Y + PLAYER_HEIGHT - OBSTACLE_HEIGHT, // Position at same height as player's hitbox
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT,
      question: randomQuestion,
      type: 'obstacle'
    };
    
    setObstacles(prev => [...prev, newObstacle]);
    
    // Shuffle the answers
    const answers = [
      { text: randomQuestion.correct, isCorrect: true },
      { text: randomQuestion.incorrect, isCorrect: false }
    ];
    const shuffled = answers.sort(() => Math.random() - 0.5);
    setShuffledAnswers(shuffled);
    
    // Immediately show question for this obstacle
    setCurrentQuestion(randomQuestion);
    setShowQuestion(true);
    setCurrentObstacle(newObstacle);
  };



  const handleAnswer = (isCorrect: boolean) => {
    if (!currentQuestion || !currentObstacle) return;
    
    if (isCorrect) {
      // Correct answer - jump over obstacle
      setFeedback('correct');
      setIsJumping(true);
      setJumpHeight(0);
      setJumpVelocity(10); // Back to original working value
      
      // Don't remove obstacle yet - let it pass under the jumping player
    } else {
      // Wrong answer - game over
      setFeedback('incorrect');
      setTimeout(() => {
        setGameState('finished');
        endGame();
      }, 1000);
    }
    
    setShowQuestion(false);
    setCurrentQuestion(null);
    setCurrentObstacle(null);
    setShuffledAnswers([]);
    
    // Clear feedback after 1 second
    setTimeout(() => setFeedback(null), 1000);
  };

  const endGame = async () => {
    setGameState('finished');
    
    if (user && courseId) {
      try {
        // Save game result to course-specific table
        const resultsTableName = `grammar_runner_${courseId}_results`;
        await supabase.from(resultsTableName).insert({
          user_id: user.id,
          game_time: gameTime,
          score: score,
          questions_answered: Math.floor(score / 10),
          date_played: new Date().toISOString()
        });

        // Update best time if better in course-specific table
        if (!bestTime || gameTime < bestTime) {
          const progressTableName = `grammar_runner_${courseId}_progress`;
          await supabase
            .from(progressTableName)
            .upsert({
              user_id: user.id,
              best_time: gameTime
            }, {
              onConflict: 'user_id'
            });
          setBestTime(gameTime);
        }

        // Mark grammar runner as completed for course progress
        const completionColumnName = `grammar_runner_${courseId}_completed`;
        await supabase
          .from('quiz_progress')
          .upsert({
            user_id: user.id,
            [completionColumnName]: true
          }, {
            onConflict: 'user_id'
          });

        console.log('✅ Grammar runner results saved!');
      } catch (error) {
        console.error('Error saving results:', error);
      }
    }
  };

  const startGame = () => {
    setGameState('playing');
    setPlayerX(50); // Fixed position on the left
    setPlayerY(300); // Updated to match new PLAYER_Y constant
    setObstacles([]);
    setScore(0);
    setGameTime(0);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setCurrentObstacle(null);
    setFeedback(null);
    setIsJumping(false);
    setJumpHeight(0);
    setJumpVelocity(0);
  };

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw background
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Draw ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, GAME_HEIGHT - 20, GAME_WIDTH, 20);
    
    // Draw player (with jumping animation and sprite)
    const playerYPos = isJumping ? playerY - jumpHeight : playerY;
    
    if (runnerSprite && imagesLoaded) {
      // Draw animated sprite
      const frameWidth = 32;
      const frameHeight = 32;
      const frameX = (currentFrame % 2) * frameWidth; // 2 columns
      const frameY = Math.floor(currentFrame / 2) * frameHeight; // 2 rows
      
      ctx.drawImage(
        runnerSprite,
        frameX, frameY, frameWidth, frameHeight, // Source rectangle
        playerX, playerYPos, PLAYER_WIDTH, PLAYER_HEIGHT // Destination rectangle
      );
    } else {
      // Fallback to blue rectangle if sprite not loaded
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(playerX, playerYPos, PLAYER_WIDTH, PLAYER_HEIGHT);
    }
    
    // Draw obstacles
    obstacles.forEach(obstacle => {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
    
    // Draw finish line
    ctx.fillStyle = '#000000';
    ctx.fillRect(FINISH_LINE, 0, 5, GAME_HEIGHT);
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FINISH', FINISH_LINE + 25, GAME_HEIGHT / 2);
  };

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGame(ctx);
  }, [playerX, playerY, obstacles, gameState, isJumping, jumpHeight, currentFrame, runnerSprite, imagesLoaded]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading Grammar Runner...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Grammar Runner
            </h1>
            <p className="text-lg text-muted-foreground">
              Run and fix grammar mistakes along the way!
            </p>
          </div>

          {gameState === 'menu' && (
            <div className="text-center space-y-6">
                              <div className="bg-card rounded-lg p-6 max-w-md mx-auto">
                  <h2 className="text-xl font-semibold mb-4">How to Play</h2>
                  <ul className="text-left space-y-2 text-sm">
                    <li>• Your character stays in a fixed position</li>
                    <li>• Red obstacles move toward you from the right</li>
                    <li>• When an obstacle appears, a grammar question appears immediately</li>
                    <li>• Click the correct sentence to make your character jump</li>
                    <li>• Time your jump to clear the obstacle</li>
                    <li>• If the obstacle hits you, the game ends</li>
                    <li>• Answer 5 questions correctly to win!</li>
                  </ul>
                </div>
              
              {bestTime && (
                <div className="bg-card rounded-lg p-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Best Time: {bestTime.toFixed(1)}s</span>
                  </div>
                </div>
              )}
              
              <Button onClick={startGame} className="hero-button">
                <Play className="w-5 h-5 mr-2" />
                Start Running
              </Button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Game Canvas */}
              <div className="flex-1">
                <canvas
                  ref={canvasRef}
                  width={GAME_WIDTH}
                  height={GAME_HEIGHT}
                  className="border rounded-lg bg-white max-w-full"
                />
              </div>
              
              {/* Game Info */}
              <div className="lg:w-80 space-y-4">
                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Score:</span>
                    <span className="text-2xl font-bold text-primary">{score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Time:</span>
                    <span className="text-lg">{gameTime.toFixed(1)}s</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-semibold">Speed:</span>
                    <span className="text-lg text-orange-600 font-bold">{Math.floor(score / 50) + 1}x</span>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Controls</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the correct sentence to jump!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    The correct answer is your "jump button"!
                  </p>
                </div>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="text-center space-y-6">
              <div className="bg-card rounded-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">Level Complete!</h2>
                <div className="space-y-2 mb-6">
                  <p>Final Score: <span className="font-bold text-primary">{score}</span></p>
                  <p>Time: <span className="font-bold">{gameTime.toFixed(1)}s</span></p>
                  {bestTime && gameTime < bestTime && (
                    <p className="text-green-600 font-bold">New Best Time! 🎉</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Button onClick={startGame} className="w-full">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Play Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/course/grammar-fundamentals')}
                    className="w-full"
                  >
                    Back to Courses
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Question Buttons - Racing Game Style */}
          {showQuestion && currentQuestion && shuffledAnswers.length === 2 && (
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-semibold text-center">
                {currentQuestion.question}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleAnswer(shuffledAnswers[0].isCorrect)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-gray-400 py-3 text-sm"
                >
                  {shuffledAnswers[0].text}
                </Button>
                <Button 
                  onClick={() => handleAnswer(shuffledAnswers[1].isCorrect)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-2 border-gray-300 hover:border-gray-400 py-3 text-sm"
                >
                  {shuffledAnswers[1].text}
                </Button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg ${
              feedback === 'correct' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrammarRunner; 