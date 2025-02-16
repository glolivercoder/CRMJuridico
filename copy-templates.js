import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join('C:', 'Users', 'gloli', 'OneDrive', 'Desktop', 'Projetos', 'Programaçao inteligente', 'Modelos de contrato');
const targetDir = path.join(__dirname, 'src', 'modelos', 'contratos');

// Criar diretório de destino se não existir
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copiar modelos de contrato
const templates = [
  'PROPOSTA-DE-LOCAÇÃO.docx',
  'CONTRATO-DE-COMPRA-E-VENDA-IMÓVEL-NA-PLANTA-FINANCIADO.docx'
];

templates.forEach(template => {
  const sourcePath = path.join(sourceDir, template);
  const targetPath = path.join(targetDir, template);
  
  try {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copiado: ${template}`);
  } catch (error) {
    console.error(`Erro ao copiar ${template}:`, error);
  }
});
