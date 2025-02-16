import React from "react";
import { Scale, Clock, Shield, FileText, Users, BarChart } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export function FeaturesSection() {
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
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
