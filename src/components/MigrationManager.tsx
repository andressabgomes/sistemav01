import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { Badge } from '@/ui/badge';
import { Alert, AlertDescription } from '@/ui/alert';
import { 
  Database, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Play,
  RotateCcw,
  Settings
} from 'lucide-react';
import { useMigration } from '@/hooks/useMigration';

export const MigrationManager: React.FC = () => {
  const {
    status,
    startMigration,
    resetMigration,
    getBackendStatus,
    switchToXano,
    switchToSupabase,
    switchToHybrid,
  } = useMigration();

  const backendStatus = getBackendStatus();

  return (
    <div className="space-y-6">
      {/* Status do Backend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Status do Backend
          </CardTitle>
          <CardDescription>
            Gerencie qual backend está ativo e configure a migração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium">Backend Ativo:</p>
              <Badge variant={backendStatus.isXano ? "default" : "secondary"}>
                {backendStatus.active === 'xano' ? 'Xano.io' : 
                 backendStatus.active === 'supabase' ? 'Supabase' : 'Híbrido'}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button
                variant={backendStatus.isSupabase ? "default" : "outline"}
                size="sm"
                onClick={switchToSupabase}
              >
                Supabase
              </Button>
              <Button
                variant={backendStatus.isXano ? "default" : "outline"}
                size="sm"
                onClick={switchToXano}
              >
                Xano
              </Button>
              <Button
                variant={backendStatus.isHybrid ? "default" : "outline"}
                size="sm"
                onClick={switchToHybrid}
              >
                Híbrido
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gerenciador de Migração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Migração de Dados
          </CardTitle>
          <CardDescription>
            Migre dados do Supabase para o Xano.io de forma segura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status da Migração */}
          {status.isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Progresso: {status.progress}%</span>
                <span>{status.completedSteps}/{status.totalSteps} etapas</span>
              </div>
              <Progress value={status.progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                {status.currentStep}
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button
              onClick={startMigration}
              disabled={status.isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {status.isRunning ? 'Migrando...' : 'Iniciar Migração'}
            </Button>
            
            <Button
              variant="outline"
              onClick={resetMigration}
              disabled={status.isRunning}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resetar
            </Button>
          </div>

          {/* Status da Migração */}
          {!status.isRunning && status.progress > 0 && (
            <div className="space-y-2">
              {status.progress === 100 ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Migração concluída com sucesso! Todos os dados foram transferidos para o Xano.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    Migração interrompida. Clique em "Iniciar Migração" para continuar.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Erros */}
          {status.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-600">Erros encontrados:</h4>
              {status.errors.map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações sobre a Migração */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informações da Migração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Dados que serão migrados:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>Clientes e informações de contato</li>
                <li>Tickets de suporte</li>
                <li>Base de conhecimento</li>
                <li>Membros da equipe</li>
                <li>Escalas e horários</li>
                <li>Metas e objetivos</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Processo de migração:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>Backup automático dos dados</li>
                <li>Validação de integridade</li>
                <li>Transferência em lotes</li>
                <li>Verificação de sucesso</li>
                <li>Opção de rollback</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Importante:</strong> A migração é um processo irreversível. 
              Certifique-se de que todos os dados estão corretos antes de prosseguir. 
              Recomendamos fazer um backup completo antes de iniciar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationManager;
