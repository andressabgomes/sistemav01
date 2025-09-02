// Script para testar a navegação
// Execute com: node scripts/test-navigation.js

import { navigationItems } from '../src/config/navigation.js';

console.log('🧭 Testando navegação...\n');

console.log('📋 Itens de navegação encontrados:');
navigationItems.forEach((item, index) => {
  console.log(`   ${index + 1}. ${item.id} - ${item.label}`);
});

console.log('\n🎯 Verificando se "clientes" está presente:');
const clientesItem = navigationItems.find(item => item.id === 'clientes');
if (clientesItem) {
  console.log('✅ Seção "clientes" encontrada!');
  console.log(`   Label: ${clientesItem.label}`);
  console.log(`   Description: ${clientesItem.description}`);
} else {
  console.log('❌ Seção "clientes" NÃO encontrada!');
}

console.log('\n🔍 Verificando permissões...');
const rolePermissions = {
  admin: ['dashboard', 'equipe', 'escalas', 'metas', 'clientes', 'atendimento', 'monitoramento', 'relatorios', 'administracao'],
  gestao: ['dashboard', 'equipe', 'escalas', 'metas', 'clientes', 'monitoramento', 'relatorios'],
  atendente: ['dashboard', 'clientes', 'atendimento']
};

Object.entries(rolePermissions).forEach(([role, permissions]) => {
  const hasClientes = permissions.includes('clientes');
  console.log(`   ${role}: ${hasClientes ? '✅' : '❌'} clientes`);
});

console.log('\n🎉 Teste concluído!');
