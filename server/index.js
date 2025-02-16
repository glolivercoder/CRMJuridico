const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database(path.join(__dirname, 'crm-juridico.db'));

app.use(cors());
app.use(express.json());

// Initialize database tables
const schema = {
  processos: `
    CREATE TABLE IF NOT EXISTS processos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero TEXT NOT NULL,
      cliente_id INTEGER,
      assunto TEXT,
      status TEXT,
      ultima_atualizacao TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `,
  
  clientes: `
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT,
      telefone TEXT,
      cpf TEXT UNIQUE,
      rg TEXT,
      data_nascimento TEXT,
      nome_pai TEXT,
      nome_mae TEXT,
      cidade TEXT,
      estado TEXT,
      endereco TEXT,
      data_cadastro TEXT
    )
  `,
  
  documentos: `
    CREATE TABLE IF NOT EXISTS documentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      tipo TEXT,
      processo_id INTEGER,
      data_upload TEXT,
      caminho_arquivo TEXT,
      FOREIGN KEY (processo_id) REFERENCES processos (id)
    )
  `
};

Object.values(schema).forEach(tableSchema => {
  db.exec(tableSchema);
});

// Sample data
const sampleData = {
  clientes: [
    {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      data_cadastro: '2024-03-09'
    },
    {
      nome: 'Maria Santos',
      email: 'maria.santos@email.com',
      telefone: '(11) 88888-8888',
      cpf: '987.654.321-00',
      data_cadastro: '2024-03-08'
    }
  ],
  processos: [
    {
      numero: '0001234-12.2024.8.26.0100',
      cliente_id: 1,
      assunto: 'Ação de Indenização',
      status: 'Em andamento',
      ultima_atualizacao: '2024-03-09'
    },
    {
      numero: '0002345-23.2024.8.26.0100',
      cliente_id: 2,
      assunto: 'Ação Trabalhista',
      status: 'Aguardando prazo',
      ultima_atualizacao: '2024-03-08'
    }
  ]
};

// Insert sample data if tables are empty
const clientCount = db.prepare('SELECT COUNT(*) as count FROM clientes').get();
if (clientCount.count === 0) {
  const insertCliente = db.prepare(`
    INSERT INTO clientes (nome, email, telefone, cpf, data_cadastro)
    VALUES (@nome, @email, @telefone, @cpf, @data_cadastro)
  `);

  const insertProcesso = db.prepare(`
    INSERT INTO processos (numero, cliente_id, assunto, status, ultima_atualizacao)
    VALUES (@numero, @cliente_id, @assunto, @status, @ultima_atualizacao)
  `);

  db.transaction(() => {
    sampleData.clientes.forEach(cliente => insertCliente.run(cliente));
    sampleData.processos.forEach(processo => insertProcesso.run(processo));
  })();
}

// API Routes
app.get('/api/dashboard', (req, res) => {
  const stats = {
    processos_ativos: db.prepare('SELECT COUNT(*) as count FROM processos WHERE status = "Em andamento"').get().count,
    prazos_proximos: db.prepare('SELECT COUNT(*) as count FROM processos WHERE status = "Aguardando prazo"').get().count,
    pendencias: 12, // Example static number
    concluidos: db.prepare('SELECT COUNT(*) as count FROM processos WHERE status = "Concluído"').get().count
  };

  const processos = db.prepare(`
    SELECT p.*, c.nome as cliente_nome 
    FROM processos p 
    JOIN clientes c ON p.cliente_id = c.id 
    ORDER BY p.ultima_atualizacao DESC 
    LIMIT 5
  `).all();

  res.json({ stats, processos });
});

app.get('/api/clientes', (req, res) => {
  const clientes = db.prepare('SELECT * FROM clientes ORDER BY data_cadastro DESC').all();
  res.json(clientes);
});

app.get('/api/documentos', (req, res) => {
  const documentos = db.prepare(`
    SELECT d.*, p.numero as processo_numero 
    FROM documentos d
    LEFT JOIN processos p ON d.processo_id = p.id
    ORDER BY d.data_upload DESC
  `).all();
  res.json(documentos);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
