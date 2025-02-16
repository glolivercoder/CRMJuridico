import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Upload, FileText, Plus, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

const documentCategories = {
  'contratos': {
    name: 'Contratos',
    items: [
      { id: 'locacao', name: 'Contrato de Locação' },
      { id: 'compra_venda', name: 'Contrato de Compra e Venda' },
      { id: 'prestacao_servicos', name: 'Contrato de Prestação de Serviços' }
    ]
  },
  'processuais': {
    name: 'Processuais',
    items: [
      { id: 'peticao_inicial', name: 'Petição Inicial' },
      { id: 'contestacao', name: 'Contestação' },
      { id: 'recurso', name: 'Recurso' }
    ]
  }
};

export default function Documentos() {
  const [selectedCategory, setSelectedCategory] = useState('contratos');
  const [selectedDocument, setSelectedDocument] = useState('locacao');
  const [formData, setFormData] = useState({
    locador: {
      tipoDocumento: 'RG',
      numeroDocumento: '',
      dataExpedicao: '',
      naturalidade: '',
      orgaoExpedidor: '',
      dataNascimento: '',
      filiacao: '',
      nomeCompleto: '',
      cpf: '',
      profissao: '',
      endereco: '',
      telefone: '',
      whatsapp: ''
    },
    locatario: {
      tipoDocumento: 'RG',
      numeroDocumento: '',
      dataExpedicao: '',
      naturalidade: '',
      orgaoExpedidor: '',
      dataNascimento: '',
      filiacao: '',
      nomeCompleto: '',
      cpf: '',
      profissao: '',
      endereco: '',
      telefone: '',
      whatsapp: ''
    },
    imovel: {
      endereco: '',
      cep: '',
      valor: '',
      prazo: '',
      dataInicio: '',
      dataFim: ''
    },
    testemunhas: [],
    local: '',
    dataPorExtenso: '',
    usarDataSistema: false
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Modelo de Documento
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Camera className="w-4 h-4" /> Capturar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Carregar Imagem
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Buscar documentos..."
            />
          </div>
        </div>
        <Select value={selectedDocument} onValueChange={setSelectedDocument}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Contrato de Locação" />
          </SelectTrigger>
          <SelectContent>
            {documentCategories[selectedCategory]?.items.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Gerador de Documentos</h1>
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            id="usarDataSistema"
            checked={formData.usarDataSistema}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, usarDataSistema: checked }))
            }
          />
          <label htmlFor="usarDataSistema">Usar data do sistema</label>
        </div>

        <div className="flex gap-4 mb-4">
          <Button variant="outline">Relatório OCR</Button>
          <Button variant="outline">Exportar PDF</Button>
          <Button variant="outline">Exportar Imagem</Button>
          <Button variant="outline">Imprimir</Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="locador">
          <AccordionTrigger>Informações do Locador</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Tipo Documento</label>
                <Input value={formData.locador.tipoDocumento} readOnly />
              </div>
              <div>
                <label className="block mb-2">Número Documento</label>
                <Input
                  value={formData.locador.numeroDocumento}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, numeroDocumento: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Data Expedição</label>
                <Input
                  type="date"
                  value={formData.locador.dataExpedicao}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, dataExpedicao: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Naturalidade</label>
                <Input
                  value={formData.locador.naturalidade}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, naturalidade: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Orgão Expedidor</label>
                <Input
                  value={formData.locador.orgaoExpedidor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, orgaoExpedidor: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Data Nascimento</label>
                <Input
                  type="date"
                  value={formData.locador.dataNascimento}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, dataNascimento: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Filiação</label>
                <Input
                  value={formData.locador.filiacao}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, filiacao: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Nome Completo</label>
                <Input
                  value={formData.locador.nomeCompleto}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, nomeCompleto: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">CPF</label>
                <Input
                  value={formData.locador.cpf}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, cpf: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Profissão</label>
                <Input
                  value={formData.locador.profissao}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, profissao: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Endereço</label>
                <Input
                  value={formData.locador.endereco}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, endereco: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Telefone</label>
                <Input
                  value={formData.locador.telefone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, telefone: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Whatsapp</label>
                <Input
                  value={formData.locador.whatsapp}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locador: { ...prev.locador, whatsapp: e.target.value }
                  }))}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="locatario">
          <AccordionTrigger>Informações do Locatário</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Tipo Documento</label>
                <Input value={formData.locatario.tipoDocumento} readOnly />
              </div>
              <div>
                <label className="block mb-2">Número Documento</label>
                <Input
                  value={formData.locatario.numeroDocumento}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, numeroDocumento: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Data Expedição</label>
                <Input
                  type="date"
                  value={formData.locatario.dataExpedicao}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, dataExpedicao: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Naturalidade</label>
                <Input
                  value={formData.locatario.naturalidade}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, naturalidade: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Orgão Expedidor</label>
                <Input
                  value={formData.locatario.orgaoExpedidor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, orgaoExpedidor: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Data Nascimento</label>
                <Input
                  type="date"
                  value={formData.locatario.dataNascimento}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, dataNascimento: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Filiação</label>
                <Input
                  value={formData.locatario.filiacao}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, filiacao: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Nome Completo</label>
                <Input
                  value={formData.locatario.nomeCompleto}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, nomeCompleto: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">CPF</label>
                <Input
                  value={formData.locatario.cpf}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, cpf: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Profissão</label>
                <Input
                  value={formData.locatario.profissao}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, profissao: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Endereço</label>
                <Input
                  value={formData.locatario.endereco}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, endereco: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Telefone</label>
                <Input
                  value={formData.locatario.telefone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, telefone: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Whatsapp</label>
                <Input
                  value={formData.locatario.whatsapp}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    locatario: { ...prev.locatario, whatsapp: e.target.value }
                  }))}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="imovel">
          <AccordionTrigger>Informações do Imóvel</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Endereço</label>
                <Input
                  value={formData.imovel.endereco}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    imovel: { ...prev.imovel, endereco: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">CEP</label>
                <Input
                  value={formData.imovel.cep}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    imovel: { ...prev.imovel, cep: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Valor</label>
                <Input
                  type="number"
                  value={formData.imovel.valor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    imovel: { ...prev.imovel, valor: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Prazo</label>
                <Input
                  value={formData.imovel.prazo}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    imovel: { ...prev.imovel, prazo: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Data Início</label>
                <Input
                  type="date"
                  value={formData.imovel.dataInicio}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    imovel: { ...prev.imovel, dataInicio: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block mb-2">Data Fim</label>
                <Input
                  type="date"
                  value={formData.imovel.dataFim}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    imovel: { ...prev.imovel, dataFim: e.target.value }
                  }))}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end mt-4">
        <Button variant="default">Salvar Todos os Dados</Button>
      </div>
    </div>
  );
}
