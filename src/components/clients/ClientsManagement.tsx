import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Plus, Search, Eye, Edit, Phone, Mail, MapPin, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  code: string;
  company_name: string;
  trade_name: string;
  document_type: string;
  document_number: string;
  client_type: string;
  segment: string;
  size: string;
  status: string;
  website?: string;
  notes?: string;
  created_at: string;
  addresses?: ClientAddress[];
  contacts?: ClientContact[];
  persons?: ClientPerson[];
}

interface ClientAddress {
  id: string;
  address_type: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_primary: boolean;
}

interface ClientContact {
  id: string;
  contact_type: string;
  contact_value: string;
  description?: string;
  is_primary: boolean;
  is_whatsapp: boolean;
}

interface ClientPerson {
  id: string;
  name: string;
  role?: string;
  department?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  is_primary: boolean;
  is_decision_maker: boolean;
}

const ClientsManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

  const filterClients = useCallback(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.trade_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.document_number.includes(searchTerm)
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(client => client.client_type === selectedType);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(client => client.status === selectedStatus);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, selectedType, selectedStatus]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [filterClients]);

  const fetchClients = async () => {
    try {
      const { data: clientsData, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_addresses(*),
          client_contacts(*),
          client_persons(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setClients(clientsData || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strategic': return 'bg-purple-100 text-purple-800';
      case 'regular': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setViewDetailsOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Cadastro de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Cadastro de Clientes
            </CardTitle>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por nome, código ou documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="strategic">Estratégico</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredClients.length} de {clients.length} clientes
            </div>

            {/* Clients list */}
            <div className="space-y-3">
              {filteredClients.map((client) => (
                <div 
                  key={client.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {client.code}
                      </Badge>
                      <Badge className={getTypeColor(client.client_type)}>
                        {client.client_type === 'strategic' ? 'Estratégico' : 
                         client.client_type === 'regular' ? 'Regular' : 'Prospect'}
                      </Badge>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status === 'active' ? 'Ativo' : 
                         client.status === 'inactive' ? 'Inativo' : 
                         client.status === 'suspended' ? 'Suspenso' : 'Prospect'}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-lg">{client.company_name}</h4>
                    {client.trade_name && (
                      <p className="text-sm text-muted-foreground">{client.trade_name}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{client.document_type}: {client.document_number}</span>
                      {client.segment && <span>• {client.segment}</span>}
                      {client.size && <span>• {client.size === 'micro' ? 'Micro' : 
                                             client.size === 'small' ? 'Pequena' : 
                                             client.size === 'medium' ? 'Média' : 'Grande'}</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(client)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-3 w-3" />
                      Detalhes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum cliente encontrado com os filtros aplicados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Client Details Modal */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Detalhes do Cliente
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Informações Básicas</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Código:</strong> {selectedClient.code}</p>
                    <p><strong>Razão Social:</strong> {selectedClient.company_name}</p>
                    {selectedClient.trade_name && (
                      <p><strong>Nome Fantasia:</strong> {selectedClient.trade_name}</p>
                    )}
                    <p><strong>Documento:</strong> {selectedClient.document_type} {selectedClient.document_number}</p>
                    <p><strong>Segmento:</strong> {selectedClient.segment || 'Não informado'}</p>
                    {selectedClient.website && (
                      <p><strong>Website:</strong> <a href={selectedClient.website} target="_blank" className="text-blue-600 hover:underline">{selectedClient.website}</a></p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Status e Classificação</h3>
                  <div className="space-y-2">
                    <Badge className={getStatusColor(selectedClient.status)}>
                      Status: {selectedClient.status === 'active' ? 'Ativo' : 
                              selectedClient.status === 'inactive' ? 'Inativo' : 
                              selectedClient.status === 'suspended' ? 'Suspenso' : 'Prospect'}
                    </Badge>
                    <Badge className={getTypeColor(selectedClient.client_type)}>
                      Tipo: {selectedClient.client_type === 'strategic' ? 'Estratégico' : 
                            selectedClient.client_type === 'regular' ? 'Regular' : 'Prospect'}
                    </Badge>
                    {selectedClient.size && (
                      <Badge variant="outline">
                        Porte: {selectedClient.size === 'micro' ? 'Micro' : 
                               selectedClient.size === 'small' ? 'Pequena' : 
                               selectedClient.size === 'medium' ? 'Média' : 'Grande'}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {selectedClient.addresses && selectedClient.addresses.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereços
                  </h3>
                  <div className="space-y-2">
                    {selectedClient.addresses.map((address) => (
                      <div key={address.id} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {address.address_type === 'main' ? 'Principal' : 
                             address.address_type === 'billing' ? 'Cobrança' : 
                             address.address_type === 'delivery' ? 'Entrega' : 'Outro'}
                          </Badge>
                          {address.is_primary && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              Primário
                            </Badge>
                          )}
                        </div>
                        <p>
                          {address.street}, {address.number}
                          {address.complement && `, ${address.complement}`}
                        </p>
                        <p>
                          {address.neighborhood} - {address.city}/{address.state}
                        </p>
                        <p>CEP: {address.zip_code}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {selectedClient.contacts && selectedClient.contacts.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contatos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedClient.contacts.map((contact) => (
                      <div key={contact.id} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {contact.contact_type === 'phone' ? 'Telefone' : 
                             contact.contact_type === 'mobile' ? 'Celular' : 
                             contact.contact_type === 'email' ? 'Email' : 
                             contact.contact_type === 'whatsapp' ? 'WhatsApp' : 'Fax'}
                          </Badge>
                          {contact.is_primary && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              Primário
                            </Badge>
                          )}
                          {contact.is_whatsapp && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              WhatsApp
                            </Badge>
                          )}
                        </div>
                        <p className="font-mono">{contact.contact_value}</p>
                        {contact.description && (
                          <p className="text-muted-foreground">{contact.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Persons */}
              {selectedClient.persons && selectedClient.persons.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Pessoas de Contato
                  </h3>
                  <div className="space-y-2">
                    {selectedClient.persons.map((person) => (
                      <div key={person.id} className="p-3 bg-muted rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{person.name}</h4>
                          {person.is_primary && (
                            <Badge className="text-xs bg-green-100 text-green-800">
                              Contato Principal
                            </Badge>
                          )}
                          {person.is_decision_maker && (
                            <Badge className="text-xs bg-blue-100 text-blue-800">
                              Tomador de Decisão
                            </Badge>
                          )}
                        </div>
                        {person.role && <p><strong>Cargo:</strong> {person.role}</p>}
                        {person.department && <p><strong>Departamento:</strong> {person.department}</p>}
                        {person.email && <p><strong>Email:</strong> {person.email}</p>}
                        {person.phone && <p><strong>Telefone:</strong> {person.phone}</p>}
                        {person.mobile && <p><strong>Celular:</strong> {person.mobile}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedClient.notes && (
                <div>
                  <h3 className="font-medium mb-2">Observações</h3>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    <p>{selectedClient.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsManagement;