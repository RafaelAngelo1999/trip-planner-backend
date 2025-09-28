# 🚀 Guia de Deploy - Trip Planner Backend

## 🌐 **Deploy na Vercel (Recomendado)**

### **Pré-requisitos**

- Conta na [Vercel](https://vercel.com)
- Repositório no GitHub
- Node.js 18+ localmente

### **Deploy Automático (GitHub Integration)**

1. **Conectar Repositório**

   ```bash
   # Push seu código para GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Importar Projeto na Vercel**
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Clique em "Import" no seu repositório
   - Configure as variáveis de ambiente (se necessário)

3. **Configuração Automática**
   A Vercel detecta automaticamente:
   - `package.json` → Instala dependências
   - `vercel.json` → Aplica configurações
   - `prisma/` → Gera cliente Prisma

### **Deploy Manual via CLI**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login na Vercel
vercel login

# Deploy do projeto
vercel

# Deploy para produção
vercel --prod
```

### **Configuração `vercel.json`**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

---

## 🐳 **Deploy com Docker**

### **Dockerfile**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

EXPOSE 3001
CMD ["npm", "start"]
```

### **docker-compose.yml**

```yaml
version: '3.8'
services:
  trip-planner:
    build: .
    ports:
      - '3001:3001'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./prod.db
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

### **Comandos Docker**

```bash
# Build da imagem
docker build -t trip-planner-backend .

# Executar container
docker run -p 3001:3001 trip-planner-backend

# Com docker-compose
docker-compose up -d
```

---

## ☁️ **Deploy na AWS**

### **AWS Lambda (Serverless)**

1. **Instalar Serverless Framework**

   ```bash
   npm install -g serverless
   npm install --save-dev serverless-offline
   ```

2. **Configurar `serverless.yml`**

   ```yaml
   service: trip-planner-backend

   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1

   functions:
     api:
       handler: src/lambda.handler
       events:
         - http:
             path: /{proxy+}
             method: ANY
             cors: true
   ```

3. **Deploy**
   ```bash
   serverless deploy
   ```

### **AWS EC2 (Tradicional)**

```bash
# Conectar à instância EC2
ssh -i your-key.pem ec2-user@your-instance-ip

# Instalar Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone e setup
git clone https://github.com/seu-usuario/trip-planner-backend.git
cd trip-planner-backend
npm install
npm run build

# PM2 para gerenciamento de processo
npm install -g pm2
pm2 start dist/server.js --name trip-planner
pm2 startup
pm2 save
```

---

## 🔥 **Deploy no Railway**

1. **Conectar GitHub**
   - Acesse [railway.app](https://railway.app)
   - Clique em "Deploy from GitHub"
   - Selecione seu repositório

2. **Configuração Automática**
   - Railway detecta automaticamente Node.js
   - Build e deploy automáticos
   - HTTPS gratuito

3. **Variáveis de Ambiente**
   ```bash
   NODE_ENV=production
   PORT=3001
   ```

---

## 🌊 **Deploy no DigitalOcean App Platform**

1. **Criar App**

   ```bash
   # Via CLI
   doctl apps create --spec app-spec.yaml
   ```

2. **app-spec.yaml**
   ```yaml
   name: trip-planner-backend
   services:
     - name: api
       source_dir: /
       github:
         repo: seu-usuario/trip-planner-backend
         branch: main
       run_command: npm start
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       routes:
         - path: /
   ```

---

## 🏠 **Deploy Local para Produção**

### **PM2 (Process Manager)**

```bash
# Instalar PM2
npm install -g pm2

# Configurar ecosystem.config.js
module.exports = {
  apps: [{
    name: 'trip-planner-backend',
    script: 'dist/server.js',
    instances: 'max',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}

# Iniciar em produção
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

### **Nginx (Reverse Proxy)**

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 **Configurações de Produção**

### **Variáveis de Ambiente**

```bash
# Essenciais
NODE_ENV=production
PORT=3001

# Database (se usando PostgreSQL em produção)
DATABASE_URL=postgresql://user:pass@host:port/db

# Opcional
LOG_LEVEL=info
CORS_ORIGIN=https://seu-frontend.com
RATE_LIMIT_MAX=100
```

### **package.json Scripts**

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "vercel-build": "npx prisma generate && npm run build",
    "postinstall": "npx prisma generate"
  }
}
```

---

## 📊 **Monitoramento e Logs**

### **Health Check Endpoint**

```typescript
// Já implementado em /health
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});
```

### **Uptime Monitoring**

- [UptimeRobot](https://uptimerobot.com) - Gratuito
- [Pingdom](https://pingdom.com) - Pago
- [StatusCake](https://statuscake.com) - Freemium

### **Application Monitoring**

```bash
# New Relic (opcional)
npm install newrelic

# Sentry para error tracking
npm install @sentry/node
```

---

## 🚨 **Troubleshooting**

### **Problemas Comuns**

#### **1. Prisma não encontra schema**

```bash
# Solução
npx prisma generate
npx prisma db push
```

#### **2. Timeout na Vercel**

```json
// vercel.json
{
  "functions": {
    "src/server.ts": {
      "maxDuration": 60
    }
  }
}
```

#### **3. Falta de memória**

```json
// vercel.json
{
  "builds": [
    {
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

#### **4. CORS Issues**

```typescript
// Configurar CORS adequadamente
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);
```

### **Comandos de Debug**

```bash
# Logs da Vercel
vercel logs

# Logs locais
npm run dev

# Verificar build
npm run build
node dist/server.js

# Testar produção localmente
NODE_ENV=production npm start
```

---

## ✅ **Checklist de Deploy**

- [ ] ✅ Código commitado no Git
- [ ] ✅ `vercel.json` configurado
- [ ] ✅ `package.json` com scripts corretos
- [ ] ✅ Prisma schema atualizado
- [ ] ✅ Variáveis de ambiente configuradas
- [ ] ✅ CORS configurado para produção
- [ ] ✅ Health check funcionando
- [ ] ✅ Rate limiting ativo
- [ ] ✅ Error handling implementado
- [ ] ✅ Logs estruturados
- [ ] ✅ Monitoramento configurado
- [ ] ✅ Backup/recovery planejado

**🎉 Deploy realizado com sucesso!**
