import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar, User, Building2, MessageSquare, Target, BarChart3 } from 'lucide-react';

const EnhancedDashboard = () => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const handleManualRefresh = () => {
    setLastUpdate(new Date());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Principal</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao Sistema V01 - Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>

        <Button 
          variant="outline" 
          onClick={handleManualRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
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
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Usuários Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-blue-600">
                +5%
              </Badge>
              <span className="text-xs text-muted-foreground">vs. semana passada</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-green-600">
                +8%
              </Badge>
              <span className="text-xs text-muted-foreground">vs. mês passado</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Metas Atingidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="text-green-600">
                +3%
              </Badge>
              <span className="text-xs text-muted-foreground">vs. meta</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="h-6 w-6" />
              <span>Ver Tickets</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <User className="h-6 w-6" />
              <span>Gerenciar Equipe</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
              <Building2 className="h-6 w-6" />
              <span>Clientes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Banco de Dados</h4>
                <p className="text-sm text-muted-foreground">
                  Conexão com Supabase
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Online
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Autenticação</h4>
                <p className="text-sm text-muted-foreground">
                  Sistema de login
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Funcionando
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">API</h4>
                <p className="text-sm text-muted-foreground">
                  Endpoints do sistema
                </p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Ativo
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDashboard;