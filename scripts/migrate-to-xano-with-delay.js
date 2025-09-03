#!/usr/bin/env node

/**
 * Script de Migração com Delays para Xano.io
 * Contorna o rate limit do plano gratuito
 * Execute: node scripts/migrate-to-xano-with-delay.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import axios from 'axios';

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
const XANO_BASE_URL = env.VITE_XANO_BASE_URL || 'https://x8ki-letl-twmt.n7.xano.io/api:hzPTkRyB';
const XANO_API_KEY = env.VITE_XANO_API_KEY || 'hzPTkRyB';

// Cliente Xano
const xanoClient = axios.create({
  baseURL: XANO_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${XANO_API_KEY}`,
  },
  timeout: 30000,
});

// Estatísticas da migração
const migrationStats = {
  total: 0,
  successful: 0,
  failed: 0,
  errors: [],
  startTime: Date.now(),
};

// Função para log
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Função para delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para migrar clientes
async function migrateCustomers() {
  log('Migrando clientes...');
  
  try {
    const sampleCustomers = [
      {
        name: 'TORQUATO IND E COM DE',
        email: 'contato@torquato.com',
        phone: '+55 11 99999-9999',
        company: 'TORQUATO IND E COM DE',
        status: 'active',
        tier: 'gold',
        segment: 'Industrial',
        size: 'medium',
        documentType: 'CNPJ',
        documentNumber: '0010204382',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'MARBELLE LINGERIE LTDA',
        email: 'contato@marbelle.com',
        phone: '+55 11 88888-8888',
        company: 'MARBELLE LINGERIE LTDA',
        status: 'active',
        tier: 'silver',
        segment: 'Lingerie',
        size: 'medium',
        documentType: 'CNPJ',
        documentNumber: '1020502488',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'GUARARAPES CONFECCOES',
        email: 'contato@guararapes.com',
        phone: '+55 11 77777-7777',
        company: 'GUARARAPES CONFECCOES',
        status: 'active',
        tier: 'platinum',
        segment: 'Confecção',
        size: 'large',
        documentType: 'CNPJ',
        documentNumber: '0011100100',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    for (const customer of sampleCustomers) {
      try {
        const response = await xanoClient.post('/customer', customer);
        log(`Cliente '${customer.name}' migrado com sucesso`, 'success');
        migrationStats.successful++;
        
        // Delay de 2 segundos entre cada cliente
        await delay(2000);
        
      } catch (error) {
        if (error.response?.status === 429) {
          log(`Rate limit atingido para '${customer.name}', aguardando 10 segundos...`, 'warning');
          await delay(10000); // Aguardar 10 segundos
          
          // Tentar novamente
          try {
            const retryResponse = await xanoClient.post('/customer', customer);
            log(`Cliente '${customer.name}' migrado com sucesso na segunda tentativa`, 'success');
            migrationStats.successful++;
          } catch (retryError) {
            log(`Erro na segunda tentativa para '${customer.name}': ${retryError.message}`, 'error');
            migrationStats.failed++;
            migrationStats.errors.push(`Cliente ${customer.name}: ${retryError.message}`);
          }
        } else {
          log(`Erro ao migrar cliente '${customer.name}': ${error.message}`, 'error');
          migrationStats.failed++;
          migrationStats.errors.push(`Cliente ${customer.name}: ${error.message}`);
        }
      }
      migrationStats.total++;
    }
    
  } catch (error) {
    log(`Erro geral na migração de clientes: ${error.message}`, 'error');
  }
}

// Função para migrar tickets
async function migrateTickets() {
  log('Migrando tickets...');
  
  try {
    const sampleTickets = [
      {
        title: 'Solicitação de Orçamento',
        description: 'Cliente solicita orçamento para impressão de materiais promocionais',
        status: 'open',
        priority: 'medium',
        category: 'general',
        clientId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'Problema com Impressão',
        description: 'Relato de falha na qualidade da impressão',
        status: 'in_progress',
        priority: 'high',
        category: 'technical',
        clientId: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    for (const ticket of sampleTickets) {
      try {
        const response = await xanoClient.post('/ticket', ticket);
        log(`Ticket '${ticket.title}' migrado com sucesso`, 'success');
        migrationStats.successful++;
        
        // Delay de 2 segundos entre cada ticket
        await delay(2000);
        
      } catch (error) {
        if (error.response?.status === 429) {
          log(`Rate limit atingido para '${ticket.title}', aguardando 10 segundos...`, 'warning');
          await delay(10000);
          
          try {
            const retryResponse = await xanoClient.post('/ticket', ticket);
            log(`Ticket '${ticket.title}' migrado com sucesso na segunda tentativa`, 'success');
            migrationStats.successful++;
          } catch (retryError) {
            log(`Erro na segunda tentativa para '${ticket.title}': ${retryError.message}`, 'error');
            migrationStats.failed++;
            migrationStats.errors.push(`Ticket ${ticket.title}: ${retryError.message}`);
          }
        } else {
          log(`Erro ao migrar ticket '${ticket.title}': ${error.message}`, 'error');
          migrationStats.failed++;
          migrationStats.errors.push(`Ticket ${ticket.title}: ${error.message}`);
        }
      }
      migrationStats.total++;
    }
    
  } catch (error) {
    log(`Erro geral na migração de tickets: ${error.message}`, 'error');
  }
}

// Função para migrar artigos da base de conhecimento
async function migrateKnowledgeArticles() {
  log('Migrando artigos da base de conhecimento...');
  
  try {
    const sampleArticles = [
      {
        title: 'Como Solicitar um Orçamento',
        content: 'Guia completo para solicitar orçamentos de impressão...',
        category: 'orientacoes',
        tags: ['orçamento', 'solicitação', 'guia'],
        authorId: '1',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: 'Tipos de Papel para Impressão',
        content: 'Descrição dos diferentes tipos de papel e suas aplicações...',
        category: 'materiais',
        tags: ['papel', 'impressão', 'materiais'],
        authorId: '1',
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    for (const article of sampleArticles) {
      try {
        const response = await xanoClient.post('/knowledge_article', article);
        log(`Artigo '${article.title}' migrado com sucesso`, 'success');
        migrationStats.successful++;
        
        // Delay de 2 segundos entre cada artigo
        await delay(2000);
        
      } catch (error) {
        if (error.response?.status === 429) {
          log(`Rate limit atingido para '${article.title}', aguardando 10 segundos...`, 'warning');
          await delay(10000);
          
          try {
            const retryResponse = await xanoClient.post('/knowledge_article', article);
            log(`Artigo '${article.title}' migrado com sucesso na segunda tentativa`, 'success');
            migrationStats.successful++;
          } catch (retryError) {
            log(`Erro na segunda tentativa para '${article.title}': ${retryError.message}`, 'error');
            migrationStats.failed++;
            migrationStats.errors.push(`Artigo ${article.title}: ${retryError.message}`);
          }
        } else {
          log(`Erro ao migrar artigo '${article.title}': ${error.message}`, 'error');
          migrationStats.failed++;
          migrationStats.errors.push(`Artigo ${article.title}: ${error.message}`);
        }
      }
      migrationStats.total++;
    }
    
  } catch (error) {
    log(`Erro geral na migração de artigos: ${error.message}`, 'error');
  }
}

// Função para migrar membros da equipe
async function migrateTeamMembers() {
  log('Migrando membros da equipe...');
  
  try {
    const sampleMembers = [
      {
        name: 'João Silva',
        email: 'joao@starprint.com',
        role: 'ADMIN',
        department: 'Administração',
        skills: ['gestão', 'atendimento', 'vendas'],
        maxTickets: 50,
        currentLoad: 0,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        name: 'Maria Santos',
        email: 'maria@starprint.com',
        role: 'MANAGER',
        department: 'Atendimento',
        skills: ['atendimento', 'resolução', 'comunicação'],
        maxTickets: 30,
        currentLoad: 0,
        isAvailable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    for (const member of sampleMembers) {
      try {
        const response = await xanoClient.post('/team_member', member);
        log(`Membro '${member.name}' migrado com sucesso`, 'success');
        migrationStats.successful++;
        
        // Delay de 2 segundos entre cada membro
        await delay(2000);
        
      } catch (error) {
        if (error.response?.status === 429) {
          log(`Rate limit atingido para '${member.name}', aguardando 10 segundos...`, 'warning');
          await delay(10000);
          
          try {
            const retryResponse = await xanoClient.post('/team_member', member);
            log(`Membro '${member.name}' migrado com sucesso na segunda tentativa`, 'success');
            migrationStats.successful++;
          } catch (retryError) {
            log(`Erro na segunda tentativa para '${member.name}': ${retryError.message}`, 'error');
            migrationStats.failed++;
            migrationStats.errors.push(`Membro ${member.name}: ${retryError.message}`);
          }
        } else {
          log(`Erro ao migrar membro '${member.name}': ${error.message}`, 'error');
          migrationStats.failed++;
          migrationStats.errors.push(`Membro ${member.name}: ${error.message}`);
        }
      }
      migrationStats.total++;
    }
    
  } catch (error) {
    log(`Erro geral na migração de membros da equipe: ${error.message}`, 'error');
  }
}

// Função para migrar escalas
async function migrateSchedules() {
  log('Migrando escalas...');
  
  try {
    const sampleSchedules = [
      {
        userId: '1',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '17:00',
        type: 'work',
        status: 'confirmed',
        notes: 'Escala padrão',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    for (const schedule of sampleSchedules) {
      try {
        const response = await xanoClient.post('/schedule', schedule);
        log(`Escala migrada com sucesso`, 'success');
        migrationStats.successful++;
        
        // Delay de 2 segundos
        await delay(2000);
        
      } catch (error) {
        if (error.response?.status === 429) {
          log(`Rate limit atingido para escala, aguardando 10 segundos...`, 'warning');
          await delay(10000);
          
          try {
            const retryResponse = await xanoClient.post('/schedule', schedule);
            log(`Escala migrada com sucesso na segunda tentativa`, 'success');
            migrationStats.successful++;
          } catch (retryError) {
            log(`Erro na segunda tentativa para escala: ${retryError.message}`, 'error');
            migrationStats.failed++;
            migrationStats.errors.push(`Escala: ${retryError.message}`);
          }
        } else {
          log(`Erro ao migrar escala: ${error.message}`, 'error');
          migrationStats.failed++;
          migrationStats.errors.push(`Escala: ${error.message}`);
        }
      }
      migrationStats.total++;
    }
    
  } catch (error) {
    log(`Erro geral na migração de escalas: ${error.message}`, 'error');
  }
}

// Função para migrar metas
async function migrateGoals() {
  log('Migrando metas...');
  
  try {
    const sampleGoals = [
      {
        userId: '1',
        title: 'Meta de Vendas Mensal',
        description: 'Atingir R$ 50.000 em vendas mensais',
        target: 50000,
        current: 0,
        unit: 'reais',
        period: 'monthly',
        status: 'not_started',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    for (const goal of sampleGoals) {
      try {
        const response = await xanoClient.post('/goal', goal);
        log(`Meta '${goal.title}' migrada com sucesso`, 'success');
        migrationStats.successful++;
        
        // Delay de 2 segundos
        await delay(2000);
        
      } catch (error) {
        if (error.response?.status === 429) {
          log(`Rate limit atingido para '${goal.title}', aguardando 10 segundos...`, 'warning');
          await delay(10000);
          
          try {
            const retryResponse = await xanoClient.post('/goal', goal);
            log(`Meta '${goal.title}' migrada com sucesso na segunda tentativa`, 'success');
            migrationStats.successful++;
          } catch (retryError) {
            log(`Erro na segunda tentativa para '${goal.title}': ${retryError.message}`, 'error');
            migrationStats.failed++;
            migrationStats.errors.push(`Meta ${goal.title}: ${retryError.message}`);
          }
        } else {
          log(`Erro ao migrar meta '${goal.title}': ${error.message}`, 'error');
          migrationStats.failed++;
          migrationStats.errors.push(`Meta ${goal.title}: ${error.message}`);
        }
      }
      migrationStats.total++;
    }
    
  } catch (error) {
    log(`Erro geral na migração de metas: ${error.message}`, 'error');
  }
}

// Função principal de migração
async function migrateToXanoWithDelay() {
  console.log('🚀 INICIANDO MIGRAÇÃO COM DELAYS PARA XANO.IO');
  console.log('================================================\n');
  
  try {
    // Verificar conectividade
    log('Verificando conectividade com o Xano...');
    await xanoClient.get('/');
    log('Conectividade com Xano confirmada', 'success');
    
    console.log('\n⏱️  IMPORTANTE: Esta migração inclui delays para contornar o rate limit');
    console.log('   • Delay de 2 segundos entre cada item');
    console.log('   • Delay de 10 segundos em caso de rate limit');
    console.log('   • Tempo estimado: ~2-3 minutos\n');
    
    // Executar migrações com delays
    await migrateCustomers();
    await delay(3000); // Delay extra entre categorias
    
    await migrateTickets();
    await delay(3000);
    
    await migrateKnowledgeArticles();
    await delay(3000);
    
    await migrateTeamMembers();
    await delay(3000);
    
    await migrateSchedules();
    await delay(3000);
    
    await migrateGoals();
    
    // Resumo final
    const endTime = Date.now();
    const duration = Math.round((endTime - migrationStats.startTime) / 1000);
    
    console.log('\n🎉 MIGRAÇÃO CONCLUÍDA!');
    console.log('========================');
    console.log(`⏱️  Duração: ${duration} segundos`);
    console.log(`📊 Total de itens: ${migrationStats.total}`);
    console.log(`✅ Sucessos: ${migrationStats.successful}`);
    console.log(`❌ Falhas: ${migrationStats.failed}`);
    
    if (migrationStats.errors.length > 0) {
      console.log('\n⚠️  ERROS ENCONTRADOS:');
      migrationStats.errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (migrationStats.failed === 0) {
      console.log('\n✨ MIGRAÇÃO 100% SUCESSO!');
      console.log('🎯 Todos os dados foram migrados para o Xano.io');
      console.log('🚀 Seu sistema está pronto para usar o Xano como backend!');
    } else {
      console.log('\n⚠️  MIGRAÇÃO PARCIALMENTE SUCESSO');
      console.log('🔧 Verifique os erros acima e execute novamente se necessário');
    }
    
  } catch (error) {
    log(`Erro fatal na migração: ${error.message}`, 'error');
    console.log('\n❌ MIGRAÇÃO FALHOU');
    console.log('🔧 Verifique a conectividade e tente novamente');
    process.exit(1);
  }
}

// Executar migração
migrateToXanoWithDelay().catch(console.error);
