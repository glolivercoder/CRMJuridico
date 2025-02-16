import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import OcrService from '@/services/OcrService';

export function OCRSelectionArea({ open, onOpenChange, imageUrl, onSelect }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (imageUrl && canvasRef.current) {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        imageRef.current = image;
        const canvas = canvasRef.current;
        canvas.width = image.width;
        canvas.height = image.height;
        drawImage();
      };
    }
  }, [imageUrl]);

  const drawImage = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0);

    if (selectionBox) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        selectionBox.x,
        selectionBox.y,
        selectionBox.width,
        selectionBox.height
      );
    }
  };

  const handleMouseDown = (e) => {
    if (!isSelecting) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPoint({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isSelecting || !startPoint) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSelectionBox({
      x: Math.min(startPoint.x, x),
      y: Math.min(startPoint.y, y),
      width: Math.abs(x - startPoint.x),
      height: Math.abs(y - startPoint.y)
    });

    drawImage();
  };

  const handleMouseUp = async () => {
    if (!isSelecting || !selectionBox) return;

    setIsSelecting(false);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = selectionBox.width;
      canvas.height = selectionBox.height;

      ctx.drawImage(
        imageRef.current,
        selectionBox.x,
        selectionBox.y,
        selectionBox.width,
        selectionBox.height,
        0,
        0,
        selectionBox.width,
        selectionBox.height
      );

      // Converter para blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve));
      
      // Processar OCR na área selecionada
      const ocrService = await OcrService.getInstance();
      const result = await ocrService.extractText(blob);

      if (result.text) {
        onSelect(result.text.trim());
      } else {
        toast({
          variant: "destructive",
          title: "Erro no OCR",
          description: "Não foi possível extrair texto desta área",
        });
      }
    } catch (error) {
      console.error('Erro ao processar área selecionada:', error);
      toast({
        variant: "destructive",
        title: "Erro no OCR",
        description: "Erro ao processar a área selecionada",
      });
    }

    setSelectionBox(null);
    setStartPoint(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Selecione a Área do Texto</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="border border-gray-200"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
          />
          
          <div className="mt-4 flex justify-between">
            <Button
              variant={isSelecting ? "secondary" : "default"}
              onClick={() => setIsSelecting(!isSelecting)}
            >
              {isSelecting ? 'Cancelar Seleção' : 'Iniciar Seleção'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
