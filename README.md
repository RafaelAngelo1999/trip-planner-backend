# �️ Trip Planner Backend

[![Live API](htt## 📚 **Documentação Completa**

| Documento                                      | Descrição                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [🔗 API-REFERENCE.md](./docs/API-REFERENCE.md) | **Referência completa** - Todas as rotas, inputs, outputs e exemplos |
| [📡 API.md](./docs/API.md)                     | Documentação da API com exemplos de uso                              |
| [🏗️ ARCHITECTURE.md](./docs/ARCHITECTURE.md)   | Arquitetura hexagonal e padrões de design                            |
| [🚀 DEPLOYMENT.md](./docs/DEPLOYMENT.md)       | Guias de deploy para Vercel, Docker, AWS                             | g.shields.io/badge/Live_API-Online-success?style=for-the-badge)](https://trip-planner-backend-three.vercel.app/health) |

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-indigo?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

> **Backend Node.js/TypeScript com arquitetura hexagonal para sistema de planejamento de viagens**

## 🌐 **API Online**

**Base URL:** https://trip-planner-backend-three.vercel.app

**Endpoints principais:**

- 🟢 [`GET /health`](https://trip-planner-backend-three.vercel.app/health) - Status da API
- ✈️ [`GET /api/flights`](https://trip-planner-backend-three.vercel.app/api/flights) - Listar voos
- 🎫 [`POST /api/flights/:id/book`](https://trip-planner-backend-three.vercel.app/api/flights) - Reservar voo
- ❌ [`PUT /api/bookings/:id/cancel`](https://trip-planner-backend-three.vercel.app/api/bookings) - Cancelar reserva

## 🚀 **Demonstração Rápida**

```bash
# Health check
curl https://trip-planner-backend-three.vercel.app/health

# Buscar voos CNF → GRU
curl "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=GRU"

# Teste local
git clone https://github.com/RafaelAngelo1999/trip-planner-backend.git
cd trip-planner-backend && npm install && npm run server
```

## ✨ **Características Técnicas**

- ⚡ **API Online**: Totalmente funcional e acessível via internet
- 🏗️ **Arquitetura Hexagonal**: Separação clara entre domínio, aplicação e infraestrutura
- � **TypeScript**: Tipagem estática e desenvolvimento mais seguro
- 🗄️ **Prisma + SQLite**: ORM moderno com banco de dados leve e performático
- 🌐 **APIs RESTful**: Endpoints totalmente compatíveis com LangGraph
- ✅ **Validação Zod**: Validação robusta de dados de entrada
- 📱 **CORS Habilitado**: Pronto para integração com frontends
- ☁️ **Deploy Vercel**: Infraestrutura serverless otimizada

## � **Documentação Completa**

| Documento                                    | Descrição                                 |
| -------------------------------------------- | ----------------------------------------- |
| [� API.md](./docs/API.md)                    | Documentação completa da API com exemplos |
| [🏗️ ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Arquitetura hexagonal e padrões de design |
| [🚀 DEPLOYMENT.md](./docs/DEPLOYMENT.md)     | Guias de deploy para Vercel, Docker, AWS  |

## ⚡ **Início Rápido - Desenvolvimento Local**

````bash
# 1. Clone e instale
git clone https://github.com/RafaelAngelo1999/trip-planner-backend.git
cd trip-planner-backend
npm install

# 2. Configure o banco

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

npm run db:generate
npm run db:push
npm run db:seed

# 3. Execute em desenvolvimento
npm run dev
# 🌐 Servidor local: http://localhost:3001
````

## 🔧 **Scripts Disponíveis**

```bash
npm run dev          # Desenvolvimento com watch mode
npm run build        # Build para produção
npm run start        # Executar versão de produção
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar schema ao banco
npm run db:seed      # Popular dados de exemplo
npm run db:studio    # Interface visual do banco
npm test             # Executar testes
```

## 📊 **Dados de Exemplo**

O sistema vem pré-populado com:

- ✈️ **30+ voos**: Domésticos e internacionais incluindo CNF → SFO (2025-10-01)
- 🏨 **10 hotéis**: Belo Horizonte (7) + San Francisco (3)
- 💰 **Preços realistas**: Voos R$ 800-8.500, Hotéis R$ 140-650/noite
- 🏢 **Companhias**: LATAM, Gol, Azul, American Airlines, United, Delta
- 🗓️ **Datas específicas**: Incluindo voos para outubro de 2025

### Saúde do Sistema

```http
GET    /health                      # Health check
GET    /api                         # Informações da API
```

### Exemplos de Uso

#### Buscar voos de CNF para GRU

```bash
curl "http://localhost:3001/api/flights?origin=CNF&destination=GRU&departure_date=2024-12-15"
```

#### Reservar um voo

```bash
curl -X POST "http://localhost:3001/api/flights/[flight-id]/book" \
  -H "Content-Type: application/json" \
  -d '{
    "passenger": {
      "first_name": "João",
      "last_name": "Silva",
      "email": "joao@example.com",
      "phone": "11999999999",
      "date_of_birth": "1990-01-01",
      "nationality": "Brazilian"
    },
    "flight_date": "2024-12-15"
  }'
```

## 🎯 Funcionalidades Extras

### 🔄 Simulação Realista

- **Latência variável**: 200ms-2000ms para simular APIs reais
- **Taxa de falha**: ~5% em operações para testing
- **Preços dinâmicos**: Variação por temporada, antecedência e demanda
- **Capacidade limitada**: Hotéis/voos podem "esgotar"

### 📊 Observabilidade

- **Logs estruturados**: Winston com múltiplos níveis
- **Métricas**: Contador de requisições, latência, errors
- **Health checks**: Status de saúde da aplicação
- **Performance tracking**: Monitoramento de queries e response times

### 🛡️ Qualidade e Segurança

- **Validação robusta**: Zod schemas para entrada e saída
- **Error handling**: Tratamento centralizado de erros
- **Rate limiting**: Proteção contra spam
- **CORS**: Configurado para localhost:2024 (LangGraph)

## 📚 Arquitetura

```
src/
├── domain/              # Regras de negócio
│   ├── entities/        # Entidades (Flight, Hotel, Booking)
│   ├── repositories/    # Contratos de repositório
│   └── services/        # Serviços de domínio
├── application/         # Casos de uso
│   ├── flights/         # Use cases de voos
│   └── hotels/          # Use cases de hotéis
├── infrastructure/      # Implementações técnicas
│   ├── database/        # Prisma e repositórios
│   ├── seeders/         # Dados iniciais
│   └── services/        # Serviços externos
└── presentation/        # Controllers e rotas
    ├── controllers/     # Controladores REST
    ├── routes/          # Definição de rotas
    ├── dto/             # Data Transfer Objects
    └── middlewares/     # Middlewares Express
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📈 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Executar em produção
npm run db:generate  # Gerar cliente Prisma
## 🧑‍💻 **Desenvolvimento**

### Estrutura do Projeto
```

src/
├── domain/ # 🧠 Regras de negócio puras
├── application/ # 🔄 Casos de uso da aplicação  
├── infrastructure/ # 🔧 Implementações técnicas
├── presentation/ # 🌐 Controllers e rotas HTTP
└── shared/ # 🛠️ Utilitários compartilhados

````

### Comandos de Desenvolvimento
```bash
npm run dev          # 🔥 Hot reload development
npm run db:studio    # 🎨 Interface visual do Prisma
npm test             # 🧪 Executar testes
npm run build        # 📦 Build de produção
````

## 🤝 **Contribuindo**

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
  <strong>�️ Trip Planner Backend - Pronto para a próxima aventura!</strong>
  <br><br>
  <a href="https://trip-planner-backend-three.vercel.app/health">🟢 Status da API</a> •
  <a href="./docs/API.md">📡 API Docs</a> •
  <a href="./docs/ARCHITECTURE.md">🏗️ Arquitetura</a> •
  <a href="./docs/DEPLOYMENT.md">🚀 Deploy</a>
</div>
