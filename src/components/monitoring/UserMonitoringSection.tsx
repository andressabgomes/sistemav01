import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Monitor, Eye, Play, Square, Globe, Smartphone, Laptop } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MonitoringSession {
  id: string;
  user_email: string;
  session_id: string;
  status: string;
  platform: string;
  browser: string;
  started_at: string;
  ended_at?: string;
}

const UserMonitoringSection = () => {
  const [sessions, setSessions] = useState<MonitoringSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMonitoringActive, setIsMonitoringActive] = useState(false);

  useEffect(() => {
    fetchMonitoringSessions();
    // Set up real-time subscription
    const subscription = supabase
      .channel('monitoring_sessions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'monitoring_sessions' }, 
        () => {
          fetchMonitoringSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMonitoringSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('monitoring_sessions')
        .select('*')
        .eq('status', 'active')
        .order('started_at', { ascending: false });

      if (error) throw error;

      setSessions(data || []);
    } catch (error) {
      console.error('Erro ao carregar sessões de monitoramento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as sessões de monitoramento",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startMonitoring = async () => {
    try {
      // Simulate starting a monitoring session
      const newSession = {
        user_email: 'demo@starprint.com',
        session_id: `session_${Date.now()}`,
        status: 'active',
        platform: 'Desktop',
        browser: 'Chrome',
        started_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('monitoring_sessions')
        .insert([newSession]);

      if (error) throw error;

      setIsMonitoringActive(true);
      toast({
        title: "Monitoramento iniciado",
        description: "Nova sessão de monitoramento foi iniciada"
      });
    } catch (error) {
      console.error('Erro ao iniciar monitoramento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o monitoramento",
        variant: "destructive"
      });
    }
  };

  const stopSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('monitoring_sessions')
        .update({
          status: 'ended',
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Sessão encerrada",
        description: "Sessão de monitoramento foi encerrada"
      });
    } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      toast({
        title: "Erro",
        description: "Não foi possível encerrar a sessão",
        variant: "destructive"
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform?.toLowerCase().includes('mobile')) return <Smartphone className="h-4 w-4" />;
    if (platform?.toLowerCase().includes('desktop')) return <Laptop className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Monitoramento de Tela
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
          <Monitor className="h-5 w-5" />
          Monitoramento de Tela
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Control buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={startMonitoring}
              disabled={isMonitoringActive}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Iniciar Nova Sessão
            </Button>
          </div>

          {/* Session stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">{sessions.length}</div>
              <div className="text-xs text-muted-foreground">Sessões Ativas</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {sessions.filter(s => s.platform?.toLowerCase().includes('desktop')).length}
              </div>
              <div className="text-xs text-muted-foreground">Desktop</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {sessions.filter(s => s.platform?.toLowerCase().includes('mobile')).length}
              </div>
              <div className="text-xs text-muted-foreground">Mobile</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(sessions.map(s => s.user_email)).size}
              </div>
              <div className="text-xs text-muted-foreground">Usuários</div>
            </div>
          </div>

          {/* Active sessions */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Sessões Ativas
            </h4>
            
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma sessão de monitoramento ativa</p>
                <p className="text-sm">Clique em "Iniciar Nova Sessão" para começar</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`} />
                    {getPlatformIcon(session.platform)}
                    <div>
                      <p className="font-medium">{session.user_email}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.browser} • {session.platform}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">
                      {session.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Iniciado: {new Date(session.started_at).toLocaleTimeString('pt-BR')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {session.session_id}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => stopSession(session.id)}
                    >
                      <Square className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <p className="font-medium text-blue-900 mb-1">Integração disponível</p>
            <p className="text-blue-700">
              Configure Hotjar, Microsoft Clarity ou módulo nativo para monitoramento completo
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserMonitoringSection;