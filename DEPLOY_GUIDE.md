# 🌐 Deploy da API Trip Planner

Guia para fazer deploy da API na internet usando plataformas gratuitas.

## 🚀 Opção 1: Vercel (Recomendado - Mais Fácil)

### Passo a Passo:

1. **Criar conta na Vercel**
   - Ir para: https://vercel.com
   - Fazer login com GitHub

2. **Importar projeto**
   - Click em "New Project"
   - Selecionar repositório: `trip-planner-backend`
   - Click em "Import"

3. **Configurar deploy**
   - Framework Preset: **Other**
   - Build Command: `npm run vercel-build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**
   - Click em "Deploy"
   - Aguardar build (2-3 minutos)
   - URL estará disponível!

### URL de Exemplo:
```
https://trip-planner-backend-seu-usuario.vercel.app
```

### Testar API:
```bash
curl https://trip-planner-backend-seu-usuario.vercel.app/health
curl https://trip-planner-backend-seu-usuario.vercel.app/api/flights
```

---

## 🚀 Opção 2: Railway

### Passo a Passo:

1. **Criar conta**
   - Ir para: https://railway.app
   - Login com GitHub

2. **Novo projeto**
   - "New Project" → "Deploy from GitHub repo"
   - Selecionar `trip-planner-backend`

3. **Configurar**
   - Variáveis de ambiente são criadas automaticamente
   - Railway detecta Node.js automaticamente

4. **Deploy**
   - Deploy automático
   - URL disponível em ~2 minutos

---

## 🚀 Opção 3: Render

### Passo a Passo:

1. **Criar conta**
   - Ir para: https://render.com
   - Login com GitHub

2. **Web Service**
   - "New" → "Web Service"
   - Connect repositório `trip-planner-backend`

3. **Configurar**
   - **Name**: trip-planner-backend
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

4. **Deploy**
   - Click "Create Web Service"
   - URL disponível em ~3 minutos

---

## ⚙️ Configurações de Produção

### CORS para Produção
O CORS já está configurado para aceitar múltiplas origens.

### Banco de Dados
- SQLite funciona perfeitamente para demonstração
- Dados são populados automaticamente no build

### Variáveis de Ambiente
Já configuradas para produção nos arquivos:
- `.env.production`
- `vercel.json`

---

## 🧪 Teste das APIs na Internet

Depois do deploy, teste estes endpoints:

```bash
# Substituir YOUR_URL pela URL do deploy

# Health Check
curl https://YOUR_URL/health

# Listar voos
curl https://YOUR_URL/api/flights

# Voos de CNF para GRU
curl "https://YOUR_URL/api/flights?origin=CNF&destination=GRU"

# Reservar voo (usar ID real)
curl -X POST "https://YOUR_URL/api/flights/FLIGHT_ID/book" \
  -H "Content-Type: application/json" \
  -d '{"passenger":{"first_name":"João","last_name":"Silva","email":"joao@email.com","phone":"+5511999999999","date_of_birth":"1990-01-01","passport":"BR123456789","nationality":"Brazilian"},"flight_date":"2024-12-15"}'

# Cancelar reserva (usar booking ID)
curl -X PUT "https://YOUR_URL/api/bookings/BOOKING_ID/cancel" \
  -H "Content-Type: application/json" \
  -d '{"reason":"Teste de cancelamento"}'
```

---

## 📊 Monitoramento

### Vercel
- Dashboard: https://vercel.com/dashboard
- Logs em tempo real
- Métricas de performance

### Railway
- Dashboard: https://railway.app/dashboard
- Logs e métricas
- Monitoramento de recursos

### Render
- Dashboard: https://dashboard.render.com
- Logs detalhados
- Health checks automáticos

---

## 🔄 Auto-Deploy

Todas as plataformas fazem deploy automático quando você fizer push para o GitHub:

```bash
# Fazer mudanças no código
git add .
git commit -m "feat: new feature"
git push

# Deploy automático será iniciado!
```

---

## 💡 Dicas

1. **Vercel** - Melhor para APIs simples, deploy mais rápido
2. **Railway** - Melhor se precisar de banco PostgreSQL no futuro
3. **Render** - Mais controle, melhor para aplicações complexas

4. **URL Personalizada** - Todas permitem configurar domínio próprio

5. **Logs** - Sempre verificar logs se algo não funcionar

---

## 🆘 Solução de Problemas

### Build falha:
1. Verificar se `package.json` tem todas dependências
2. Verificar se `tsconfig.json` está correto
3. Verificar logs de build na plataforma

### API não responde:
1. Verificar se porta está correta (processo.env.PORT)
2. Verificar CORS
3. Verificar logs da aplicação

### Banco não inicializa:
1. Verificar se `prisma generate` roda no build
2. Verificar se seeders executam
3. Verificar permissões de arquivo

---

**Recomendo começar com Vercel - é o mais simples! 🚀**