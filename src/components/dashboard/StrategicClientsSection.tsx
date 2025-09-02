import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Download, Search, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StrategicClient {
  id: string;
  code: string;
  name: string;
  responsible_team_member: string;
  created_at: string;
}

const StrategicClientsSection = () => {
  const [clients, setClients] = useState<StrategicClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<StrategicClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState<string>('all');
  const [responsibleOptions, setResponsibleOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchStrategicClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, selectedResponsible]);

  const fetchStrategicClients = async () => {
    try {
      const { data, error } = await supabase
        .from('strategic_clients')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data) {
        setClients(data);
        
        // Extract unique responsible team members
        const uniqueResponsible = [...new Set(data.map(client => client.responsible_team_member))];
        setResponsibleOptions(uniqueResponsible);
      }
    } catch (error) {
      console.error('Erro ao carregar clientes estratégicos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes estratégicos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedResponsible !== 'all') {
      filtered = filtered.filter(client => 
        client.responsible_team_member === selectedResponsible
      );
    }

    setFilteredClients(filtered);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Código', 'Nome do Cliente', 'Responsável da Equipe', 'Data de Cadastro'],
      ...filteredClients.map(client => [
        client.code,
        client.name,
        client.responsible_team_member,
        new Date(client.created_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clientes_estrategicos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Exportação concluída",
      description: "Lista de clientes estratégicos exportada com sucesso"
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Top 50 Clientes Estratégicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Top 50 Clientes Estratégicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os responsáveis</SelectItem>
                {responsibleOptions.map((responsible) => (
                  <SelectItem key={responsible} value={responsible}>
                    {responsible}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={exportToCSV}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>

          {/* Clients list */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredClients.map((client) => (
              <div 
                key={client.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      {client.code}
                    </Badge>
                    <h4 className="font-medium">{client.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Responsável: {client.responsible_team_member}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    Cadastrado em {new Date(client.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente encontrado com os filtros aplicados</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategicClientsSection;