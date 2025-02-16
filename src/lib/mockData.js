export const mockDashboardData = {
  stats: {
    processos_ativos: 156,
    prazos_proximos: 23,
    pendencias: 12,
    concluidos: 89
  },
  processos: [
    {
      id: 1,
      numero: '0001234-12.2024.8.26.0100',
      cliente_nome: 'João Silva',
      assunto: 'Ação de Indenização',
      status: 'Em andamento',
      ultima_atualizacao: '2024-03-09'
    },
    {
      id: 2,
      numero: '0002345-23.2024.8.26.0100',
      cliente_nome: 'Maria Santos',
      assunto: 'Ação Trabalhista',
      status: 'Aguardando prazo',
      ultima_atualizacao: '2024-03-08'
    }
  ]
};

export const mockClientes = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    data_cadastro: '2024-03-09'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    telefone: '(11) 88888-8888',
    cpf: '987.654.321-00',
    data_cadastro: '2024-03-08'
  }
];

export const mockDocumentos = [
  {
    id: 1,
    nome: 'Petição Inicial',
    tipo: 'PDF',
    processo_numero: '0001234-12.2024.8.26.0100',
    data_upload: '2024-03-09'
  },
  {
    id: 2,
    nome: 'Procuração',
    tipo: 'PDF',
    processo_numero: '0002345-23.2024.8.26.0100',
    data_upload: '2024-03-08'
  }
];
