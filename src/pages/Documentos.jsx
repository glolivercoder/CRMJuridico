import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { SimpleOcrService } from '@/services/SimpleOcrService';
import ContractService from '@/services/ContractService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const tiposDocumento = {
  'RG': 'RG',
  'CPF': 'CPF',
  'CNH': 'CNH',
};

const personTypes = [
  { value: 'PF', label: 'Pessoa Física' },
  { value: 'PJ', label: 'Pessoa Jurídica' },
];

const contractTypes = [
  { id: 'locacao', name: 'Contrato de Locação' },
  { id: 'venda', name: 'Contrato de Venda' },
];

export default function Documentos() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedContractType, setSelectedContractType] = useState('');
  const [formData, setFormData] = useState({});
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [selectedPerson, setSelectedPerson] = useState('');
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      processImageOCR(file);
    }
  };

  const processImageOCR = async (file) => {
    try {
      setLoading(true);
      
      const text = await SimpleOcrService.processImage(file);
      const extractedData = SimpleOcrService.extractFormData(text);
      
      // Perguntar ao usuário se os dados estão corretos
      const confirmed = window.confirm('Os dados foram preenchidos automaticamente. Os dados estão corretos?');
      
      if (confirmed) {
        setFormData(extractedData);
      } else {
        setShowManualSelect(true);
      }
    } catch (error) {
      console.error('Erro ao processar OCR:', error);
      toast({
        variant: "destructive",
        title: "Erro no OCR",
        description: "Não foi possível processar o texto da imagem",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContract = async () => {
    try {
      setLoading(true);
      const url = await ContractService.generateContract(selectedContractType, formData);
      window.open(url, '_blank');
      
      toast({
        title: "Contrato Gerado",
        description: "O contrato foi gerado com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao gerar contrato:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar o contrato",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="space-y-8">
        {/* Seleção de Contrato */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Gerar Contrato</h2>
          <div className="flex-1">
            <Label>Tipo de Contrato</Label>
            <Select value={selectedContractType} onValueChange={setSelectedContractType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o contrato" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Upload de Documento */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upload de Documento</h3>
          <Input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full"
          />
        </div>

        {/* Formulário */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Dados do Contrato</h3>
          
          {/* Campos dinâmicos baseados no tipo de contrato */}
          {selectedContractType === 'venda' ? (
            <>
              {/* Dados do Vendedor */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Dados do Vendedor</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={formData.vendedor_nome || ''}
                      onChange={(e) => setFormData({...formData, vendedor_nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nacionalidade</Label>
                    <Input
                      value={formData.vendedor_nacionalidade || ''}
                      onChange={(e) => setFormData({...formData, vendedor_nacionalidade: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Input
                      value={formData.vendedor_estado_civil || ''}
                      onChange={(e) => setFormData({...formData, vendedor_estado_civil: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profissão</Label>
                    <Input
                      value={formData.vendedor_profissao || ''}
                      onChange={(e) => setFormData({...formData, vendedor_profissao: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      value={formData.vendedor_rg || ''}
                      onChange={(e) => setFormData({...formData, vendedor_rg: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={formData.vendedor_cpf || ''}
                      onChange={(e) => setFormData({...formData, vendedor_cpf: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input
                      value={formData.vendedor_endereco || ''}
                      onChange={(e) => setFormData({...formData, vendedor_endereco: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Comprador */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Dados do Comprador</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={formData.comprador_nome || ''}
                      onChange={(e) => setFormData({...formData, comprador_nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nacionalidade</Label>
                    <Input
                      value={formData.comprador_nacionalidade || ''}
                      onChange={(e) => setFormData({...formData, comprador_nacionalidade: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Input
                      value={formData.comprador_estado_civil || ''}
                      onChange={(e) => setFormData({...formData, comprador_estado_civil: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profissão</Label>
                    <Input
                      value={formData.comprador_profissao || ''}
                      onChange={(e) => setFormData({...formData, comprador_profissao: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      value={formData.comprador_rg || ''}
                      onChange={(e) => setFormData({...formData, comprador_rg: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={formData.comprador_cpf || ''}
                      onChange={(e) => setFormData({...formData, comprador_cpf: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input
                      value={formData.comprador_endereco || ''}
                      onChange={(e) => setFormData({...formData, comprador_endereco: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : selectedContractType === 'locacao' ? (
            <>
              {/* Dados do Locador */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Dados do Locador</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={formData.vendedor_nome || ''}
                      onChange={(e) => setFormData({...formData, vendedor_nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nacionalidade</Label>
                    <Input
                      value={formData.vendedor_nacionalidade || ''}
                      onChange={(e) => setFormData({...formData, vendedor_nacionalidade: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Input
                      value={formData.vendedor_estado_civil || ''}
                      onChange={(e) => setFormData({...formData, vendedor_estado_civil: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profissão</Label>
                    <Input
                      value={formData.vendedor_profissao || ''}
                      onChange={(e) => setFormData({...formData, vendedor_profissao: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      value={formData.vendedor_rg || ''}
                      onChange={(e) => setFormData({...formData, vendedor_rg: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={formData.vendedor_cpf || ''}
                      onChange={(e) => setFormData({...formData, vendedor_cpf: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input
                      value={formData.vendedor_endereco || ''}
                      onChange={(e) => setFormData({...formData, vendedor_endereco: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Dados do Locatário */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Dados do Locatário</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input
                      value={formData.comprador_nome || ''}
                      onChange={(e) => setFormData({...formData, comprador_nome: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nacionalidade</Label>
                    <Input
                      value={formData.comprador_nacionalidade || ''}
                      onChange={(e) => setFormData({...formData, comprador_nacionalidade: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estado Civil</Label>
                    <Input
                      value={formData.comprador_estado_civil || ''}
                      onChange={(e) => setFormData({...formData, comprador_estado_civil: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Profissão</Label>
                    <Input
                      value={formData.comprador_profissao || ''}
                      onChange={(e) => setFormData({...formData, comprador_profissao: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      value={formData.comprador_rg || ''}
                      onChange={(e) => setFormData({...formData, comprador_rg: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={formData.comprador_cpf || ''}
                      onChange={(e) => setFormData({...formData, comprador_cpf: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Endereço</Label>
                    <Input
                      value={formData.comprador_endereco || ''}
                      onChange={(e) => setFormData({...formData, comprador_endereco: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}

          <div className="flex-1">
            <Label>Tipo de Documento</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(tiposDocumento).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Label>Tipo de Pessoa</Label>
            <Select value={selectedPerson} onValueChange={setSelectedPerson}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de pessoa" />
              </SelectTrigger>
              <SelectContent>
                {personTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botão Gerar Contrato */}
        <Button
          onClick={handleGenerateContract}
          disabled={loading || !selectedContractType}
          className="w-full"
        >
          {loading ? 'Gerando...' : 'Gerar Contrato'}
        </Button>
      </div>

      {/* Dialog para Seleção Manual */}
      <Dialog open={showManualSelect} onOpenChange={setShowManualSelect}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Selecione os Dados Manualmente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm">
              Selecione a área do documento que contém cada informação:
            </p>
            <Button onClick={() => setShowManualSelect(false)}>
              Concluir Seleção
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
