import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

const TEMPLATES = {
  locacao: `
    CONTRATO DE LOCAÇÃO

    LOCADOR: {NOME_VENDEDOR}, {NACIONALIDADE_VENDEDOR}, {ESTADO_CIVIL_VENDEDOR}, {PROFISSAO_VENDEDOR}, 
    portador do RG nº {RG_VENDEDOR} e CPF nº {CPF_VENDEDOR}, 
    residente e domiciliado à {ENDERECO_VENDEDOR}.

    LOCATÁRIO: {NOME_COMPRADOR}, {NACIONALIDADE_COMPRADOR}, {ESTADO_CIVIL_COMPRADOR}, {PROFISSAO_COMPRADOR},
    portador do RG nº {RG_COMPRADOR} e CPF nº {CPF_COMPRADOR},
    residente e domiciliado à {ENDERECO_COMPRADOR}.

    As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Locação...
  `,
  
  venda: `
    CONTRATO DE COMPRA E VENDA

    VENDEDOR: {NOME_VENDEDOR}, {NACIONALIDADE_VENDEDOR}, {ESTADO_CIVIL_VENDEDOR}, {PROFISSAO_VENDEDOR}, 
    portador do RG nº {RG_VENDEDOR} e CPF nº {CPF_VENDEDOR}, 
    residente e domiciliado à {ENDERECO_VENDEDOR}.

    COMPRADOR: {NOME_COMPRADOR}, {NACIONALIDADE_COMPRADOR}, {ESTADO_CIVIL_COMPRADOR}, {PROFISSAO_COMPRADOR},
    portador do RG nº {RG_COMPRADOR} e CPF nº {CPF_COMPRADOR},
    residente e domiciliado à {ENDERECO_COMPRADOR}.

    As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Compra e Venda...
  `
};

class ContractService {
  static async generateContract(type, data) {
    try {
      // Criar um novo documento usando o template
      const template = TEMPLATES[type];
      if (!template) {
        throw new Error('Tipo de contrato não encontrado');
      }

      // Preparar os dados para o template
      const templateData = this.prepareTemplateData(data);

      // Substituir os campos no template
      let content = template;
      Object.entries(templateData).forEach(([key, value]) => {
        content = content.replace(new RegExp(`{${key}}`, 'g'), value || '');
      });

      // Criar um blob com o conteúdo
      const blob = new Blob([content], { type: 'text/plain' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      throw error;
    }
  }

  static prepareTemplateData(formData) {
    // Mapear os campos do formulário para os campos do template
    return {
      // Dados do Vendedor
      NOME_VENDEDOR: formData.vendedor_nome || '',
      RG_VENDEDOR: formData.vendedor_rg || '',
      CPF_VENDEDOR: formData.vendedor_cpf || '',
      PROFISSAO_VENDEDOR: formData.vendedor_profissao || '',
      NACIONALIDADE_VENDEDOR: formData.vendedor_nacionalidade || '',
      ESTADO_CIVIL_VENDEDOR: formData.vendedor_estado_civil || '',
      ENDERECO_VENDEDOR: formData.vendedor_endereco || '',

      // Dados do Cônjuge do Vendedor
      NOME_CONJUGE_VENDEDOR: formData.conjuge_vendedor_nome || '',
      RG_CONJUGE_VENDEDOR: formData.conjuge_vendedor_rg || '',
      CPF_CONJUGE_VENDEDOR: formData.conjuge_vendedor_cpf || '',
      PROFISSAO_CONJUGE_VENDEDOR: formData.conjuge_vendedor_profissao || '',
      NACIONALIDADE_CONJUGE_VENDEDOR: formData.conjuge_vendedor_nacionalidade || '',

      // Dados do Comprador
      NOME_COMPRADOR: formData.comprador_nome || '',
      RG_COMPRADOR: formData.comprador_rg || '',
      CPF_COMPRADOR: formData.comprador_cpf || '',
      PROFISSAO_COMPRADOR: formData.comprador_profissao || '',
      NACIONALIDADE_COMPRADOR: formData.comprador_nacionalidade || '',
      ESTADO_CIVIL_COMPRADOR: formData.comprador_estado_civil || '',
      ENDERECO_COMPRADOR: formData.comprador_endereco || '',

      // Dados do Cônjuge do Comprador
      NOME_CONJUGE_COMPRADOR: formData.conjuge_comprador_nome || '',
      RG_CONJUGE_COMPRADOR: formData.conjuge_comprador_rg || '',
      CPF_CONJUGE_COMPRADOR: formData.conjuge_comprador_cpf || '',
      PROFISSAO_CONJUGE_COMPRADOR: formData.conjuge_comprador_profissao || '',
      NACIONALIDADE_CONJUGE_COMPRADOR: formData.conjuge_comprador_nacionalidade || '',

      // Data atual formatada
      DATA_ATUAL: new Date().toLocaleDateString('pt-BR'),
    };
  }
}

export default ContractService;
