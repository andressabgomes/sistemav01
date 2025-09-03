#!/usr/bin/env node

/**
 * Script para Testar URLs do Xano.io
 * Encontra o formato correto da URL da API
 * Execute: node scripts/test-xano-urls.js
 */

import axios from 'axios';

// Função para log
function log(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

// Função para testar uma URL
async function testURL(url, description) {
  try {
    log(`Testando: ${description}`);
    log(`URL: ${url}`);
    
    const response = await axios.get(url, {
      timeout: 10000,
      validateStatus: () => true // Aceitar qualquer status
    });
    
    if (response.status === 200) {
      log(`✅ Status: ${response.status}`, 'success');
      
      // Verificar se é JSON ou HTML
      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/json')) {
        log('✅ Resposta JSON válida', 'success');
        log(`📄 Dados: ${JSON.stringify(response.data).substring(0, 100)}...`);
      } else if (contentType.includes('text/html')) {
        log('⚠️  Resposta HTML (não é API)', 'warning');
      } else {
        log(`ℹ️  Tipo de conteúdo: ${contentType}`, 'info');
      }
    } else {
      log(`⚠️  Status: ${response.status}`, 'warning');
    }
    
    return { success: true, status: response.status, contentType };
  } catch (error) {
    log(`❌ Erro: ${error.message}`, 'error');
    return { success: false, error: error.message };
  }
}

// Função para testar diferentes formatos de URL
async function testXanoURLs() {
  console.log('🔍 TESTANDO DIFERENTES FORMATOS DE URL DO XANO.IO');
  console.log('==================================================\n');
  
  const baseWorkspace = 'x8ki-letl-twmt.n7.xano.io';
  const apiKey = 'hzPTkRyB';
  
  const urlsToTest = [
    {
      url: `https://${baseWorkspace}/api:${apiKey}`,
      description: 'Formato atual (com dois pontos)'
    },
    {
      url: `https://${baseWorkspace}/api/${apiKey}`,
      description: 'Formato com barra'
    },
    {
      url: `https://${baseWorkspace}/api`,
      description: 'Formato sem chave'
    },
    {
      url: `https://${baseWorkspace}`,
      description: 'URL base do workspace'
    },
    {
      url: `https://${baseWorkspace}/`,
      description: 'URL base com barra'
    },
    {
      url: `https://${baseWorkspace}/v1`,
      description: 'Versão v1 da API'
    },
    {
      url: `https://${baseWorkspace}/v2`,
      description: 'Versão v2 da API'
    }
  ];
  
  const results = [];
  
  for (const urlTest of urlsToTest) {
    console.log(`\n${'='.repeat(60)}`);
    const result = await testURL(urlTest.url, urlTest.description);
    results.push({ ...urlTest, result });
    
    // Aguardar um pouco entre as requisições
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Resumo dos resultados
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 RESUMO DOS TESTES');
  console.log('=====================');
  
  const successful = results.filter(r => r.result.success).length;
  const failed = results.length - successful;
  
  console.log(`✅ URLs com sucesso: ${successful}`);
  console.log(`❌ URLs com falha: ${failed}`);
  
  // Mostrar as URLs que funcionaram
  const workingURLs = results.filter(r => r.result.success);
  if (workingURLs.length > 0) {
    console.log('\n🎯 URLs FUNCIONAIS:');
    workingURLs.forEach((urlTest, index) => {
      console.log(`   ${index + 1}. ${urlTest.description}`);
      console.log(`      URL: ${urlTest.url}`);
      console.log(`      Status: ${urlTest.result.status}`);
    });
  }
  
  // Recomendações
  console.log('\n💡 RECOMENDAÇÕES:');
  if (workingURLs.length > 0) {
    console.log('   • Use uma das URLs funcionais acima');
    console.log('   • Teste com endpoints específicos (ex: /clients)');
    console.log('   • Verifique a documentação do Xano para o formato correto');
  } else {
    console.log('   • Verifique se o workspace está ativo');
    console.log('   • Confirme se a API key está correta');
    console.log('   • Acesse o painel do Xano para verificar a URL correta');
  }
  
  console.log('\n🌐 PAINEL DO XANO:');
  console.log(`   https://${baseWorkspace}`);
}

// Executar testes
testXanoURLs().catch(console.error);
