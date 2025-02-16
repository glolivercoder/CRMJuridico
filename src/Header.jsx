import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, Scale, Clock, Shield, FileText, Users, BarChart, Star, Mail, Phone, MapPin, ChevronDown, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function App() {
  // Animation classes for scroll reveal
  const revealFromBottom = "animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards";
  const revealFromLeft = "animate-in fade-in slide-in-from-left-8 duration-700 fill-mode-forwards";
  const revealFromRight = "animate-in fade-in slide-in-from-right-8 duration-700 fill-mode-forwards";
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const features = [
    {
      icon: <Scale className="w-6 h-6 mb-2" />,
      title: "Integração com Tribunais",
      description: "Conexão direta com PJe e e-SAJ para atualizações em tempo real"
    },
    {
      icon: <Clock className="w-6 h-6 mb-2" />,
      title: "Notificações Automáticas",
      description: "Atualizações instantâneas via WhatsApp e Telegram"
    },
    {
      icon: <Shield className="w-6 h-6 mb-2" />,
      title: "Segurança Avançada",
      description: "Proteção de dados com criptografia de ponta a ponta"
    },
    {
      icon: <FileText className="w-6 h-6 mb-2" />,
      title: "Gestão de Documentos",
      description: "Armazene e organize documentos de forma eficiente"
    },
    {
      icon: <Users className="w-6 h-6 mb-2" />,
      title: "Gestão de Clientes",
      description: "Mantenha todos os dados dos seus clientes organizados"
    },
    {
      icon: <BarChart className="w-6 h-6 mb-2" />,
      title: "Análises e Relatórios",
      description: "Insights valiosos sobre sua prática jurídica"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        {/* Statistics Section */}
        <section className="container mx-auto px-4 py-12 border-y bg-accent/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Advogados Ativos" },
              { number: "50.000+", label: "Processos Gerenciados" },
              { number: "98%", label: "Satisfação dos Clientes" },
              { number: "24/7", label: "Suporte Dedicado" }
            ].map((stat, index) => (
              <div key={index} className={`text-center ${revealFromBottom} delay-${index * 100}`}>
                <p className="text-3xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="container mx-auto px-4 py-20 bg-accent/20">
          <h2 className={`text-3xl font-bold text-center mb-12 ${revealFromBottom}`}>Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Cadastro Simples",
                description: "Crie sua conta em menos de 2 minutos e configure seu escritório"
              },
              {
                step: "2",
                title: "Integração Instantânea",
                description: "Conecte-se aos sistemas dos tribunais e importe seus processos"
              },
              {
                step: "3",
                title: "Gestão Completa",
                description: "Gerencie processos, prazos e comunicações em um só lugar"
              }
            ].map((step, index) => (
              <div key={index} className={`relative ${revealFromBottom} delay-${index * 150}`}>
                {index < 2 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-primary absolute -right-3 top-1/2 -translate-y-1/2 z-10" />
                )}
                <div className="bg-background p-8 rounded-lg shadow-lg relative">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-accent py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-6 transform origin-top-right"></div>
          <div className="container mx-auto px-4">
            <h2 className={`text-3xl font-bold text-center mb-12 relative ${revealFromBottom}`}>Por que escolher o LexConnect Pro?</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className={`space-y-6 ${revealFromLeft}`}>
                <div className="flex items-start gap-4 group hover:bg-primary/5 p-4 rounded-lg transition-colors">
                  <div className="bg-primary rounded-full p-2 mt-1">
                    <Clock className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Economia Real</h3>
                    <p className="text-muted-foreground">Solução completa com custo acessível e tecnologia open-source</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2 mt-1">
                    <Shield className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Comunicação Eficiente</h3>
                    <p className="text-muted-foreground">Notificações automáticas mantêm seus clientes sempre informados</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary rounded-full p-2 mt-1">
                    <Users className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Integração Total</h3>
                    <p className="text-muted-foreground">Conexão direta com sistemas dos tribunais (PJe, e-SAJ)</p>
                  </div>
                </div>
              </div>
              <div className={`bg-card p-8 rounded-lg shadow-xl ${revealFromRight} hover:shadow-2xl transition-shadow relative z-10`}>
                <h3 className="text-2xl font-bold mb-4">Comece Gratuitamente</h3>
                <p className="text-muted-foreground mb-6">Experimente todos os recursos por 14 dias sem compromisso</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center justify-center p-4 rounded-lg bg-accent/50">
                    <img src="https://www.pje.jus.br/portal/wp-content/uploads/2021/03/logo-pje.png" alt="PJe" className="h-8 object-contain opacity-75" />
                  </div>
                  <div className="flex items-center justify-center p-4 rounded-lg bg-accent/50">
                    <img src="https://www.tjsp.jus.br/Download/Portal/Links/esaj.png" alt="e-SAJ" className="h-8 object-contain opacity-75" />
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full text-lg"
                  onClick={() => navigate("/Login")}>
                  Criar Conta Grátis
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className={`text-3xl font-bold text-center mb-12 ${revealFromBottom}`}>Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  question: "Como funciona a integração com os tribunais?",
                  answer: "O LexConnect Pro se conecta automaticamente aos sistemas PJe e e-SAJ, importando atualizações processuais em tempo real. Você recebe notificações instantâneas sobre movimentações e prazos."
                },
                {
                  question: "As notificações via WhatsApp são seguras?",
                  answer: "Sim! Utilizamos criptografia de ponta a ponta e seguimos todas as diretrizes de segurança e LGPD para garantir a confidencialidade das informações."
                },
                {
                  question: "Posso experimentar antes de assinar?",
                  answer: "Sim! Oferecemos um período de teste gratuito de 14 dias com acesso a todas as funcionalidades. Não é necessário cartão de crédito."
                },
                {
                  question: "Qual o suporte oferecido?",
                  answer: "Oferecemos suporte 24/7 via chat, email e telefone. Nossa equipe está sempre disponível para ajudar com dúvidas e configurações."
                },
                {
                  question: "Como é feita a cobrança?",
                  answer: "Trabalhamos com planos mensais e anuais, com desconto especial para pagamento anual. Não há taxa de setup ou custos ocultos."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className={`${revealFromBottom} delay-${index * 100}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className={`text-3xl font-bold text-center mb-12 ${revealFromBottom}`}>O que dizem nossos clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Ricardo Silva",
                role: "Advogado Trabalhista",
                content: "O LexConnect Pro revolucionou a gestão do meu escritório. As integrações com os tribunais economizam horas de trabalho."
              },
              {
                name: "Dra. Maria Santos",
                role: "Advogada Tributarista",
                content: "A comunicação automática com clientes melhorou muito nosso relacionamento. Sistema completo e intuitivo."
              },
              {
                name: "Dr. João Costa",
                role: "Advogado Civilista",
                content: "Excelente custo-benefício. As notificações automáticas e a gestão de prazos são imprescindíveis."
              }
            ].map((testimonial, index) => (
              <Card key={index} className={`p-6 ${revealFromBottom} delay-${(index + 1) * 150}`}>
                <div className="flex items-center gap-2 mb-4">
                  {[1,2,3,4,5].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">{testimonial.content}</p>
                <div className="border-t pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 skew-y-6 transform origin-top-left"></div>
          <h2 className={`text-3xl font-bold mb-6 relative ${revealFromBottom}`}>Pronto para transformar seu escritório?</h2>
          <p className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto relative ${revealFromBottom} delay-150`}>
            Junte-se a centenas de escritórios que já estão usando o LexConnect Pro
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/Login")}
            className={`text-lg px-8 relative ${revealFromBottom} delay-300 hover:scale-105 transition-transform`}>
            Começar Agora
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-4">LexConnect Pro</h3>
              <p className="text-muted-foreground">Transformando a gestão jurídica com tecnologia e inovação.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Gestão de Processos</li>
                <li>Notificações Automáticas</li>
                <li>Integração com Tribunais</li>
                <li>Gestão Documental</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Sobre Nós</li>
                <li>Blog</li>
                <li>Carreiras</li>
                <li>Contato</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contato@lexconnect.pro
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  (11) 3333-3333
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  São Paulo, SP
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-muted-foreground">
            <p> 2024 LexConnect Pro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
