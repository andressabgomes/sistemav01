import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import NPSCard from './NPSCard';
import TeamCoverageCard from './TeamCoverageCard';
import StrategicClientsSection from './StrategicClientsSection';
import UserMonitoringSection from '../monitoring/UserMonitoringSection';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Filter, Calendar, User, Building2 } from 'lucide-react';

const EnhancedDashboard = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [selectedOperator, setSelectedOperator] = useState('all');
  const [selectedClient, setSelectedClient] = useState('all');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
      }, 60000); // Refresh every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header with filters and refresh */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard em Tempo Real</h1>
          <p className="text-muted-foreground">
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Period filter */}
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">7 dias</SelectItem>
              <SelectItem value="month">30 dias</SelectItem>
              <SelectItem value="quarter">90 dias</SelectItem>
            </SelectContent>
          </Select>

          {/* Operator filter */}
          <Select value={selectedOperator} onValueChange={setSelectedOperator}>
            <SelectTrigger className="w-40">
              <User className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos operadores</SelectItem>
              <SelectItem value="ana">Ana Silva</SelectItem>
              <SelectItem value="carlos">Carlos Santos</SelectItem>
              <SelectItem value="maria">Maria Oliveira</SelectItem>
            </SelectContent>
          </Select>

          {/* Client filter */}
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-40">
              <Building2 className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos clientes</SelectItem>
              <SelectItem value="cli001">TechCorp</SelectItem>
              <SelectItem value="cli002">Inovação Digital</SelectItem>
              <SelectItem value="cli003">Empresa Global</SelectItem>
            </SelectContent>
          </Select>

          {/* Refresh button */}
          <Button 
            variant="outline" 
            onClick={handleManualRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>

          {/* Auto refresh toggle */}
          <Button
            variant={autoRefresh ? "default" : "outline"}
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2"
          >
            <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-400' : 'bg-gray-400'}`} />
            Auto-refresh
          </Button>
        </div>
      </div>

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NPSCard key={lastUpdate.getTime()} />
        <TeamCoverageCard key={lastUpdate.getTime()} />
        
        {/* Additional KPI cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-green-600">
                +12%
              </Badge>
              <span className="text-xs text-muted-foreground">vs. ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8m 30s</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-red-600">
                +2m
              </Badge>
              <span className="text-xs text-muted-foreground">vs. meta</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrategicClientsSection />
        <UserMonitoringSection />
      </div>

      {/* Pipefy Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Integração Pipefy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Status da Sincronização</h4>
                <p className="text-sm text-muted-foreground">
                  Tickets são automaticamente sincronizados com o Pipefy
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Ativo
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-blue-600">23</div>
                <div className="text-xs text-muted-foreground">Cards Criados Hoje</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">18</div>
                <div className="text-xs text-muted-foreground">Sincronizados</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">5</div>
                <div className="text-xs text-muted-foreground">Pendentes</div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-blue-900 mb-1">Fluxos automáticos configurados</p>
              <p className="text-blue-700">
                • Abertura de ticket → Criar card no Pipefy<br/>
                • Atualização de ticket → Mover card entre fases<br/>
                • Fechamento de ticket → Marcar card como concluído
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;