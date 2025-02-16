import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProcessCard } from "./ProcessCard";

export function HeroSection() {
  const navigate = useNavigate();
  const revealFromBottom = "animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards";
  const revealFromRight = "animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-forwards";

  return (
    <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center" view-transition-name="hero">
      <div className="text-center md:text-left">
        <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${revealFromBottom} delay-150`}>
          Gestão Jurídica Inteligente
        </h1>
        <p className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto ${revealFromBottom} delay-300`}>
          Simplifique a gestão do seu escritório com nossa plataforma completa para advogados
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/Login")}
          className={`text-lg px-8 ${revealFromBottom} delay-500 hover:scale-105 transition-transform`}>
          Começar Agora
        </Button>
      </div>
      <div className={`${revealFromRight} delay-700`}>
        <ProcessCard />
      </div>
    </section>
  );
}
