import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Users, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CoverageData {
  totalCapacity: number;
  actualAttendance: number;
  coveragePercentage: number;
  trend: number;
}

const TeamCoverageCard = () => {
  const [coverageData, setCoverageData] = useState<CoverageData>({
    totalCapacity: 0,
    actualAttendance: 0,
    coveragePercentage: 0,
    trend: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoverageData();
  }, []);

  const fetchCoverageData = async () => {
    try {
      const { data, error } = await supabase
        .from('team_capacity')
        .select('*')
        .order('date', { ascending: false })
        .limit(7);

      if (error) throw error;

      if (data && data.length > 0) {
        const today = data[0];
        const yesterday = data[1];
        
        const trend = yesterday ? 
          ((today.coverage_percentage - yesterday.coverage_percentage) / yesterday.coverage_percentage) * 100 
          : 0;

        setCoverageData({
          totalCapacity: today.total_capacity,
          actualAttendance: today.actual_attendance,
          coveragePercentage: today.coverage_percentage,
          trend
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados de cobertura:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de cobertura da equipe",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCoverageStatus = (percentage: number) => {
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 75) return 'Adequada';
    if (percentage >= 60) return 'Baixa';
    return 'Crítica';
  };

  if (loading) {
    return (
      <Card className="h-48">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cobertura da Equipe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-20 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Cobertura da Equipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getCoverageColor(coverageData.coveragePercentage)}`}>
                {coverageData.coveragePercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                {getCoverageStatus(coverageData.coveragePercentage)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {coverageData.trend >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${coverageData.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(coverageData.trend).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                vs. ontem
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Progress 
              value={coverageData.coveragePercentage} 
              className="h-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Presentes: {coverageData.actualAttendance}
              </span>
              <span className="text-muted-foreground">
                Capacidade: {coverageData.totalCapacity}
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Escala necessária vs Atendimentos realizados</p>
            <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCoverageCard;