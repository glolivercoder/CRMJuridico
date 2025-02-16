# Análise do Sistema CRM Jurídico

## 1. Estrutura Original do Sistema

### 1.1 Categorização de Documentos
- Hierarquia completa de documentos:
  - Categorias principais (ex: Contratos, Documentos de Identificação)
  - Subcategorias
  - Tipos específicos de documentos
  - Metadados associados a cada tipo

### 1.2 Sistema OCR
- Funcionalidade de OCR integrada
- Seleção de área na imagem (side-by-side)
- Extração precisa de texto
- Mapeamento automático para campos específicos
- Suporte a diferentes tipos de documentos

### 1.3 Tipos de Pessoas e Relacionamentos
- Vendedor
- Comprador
- Cônjuge do Vendedor
- Cônjuge do Comprador
- Campos específicos para cada tipo
- Relacionamentos entre pessoas

### 1.4 Campos de Documentos
- Campos padrão:
  - Nome Completo
  - CPF
  - RG
  - Data de Nascimento
  - Estado Civil
  - Profissão
  - Nacionalidade
  - Naturalidade
  - Endereço
  - Telefone
  - Email
  - Nome do Pai
  - Nome da Mãe

## 2. Erros Cometidos na Implementação

### 2.1 Erros Estruturais
1. Destruição da hierarquia de categorias e subcategorias
2. Perda da relação entre tipos de documentos
3. Remoção acidental dos relacionamentos entre pessoas
4. Simplificação excessiva do sistema OCR

### 2.2 Erros de Interface
1. Remoção do layout side-by-side efetivo
2. Perda da visualização hierárquica de documentos
3. Eliminação da navegação entre categorias
4. Simplificação excessiva da seleção de área

### 2.3 Erros Funcionais
1. Quebra do sistema OCR existente
2. Perda da funcionalidade de mapeamento automático
3. Remoção do histórico de extrações
4. Eliminação do contexto entre documentos relacionados

## 3. Plano de Reconstrução

### 3.1 Restauração da Estrutura
1. Reimplementar a hierarquia completa de documentos
2. Restaurar todos os tipos de relacionamentos
3. Recriar o sistema de categorização
4. Manter todos os campos originais

### 3.2 Interface do Usuário
1. Layout side-by-side com:
   - Visualização do documento original
   - Área de seleção para OCR
   - Campos de formulário
   - Preview do texto extraído

2. Navegação hierárquica:
   - Lista de categorias
   - Subcategorias expansíveis
   - Tipos de documentos
   - Filtros e busca

### 3.3 Funcionalidade OCR
1. Seleção precisa de área
2. Processamento OCR otimizado
3. Mapeamento automático de campos
4. Histórico de extrações
5. Sugestões baseadas no tipo de documento

### 3.4 Componentes React
1. DocumentViewer
   - Visualização do documento
   - Controles de zoom
   - Seleção de área

2. OCRProcessor
   - Integração com Tesseract
   - Processamento de imagem
   - Extração de texto

3. FormBuilder
   - Campos dinâmicos
   - Validação
   - Auto-preenchimento

4. CategoryNavigator
   - Árvore de categorias
   - Filtros
   - Busca

## 4. Prioridades na Reconstrução

1. Restaurar a estrutura base do sistema
2. Reimplementar o OCR com side-by-side
3. Recriar a hierarquia de documentos
4. Restaurar os relacionamentos entre pessoas
5. Implementar a interface completa
6. Adicionar validações e melhorias

## 5. Componentes Específicos a Serem Preservados

1. Estrutura de categorias e documentos
2. Sistema OCR com seleção de área
3. Relacionamentos entre pessoas
4. Campos específicos por tipo de documento
5. Mapeamento automático de campos
6. Interface side-by-side
7. Navegação hierárquica

## 6. Lições Aprendidas

1. Analisar completamente o código antes de modificar
2. Preservar funcionalidades existentes
3. Manter a complexidade necessária
4. Documentar alterações
5. Testar cada componente individualmente
6. Manter backup das versões funcionais
