import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Camera, Upload, X } from 'lucide-react';
import { mockClientes } from '@/lib/mockData';
import { SimpleOcrService } from '@/services/SimpleOcrService';

export default function Clientes() {
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    rg: '',
    cpf: '',
    dataExpedicao: '',
    dataNascimento: '',
    nomePai: '',
    nomeMae: '',
    naturalidade: '',
    telefone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [ocrService, setOcrService] = useState(null);

  useEffect(() => {
    // Inicializar o serviço OCR quando o componente montar
    async function initOcr() {
      try {
        const service = await SimpleOcrService.getInstance();
        setOcrService(service);
      } catch (error) {
        console.error('Erro ao inicializar OCR:', error);
      }
    }
    initOcr();

    // Limpar quando o componente desmontar
    return () => {
      if (ocrService) {
        ocrService.cleanup();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      alert('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  const captureImage = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    stopCamera();
    await processImage(canvas.toDataURL('image/jpeg'));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      await processImage(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (imageData) => {
    if (!ocrService) {
      alert('Serviço OCR não está inicializado. Tente recarregar a página.');
      return;
    }

    setLoading(true);
    try {
      console.log('Iniciando processamento da imagem...');
      const result = await ocrService.extractText(imageData);
      console.log('Resultado OCR:', result);

      if (result.confidence < 50) {
        alert('Aviso: A qualidade do reconhecimento está baixa. Verifique os dados extraídos.');
      }

      setFormData(prev => ({
        ...prev,
        nome: result.nome || '',
        rg: result.rg || '',
        cpf: result.cpf || '',
        dataNascimento: result.dataNascimento || '',
        dataExpedicao: result.dataExpedicao || '',
        nomePai: result.nomePai || '',
        nomeMae: result.nomeMae || '',
        naturalidade: result.naturalidade || ''
      }));

    } catch (error) {
      console.error('Erro no processamento OCR:', error);
      alert('Erro ao processar a imagem. Por favor, tente novamente ou insira os dados manualmente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => setShowNewClientModal(true)}>
          Novo Cliente
        </Button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Nome</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Telefone</th>
                <th className="text-left py-3 px-4">CPF</th>
                <th className="text-left py-3 px-4">Data de Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {mockClientes.map((cliente) => (
                <tr key={cliente.id} className="border-b">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {cliente.nome}
                    </div>
                  </td>
                  <td className="py-3 px-4">{cliente.email}</td>
                  <td className="py-3 px-4">{cliente.telefone}</td>
                  <td className="py-3 px-4">{cliente.cpf}</td>
                  <td className="py-3 px-4">{cliente.data_cadastro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showNewClientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Novo Cliente</h2>
              <Button variant="ghost" onClick={() => {
                setShowNewClientModal(false);
                stopCamera();
              }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Botões de Captura */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={startCamera}
                  disabled={loading}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Câmera
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => document.getElementById('fileInput').click()}
                  disabled={loading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Carregar Imagem
                </Button>
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Câmera */}
              {showCamera && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <Button
                    className="absolute bottom-4 left-1/2 -translate-x-1/2"
                    onClick={captureImage}
                  >
                    Capturar
                  </Button>
                </div>
              )}

              {/* Formulário */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">RG</label>
                  <input
                    type="text"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Expedição</label>
                  <input
                    type="date"
                    name="dataExpedicao"
                    value={formData.dataExpedicao}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Data de Nascimento</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome do Pai</label>
                  <input
                    type="text"
                    name="nomePai"
                    value={formData.nomePai}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Nome da Mãe</label>
                  <input
                    type="text"
                    name="nomeMae"
                    value={formData.nomeMae}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Naturalidade</label>
                  <input
                    type="text"
                    name="naturalidade"
                    value={formData.naturalidade}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md border bg-background"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNewClientModal(false);
                    stopCamera();
                  }}
                >
                  Cancelar
                </Button>
                <Button disabled={loading}>
                  {loading ? 'Processando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
