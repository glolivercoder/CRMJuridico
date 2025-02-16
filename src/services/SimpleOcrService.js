import { createWorker } from 'tesseract.js';

export class SimpleOcrService {
  static instance = null;
  static worker = null;

  static async getInstance() {
    if (!SimpleOcrService.instance) {
      SimpleOcrService.instance = new SimpleOcrService();
      await SimpleOcrService.instance.initialize();
    }
    return SimpleOcrService.instance;
  }

  async initialize() {
    if (!SimpleOcrService.worker) {
      try {
        console.log('Iniciando Tesseract...');
        const worker = await createWorker();
        await worker.load();
        await worker.loadLanguage('por');
        await worker.initialize('por');
        SimpleOcrService.worker = worker;
        console.log('Tesseract inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar Tesseract:', error);
        throw error;
      }
    }
  }

  async processImage(file) {
    if (!SimpleOcrService.worker) {
      throw new Error('Tesseract não foi inicializado');
    }

    try {
      const result = await SimpleOcrService.worker.recognize(file);
      return result.data.text;
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      throw error;
    }
  }

  async processImageRegion(imageUrl, region) {
    if (!SimpleOcrService.worker) {
      throw new Error('Tesseract não foi inicializado');
    }

    try {
      const result = await SimpleOcrService.worker.recognize(imageUrl, {
        rectangle: region
      });
      return result.data.text;
    } catch (error) {
      console.error('Erro ao processar região da imagem:', error);
      throw error;
    }
  }

  async preprocessImage(imageData) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Ajustar dimensões
        canvas.width = img.width;
        canvas.height = img.height;
        
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
      img.src = imageData;
    });
  }

  async extractText(imageData) {
    try {
      // Pré-processar imagem
      const processedImage = await this.preprocessImage(imageData);
      
      // Configurar parâmetros do Tesseract
      await SimpleOcrService.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-/() ',
        tessedit_pageseg_mode: '1'
      });

      // Executar OCR
      const result = await SimpleOcrService.worker.recognize(processedImage);
      const { data: { text, confidence } } = result;

      return {
        text,
        confidence,
        ...this.extractFormData(text)
      };
    } catch (error) {
      console.error('Erro na extração de texto:', error);
      throw error;
    }
  }

  extractFormData(text) {
    const data = {};
    
    // Expressões regulares para extrair dados
    const regexPatterns = {
      nome: /nome:?\s*([^\n,]+)/i,
      rg: /rg:?\s*([\d.-]+)/i,
      cpf: /cpf:?\s*([\d.-]+)/i,
      endereco: /endere[çc]o:?\s*([^\n]+)/i,
    };

    // Tenta encontrar dados do vendedor
    const vendedorText = text.match(/vendedor:?\s*([^]*?)(?=comprador|$)/i)?.[1] || text;
    if (vendedorText) {
      Object.entries(regexPatterns).forEach(([field, pattern]) => {
        const match = vendedorText.match(pattern);
        if (match) {
          data[`vendedor_${field}`] = match[1].trim();
        }
      });
    }

    // Tenta encontrar dados do comprador
    const compradorText = text.match(/comprador:?\s*([^]*?)(?=vendedor|$)/i)?.[1] || text;
    if (compradorText) {
      Object.entries(regexPatterns).forEach(([field, pattern]) => {
        const match = compradorText.match(pattern);
        if (match) {
          data[`comprador_${field}`] = match[1].trim();
        }
      });
    }

    return data;
  }

  async cleanup() {
    if (SimpleOcrService.worker) {
      await SimpleOcrService.worker.terminate();
      SimpleOcrService.worker = null;
    }
  }
}
