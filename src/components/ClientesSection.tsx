import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, History, Users, BarChart3 } from 'lucide-react';

const ClientesSection = () => {
  const [activeTab, setActiveTab] = useState('gestao');

  useEffect(() => {
    console.log('🎯 ClientesSection carregado!');
    console.log('📊 Aba ativa:', activeTab);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
            <p className="text-sm text-gray-600 mt-1">Gerencie seus clientes e histórico de serviços</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">59 clientes cadastrados</span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <Users className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">49 estratégicos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-12 bg-transparent p-0 space-x-8">
            <TabsTrigger 
              value="gestao" 
              className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
            >
              <Building2 className="h-4 w-4" />
              <span>Gestão de Clientes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="historico" 
              className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
            >
              <History className="h-4 w-4" />
              <span>Histórico de Serviços</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center space-x-2 h-12 px-0 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent rounded-none"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="gestao" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestão de Clientes</h3>
              <p className="text-gray-600">Aqui você pode gerenciar todos os seus clientes.</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>59 clientes</strong> cadastrados no sistema
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  <strong>49 clientes estratégicos</strong> e <strong>10 clientes regulares</strong>
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="historico" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Serviços</h3>
              <p className="text-gray-600">Visualize o histórico completo de atendimentos e serviços.</p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>127 atendimentos</strong> realizados
                </p>
                <p className="text-sm text-green-600 mt-1">
                  <strong>7 registros</strong> de histórico de serviços
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics de Clientes</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total de Clientes</p>
                      <p className="text-2xl font-bold text-blue-900">59</p>
                    </div>
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Clientes Estratégicos</p>
                      <p className="text-2xl font-bold text-green-900">49</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Atendimentos</p>
                      <p className="text-2xl font-bold text-purple-900">127</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Distribuição por Segmento</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Industrial</span>
                    <span className="text-sm font-medium text-gray-900">21 clientes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lingerie</span>
                    <span className="text-sm font-medium text-gray-900">4 clientes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Confecção</span>
                    <span className="text-sm font-medium text-gray-900">3 clientes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saúde</span>
                    <span className="text-sm font-medium text-gray-900">3 clientes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Outros</span>
                    <span className="text-sm font-medium text-gray-900">28 clientes</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientesSection;
