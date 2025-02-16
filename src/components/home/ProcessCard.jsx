import React from "react";
import { FileText } from "lucide-react";

export function ProcessCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25"></div>
      <div className="relative bg-card rounded-lg shadow-xl p-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-6">
          <div>
            <h3 className="font-semibold">Processo Trabalhista</h3>
            <p className="text-sm text-muted-foreground">Atualizado há 5 minutos</p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">Em andamento</span>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Nova movimentação</p>
              <p className="text-xs text-muted-foreground">Petição juntada aos autos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
