# 🚀 Guia de Deploy - StarPrint CRM

## 📖 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Supabase](#configuração-do-supabase)
4. [Deploy no Vercel](#deploy-no-vercel)
5. [Deploy no Netlify](#deploy-no-netlify)
6. [Deploy Manual](#deploy-manual)
7. [Configuração de Produção](#configuração-de-produção)
8. [Monitoramento](#monitoramento)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este guia detalha o processo completo de deploy do StarPrint CRM em diferentes plataformas, incluindo configuração do ambiente de produção, variáveis de ambiente e monitoramento.

### **Arquitetura de Deploy**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Banco de      │
│   (Vercel/      │◄──►│   (Backend)     │◄──►│   Dados        │
│   Netlify)      │    │                 │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## ✅ Pré-requisitos

### **Requisitos do Sistema**
- Node.js 18+ instalado
- Git configurado
- Conta no Supabase
- Conta na plataforma de deploy escolhida

### **Checklist Pré-Deploy**
- [ ] Código testado e funcionando localmente
- [ ] Todos os testes passando
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Migrations executadas
- [ ] Build de produção funcionando

---

## 🔧 Configuração do Supabase

### **1. Criação do Projeto**

#### **Acesse o Supabase**
1. Vá para [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"

#### **Configure o Projeto**
```
Project Name: starprint-crm
Database Password: [senha-segura]
Region: [região-mais-próxima]
Pricing Plan: Free (início) ou Pro (produção)
```

### **2. Configuração do Banco**

#### **Execute as Migrations**
```bash
# Instale o Supabase CLI
npm install -g supabase

# Faça login
supabase login

# Conecte ao projeto
supabase link --project-ref [seu-project-ref]

# Execute as migrations
supabase db push
```

#### **Verifique as Tabelas**
```sql
-- Verifique se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verifique as políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### **3. Configuração de Segurança**

#### **Row Level Security (RLS)**
```sql
-- Verifique se RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Se não estiver, habilite
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
-- ... outras tabelas
```

#### **Políticas de Acesso**
```sql
-- Exemplo de política para clientes
CREATE POLICY "Users can view their own clients" ON clients
FOR SELECT USING (auth.uid() IN (
  SELECT user_id FROM user_clients WHERE client_id = clients.id
));

-- Exemplo de política para tickets
CREATE POLICY "Users can view assigned tickets" ON tickets
FOR SELECT USING (
  auth.uid() = assigned_to OR 
  auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
);
```

### **4. Configuração de Storage**

#### **Buckets para Arquivos**
```sql
-- Crie buckets para diferentes tipos de arquivo
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('tickets', 'tickets', false),
('documents', 'documents', false);
```

#### **Políticas de Storage**
```sql
-- Política para avatares públicos
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Política para documentos privados
CREATE POLICY "Users can access their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🚀 Deploy no Vercel

### **1. Preparação do Projeto**

#### **Configure o Build**
```json
// package.json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build"
  }
}
```

#### **Arquivo de Configuração Vercel**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **2. Deploy via Dashboard**

#### **Conecte o Repositório**
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente

#### **Variáveis de Ambiente**
```env
# Supabase
VITE_SUPABASE_URL=https://[seu-projeto].supabase.co
VITE_SUPABASE_ANON_KEY=[sua-chave-anonima]

# Aplicação
VITE_APP_NAME=StarPrint CRM
VITE_DEBUG_MODE=false
NODE_ENV=production
```

### **3. Deploy via CLI**

#### **Instale o Vercel CLI**
```bash
npm install -g vercel
```

#### **Faça Login e Deploy**
```bash
# Login
vercel login

# Deploy
vercel --prod

# Ou configure e deploy
vercel
```

---

## 🌐 Deploy no Netlify

### **1. Preparação do Projeto**

#### **Arquivo de Configuração**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### **2. Deploy via Dashboard**

#### **Conecte o Repositório**
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "New site from Git"
3. Conecte seu repositório
4. Configure as variáveis de ambiente

#### **Configuração de Build**
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

### **3. Deploy via CLI**

#### **Instale o Netlify CLI**
```bash
npm install -g netlify-cli
```

#### **Faça Login e Deploy**
```bash
# Login
netlify login

# Deploy
netlify deploy --prod

# Ou configure e deploy
netlify deploy
```

---

## 🛠️ Deploy Manual

### **1. Build de Produção**

#### **Execute o Build**
```bash
# Instale dependências
npm install

# Build de produção
npm run build:prod

# Verifique o build
npm run preview
```

#### **Otimizações de Build**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog'],
          charts: ['recharts']
        }
      }
    }
  }
});
```

### **2. Upload para Servidor**

#### **Via SCP/SFTP**
```bash
# Upload dos arquivos
scp -r dist/* usuario@servidor:/var/www/html/

# Ou via rsync
rsync -avz --delete dist/ usuario@servidor:/var/www/html/
```

#### **Via Git (Deploy Automático)**
```bash
# No servidor
cd /var/www/html
git pull origin main
npm install
npm run build:prod
```

### **3. Configuração do Servidor Web**

#### **Nginx**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;
    root /var/www/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache estático
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### **Apache**
```apache
<VirtualHost *:80>
    ServerName seu-dominio.com
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>

    # Gzip
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain text/css application/json application/javascript
    </IfModule>

    # Cache
    <IfModule mod_expires.c>
        ExpiresActive on
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
    </IfModule>
</VirtualHost>
```

---

## ⚙️ Configuração de Produção

### **1. Variáveis de Ambiente**

#### **Arquivo .env.production**
```env
# Supabase
VITE_SUPABASE_URL=https://[seu-projeto].supabase.co
VITE_SUPABASE_ANON_KEY=[sua-chave-anonima]

# Aplicação
VITE_APP_NAME=StarPrint CRM
VITE_DEBUG_MODE=false
VITE_APP_VERSION=1.0.0

# Analytics
VITE_ANALYTICS_ID=[seu-id-analytics]
VITE_SENTRY_DSN=[seu-dsn-sentry]

# Performance
VITE_ENABLE_SERVICE_WORKER=true
VITE_ENABLE_PWA=true
```

### **2. Configuração de Performance**

#### **Service Worker**
```typescript
// public/sw.js
const CACHE_NAME = 'starprint-crm-v1';
const urlsToCache = [
  '/',
  '/assets/index.js',
  '/assets/index.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

#### **PWA Manifest**
```json
// public/manifest.json
{
  "name": "StarPrint CRM",
  "short_name": "StarPrint",
  "description": "Sistema de gestão para empresas de impressão",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### **3. Configuração de Segurança**

#### **Headers de Segurança**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
});
```

#### **CSP (Content Security Policy)**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://*.supabase.co;">
```

---

## 📊 Monitoramento

### **1. Logs e Erros**

#### **Sentry Integration**
```typescript
// src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

#### **Error Boundary**
```typescript
// src/components/ErrorBoundary.tsx
import { ErrorBoundary } from '@sentry/react';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {/* sua aplicação */}
    </ErrorBoundary>
  );
}
```

### **2. Métricas de Performance**

#### **Web Vitals**
```typescript
// src/utils/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Envie para seu sistema de analytics
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

#### **Custom Metrics**
```typescript
// src/hooks/usePerformance.ts
export function usePerformance() {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming;
          console.log('Page Load Time:', nav.loadEventEnd - nav.loadEventStart);
        }
      }
    });
    
    observer.observe({ entryTypes: ['navigation'] });
    
    return () => observer.disconnect();
  }, []);
}
```

### **3. Uptime e Disponibilidade**

#### **Health Check Endpoint**
```typescript
// src/pages/health.tsx
export default function HealthCheck() {
  return (
    <div>
      <h1>Status: OK</h1>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>Version: {import.meta.env.VITE_APP_VERSION}</p>
    </div>
  );
}
```

#### **Monitoramento Externo**
- **UptimeRobot**: Monitoramento de uptime
- **Pingdom**: Testes de performance
- **New Relic**: APM e monitoramento
- **Datadog**: Logs e métricas

---

## 🔧 Troubleshooting

### **1. Problemas Comuns**

#### **Build Falhando**
```bash
# Limpe o cache
rm -rf node_modules package-lock.json
npm install

# Verifique as dependências
npm audit fix

# Build em modo verbose
npm run build --verbose
```

#### **Erro de CORS**
```typescript
// Verifique as configurações do Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
```

#### **Problemas de Roteamento**
```typescript
// Verifique se o router está configurado corretamente
<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

### **2. Debug em Produção**

#### **Source Maps**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true, // Habilite para debug
  }
});
```

#### **Logs Condicionais**
```typescript
// src/utils/logger.ts
export const logger = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args); // Sempre log de erros
  }
};
```

### **3. Rollback**

#### **Deploy Anterior**
```bash
# Vercel
vercel --prod --force

# Netlify
netlify deploy --prod --dir=dist

# Manual
git checkout HEAD~1
npm run build:prod
# Upload dos arquivos
```

---

## 📚 Recursos Adicionais

### **Documentação Oficial**
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)

### **Ferramentas Úteis**
- **Build**: Vite, Webpack
- **Deploy**: Vercel, Netlify, AWS, Google Cloud
- **Monitoramento**: Sentry, New Relic, Datadog
- **Performance**: Lighthouse, WebPageTest

### **Comandos Úteis**
```bash
# Verificar build
npm run build && npm run preview

# Analisar bundle
npm run build:analyze

# Testes antes do deploy
npm run test:run

# Verificar tipos
npm run type-check

# Lint e formatação
npm run lint:fix && npm run format
```

---

## 🎯 Checklist de Deploy

### **Pré-Deploy**
- [ ] Código testado e funcionando
- [ ] Todos os testes passando
- [ ] Build de produção funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado

### **Deploy**
- [ ] Deploy executado com sucesso
- [ ] Aplicação acessível
- [ ] Funcionalidades principais funcionando
- [ ] Performance aceitável
- [ ] Logs sem erros críticos

### **Pós-Deploy**
- [ ] Monitoramento configurado
- [ ] Alertas configurados
- [ ] Backup configurado
- [ ] Documentação atualizada
- [ ] Equipe notificada

---

**Última atualização: Janeiro 2024**
