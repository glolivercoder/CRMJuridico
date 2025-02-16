import { createWorker } from 'tesseract.js';

class OcrService {
  static instance = null;
  static worker = null;

  constructor() {
    this.initialize();
  }

  static getInstance() {
    if (!OcrService.instance) {
      OcrService.instance = new OcrService();
    }
    return OcrService.instance;
  }

  async initialize() {
    if (!OcrService.worker) {
      try {
        console.log('Iniciando Tesseract...');
        OcrService.worker = await createWorker();
        await OcrService.worker.loadLanguage('por');
        await OcrService.worker.initialize('por');
        console.log('Tesseract inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar Tesseract:', error);
        throw error;
      }
    }
  }

  async extractText(file) {
    try {
      // Pré-processar imagem
      const imageData = await this.preprocessImage(file);
      
      // Configurar parâmetros do Tesseract
      await OcrService.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-/() ',
        tessedit_pageseg_mode: '1'
      });

      // Executar OCR
      const result = await OcrService.worker.recognize(imageData);
      const { data: { text, confidence } } = result;

      // Extrair campos específicos do texto
      const fields = this.extractFields(text);

      return {
        text,
        confidence,
        fields
      };
    } catch (error) {
      console.error('Erro na extração de texto:', error);
      throw new Error('Falha ao extrair texto da imagem');
    }
  }

  async preprocessImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          // Desenhar imagem
          ctx.drawImage(img, 0, 0);
          
          // Aumentar contraste
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          for (let i = 0; i < data.length; i += 4) {
            // Converter para escala de cinza
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            
            // Aplicar threshold
            const value = avg > 128 ? 255 : 0;
            
            data[i] = value;     // R
            data[i + 1] = value; // G
            data[i + 2] = value; // B
          }
          
          ctx.putImageData(imageData, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  extractFields(text) {
    const fields = {};
    const lines = text.split('\n');

    lines.forEach(line => {
      line = line.trim();
      
      // Extrair Nome
      if (line.match(/nome/i)) {
        const match = line.match(/nome[:\s]+(.+)/i);
        if (match) {
          fields.nome = {
            value: match[1].trim(),
            confidence: 0.9
          };
        }
      }

      // Extrair CPF
      const cpfMatch = line.match(/(\d{3}\.?\d{3}\.?\d{3}-?\d{2})/);
      if (cpfMatch) {
        fields.cpf = {
          value: cpfMatch[1],
          confidence: 0.95
        };
      }

      // Extrair RG
      const rgMatch = line.match(/(\d{1,2}\.?\d{3}\.?\d{3}-?[0-9X])/);
      if (rgMatch) {
        fields.rg = {
          value: rgMatch[1],
          confidence: 0.95
        };
      }

      // Extrair Data de Nascimento
      const nascimentoMatch = line.match(/nasc(?:imento)?[:\s]+(\d{2}\/\d{2}\/\d{4}|\d{2}\.\d{2}\.\d{4}|\d{8})/i);
      if (nascimentoMatch) {
        const data = nascimentoMatch[1].replace(/[^\d]/g, '');
        fields.data_nascimento = {
          value: `${data.slice(0,2)}/${data.slice(2,4)}/${data.slice(4)}`,
          confidence: 0.9
        };
      }

      // Extrair Estado Civil
      if (line.match(/estado\s*civil/i)) {
        const match = line.match(/estado\s*civil[:\s]+(.+)/i);
        if (match) {
          fields.estado_civil = {
            value: match[1].trim(),
            confidence: 0.85
          };
        }
      }

      // Extrair Profissão
      if (line.match(/profiss[ãa]o/i)) {
        const match = line.match(/profiss[ãa]o[:\s]+(.+)/i);
        if (match) {
          fields.profissao = {
            value: match[1].trim(),
            confidence: 0.85
          };
        }
      }

      // Extrair Nacionalidade
      if (line.match(/nacionalidade/i)) {
        const match = line.match(/nacionalidade[:\s]+(.+)/i);
        if (match) {
          fields.nacionalidade = {
            value: match[1].trim(),
            confidence: 0.85
          };
        }
      }

      // Extrair Endereço
      if (line.match(/endere[çc]o/i)) {
        const match = line.match(/endere[çc]o[:\s]+(.+)/i);
        if (match) {
          fields.endereco = {
            value: match[1].trim(),
            confidence: 0.85
          };
        }
      }

      // Extrair Telefone
      const telefoneMatch = line.match(/(?:telefone|cel(?:ular)?)[:\s]+([0-9\s()-]{8,})/i);
      if (telefoneMatch) {
        fields.telefone = {
          value: telefoneMatch[1].trim(),
          confidence: 0.85
        };
      }

      // Extrair Email
      const emailMatch = line.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i);
      if (emailMatch) {
        fields.email = {
          value: emailMatch[1].trim(),
          confidence: 0.9
        };
      }

      // Extrair Nome do Pai
      if (line.match(/(?:nome\s+do\s+)?pai/i)) {
        const match = line.match(/pai[:\s]+(.+)/i);
        if (match) {
          fields.nome_pai = {
            value: match[1].trim(),
            confidence: 0.85
          };
        }
      }

      // Extrair Nome da Mãe
      if (line.match(/(?:nome\s+d[ae]\s+)?m[ãa]e/i)) {
        const match = line.match(/m[ãa]e[:\s]+(.+)/i);
        if (match) {
          fields.nome_mae = {
            value: match[1].trim(),
            confidence: 0.85
          };
        }
      }

      // Extrair Naturalidade
      if (line.match(/naturalidade/i)) {
        const match = line.match(/naturalidade[:\s]+(.+)/i);
        if (match) {
          fields.naturalidade = {
            value: match[1].trim(),
            confidence: 0.85
          };
        }
      }
    });

    return fields;
  }

  async terminate() {
    if (OcrService.worker) {
      await OcrService.worker.terminate();
      OcrService.worker = null;
    }
  }
}

export default OcrService;
