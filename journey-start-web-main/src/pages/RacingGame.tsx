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
  x: number; // This will stay constant (middle of screen)
  y: number; // Lane position
  speed: number;
  progress: number;
  baseSpeed: number; // Base speed for the car
  visualOffset: number; // Visual offset from center based on speed difference
}

// Image assets
const playerCarImg = new Image();
playerCarImg.src = '/car-player.png'; // Your blue car PNG

const computerCarImg = new Image();
computerCarImg.src = '/car-computer.png'; // Your red car PNG

const trackBackgroundImg = new Image();
trackBackgroundImg.src = '/racing-desktop-bg.png'; // Your desktop racing background

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
  const [playerCar, setPlayerCar] = useState<Car>({ x: 400, y: 200, speed: 100, progress: 0, baseSpeed: 100, visualOffset: 0 });
  const [computerCar, setComputerCar] = useState<Car>({ x: 400, y: 300, speed: 100, progress: 0, baseSpeed: 100, visualOffset: 0 });
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);
  const [computerTimer, setComputerTimer] = useState<NodeJS.Timeout | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<any>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [trackOffset, setTrackOffset] = useState(0);

  // Responsive canvas dimensions
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 400 });
  const FINISH_LINE = 5000;

  // Set responsive canvas dimensions
  useEffect(() => {
    const updateCanvasSize = () => {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      
      if (isMobile) {
        if (isPortrait) {
          // Portrait mobile - smaller canvas to fit better
          setCanvasDimensions({ width: 350, height: 200 });
        } else {
          // Landscape mobile - can use more space
          setCanvasDimensions({ width: 500, height: 250 });
        }
      } else {
        setCanvasDimensions({ width: 1000, height: 500 });
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
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
          
          // Load quiz progress to check completion status
          const { data: quizProgressData, error: quizProgressError } = await supabase
            .from('quiz_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();
          
          if (quizProgressError) {
            console.error('Error loading quiz progress:', quizProgressError);
          } else {
            console.log('Loaded quiz progress:', quizProgressData);
            setProgress(quizProgressData);
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
    const totalImages = 3; // Now including track background

    const checkAllLoaded = () => {
      loadedCount++;
      console.log(`Image loaded! Count: ${loadedCount}/${totalImages}`);
      if (loadedCount === totalImages) {
        console.log('All images loaded successfully!');
        setImagesLoaded(true);
      }
    };

    // Reset image loading state
    setImagesLoaded(false);

    // Create new image instances to ensure fresh loading
    const newPlayerCarImg = new Image();
    const newComputerCarImg = new Image();
    const newTrackBackgroundImg = new Image();

    newPlayerCarImg.onload = () => {
      console.log('Player car image loaded successfully');
      checkAllLoaded();
    };
    newComputerCarImg.onload = () => {
      console.log('Computer car image loaded successfully');
      checkAllLoaded();
    };
    newTrackBackgroundImg.onload = () => {
      console.log('Track background image loaded successfully');
      checkAllLoaded();
    };

    // Handle image loading errors
    newPlayerCarImg.onerror = () => {
      console.error('Player car image failed to load');
      console.error('Tried to load:', newPlayerCarImg.src);
      checkAllLoaded(); // Still count as loaded to prevent infinite waiting
    };
    newComputerCarImg.onerror = () => {
      console.error('Computer car image failed to load');
      console.error('Tried to load:', newComputerCarImg.src);
      checkAllLoaded(); // Still count as loaded to prevent infinite waiting
    };
    newTrackBackgroundImg.onerror = () => {
      console.error('Track background image failed to load');
      console.error('Tried to load:', newTrackBackgroundImg.src);
      checkAllLoaded(); // Still count as loaded to prevent infinite waiting
    };

    // Set image sources
    newPlayerCarImg.src = '/car-player.png';
    newComputerCarImg.src = '/car-computer.png';
    newTrackBackgroundImg.src = '/racing-desktop-bg.png';

    // Update global image references
    playerCarImg.src = newPlayerCarImg.src;
    computerCarImg.src = newComputerCarImg.src;
    trackBackgroundImg.src = newTrackBackgroundImg.src;

    // Log the image sources
    console.log('Loading images from:', {
      playerCar: newPlayerCarImg.src,
      computerCar: newComputerCarImg.src,
      trackBackground: newTrackBackgroundImg.src
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

    fetch('/racing-desktop-bg.png')
      .then(response => {
        if (response.ok) {
          console.log('✅ racing-desktop-bg.png is accessible');
        } else {
          console.error('❌ racing-desktop-bg.png not found (status:', response.status, ')');
        }
      })
      .catch(error => console.error('❌ Error checking racing-desktop-bg.png:', error));
  }, []);

  const startGame = () => {
    setGameState('playing');
    setGameTime(0);
    setQuestionsAnswered(0);
    setPlayerCar({ x: 400, y: 200, speed: 100, progress: 0, baseSpeed: 100, visualOffset: 0 });
    setComputerCar({ x: 400, y: 300, speed: 100, progress: 0, baseSpeed: 100, visualOffset: 0 });
    generateNewQuestion();
  };

  const generateNewQuestion = () => {
    if (questions.length === 0) return;
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    console.log('Generated new question:', randomQuestion);
    setCurrentQuestion(randomQuestion);
    
    // Set random timer for computer (2-5 seconds)
    const computerTime = Math.random() * 3000 + 2000; // 2-5 seconds in milliseconds
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
      // Computer gets the same speed boost as player
      const newSpeed = prev.speed + 10; // No speed cap
      return {
        ...prev,
        speed: newSpeed
      };
    });
    generateNewQuestion();
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
      console.log('✅ Player answered correctly - increasing speed');
      setQuestionsAnswered(prev => prev + 1);
      // Player answers correctly - increase speed
      setPlayerCar(prev => {
        const newSpeed = prev.speed + 10; // Increase speed, no cap
        return {
          ...prev,
          speed: newSpeed
        };
      });
      generateNewQuestion();
    } else {
      console.log('❌ Player answered incorrectly - decreasing speed');
      setQuestionsAnswered(prev => prev + 1);
      // Player answers incorrectly - decrease speed
      setPlayerCar(prev => {
        const newSpeed = Math.max(prev.speed - 10, 50); // Decrease speed, min 50 kph
        return {
          ...prev,
          speed: newSpeed
        };
      });
      generateNewQuestion();
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
                  questions_answered: questionsAnswered,
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
            // Check if all three quiz types are completed
            const allQuizzesCompleted = true && // Racing game is being completed
              progress?.completed === true && // Highlight quiz completed
              progress?.grammar_runner_parts_of_speech_completed === true; // Grammar runner completed
            
            await supabase
              .from('quiz_progress')
              .upsert({
                user_id: user.id,
                racing_game_completed: true, // Add racing game completion flag
                parts_of_speech_course_completed: allQuizzesCompleted // Update overall course completion
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
    const isMobile = window.innerWidth < 768;
    const isPortrait = window.innerHeight > window.innerWidth;
    const isVerticalRace = isMobile && isPortrait;

    // Clear canvas
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);

    if (isVerticalRace) {
             // Vertical racing for mobile portrait
       // Draw moving track with perspective effect (vertical) - much wider
       ctx.fillStyle = '#696969'; // Gray road
       ctx.fillRect(canvasDimensions.width / 2 - 75, 0, 150, canvasDimensions.height);

      // Draw moving road lines for speed effect (vertical)
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.setLineDash([20, 20]);
      
             // Draw multiple moving lines (bottom to top for upward motion illusion)
       for (let i = 0; i < 5; i++) {
         const lineY = (canvasDimensions.height + trackOffset + i * 100) % (canvasDimensions.height + 100);
         ctx.beginPath();
         ctx.moveTo(canvasDimensions.width / 2 - 65, lineY);
         ctx.lineTo(canvasDimensions.width / 2 + 65, lineY);
         ctx.stroke();
       }

             // Calculate car positions based on progress (vertical movement)
       const progressDiff = playerCar.progress - computerCar.progress;
       const maxOffset = 120; // Much larger offset for better separation
       
       // Base positions - cars start in the center of the track
       let playerY = canvasDimensions.height - 50;
       let computerY = canvasDimensions.height - 50;
       
       // Apply offset based on progress difference
       if (progressDiff > 0) {
         // Player is ahead - move player up, computer down
         playerY = canvasDimensions.height - 50 - Math.min(progressDiff * 0.3, maxOffset);
         computerY = canvasDimensions.height - 50 + Math.min(progressDiff * 0.3, maxOffset);
       } else {
         // Computer is ahead - move computer up, player down
         playerY = canvasDimensions.height - 50 + Math.min(Math.abs(progressDiff) * 0.3, maxOffset);
         computerY = canvasDimensions.height - 50 - Math.min(Math.abs(progressDiff) * 0.3, maxOffset);
       }

      // Draw player car image (if loaded) - vertical orientation
      if (imagesLoaded && playerCarImg.complete) {
        const carWidth = 30;
        const carHeight = (playerCarImg.height / playerCarImg.width) * carWidth;
        ctx.save();
        ctx.translate(canvasDimensions.width / 2 - 60, playerY);
        ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
        ctx.drawImage(playerCarImg, -carHeight/2, -carWidth/2, carHeight, carWidth);
        ctx.restore();
      } else {
        // Fallback to rectangle if image not loaded
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(canvasDimensions.width / 2 - 60, playerY, 20, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(canvasDimensions.width / 2 - 55, playerY + 5, 10, 10);
      }

      // Draw computer car image (if loaded) - vertical orientation
      if (imagesLoaded && computerCarImg.complete) {
        const carWidth = 30;
        const carHeight = (computerCarImg.height / computerCarImg.width) * carWidth;
        ctx.save();
        ctx.translate(canvasDimensions.width / 2 + 60, computerY);
        ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
        ctx.drawImage(computerCarImg, -carHeight/2, -carWidth/2, carHeight, carWidth);
        ctx.restore();
      } else {
        // Fallback to rectangle if image not loaded
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(canvasDimensions.width / 2 + 40, computerY, 20, 30);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(canvasDimensions.width / 2 + 45, computerY + 5, 10, 10);
      }

      // Draw progress bars (vertical)
      ctx.fillStyle = '#333';
      ctx.fillRect(10, 10, 20, 100);
      ctx.fillStyle = '#0066CC';
      ctx.fillRect(10, 10 + (100 - (playerCar.progress / FINISH_LINE) * 100), 20, (playerCar.progress / FINISH_LINE) * 100);

      ctx.fillStyle = '#333';
      ctx.fillRect(40, 10, 20, 100);
      ctx.fillStyle = '#CC0000';
      ctx.fillRect(40, 10 + (100 - (computerCar.progress / FINISH_LINE) * 100), 20, (computerCar.progress / FINISH_LINE) * 100);

         } else {
       // Horizontal racing for desktop and mobile landscape
       
       // Draw background image if loaded (for desktop only)
       if (imagesLoaded && trackBackgroundImg.complete && canvasDimensions.width >= 800) {
         ctx.drawImage(trackBackgroundImg, 0, 0, canvasDimensions.width, canvasDimensions.height);
       } else {
         // Fallback to solid colors if image not loaded
         ctx.fillStyle = '#87CEEB'; // Sky blue background
         ctx.fillRect(0, 0, canvasDimensions.width, canvasDimensions.height);
         
         // Draw moving track with perspective effect (much wider)
         ctx.fillStyle = '#696969'; // Gray road
         ctx.fillRect(0, 100, canvasDimensions.width, 300); // Much wider track
       }

       // Draw moving road lines for speed effect
       ctx.strokeStyle = '#FFFFFF';
       ctx.lineWidth = 3;
       ctx.setLineDash([20, 20]);
       
       // Draw multiple moving lines (right to left for forward motion illusion)
       for (let i = 0; i < 5; i++) {
         const lineX = (canvasDimensions.width - trackOffset - i * 100) % (canvasDimensions.width + 100);
         ctx.beginPath();
         ctx.moveTo(lineX, 150);
         ctx.lineTo(lineX, 350);
         ctx.stroke();
       }

                           // Calculate car positions based on progress (horizontal movement)
        const progressDiff = playerCar.progress - computerCar.progress;
        const maxOffset = 150; // Much larger offset for better separation
        
        // Center position on the track - much more centered
        const trackCenter = canvasDimensions.width / 2;
        const trackWidth = 300; // Much wider track
        
        // Base positions - cars start in the center of the track
        let playerX = trackCenter;
        let computerX = trackCenter;
        
        // Apply offset based on progress difference
        if (progressDiff > 0) {
          // Player is ahead - move player right, computer left
          playerX = trackCenter + Math.min(progressDiff * 0.3, maxOffset);
          computerX = trackCenter - Math.min(progressDiff * 0.3, maxOffset);
        } else {
          // Computer is ahead - move computer right, player left
          playerX = trackCenter - Math.min(Math.abs(progressDiff) * 0.3, maxOffset);
          computerX = trackCenter + Math.min(Math.abs(progressDiff) * 0.3, maxOffset);
        }
        
        // Ensure cars stay within track boundaries (much more generous)
        const trackLeft = trackCenter - trackWidth / 2 + 50; // 50px margin from edge
        const trackRight = trackCenter + trackWidth / 2 - 50; // 50px margin from edge
        
        playerX = Math.max(trackLeft, Math.min(trackRight, playerX));
        computerX = Math.max(trackLeft, Math.min(trackRight, computerX));

      // Draw player car image (if loaded)
      if (imagesLoaded && playerCarImg.complete) {
        const carWidth = 40;
        const carHeight = (playerCarImg.height / playerCarImg.width) * carWidth;
        ctx.drawImage(playerCarImg, playerX, playerCar.y, carWidth, carHeight);
      } else {
        // Fallback to rectangle if image not loaded
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(playerX, playerCar.y, 40, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(playerX + 5, playerCar.y + 5, 10, 10);
      }

      // Draw computer car image (if loaded)
      if (imagesLoaded && computerCarImg.complete) {
        const carWidth = 40;
        const carHeight = (computerCarImg.height / computerCarImg.width) * carWidth;
        ctx.drawImage(computerCarImg, computerX, computerCar.y, carWidth, carHeight);
      } else {
        // Fallback to rectangle if image not loaded
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(computerX, computerCar.y, 40, 20);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(computerX + 5, computerCar.y + 5, 10, 10);
      }

      // Draw progress bars (horizontal)
      ctx.fillStyle = '#333';
      ctx.fillRect(10, 10, 200, 20);
      ctx.fillStyle = '#0066CC';
      ctx.fillRect(10, 10, (playerCar.progress / FINISH_LINE) * 200, 20);

      ctx.fillStyle = '#333';
      ctx.fillRect(10, 40, 200, 20);
      ctx.fillStyle = '#CC0000';
      ctx.fillRect(10, 40, (computerCar.progress / FINISH_LINE) * 200, 20);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      drawGame(ctx);
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    // Cleanup function to cancel animation frame
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [playerCar, computerCar, trackOffset]);

       // Continuous movement system with perspective effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const movementInterval = setInterval(() => {
      // Calculate track speed based on the faster car's speed
      const fasterCarSpeed = Math.max(playerCar.speed, computerCar.speed);
      const trackSpeed = Math.max(5, fasterCarSpeed * 0.1); // Minimum 5, scales with speed
      
      // Update track movement (creates illusion of forward motion)
      setTrackOffset(prev => (prev + trackSpeed) % 100);

      // Update progress based on individual car speeds
      setPlayerCar(prev => {
        const newProgress = prev.progress + (prev.speed * 0.01);
        
        if (newProgress >= FINISH_LINE) {
          setTimeout(() => endGame('player'), 100);
        }
        
        return {
          ...prev,
          progress: newProgress
        };
      });

      setComputerCar(prev => {
        const newProgress = prev.progress + (prev.speed * 0.01);
        
        if (newProgress >= FINISH_LINE) {
          setTimeout(() => endGame('computer'), 100);
        }
        
        return {
          ...prev,
          progress: newProgress
        };
      });
    }, 50); // Update every 50ms for smooth movement

    return () => {
      clearInterval(movementInterval);
    };
  }, [gameState, playerCar.speed, computerCar.speed]);



  useEffect(() => {
    // Update timer display
    if (timeLeft > 0 && gameState === 'playing') {
      const timer = setTimeout(() => {
        setTimeLeft(prev => Math.max(0, prev - 0.1));
      }, 100);
      setGameTimer(timer);
    }
    
    // Cleanup function
    return () => {
      if (gameTimer) {
        clearTimeout(gameTimer);
      }
    };
  }, [timeLeft, gameState]);

  // Track game time
  useEffect(() => {
    let timeTimer: NodeJS.Timeout | null = null;
    if (gameState === 'playing') {
      timeTimer = setInterval(() => {
        setGameTime(prev => prev + 0.1);
      }, 100);
    }
    return () => {
      if (timeTimer) {
        clearInterval(timeTimer);
      }
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
      <div className="container mx-auto px-4 py-4">
        {/* Minimal header with just title and time */}
        <div className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-bold mb-2">🏎️ Grammar Racing</h1>
          <div className="flex justify-center items-center gap-4 text-sm">
            <span className="font-semibold">Time: {gameTime.toFixed(1)}s</span>
            {bestTime && <span className="text-blue-600">Best: {bestTime.toFixed(1)}s</span>}
          </div>
        </div>

                 <div className="flex flex-col gap-4">
           {/* Game Canvas - Centered */}
           <div className="flex justify-center">
             <canvas
               ref={canvasRef}
               width={canvasDimensions.width}
               height={canvasDimensions.height}
               className="border-2 border-gray-300 rounded-lg max-w-full"
             />
           </div>

           {/* Question Panel - Below the canvas */}
           <div className="max-w-md mx-auto w-full">
             <div className="bg-card rounded-lg shadow-lg p-4">
               <div className="flex justify-between items-center mb-3">
                 <h2 className="text-sm md:text-base font-bold">What part of speech is:</h2>
                 <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                   Q: {questionsAnswered}
                 </div>
               </div>
               
               {currentQuestion && (
                 <>
                   <div className="text-lg md:text-xl font-bold text-center mb-4 p-3 bg-primary/10 rounded">
                     "{currentQuestion.word}"
                   </div>
                   <div className="grid grid-cols-2 gap-2">
                     {currentQuestion.options.map((option) => (
                       <Button
                         key={option}
                         onClick={() => handleAnswer(option)}
                         className="w-full py-2 text-sm"
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