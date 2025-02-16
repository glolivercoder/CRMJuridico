import React from 'react';
import { FileText, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { mockDashboardData } from '@/lib/mockData';

export default function Dashboard() {
  const { stats, processos } = mockDashboardData;

  const statCards = [
    {
      title: 'Processos Ativos',
      value: stats.processos_ativos,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      title: 'Prazos Próximos',
      value: stats.prazos_proximos,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
    },
    {
      title: 'Pendências',
      value: stats.pendencias,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    },
    {
      title: 'Concluídos',
      value: stats.concluidos,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Processos Recentes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Número</th>
                <th className="text-left py-3 px-4">Cliente</th>
                <th className="text-left py-3 px-4">Assunto</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Última Atualização</th>
              </tr>
            </thead>
            <tbody>
              {processos.map((processo) => (
                <tr key={processo.id} className="border-b">
                  <td className="py-3 px-4">{processo.numero}</td>
                  <td className="py-3 px-4">{processo.cliente_nome}</td>
                  <td className="py-3 px-4">{processo.assunto}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs
                      ${processo.status === 'Em andamento' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                        processo.status === 'Aguardando prazo' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                        'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                      {processo.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{processo.ultima_atualizacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
