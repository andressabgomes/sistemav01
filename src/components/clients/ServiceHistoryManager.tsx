import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { History, Clock, Star, User, Wrench, Calendar, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ServiceRecord {
  id: string;
  service_type: string;
  service_date: string;
  duration_minutes: number;
  responsible_technician: string;
  description: string;
  solution?: string;
  equipment_serviced?: string;
  parts_used?: string;
  status: string;
  satisfaction_rating?: number;
  client_feedback?: string;
  cost?: number;
  billing_status: string;
  client?: {
    company_name: string;
    code: string;
  };
}

const ServiceHistoryManager = () => {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedTechnician, setSelectedTechnician] = useState<string>('all');

  useEffect(() => {
    fetchServiceHistory();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [serviceRecords, selectedServiceType, selectedStatus, selectedTechnician]);

  const fetchServiceHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('service_history')
        .select(`
          *,
          client:clients(company_name, code)
        `)
        .order('service_date', { ascending: false });

      if (error) throw error;

      setServiceRecords(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico de atendimentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico de atendimentos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = serviceRecords;

    if (selectedServiceType !== 'all') {
      filtered = filtered.filter(record => record.service_type === selectedServiceType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    if (selectedTechnician !== 'all') {
      filtered = filtered.filter(record => record.responsible_technician === selectedTechnician);
    }

    setFilteredRecords(filtered);
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'support': return <User className="h-4 w-4" />;
      case 'maintenance': return <Wrench className="h-4 w-4" />;
      case 'installation': return <Clock className="h-4 w-4" />;
      case 'training': return <Star className="h-4 w-4" />;
      case 'consultation': return <User className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'support': return 'Suporte';
      case 'maintenance': return 'Manutenção';
      case 'installation': return 'Instalação';
      case 'training': return 'Treinamento';
      case 'consultation': return 'Consultoria';
      default: return 'Outro';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'in_progress': return 'Em Andamento';
      case 'scheduled': return 'Agendado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'billed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBillingStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'billed': return 'Faturado';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  // Get unique technicians for filter
  const uniqueTechnicians = [...new Set(serviceRecords.map(record => record.responsible_technician))];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Atendimentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Atendimentos
          </CardTitle>
          <Button className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Novo Atendimento
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo de Serviço" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
                <SelectItem value="installation">Instalação</SelectItem>
                <SelectItem value="training">Treinamento</SelectItem>
                <SelectItem value="consultation">Consultoria</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Técnico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os técnicos</SelectItem>
                {uniqueTechnicians.map((technician) => (
                  <SelectItem key={technician} value={technician}>
                    {technician}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredRecords.length} de {serviceRecords.length} registros
          </div>

          {/* Service records list */}
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div 
                key={record.id} 
                className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getServiceTypeIcon(record.service_type)}
                      <h4 className="font-medium">
                        {getServiceTypeLabel(record.service_type)}
                      </h4>
                      <Badge className={getStatusColor(record.status)}>
                        {getStatusLabel(record.status)}
                      </Badge>
                      {record.cost && (
                        <Badge className={getBillingStatusColor(record.billing_status)}>
                          {getBillingStatusLabel(record.billing_status)}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm mb-2">{record.description}</p>
                    
                    {record.solution && (
                      <p className="text-sm text-green-700 bg-green-50 p-2 rounded mb-2">
                        <strong>Solução:</strong> {record.solution}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.service_date).toLocaleString('pt-BR')}
                      </span>
                      {record.duration_minutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(record.duration_minutes)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {record.responsible_technician}
                      </span>
                      {record.client && (
                        <span className="flex items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {record.client.code}
                          </Badge>
                          {record.client.company_name}
                        </span>
                      )}
                      {record.cost && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          R$ {record.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                    </div>

                    {record.equipment_serviced && (
                      <div className="mt-2 text-xs">
                        <span className="font-medium">Equipamento:</span> {record.equipment_serviced}
                      </div>
                    )}

                    {record.parts_used && (
                      <div className="mt-1 text-xs">
                        <span className="font-medium">Peças utilizadas:</span> {record.parts_used}
                      </div>
                    )}

                    {record.satisfaction_rating && (
                      <div className="mt-2">
                        {renderRating(record.satisfaction_rating)}
                        {record.client_feedback && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            "{record.client_feedback}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum registro de atendimento encontrado</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceHistoryManager;