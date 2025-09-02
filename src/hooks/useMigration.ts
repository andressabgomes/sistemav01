import { useState, useCallback } from 'react';
import { migrateDataToXano, getActiveBackend, integrationConfig } from '../integrations/config';
import { useToast } from './use-toast';

export interface MigrationStatus {
  isRunning: boolean;
  progress: number;
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  errors: string[];
}

export const useMigration = () => {
  const [status, setStatus] = useState<MigrationStatus>({
    isRunning: false,
    progress: 0,
    currentStep: '',
    totalSteps: 6, // clientes, tickets, artigos, equipe, escalas, metas
    completedSteps: 0,
    errors: [],
  });

  const { toast } = useToast();

  const startMigration = useCallback(async () => {
    if (status.isRunning) {
      toast({
        title: "Migração em andamento",
        description: "Aguarde a migração atual terminar",
        variant: "destructive",
      });
      return;
    }

    setStatus(prev => ({
      ...prev,
      isRunning: true,
      progress: 0,
      currentStep: 'Iniciando migração...',
      completedSteps: 0,
      errors: [],
    }));

    try {
      // Simular progresso da migração
      const updateProgress = (step: string, completed: number) => {
        setStatus(prev => ({
          ...prev,
          currentStep: step,
          completedSteps: completed,
          progress: Math.round((completed / prev.totalSteps) * 100),
        }));
      };

      updateProgress('Migrando clientes...', 1);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular delay

      updateProgress('Migrando tickets...', 2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress('Migrando artigos...', 3);
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress('Migrando equipe...', 4);
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress('Migrando escalas...', 5);
      await new Promise(resolve => setTimeout(resolve, 1000));

      updateProgress('Migrando metas...', 6);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Executar migração real
      await migrateDataToXano();

      setStatus(prev => ({
        ...prev,
        isRunning: false,
        progress: 100,
        currentStep: 'Migração concluída com sucesso!',
      }));

      toast({
        title: "Migração concluída",
        description: "Todos os dados foram migrados para o Xano com sucesso!",
        variant: "default",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido durante a migração';
      
      setStatus(prev => ({
        ...prev,
        isRunning: false,
        currentStep: 'Erro na migração',
        errors: [...prev.errors, errorMessage],
      }));

      toast({
        title: "Erro na migração",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [status.isRunning, toast]);

  const resetMigration = useCallback(() => {
    setStatus({
      isRunning: false,
      progress: 0,
      currentStep: '',
      totalSteps: 6,
      completedSteps: 0,
      errors: [],
    });
  }, []);

  const getBackendStatus = useCallback(() => {
    const activeBackend = getActiveBackend();
    return {
      active: activeBackend,
      isXano: activeBackend === 'xano',
      isSupabase: activeBackend === 'supabase',
      isHybrid: activeBackend === 'hybrid',
    };
  }, []);

  const switchToXano = useCallback(() => {
    integrationConfig.backend = 'xano';
    toast({
      title: "Backend alterado",
      description: "Sistema configurado para usar o Xano como backend principal",
      variant: "default",
    });
  }, [toast]);

  const switchToSupabase = useCallback(() => {
    integrationConfig.backend = 'supabase';
    toast({
      title: "Backend alterado",
      description: "Sistema configurado para usar o Supabase como backend principal",
      variant: "default",
    });
  }, [toast]);

  const switchToHybrid = useCallback(() => {
    integrationConfig.backend = 'hybrid';
    toast({
      title: "Backend alterado",
      description: "Sistema configurado para usar ambos os backends em modo híbrido",
      variant: "default",
    });
  }, [toast]);

  return {
    status,
    startMigration,
    resetMigration,
    getBackendStatus,
    switchToXano,
    switchToSupabase,
    switchToHybrid,
  };
};
