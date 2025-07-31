import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import GrammarFundamentals from "./pages/GrammarFundamentals";
import PartsOfSpeech from "./pages/PartsOfSpeech";
import ArticlesAndDeterminers from "./pages/ArticlesAndDeterminers";
import ArticlesAndDeterminersQuizType from "./pages/ArticlesAndDeterminersQuizType";
import ArticlesAndDeterminersPresentation from "./pages/ArticlesAndDeterminersPresentation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChooseQuizType from "./pages/ChooseQuizType";
import HighlightQuiz from "./pages/HighlightQuiz";
import ModeSelection from "./pages/ModeSelection";
import RacingGame from "./pages/RacingGame";
import GrammarRunner from "./pages/GrammarRunner";
import GrammarRunnerModeSelection from "./pages/GrammarRunnerModeSelection";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/choose-mode" element={<ModeSelection />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/course/grammar-fundamentals" element={<GrammarFundamentals />} />
          <Route path="/course/grammar-fundamentals/parts-of-speech" element={<PartsOfSpeech />} />
          <Route path="/course/grammar-fundamentals/parts-of-speech/choose-quiz" element={<ChooseQuizType />} />
          <Route path="/course/grammar-fundamentals/parts-of-speech/highlight-quiz" element={<HighlightQuiz />} />
          <Route path="/course/grammar-fundamentals/articles-and-determiners" element={<ArticlesAndDeterminers />} />
          <Route path="/course/grammar-fundamentals/articles-and-determiners/choose-quiz" element={<ArticlesAndDeterminersQuizType />} />
          <Route path="/course/grammar-fundamentals/articles-and-determiners/presentation" element={<ArticlesAndDeterminersPresentation />} />
          <Route path="/racing-game" element={<RacingGame />} />
          <Route path="/grammar-runner" element={<GrammarRunnerModeSelection />} />
          <Route path="/grammar-runner/:courseId" element={<GrammarRunner />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
