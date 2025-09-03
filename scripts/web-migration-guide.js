#!/usr/bin/env node

/**
 * Guia de Migração via Interface Web do Xano
 * Instruções para migrar dados usando a interface web
 * Execute: node scripts/web-migration-guide.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obter o diretório atual do módulo ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#')) {
        env[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return env;
  } catch (error) {
    console.log('⚠️  Arquivo .env.local não encontrado, usando configurações padrão');
    return {};
  }
}

const env = loadEnv();

// Configurações
const XANO_WORKSPACE = 'x8ki-letl-twmt.n7.xano.io';
const XANO_API_KEY = env.VITE_XANO_API_KEY || 'hzPTkRyB';

console.log('🌐 GUIA DE MIGRAÇÃO VIA INTERFACE WEB DO XANO');
console.log('================================================\n');

console.log('🔧 CONFIGURAÇÃO NECESSÁRIA:');
console.log('============================');
console.log(`📋 Workspace: ${XANO_WORKSPACE}`);
console.log(`🔑 API Key: ${XANO_API_KEY}`);
console.log('🌐 URL do Painel: https://x8ki-letl-twmt.n7.xano.io\n');

console.log('📋 PASSO A PASSO PARA MIGRAÇÃO:');
console.log('================================\n');

console.log('1️⃣ ACESSAR O PAINEL DO XANO');
console.log('   • Acesse: https://x8ki-letl-twmt.n7.xano.io');
console.log('   • Faça login com suas credenciais\n');

console.log('2️⃣ VERIFICAR CONFIGURAÇÃO DA API');
console.log('   • Vá para "API" no menu lateral');
console.log('   • Verifique se a API está habilitada');
console.log('   • Confirme se a chave da API está correta\n');

console.log('3️⃣ CRIAR TABELAS MANUALMENTE');
console.log('   • Vá para "Database" no menu lateral');
console.log('   • Clique em "Create Table" para cada tabela:\n');

console.log('   📊 TABELA: clients');
console.log('      • id (UUID, Primary Key)');
console.log('      • name (VARCHAR, Required)');
console.log('      • email (VARCHAR, Required, Unique)');
console.log('      • phone (VARCHAR, Optional)');
console.log('      • company (VARCHAR, Optional)');
console.log('      • status (VARCHAR, Default: active)');
console.log('      • tier (VARCHAR, Optional)');
console.log('      • segment (VARCHAR, Optional)');
console.log('      • size (VARCHAR, Optional)');
console.log('      • documentType (VARCHAR, Optional)');
console.log('      • documentNumber (VARCHAR, Optional)');
console.log('      • createdAt (TIMESTAMP, Default: now())');
console.log('      • updatedAt (TIMESTAMP, Default: now())\n');

console.log('   📊 TABELA: tickets');
console.log('      • id (UUID, Primary Key)');
console.log('      • title (VARCHAR, Required)');
console.log('      • description (TEXT, Required)');
console.log('      • status (VARCHAR, Default: open)');
console.log('      • priority (VARCHAR, Default: medium)');
console.log('      • category (VARCHAR, Required)');
console.log('      • clientId (UUID, Required)');
console.log('      • agentId (UUID, Optional)');
console.log('      • createdAt (TIMESTAMP, Default: now())');
console.log('      • updatedAt (TIMESTAMP, Default: now())\n');

console.log('   📊 TABELA: articles');
console.log('      • id (UUID, Primary Key)');
console.log('      • title (VARCHAR, Required)');
console.log('      • content (TEXT, Required)');
console.log('      • category (VARCHAR, Required)');
console.log('      • tags (JSON, Optional)');
console.log('      • authorId (UUID, Optional)');
console.log('      • isPublished (BOOLEAN, Default: false)');
console.log('      • viewCount (INTEGER, Default: 0)');
console.log('      • helpfulCount (INTEGER, Default: 0)');
console.log('      • createdAt (TIMESTAMP, Default: now())');
console.log('      • updatedAt (TIMESTAMP, Default: now())\n');

console.log('   📊 TABELA: team_members');
console.log('      • id (UUID, Primary Key)');
console.log('      • name (VARCHAR, Required)');
console.log('      • email (VARCHAR, Required, Unique)');
console.log('      • role (VARCHAR, Required)');
console.log('      • department (VARCHAR, Required)');
console.log('      • skills (JSON, Optional)');
console.log('      • maxTickets (INTEGER, Default: 50)');
console.log('      • currentLoad (INTEGER, Default: 0)');
console.log('      • isAvailable (BOOLEAN, Default: true)');
console.log('      • createdAt (TIMESTAMP, Default: now())');
console.log('      • updatedAt (TIMESTAMP, Default: now())\n');

console.log('   📊 TABELA: schedules');
console.log('      • id (UUID, Primary Key)');
console.log('      • userId (UUID, Required)');
console.log('      • date (DATE, Required)');
console.log('      • startTime (TIME, Required)');
console.log('      • endTime (TIME, Required)');
console.log('      • type (VARCHAR, Default: work)');
console.log('      • status (VARCHAR, Default: confirmed)');
console.log('      • notes (TEXT, Optional)');
console.log('      • createdAt (TIMESTAMP, Default: now())');
console.log('      • updatedAt (TIMESTAMP, Default: now())\n');

console.log('   📊 TABELA: goals');
console.log('      • id (UUID, Primary Key)');
console.log('      • userId (UUID, Required)');
console.log('      • title (VARCHAR, Required)');
console.log('      • description (TEXT, Required)');
console.log('      • target (DECIMAL, Required)');
console.log('      • current (DECIMAL, Default: 0)');
console.log('      • unit (VARCHAR, Required)');
console.log('      • period (VARCHAR, Required)');
console.log('      • status (VARCHAR, Default: not_started)');
console.log('      • startDate (DATE, Required)');
console.log('      • endDate (DATE, Required)');
console.log('      • createdAt (TIMESTAMP, Default: now())');
console.log('      • updatedAt (TIMESTAMP, Default: now())\n');

console.log('4️⃣ CONFIGURAR AUTENTICAÇÃO');
console.log('   • Vá para "API > Auth"');
console.log('   • Clique em "Enable Auth"');
console.log('   • Configure campos: email, password, confirm_password');
console.log('   • Salve as configurações\n');

console.log('5️⃣ CONFIGURAR CORS');
console.log('   • Vá para "API > Settings"');
console.log('   • Em "CORS", adicione:');
console.log('     - http://localhost:8080 (desenvolvimento)');
console.log('     - https://seu-dominio.com (produção)\n');

console.log('6️⃣ TESTAR CONECTIVIDADE');
console.log('   • Execute: node scripts/test-xano-connection.js');
console.log('   • Verifique se todas as tabelas estão acessíveis\n');

console.log('7️⃣ EXECUTAR MIGRAÇÃO');
console.log('   • Execute: node scripts/migrate-to-xano.js');
console.log('   • Monitore o progresso da migração\n');

console.log('8️⃣ VERIFICAR DADOS');
console.log('   • Acesse cada tabela no painel do Xano');
console.log('   • Confirme que os dados foram migrados corretamente\n');

console.log('🚨 PROBLEMAS COMUNS:');
console.log('======================');
console.log('❌ Erro 404: Tabela não encontrada');
console.log('   • Verifique se a tabela foi criada corretamente');
console.log('   • Confirme o nome da tabela no endpoint\n');

console.log('❌ Erro 401: Não autorizado');
console.log('   • Verifique se a API key está correta');
console.log('   • Confirme se a autenticação está habilitada\n');

console.log('❌ Erro 500: Erro interno');
console.log('   • Verifique os logs do Xano');
console.log('   • Confirme se a estrutura da tabela está correta\n');

console.log('❌ Timeout');
console.log('   • Aumente o timeout no cliente');
console.log('   • Verifique a conectividade de rede\n');

console.log('\n💡 DICAS IMPORTANTES:');
console.log('======================');
console.log('• Crie as tabelas uma por vez para evitar conflitos');
console.log('• Use nomes de tabela em minúsculas e com underscores');
console.log('• Configure índices para campos frequentemente consultados');
console.log('• Teste cada endpoint após criar a tabela');
console.log('• Faça backup antes de executar a migração\n');

console.log('🔗 LINKS ÚTEIS:');
console.log('================');
console.log('• Painel do Xano: https://x8ki-letl-twmt.n7.xano.io');
console.log('• Documentação: https://docs.xano.com/');
console.log('• Comunidade: https://community.xano.com/\n');

console.log('📞 SUPORTE:');
console.log('============');
console.log('• Se precisar de ajuda, acesse o painel do Xano');
console.log('• Use o chat de suporte integrado');
console.log('• Consulte a documentação oficial\n');

console.log('🎯 PRÓXIMOS PASSOS:');
console.log('====================');
console.log('1. Acesse o painel do Xano');
console.log('2. Crie as tabelas conforme especificado');
console.log('3. Configure a autenticação');
console.log('4. Teste a conectividade');
console.log('5. Execute a migração de dados');
console.log('6. Verifique a integridade dos dados\n');

console.log('🚀 BOA SORTE COM A MIGRAÇÃO!');
console.log('=============================');
console.log('Seu StarPrint CRM estará funcionando com o Xano em breve! 🎉\n');
