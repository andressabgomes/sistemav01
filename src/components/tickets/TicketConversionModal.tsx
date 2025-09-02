import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TicketConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketTitle: string;
  onConversionComplete: () => void;
}

const TicketConversionModal = ({
  isOpen,
  onClose,
  ticketId,
  ticketTitle,
  onConversionComplete
}: TicketConversionModalProps) => {
  const [conversionReason, setConversionReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConversion = async () => {
    if (!conversionReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da conversão para atendimento presencial",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          type: 'presencial',
          conversion_reason: conversionReason,
          converted_at: new Date().toISOString(),
          status: 'converted'
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: "Conversão realizada",
        description: "Ticket convertido para atendimento presencial. A equipe presencial foi notificada.",
      });

      onConversionComplete();
      onClose();
      setConversionReason('');
    } catch (error) {
      console.error('Erro ao converter ticket:', error);
      toast({
        title: "Erro na conversão",
        description: "Não foi possível converter o ticket. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Converter para Atendimento Presencial
          </DialogTitle>
          <DialogDescription>
            Você está convertendo o ticket "{ticketTitle}" para atendimento presencial.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Users className="h-5 w-5 text-blue-600" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">Ação automática</p>
              <p className="text-blue-700">A equipe presencial será notificada automaticamente</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da conversão *</Label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo da conversão para atendimento presencial..."
              value={conversionReason}
              onChange={(e) => setConversionReason(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Este motivo ficará registrado no histórico do ticket
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleConversion} disabled={loading}>
            {loading ? 'Convertendo...' : 'Converter Ticket'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketConversionModal;