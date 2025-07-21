import { useNavigate } from "react-router-dom";
import { MessageCircle, Volume2, Users, Trophy } from "lucide-react";

const Welcome = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/learn");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/20 to-accent-light/30 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-accent/10 rounded-full blur-lg float-animation" />
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-primary-glow/20 rounded-full blur-xl float-animation" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* Main welcome content */}
        <div className="max-w-4xl mx-auto">
          {/* Logo area removed */}

          {/* Main heading */}
          <h1 className="fade-in-up text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Dědkův{" "}
            <span className="text-gradient">Rychlokurz</span>
          </h1>

          {/* Subtitle */}
          <p className="fade-in-delayed text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                  Jsi ready dát angličtině šanci? Pak jsi na správném místě!
          </p>

          {/* Feature highlights */}
          <div className="fade-in-delayed grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 rounded-xl card-gradient shadow-card">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Interactive Conversations</h3>
              <p className="text-muted-foreground text-sm">Practice speaking with AI tutors and real conversation partners</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl card-gradient shadow-card">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Volume2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Pronunciation Training</h3>
              <p className="text-muted-foreground text-sm">Perfect your accent with speech recognition and feedback</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl card-gradient shadow-card">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Your Progress</h3>
              <p className="text-muted-foreground text-sm">Monitor fluency improvements and unlock achievements</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="fade-in-delayed">
            <button 
              onClick={handleStart}
              className="hero-button group"
            >
              <span className="flex items-center gap-2">
                Start Learning English
                <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
          </div>

          {/* Bottom text */}
          <p className="fade-in-delayed text-sm text-muted-foreground mt-8">
            Join thousands of students improving their English every day
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;