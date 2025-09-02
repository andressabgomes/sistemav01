import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NPSData {
  npsScore: number;
  totalResponses: number;
  trend: number;
  promoters: number;
  passives: number;
  detractors: number;
}

const NPSCard = () => {
  const [npsData, setNpsData] = useState<NPSData>({
    npsScore: 0,
    totalResponses: 0,
    trend: 0,
    promoters: 0,
    passives: 0,
    detractors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNPSData();
  }, []);

  const fetchNPSData = async () => {
    try {
      const { data, error } = await supabase
        .from('nps_responses')
        .select('*')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      if (data) {
        const promoters = data.filter(r => r.nps_score === 1).length;
        const passives = data.filter(r => r.nps_score === 0).length;
        const detractors = data.filter(r => r.nps_score === -1).length;
        const total = data.length;
        
        const npsScore = total > 0 ? Math.round(((promoters - detractors) / total) * 100) : 0;

        setNpsData({
          npsScore,
          totalResponses: total,
          trend: Math.random() * 20 - 10, // Mock trend data
          promoters,
          passives,
          detractors
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados NPS:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do NPS",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Excelente';
    if (score >= 50) return 'Bom';
    if (score >= 30) return 'Regular';
    return 'Crítico';
  };

  if (loading) {
    return (
      <Card className="h-48">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            NPS (Net Promoter Score)
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
          <Star className="h-5 w-5" />
          NPS (Net Promoter Score)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-3xl font-bold ${getScoreColor(npsData.npsScore)}`}>
                {npsData.npsScore}
              </div>
              <div className="text-sm text-muted-foreground">
                {getScoreLabel(npsData.npsScore)}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                {npsData.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm ${npsData.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(npsData.trend).toFixed(1)}%
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                {npsData.totalResponses} respostas
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Promotores: {npsData.promoters}</span>
              <span>Neutros: {npsData.passives}</span>
              <span>Detratores: {npsData.detractors}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-l-full" 
                style={{ width: `${npsData.totalResponses > 0 ? (npsData.promoters / npsData.totalResponses) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <p>Pergunta 1: "Seu problema foi resolvido?"</p>
            <p>Pergunta 2: "Qual seu nível de satisfação?"</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NPSCard;