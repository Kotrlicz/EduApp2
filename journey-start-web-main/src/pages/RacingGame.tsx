import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

interface Question {
  word: string;
  correctAnswer: string;
  options: string[];
}

interface Car {
  x: number;
  y: number;
  speed: number;
  progress: number;
}

// Image assets
const playerCarImg = new Image();
playerCarImg.src = '/car-player.png'; // Your blue car PNG

const computerCarImg = new Image();
computerCarImg.src = '/car-computer.png'; // Your red car PNG

const trackImg = new Image();
trackImg.src = '/track-background.png'; // Your track PNG

const sampleQuestions: Question[] = [
  { word: "run", correctAnswer: "verb", options: ["noun", "verb", "adjective", "adverb"] },
  { word: "happy", correctAnswer: "adjective", options: ["noun", "verb", "adjective", "adverb"] },
  { word: "quickly", correctAnswer: "adverb", options: ["noun", "verb", "adjective", "adverb"] },
  { word: "book", correctAnswer: "noun", options: ["noun", "verb", "adjective", "adverb"] },
  { word: "jump", correctAnswer: "verb", options: ["noun", "verb", "adjective", "adverb"] },
  { word: "beautiful", correctAnswer: "adjective", options: ["noun", "verb", "adjective", "adverb"] },
  { word: "slowly", correctAnswer: "adverb", options: ["noun", "verb", "adjective", "adverb"] },
  { word: "house", correctAnswer: "noun", options: ["noun", "verb", "adjective", "adverb"] },
];

const RacingGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'finished'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [playerCar, setPlayerCar] = useState<Car>({ x: 50, y: 200, speed: 0, progress: 0 });
  const [computerCar, setComputerCar] = useState<Car>({ x: 50, y: 300, speed: 0, progress: 0 });
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);
  const [computerTimer, setComputerTimer] = useState<NodeJS.Timeout | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Responsive canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 400 });
  const FINISH_LINE = 700;

  // Set responsive canvas dimensions
  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setCanvasDimensions({ width: 350, height: 200 });
      } else {
        setCanvasDimensions({ width: 800, height: 400 });
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Load user and data from Supabase
  useEffect(() => {
    const loadUserAndData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          console.log('User logged in, loading data from Supabase...');
          
          // Test if tables exist by trying to count rows
          try {
            const { count: questionsCount, error: countError } = await supabase
              .from('racing_game_questions')
              .select('*', { count: 'exact', head: true });
            
            if (countError) {
              console.error('Table racing_game_questions does not exist or has RLS issues:', countError);
            } else {
              console.log('Found', questionsCount, 'questions in database');
            }
          } catch (error) {
            console.error('Error testing table access:', error);
          }
          
          // Load best time from Supabase
          const { data: bestTimeData, error: progressError } = await supabase
            .from('racing_game_progress')
            .select('best_time')
            .eq('user_id', user.id)
            .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows
          
          if (progressError) {
            console.error('Error loading progress:', progressError);
          } else if (bestTimeData?.best_time) {
            console.log('Loaded best time:', bestTimeData.best_time);
            setBestTime(bestTimeData.best_time);
          } else {
            console.log('No progress record found for user (first time playing)');
          }
          
          // Load questions from Supabase
          const { data: questionsData, error: questionsError } = await supabase
            .from('racing_game_questions')
            .select('*')
            .order('id');
          
          if (questionsError) {
            console.error('Error loading questions:', questionsError);
            console.log('Falling back to sample questions');
            setQuestions(sampleQuestions);
          } else if (questionsData && questionsData.length > 0) {
            // Map DB fields to camelCase for compatibility
            const mappedQuestions = questionsData.map((q: any) => ({
              word: q.word,
              correctAnswer: q.correct_answer, // map to camelCase
              options: q.options,
            }));
            console.log('Loaded', mappedQuestions.length, 'questions from database');
            console.log('Sample mapped question:', mappedQuestions[0]);
            setQuestions(mappedQuestions);
          } else {
            console.log('No questions in database, using sample questions');
            setQuestions(sampleQuestions);
          }
        } else {
          console.log('No user logged in, using sample questions');
          setQuestions(sampleQuestions);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample questions
        setQuestions(sampleQuestions);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserAndData();
  }, []);

  // Load all images
  useEffect(() => {
    console.log('RacingGame component mounted - starting image loading...');
    
    let loadedCount = 0;
    const totalImages = 2; // Only 2 images since we don't have track image yet

    const checkAllLoaded = () => {
      loadedCount++;
      console.log(`Image loaded! Count: ${loadedCount}/${totalImages}`);
      if (loadedCount === totalImages) {
        console.log('All images loaded successfully!');
        setImagesLoaded(true);
      }
    };

    playerCarImg.onload = () => {
      console.log('Player car image loaded successfully');
      checkAllLoaded();
    };
    computerCarImg.onload = () => {
      console.log('Computer car image loaded successfully');
      checkAllLoaded();
    };

    // Handle image loading errors
    playerCarImg.onerror = () => {
      console.error('Player car image failed to load');
      console.error('Tried to load:', playerCarImg.src);
    };
    computerCarImg.onerror = () => {
      console.error('Computer car image failed to load');
      console.error('Tried to load:', computerCarImg.src);
    };

    // Log the image sources
    console.log('Loading images from:', {
      playerCar: playerCarImg.src,
      computerCar: computerCarImg.src
    });

    // Test if images are accessible
    fetch('/car-player.png')
      .then(response => {
        if (response.ok) {
          console.log('✅ car-player.png is accessible');
        } else {
          console.error('❌ car-player.png not found (status:', response.status, ')');
        }
      })
      .catch(error => console.error('❌ Error checking car-player.png:', error));

    fetch('/car-computer.png')
      .then(response => {
        if (response.ok) {
          console.log('✅ car-computer.png is accessible');
        } else {
          console.error('❌ car-computer.png not found (status:', response.status, ')');
        }
      })
      .catch(error => console.error('❌ Error checking car-computer.png:', error));
  }, []);

  const startGame = () => {
    setGameState('playing');
    setGameTime(0);
    setPlayerCar({ x: 50, y: 200, speed: 0, progress: 0 });
    setComputerCar({ x: 50, y: 300, speed: 0, progress: 0 });
    generateNewQuestion();
  };

  const generateNewQuestion = () => {
    if (questions.length === 0) return;
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    console.log('Generated new question:', randomQuestion);
    setCurrentQuestion(randomQuestion);
    
    // Set random timer for computer (5-10 seconds)
    const computerTime = Math.random() * 5000 + 5000; // 5-10 seconds in milliseconds
    setTimeLeft(computerTime / 1000);
    
    // Computer will answer correctly after the timer
    const timer = setTimeout(() => {
      if (gameState === 'playing') {
        computerAnswer();
      }
    }, computerTime);
    
    setComputerTimer(timer);
  };

  const computerAnswer = () => {
    setComputerCar(prev => {
      const newProgress = prev.progress + 20;
      const newX = Math.min(prev.x + 20, FINISH_LINE);
      
      // Check if computer won
      if (newProgress >= FINISH_LINE) {
        setTimeout(() => endGame('computer'), 100);
      } else {
        generateNewQuestion();
      }
      
      return {
        ...prev,
        progress: newProgress,
        x: newX
      };
    });
  };

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || gameState !== 'playing') return;

    console.log('Player answered:', answer);
    console.log('Correct answer:', currentQuestion.correctAnswer);
    console.log('Answer is correct:', answer === currentQuestion.correctAnswer);

    // Clear computer timer
    if (computerTimer) {
      clearTimeout(computerTimer);
      setComputerTimer(null);
    }

    if (answer === currentQuestion.correctAnswer) {
      console.log('✅ Player answered correctly - moving forward');
      // Player answers correctly
      setPlayerCar(prev => {
        const newProgress = prev.progress + 20;
        const newX = Math.min(prev.x + 20, FINISH_LINE);
        
        // Check if player won
        if (newProgress >= FINISH_LINE) {
          setTimeout(() => endGame('player'), 100);
        } else {
          generateNewQuestion();
        }
        
        return {
          ...prev,
          progress: newProgress,
          x: newX
        };
      });
    } else {
      console.log('❌ Player answered incorrectly - computer moves forward');
      // Player answers incorrectly - computer moves forward
      setComputerCar(prev => {
        const newProgress = prev.progress + 20;
        const newX = Math.min(prev.x + 20, FINISH_LINE);
        
        // Check if computer won
        if (newProgress >= FINISH_LINE) {
          setTimeout(() => endGame('computer'), 100);
        } else {
          generateNewQuestion();
        }
        
        return {
          ...prev,
          progress: newProgress,
          x: newX
        };
      });
    }
  };

  const endGame = async (winner: 'player' | 'computer') => {
    setGameState('finished');
    if (gameTimer) clearTimeout(gameTimer);
    if (computerTimer) clearTimeout(computerTimer);
    
            // Save results to Supabase if user is logged in
        if (user) {
          try {
            const currentTime = gameTime;
            const isNewBestTime = !bestTime || currentTime < bestTime;
            
            // Only save game result if player won
            if (winner === 'player') {
              await supabase
                .from('racing_game_results')
                .insert({
                  user_id: user.id,
                  game_time: currentTime,
                  won: true,
                  questions_answered: Math.floor(playerCar.progress / 20), // Each correct answer moves 20 pixels
                  date_played: new Date().toISOString()
                });
              
              // Update best time if it's a new record
              if (isNewBestTime) {
                await supabase
                  .from('racing_game_progress')
                  .upsert({
                    user_id: user.id,
                    best_time: currentTime,
                    games_played: 1,
                    games_won: 1
                  }, {
                    onConflict: 'user_id'
                  });
                
                setBestTime(currentTime);
              } else {
                // Update stats for win (but not best time)
                await supabase
                  .from('racing_game_progress')
                  .upsert({
                    user_id: user.id,
                    games_played: 1,
                    games_won: 1
                  }, {
                    onConflict: 'user_id'
                  });
              }
            } else {
              // Only update games played for losses (no time saved)
              await supabase
                .from('racing_game_progress')
                .upsert({
                  user_id: user.id,
                  games_played: 1,
                  games_won: 0
                }, {
                  onConflict: 'user_id'
                });
            }
        
        // Mark racing game as completed if player won
        if (winner === 'player') {
          try {
            await supabase
              .from('quiz_progress')
              .upsert({
                user_id: user.id,
                racing_game_completed: true // Add racing game completion flag
              }, {
                onConflict: 'user_id'
              });
            console.log('✅ Racing game marked as completed!');
          } catch (error) {
            console.error('Error marking racing game as completed:', error);
          }
        }
      } catch (error) {
        console.error('Error saving game results:', error);
      }
    } else {
      // Fallback to localStorage for anonymous users
      if (winner === 'player') {
        const currentTime = gameTime;
        if (!bestTime || currentTime < bestTime) {
          setBestTime(currentTime);
          localStorage.setItem('racing-game-best-time', currentTime.toString());
        }
      }
    }
  };

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    // Draw track background (simple gray road for now)
    ctx.fillStyle = '#696969'; // Gray road
    ctx.fillRect(0, 150, canvasDimensions.width, 200);

    // Draw finish line
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(FINISH_LINE, 150, 10, 200);

    // Draw player car image (if loaded)
    if (imagesLoaded && playerCarImg.complete) {
      // Calculate aspect ratio to prevent stretching
      const carWidth = 40;
      const carHeight = (playerCarImg.height / playerCarImg.width) * carWidth;
      ctx.drawImage(playerCarImg, playerCar.x, playerCar.y, carWidth, carHeight);
    } else {
      // Fallback to rectangle if image not loaded
      ctx.fillStyle = '#0066CC';
      ctx.fillRect(playerCar.x, playerCar.y, 40, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(playerCar.x + 5, playerCar.y + 5, 10, 10);
    }

    // Draw computer car image (if loaded)
    if (imagesLoaded && computerCarImg.complete) {
      // Calculate aspect ratio to prevent stretching
      const carWidth = 40;
      const carHeight = (computerCarImg.height / computerCarImg.width) * carWidth;
      ctx.drawImage(computerCarImg, computerCar.x, computerCar.y, carWidth, carHeight);
    } else {
      // Fallback to rectangle if image not loaded
      ctx.fillStyle = '#CC0000';
      ctx.fillRect(computerCar.x, computerCar.y, 40, 20);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(computerCar.x + 5, computerCar.y + 5, 10, 10);
    }

    // Draw progress bars
    ctx.fillStyle = '#333';
    ctx.fillRect(10, 10, 200, 20);
    ctx.fillStyle = '#0066CC';
    ctx.fillRect(10, 10, (playerCar.progress / FINISH_LINE) * 200, 20);

    ctx.fillStyle = '#333';
    ctx.fillRect(10, 40, 200, 20);
    ctx.fillStyle = '#CC0000';
    ctx.fillRect(10, 40, (computerCar.progress / FINISH_LINE) * 200, 20);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      drawGame(ctx);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();
  }, [playerCar, computerCar]);

  useEffect(() => {
    // Update timer display
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => {
        setTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
      setGameTimer(timer);
    }
  }, [timeLeft, gameState]);

  // Track game time
  useEffect(() => {
    let timeTimer: NodeJS.Timeout;
    if (gameState === 'playing') {
      timeTimer = setInterval(() => {
        setGameTime(prev => prev + 0.1);
      }, 100);
    }
    return () => {
      if (timeTimer) clearInterval(timeTimer);
    };
  }, [gameState]);

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">🏎️ Grammar Racing Game</h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8">Race against the computer by answering grammar questions correctly!</p>
          
          {loading ? (
            <div className="text-lg mb-8">Loading game data...</div>
          ) : (
            <>
              {user && bestTime && (
                <div className="text-lg mb-8 text-blue-600">
                  Your Best Time: {bestTime.toFixed(1)}s
                </div>
              )}
              <Button onClick={startGame} className="hero-button text-lg px-8 py-4">
                Start Race
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    // Determine if player won based on who reached the finish line first
    const playerWon = playerCar.progress >= FINISH_LINE;
    
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
            {playerWon ? '🎉 You Won!' : '😔 You Lost. Better luck next time!'}
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8">Final Time: {gameTime.toFixed(1)}s</p>
          {bestTime && playerWon && <p className="text-base md:text-lg mb-6 md:mb-8 text-blue-600">Best Time: {bestTime.toFixed(1)}s</p>}
          
          {playerWon && user && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-green-800 mb-2">🏆 Racing Challenge Completed!</h2>
              <p className="text-green-700 mb-4">
                Congratulations! You've completed the racing game challenge for "Parts of Speech"!
              </p>
              <p className="text-sm text-green-600">
                You still need to complete the regular quiz (10 correct answers in a row) to finish the full course.
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button onClick={startGame} className="hero-button text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
              Race Again
            </Button>
            {playerWon && (
              <Button 
                onClick={() => window.location.href = '/course/grammar-fundamentals'} 
                className="bg-green-600 hover:bg-green-700 text-white text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
              >
                View Progress
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">🏎️ Grammar Racing</h1>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-4">
            <div className="text-blue-600 font-bold text-sm md:text-base">Player: {Math.round((playerCar.progress / FINISH_LINE) * 100)}%</div>
            <div className="text-red-600 font-bold text-sm md:text-base">Computer: {Math.round((computerCar.progress / FINISH_LINE) * 100)}%</div>
          </div>
          <div className="text-base md:text-lg font-semibold">Time: {gameTime.toFixed(1)}s</div>
          {bestTime && <div className="text-xs md:text-sm text-blue-600">Best: {bestTime.toFixed(1)}s</div>}
          <div className="text-xs text-gray-500">Images loaded: {imagesLoaded ? '✅' : '⏳'}</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Game Canvas */}
          <div className="flex-1">
            <canvas
              ref={canvasRef}
              width={canvasDimensions.width}
              height={canvasDimensions.height}
              className="border-2 border-gray-300 rounded-lg mx-auto max-w-full"
            />
          </div>

          {/* Question Panel */}
          <div className="w-full lg:w-80">
            <div className="bg-card rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">What part of speech is:</h2>
              {currentQuestion && (
                <>
                  <div className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 p-3 md:p-4 bg-primary/10 rounded">
                    "{currentQuestion.word}"
                  </div>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {currentQuestion.options.map((option) => (
                      <Button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className="w-full py-2 md:py-3 text-sm md:text-lg"
                        variant="outline"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RacingGame; 