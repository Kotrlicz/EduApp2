import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatAI from "@/components/ChatAI";
import Modal from "@/components/ui/Modal";

const lessonPages = [
  {
    title: "Podstatná jména",
    content: (
      <>
        <h3 className="text-2xl font-bold mb-2">Podstatná jména</h3>
        <p className="mb-4">Podstatná jména jsou slova označující osoby, místa, věci nebo pojmy. Příklady: <b>pes</b>, <b>město</b>, <b>štěstí</b>.</p>
      </>
    ),
  },
  {
    title: "Slovesa",
    content: (
      <>
        <h3 className="text-2xl font-bold mb-2">Slovesa</h3>
        <p className="mb-4">Slovesa jsou slova, která vyjadřují děj, stav nebo činnost. Příklady: <b>běžet</b>, <b>je</b>, <b>myslet</b>.</p>
      </>
    ),
  },
  {
    title: "Přídavná jména",
    content: (
      <>
        <h3 className="text-2xl font-bold mb-2">Přídavná jména</h3>
        <p className="mb-4">Přídavná jména popisují nebo blíže určují podstatná jména. Příklady: <b>šťastný</b>, <b>modrý</b>, <b>vysoký</b>.</p>
      </>
    ),
  },
]

const PartsOfSpeech = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [showQuizModal, setShowQuizModal] = useState(false);

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
                onClick={() => navigate("/course/grammar-fundamentals")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Zpět
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
                Moje lekce
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Procvičování mluvení
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pokrok
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Profil
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
              Slovní <span className="text-gradient">druhy</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Objevte základní stavební kameny anglické gramatiky: podstatná jména, slovesa, přídavná jména a další. Každý slovní druh má v větě svou jedinečnou roli.
            </p>
          </div>
          <div className="bg-card rounded-xl shadow-lg p-8 max-w-2xl w-full mx-auto">
            {lessonPages[page].content}
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Předchozí
              </Button>
              <span className="text-muted-foreground text-sm self-center">
                Stránka {page + 1} z {lessonPages.length}
              </span>
              {page < 2 ? (
                <Button
                  onClick={() => setPage((p) => Math.min(lessonPages.length - 1, p + 1))}
                  disabled={page === lessonPages.length - 1}
                >
                  Další
                </Button>
              ) : (
                <Button onClick={() => setShowQuizModal(true)}>
                  Start Quiz
                </Button>
              )}
            </div>
          </div>
          <Modal open={showQuizModal} onClose={() => setShowQuizModal(false)}>
            {/* Traditional quiz will go here instead of ChatAI */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Kvíz: Podstatná jména</h2>
              {/* Quiz content will be implemented here */}
            </div>
          </Modal>
        </div>
      </section>
    </div>
  );
};

export default PartsOfSpeech; 