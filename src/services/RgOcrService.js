import { createWorker } from 'tesseract.js';
import { loadOpenCV } from '@/utils/opencvLoader';

export class RgOcrService {
  static instance = null;
  static cv = null;

  // Coordenadas relativas dos campos no RG (baseadas na imagem exemplo)
  static fieldCoordinates = {
    rg: { top: 8, left: 5, width: 30, height: 5 },
    nome: { top: 20, left: 5, width: 90, height: 5 },
    filiacao: { top: 28, left: 5, width: 90, height: 12 },
    naturalidade: { top: 45, left: 5, width: 30, height: 5 },
    dataNascimento: { top: 45, left: 70, width: 25, height: 5 },
    dataExpedicao: { top: 8, left: 70, width: 25, height: 5 },
    cpf: { top: 60, left: 5, width: 40, height: 5 }
  };

  static async getInstance() {
    if (!RgOcrService.instance) {
      RgOcrService.instance = new RgOcrService();
      await RgOcrService.instance.initialize();
    }
    return RgOcrService.instance;
  }

  async initialize() {
    if (!RgOcrService.cv) {
      try {
        console.log('Iniciando carregamento do OpenCV...');
        RgOcrService.cv = await loadOpenCV();
        console.log('OpenCV carregado com sucesso');
        
        // Verificar se o OpenCV está funcionando corretamente
        if (!RgOcrService.cv.Mat || typeof RgOcrService.cv.Mat !== 'function') {
          throw new Error('OpenCV.Mat não está disponível após inicialização');
        }
      } catch (error) {
        console.error('Erro ao inicializar OpenCV:', error);
        throw error;
      }
    }
  }

  createMat(width, height) {
    if (!RgOcrService.cv || !RgOcrService.cv.Mat) {
      throw new Error('OpenCV não está inicializado');
    }
    return new RgOcrService.cv.Mat(height, width, RgOcrService.cv.CV_8UC4);
  }

  async preprocessImage(imageData) {
    try {
      console.log('Iniciando pré-processamento da imagem...');
      const img = await this.loadImage(imageData);
      
      // Criar canvas e desenhar imagem
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Verificar se o OpenCV está disponível
      if (!RgOcrService.cv || !RgOcrService.cv.Mat) {
        throw new Error('OpenCV não está inicializado corretamente');
      }

      console.log('Convertendo imagem para formato OpenCV...');
      
      // Obter dados da imagem do canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Criar Mat a partir dos dados da imagem
      let src = this.createMat(canvas.width, canvas.height);
      let dataPtr = src.data;
      
      for (let i = 0; i < imageData.data.length; i++) {
        dataPtr[i] = imageData.data[i];
      }

      console.log('Imagem convertida para Mat');

      // Processar imagem
      let gray = this.createMat(canvas.width, canvas.height);
      RgOcrService.cv.cvtColor(src, gray, RgOcrService.cv.COLOR_RGBA2GRAY);

      let contrast = this.createMat(canvas.width, canvas.height);
      RgOcrService.cv.convertScaleAbs(gray, contrast, 1.5, 0);

      let denoised = this.createMat(canvas.width, canvas.height);
      RgOcrService.cv.fastNlMeansDenoising(contrast, denoised);

      let binary = this.createMat(canvas.width, canvas.height);
      RgOcrService.cv.adaptiveThreshold(
        denoised,
        binary,
        255,
        RgOcrService.cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        RgOcrService.cv.THRESH_BINARY,
        11,
        2
      );

      // Mostrar resultado no canvas
      RgOcrService.cv.imshow(canvas, binary);

      // Limpar memória
      src.delete();
      gray.delete();
      contrast.delete();
      denoised.delete();
      binary.delete();

      console.log('Pré-processamento concluído');
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      console.error('Erro no pré-processamento da imagem:', error);
      throw error;
    }
  }

  async loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async extractFieldFromImage(img, field) {
    const coords = RgOcrService.fieldCoordinates[field];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calcular coordenadas reais baseadas nas dimensões da imagem
    const x = (coords.left * img.width) / 100;
    const y = (coords.top * img.height) / 100;
    const w = (coords.width * img.width) / 100;
    const h = (coords.height * img.height) / 100;

    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

    return canvas.toDataURL('image/jpeg');
  }

  async recognizeField(imageData, field) {
    const img = await this.loadImage(imageData);
    const fieldImage = await this.extractFieldFromImage(img, field);
    const processedImage = await this.preprocessImage(fieldImage);

    const worker = await createWorker();
    await worker.loadLanguage('por');
    await worker.initialize('por');

    // Configurações específicas para cada campo
    const configs = {
      rg: { tessedit_char_whitelist: '0123456789.-' },
      cpf: { tessedit_char_whitelist: '0123456789.-' },
      dataNascimento: { tessedit_char_whitelist: '0123456789-' },
      dataExpedicao: { tessedit_char_whitelist: '0123456789-' },
      nome: { tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ' },
      filiacao: { tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ' },
      naturalidade: { tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ' }
    };

    await worker.setParameters({
      tessedit_pageseg_mode: '7', // Trata como uma única linha de texto
      ...configs[field]
    });

    const { data: { text } } = await worker.recognize(processedImage);
    await worker.terminate();

    return this.cleanFieldData(text, field);
  }

  cleanFieldData(text, field) {
    const cleaners = {
      rg: (t) => t.replace(/[^\d.-]/g, ''),
      cpf: (t) => t.replace(/[^\d.-]/g, ''),
      dataNascimento: (t) => {
        const matches = t.match(/(\d{2})[.-]?(\d{2})[.-]?(\d{4})/);
        return matches ? `${matches[1]}-${matches[2]}-${matches[3]}` : t;
      },
      dataExpedicao: (t) => {
        const matches = t.match(/(\d{2})[.-]?(\d{2})[.-]?(\d{4})/);
        return matches ? `${matches[1]}-${matches[2]}-${matches[3]}` : t;
      },
      nome: (t) => t.trim().toUpperCase(),
      filiacao: (t) => t.trim().toUpperCase(),
      naturalidade: (t) => t.trim().toUpperCase()
    };

    return cleaners[field] ? cleaners[field](text) : text.trim();
  }

  async extractAllFields(imageData) {
    const processedImage = await this.preprocessImage(imageData);
    const fields = Object.keys(RgOcrService.fieldCoordinates);
    
    const results = {};
    for (const field of fields) {
      try {
        results[field] = await this.recognizeField(imageData, field);
      } catch (error) {
        console.error(`Erro ao extrair campo ${field}:`, error);
        results[field] = '';
      }
    }

    // Processar filiação para separar pai e mãe
    if (results.filiacao) {
      const filiacaoLines = results.filiacao.split('\n');
      results.nomePai = filiacaoLines[0]?.trim() || '';
      results.nomeMae = filiacaoLines[1]?.trim() || '';
      delete results.filiacao;
    }

    return results;
  }

  // Método para salvar os dados extraídos como referência
  async saveRgReference(data) {
    // Aqui você implementaria a lógica para salvar no banco de dados
    console.log('Dados do RG salvos como referência:', data);
    return data;
  }
}
