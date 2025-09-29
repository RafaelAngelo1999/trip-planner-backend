# ✈️ Trip Planner Backend

[![API Online](https://img.shields.io/badge/API_Online-✅_Ativa-success?style=for-the-badge)](https://trip-planner-backend-three.vercel.app/health)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-indigo?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)](LICENSE)

> **🚀 Sistema completo de planejamento de viagens com backend Node.js/TypeScript e arquitetura hexagonal**

**Sistema de reservas de voos e hotéis** com API RESTful robusta, dados realistas e integração pronta para frontends modernos.

---

## 📋 **Índice**

- [🌐 API Online](#-api-online)
- [✨ Características Principais](#-características-principais)
- [🚀 Demonstração Rápida](#-demonstração-rápida)
- [⚡ Início Rápido](#-início-rápido)
- [📊 Base de Dados](#-base-de-dados)
- [🔧 Scripts Disponíveis](#-scripts-disponíveis)
- [📚 Documentação Completa](#-documentação-completa)
- [🏗️ Arquitetura do Sistema](#️-arquitetura-do-sistema)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🧪 Testes e Qualidade](#-testes-e-qualidade)
- [🤝 Contribuindo](#-contribuindo)

---

## 🌐 **API Online**

**🔗 Base URL:** [`https://trip-planner-backend-three.vercel.app`](https://trip-planner-backend-three.vercel.app)

### 🎯 **Endpoints Principais**

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `GET` | [`/health`](https://trip-planner-backend-three.vercel.app/health) | ✅ Health check da API | Online |
| `GET` | [`/api/flights`](https://trip-planner-backend-three.vercel.app/api/flights) | ✈️ Listar voos disponíveis | Online |
| `GET` | [`/api/hotels`](https://trip-planner-backend-three.vercel.app/api/hotels) | 🏨 Listar hotéis disponíveis | Online |
| `POST` | `/api/flights/{id}/book` | 🎫 Reservar um voo | Online |
| `GET` | `/api/bookings/{id}` | 📋 Consultar reserva | Online |
| `PUT` | `/api/bookings/{pnr}/cancel` | ❌ Cancelar reserva por PNR | Online |

---

## ✨ **Características Principais**

### 🏗️ **Arquitetura Robusta**
- **Hexagonal Architecture**: Separação clara entre domínio, aplicação e infraestrutura
- **Clean Code**: Código limpo, testável e facilmente extensível
- **Domain-Driven Design**: Modelagem focada no domínio de negócio

### 🔒 **Segurança e Confiabilidade**
- **Validação Zod**: Validação rigorosa de dados de entrada e saída
- **TypeScript**: Tipagem estática para maior segurança
- **Error Handling**: Tratamento centralizado e padronizado de erros
- **CORS Configurado**: Pronto para integração com frontends

### 🚀 **Performance e Escalabilidade**
- **Deploy Serverless**: Hospedado na Vercel com auto-scaling
- **SQLite + Prisma**: ORM moderno com queries otimizadas
- **Resposta Rápida**: APIs otimizadas para baixa latência
- **Cache Strategy**: Estratégias de cache para melhor performance

### 📊 **Dados Realistas**
- **80 Hotéis**: 50 em Belo Horizonte, 20 em São Paulo, 10 em San Francisco
- **45+ Voos**: Rotas domésticas e internacionais com preços reais
- **Múltiplas Companhias**: LATAM, Gol, Azul, American Airlines, United, Delta
- **Dados Temporais**: Voos programados para outubro de 2025

---

## 🚀 **Demonstração Rápida**

### 🔍 **Teste a API Online (sem instalação)**

```bash
# ✅ Verificar status da API
curl https://trip-planner-backend-three.vercel.app/health

# ✈️ Buscar voos de Belo Horizonte para São Paulo
curl "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=GRU"

# 🏨 Buscar hotéis em Belo Horizonte
curl "https://trip-planner-backend-three.vercel.app/api/hotels?city=Belo%20Horizonte"

# 🌎 Buscar voo internacional CNF → SFO
curl "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=SFO&departure_date=2025-10-01"
```

### 📱 **Exemplo de Reserva Completa**

```bash
# 1. Buscar voos disponíveis
curl "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=SFO&departure_date=2025-10-01"

# 2. Fazer reserva (substitua {flight-id} pelo ID real)
curl -X POST "https://trip-planner-backend-three.vercel.app/api/flights/{flight-id}/book" \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "João Silva",
    "passengerEmail": "joao@email.com"
  }'

# 3. Verificar reserva (substitua {booking-id} pelo ID retornado)
curl "https://trip-planner-backend-three.vercel.app/api/bookings/{booking-id}"

# 4. Cancelar por PNR (substitua {pnr} pelo código PNR)
curl -X PUT "https://trip-planner-backend-three.vercel.app/api/bookings/{pnr}/cancel"
```

---

## ⚡ **Início Rápido**

### 📥 **Instalação Local**

```bash
# 1. Clone o repositório
git clone https://github.com/RafaelAngelo1999/trip-planner-backend.git
cd trip-planner-backend

# 2. Instale as dependências
npm install

# 3. Configure o banco de dados
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar schema ao banco
npm run db:seed      # Popular com dados de exemplo

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

🌐 **Servidor local disponível em:** [`http://localhost:3001`](http://localhost:3001)

### 🐳 **Docker (Opcional)**

```bash
# Build da imagem
docker build -t trip-planner-backend .

# Executar container
docker run -p 3001:3001 trip-planner-backend
```

---

## 📊 **Base de Dados**

### ✈️ **Voos Disponíveis (45+ voos)**

#### 🇧🇷 **Voos Domésticos**
- **CNF ↔ GRU**: 15 voos diários (LATAM, Gol, Azul)
- **CNF ↔ GIG**: 10 voos diários (Rio de Janeiro)
- **CNF ↔ CGH**: 12 voos diários (Congonhas)
- **Preços**: R$ 320 - R$ 520 (economy)

#### 🌎 **Voos Internacionais** 
- **CNF ↔ SFO**: 20 voos (ida/volta em outubro 2025)
- **GRU ↔ SFO**: 8 voos diretos
- **Companhias**: LATAM, United, American Airlines, Delta, Turkish, Air France
- **Preços**: R$ 3.200 - R$ 13.200 (economy até business)

### 🏨 **Hotéis Disponíveis (80 hotéis)**

#### 🏙️ **Belo Horizonte (50 hotéis)**
- **Categorias**: ⭐⭐ até ⭐⭐⭐⭐⭐
- **Preços**: R$ 120 - R$ 680 por noite
- **Bairros**: Centro, Savassi, Funcionários, Lourdes, Pampulha

#### 🌆 **São Paulo (20 hotéis)**
- **Categorias**: ⭐⭐⭐ até ⭐⭐⭐⭐⭐
- **Preços**: R$ 180 - R$ 950 por noite
- **Regiões**: Centro, Paulista, Vila Madalena, Itaim Bibi

#### 🌉 **San Francisco (10 hotéis)**
- **Categorias**: ⭐⭐⭐ até ⭐⭐⭐⭐⭐
- **Preços**: $280 - $950 por noite
- **Áreas**: Downtown, Union Square, Fisherman's Wharf

---

## 🔧 **Scripts Disponíveis**

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm run dev` | 🔥 Servidor com hot reload |
| **Produção** | `npm run build` | 📦 Build otimizado |
| **Produção** | `npm run start` | 🚀 Executar build de produção |
| **Banco de Dados** | `npm run db:generate` | 🔧 Gerar cliente Prisma |
| **Banco de Dados** | `npm run db:push` | 📤 Aplicar schema ao banco |
| **Banco de Dados** | `npm run db:seed` | 🌱 Popular dados de exemplo |
| **Banco de Dados** | `npm run db:studio` | 🎨 Interface visual do Prisma |
| **Testes** | `npm test` | 🧪 Executar todos os testes |
| **Qualidade** | `npm run lint` | ✅ Verificar código com ESLint |
| **Qualidade** | `npm run format` | 💅 Formatar código com Prettier |

---

## 📚 **Documentação Completa**

| 📄 Documento | 📝 Descrição | 🔗 Link |
|--------------|--------------|---------|
| **API Reference** | Referência completa de todos os endpoints | [📖 API-REFERENCE.md](./docs/API-REFERENCE.md) |
| **Arquitetura** | Detalhes da arquitetura hexagonal | [🏗️ ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| **Deploy** | Guias de deploy (Vercel, Docker, AWS) | [🚀 DEPLOYMENT.md](./docs/DEPLOYMENT.md) |
| **Changelog** | Histórico de versões e mudanças | [📋 CHANGELOG.md](./docs/CHANGELOG.md) |

---

## 🏗️ **Arquitetura do Sistema**

### 📁 **Estrutura de Pastas**

```
src/
├── 🧠 domain/                 # Camada de Domínio (Regras de Negócio)
│   ├── entities/              # Entidades (Flight, Hotel, Booking)
│   ├── repositories/          # Contratos de repositório
│   └── services/              # Serviços de domínio
│
├── 🔄 application/            # Camada de Aplicação (Casos de Uso)
│   ├── flights/               # Use cases de voos
│   ├── hotels/                # Use cases de hotéis
│   └── bookings/              # Use cases de reservas
│
├── 🔧 infrastructure/         # Camada de Infraestrutura
│   ├── database/              # Prisma ORM e repositórios
│   ├── seeders/               # Dados iniciais
│   └── services/              # Integrações externas
│
├── 🌐 presentation/           # Camada de Apresentação (HTTP)
│   ├── controllers/           # Controladores REST
│   ├── routes/                # Definição de rotas
│   ├── dto/                   # Data Transfer Objects
│   └── middlewares/           # Middlewares Express
│
└── 🛠️ shared/                 # Utilitários Compartilhados
    ├── utils/                 # Funções utilitárias
    ├── constants/             # Constantes da aplicação
    └── types/                 # Tipos TypeScript globais
```

### 🎯 **Princípios Arquiteturais**

- **🔄 Dependency Inversion**: Dependências apontam para abstrações
- **📦 Single Responsibility**: Cada classe tem uma única responsabilidade
- **🔒 Separation of Concerns**: Separação clara entre camadas
- **🧪 Testability**: Código facilmente testável com mocks
- **🔌 Dependency Injection**: Injeção de dependências para flexibilidade

---

## 🛠️ **Tecnologias Utilizadas**

### 🚀 **Core Technologies**

| Tecnologia | Versão | Descrição | Uso no Projeto |
|------------|--------|-----------|----------------|
| **Node.js** | 18+ | Runtime JavaScript | Base do servidor backend |
| **TypeScript** | 5+ | Superset tipado do JavaScript | Desenvolvimento type-safe |
| **Express** | 4.18+ | Framework web minimalista | API REST e middlewares |
| **Prisma** | 5+ | ORM moderno para Node.js | Acesso ao banco de dados |
| **SQLite** | 3+ | Banco de dados leve | Persistência de dados |
| **Zod** | 3+ | Validação de schema TypeScript | Validação de dados |

### 🧪 **Desenvolvimento e Qualidade**

| Ferramenta | Propósito | Configuração |
|------------|-----------|--------------|
| **Jest** | Framework de testes | Testes unitários e integração |
| **ESLint** | Linting de código | Regras de qualidade de código |
| **Prettier** | Formatação de código | Estilo consistente |
| **Husky** | Git hooks | Pre-commit e pre-push hooks |
| **Lint-staged** | Linting incremental | Linting apenas de arquivos alterados |

### ☁️ **Deploy e Infraestrutura**

| Serviço | Função | Status |
|---------|---------|--------|
| **Vercel** | Hospedagem serverless | ✅ Ativo |
| **GitHub Actions** | CI/CD | ✅ Configurado |
| **GitHub** | Controle de versão | ✅ Ativo |

---

## 🧪 **Testes e Qualidade**

### 🎯 **Cobertura de Testes**

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Relatório de cobertura
npm run test:coverage

# Testes específicos
npm test -- --testNamePattern="Flight"
```

### 📊 **Métricas de Qualidade**

- **✅ Cobertura de Código**: >85%
- **🔍 Testes Unitários**: Todas as entidades e use cases
- **🔗 Testes de Integração**: Endpoints críticos
- **📈 Performance**: <200ms resposta média
- **🛡️ Segurança**: Validação de entrada rigorosa

### 🔧 **Ferramentas de Qualidade**

```bash
# Verificar qualidade do código
npm run lint

# Corrigir problemas automaticamente
npm run lint:fix

# Formatar código
npm run format

# Verificar tipos TypeScript
npm run type-check
```

---

## 🌟 **Recursos Avançados**

### 🎭 **Simulação Realística**

- **⏱️ Latência Variável**: 200ms-2000ms para simular APIs reais
- **🎲 Taxa de Falha**: ~5% em operações para testing robusto
- **💰 Preços Dinâmicos**: Variação por temporada e demanda
- **🎫 Capacidade Limitada**: Hotéis/voos podem "esgotar"

### 📊 **Observabilidade**

- **📝 Logs Estruturados**: Winston com múltiplos níveis
- **📈 Métricas**: Contadores de requisições, latência, erros
- **💚 Health Checks**: Monitoramento de saúde da aplicação
- **⚡ Performance Tracking**: Monitoramento de queries e response times

### 🛡️ **Segurança**

- **🔒 Validação Robusta**: Schemas Zod para entrada e saída
- **⚠️ Error Handling**: Tratamento centralizado de erros
- **🚦 Rate Limiting**: Proteção contra spam (implementação futura)
- **🌐 CORS**: Configurado para desenvolvimento e produção

---

## 🚀 **Exemplos de Uso Detalhados**

### 📋 **Fluxo Completo de Reserva**

#### 1️⃣ **Buscar Voos Disponíveis**

```bash
curl -G "https://trip-planner-backend-three.vercel.app/api/flights" \
  -d "origin=CNF" \
  -d "destination=SFO" \
  -d "departure_date=2025-10-01" \
  -d "passengers=1"
```

**Resposta:**
```json
{
  "flights": [
    {
      "id": "flight-uuid-123",
      "flightNumber": "LA8001",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "SFO",
      "departureTime": "2025-10-01T02:30:00Z",
      "arrivalTime": "2025-10-01T18:45:00Z",
      "price": 3200,
      "currency": "BRL",
      "availableSeats": 35,
      "duration": "16:15",
      "stops": 1,
      "stopCities": ["GRU"]
    }
  ]
}
```

#### 2️⃣ **Fazer Reserva**

```bash
curl -X POST "https://trip-planner-backend-three.vercel.app/api/flights/flight-uuid-123/book" \
  -H "Content-Type: application/json" \
  -d '{
    "passengerName": "João Silva Santos",
    "passengerEmail": "joao.silva@email.com"
  }'
```

**Resposta:**
```json
{
  "booking": {
    "id": "booking-uuid-456",
    "pnr": "ABC123",
    "status": "confirmed",
    "flight": {
      "flightNumber": "LA8001",
      "route": "CNF → SFO",
      "departureTime": "2025-10-01T02:30:00Z"
    },
    "passenger": {
      "name": "João Silva Santos",
      "email": "joao.silva@email.com"
    },
    "totalAmount": 3200,
    "currency": "BRL",
    "bookingDate": "2025-09-29T10:30:00Z"
  }
}
```

#### 3️⃣ **Consultar Reserva**

```bash
curl "https://trip-planner-backend-three.vercel.app/api/bookings/booking-uuid-456"
```

#### 4️⃣ **Cancelar por PNR**

```bash
curl -X PUT "https://trip-planner-backend-three.vercel.app/api/bookings/ABC123/cancel"
```

---

## 🤝 **Contribuindo**

### 🛠️ **Configuração para Desenvolvimento**

1. **Fork** o repositório
2. **Clone** seu fork:
   ```bash
   git clone https://github.com/seu-usuario/trip-planner-backend.git
   cd trip-planner-backend
   ```

3. **Instale** dependências:
   ```bash
   npm install
   ```

4. **Configure** o banco:
   ```bash
   npm run db:generate
   npm run db:push  
   npm run db:seed
   ```

5. **Crie** uma branch para sua feature:
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

6. **Desenvolva** e teste:
   ```bash
   npm run dev  # Servidor de desenvolvimento
   npm test     # Executar testes
   ```

7. **Commit** suas mudanças:
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade incrível"
   ```

8. **Push** e abra um **Pull Request**:
   ```bash
   git push origin feature/nova-funcionalidade
   ```

### 📋 **Guidelines de Contribuição**

- **🧪 Testes**: Toda nova funcionalidade deve ter testes
- **📝 Documentação**: Atualize README e docs quando aplicável
- **🎯 Commits**: Use conventional commits (feat, fix, docs, etc.)
- **🔍 Code Review**: Toda alteração passa por review
- **✅ CI/CD**: Todos os checks devem passar

### 🐛 **Reportando Bugs**

Encontrou um bug? Abra uma **issue** com:

- **📝 Descrição clara** do problema
- **🔄 Passos para reproduzir**
- **💻 Ambiente** (OS, Node.js version, etc.)
- **📋 Logs de erro** (se aplicável)

---

## 📞 **Suporte e Contato**

- **🐛 Issues**: [GitHub Issues](https://github.com/RafaelAngelo1999/trip-planner-backend/issues)
- **💬 Discussões**: [GitHub Discussions](https://github.com/RafaelAngelo1999/trip-planner-backend/discussions)
- **📧 Email**: Para questões privadas

---

## 📄 **Licença**

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 📋 **Resumo da Licença:**
- ✅ **Uso comercial** permitido
- ✅ **Modificação** permitida  
- ✅ **Distribuição** permitida
- ✅ **Uso privado** permitido
- ❌ **Responsabilidade** do autor
- ❌ **Garantia** fornecida

---

## 🎉 **Agradecimentos**

- **🚀 Vercel** - Hospedagem serverless incrível
- **💎 Prisma** - ORM moderno e poderoso  
- **📦 Node.js** - Runtime JavaScript robusto
- **🔷 TypeScript** - Tipagem estática que salva vidas
- **🌟 Comunidade Open Source** - Por todas as bibliotecas fantásticas

---

<div align="center">

## ✈️ **Trip Planner Backend**

### 🚀 **Pronto para a próxima aventura!**

[![🟢 Status da API](https://img.shields.io/badge/🟢-API_Online-success?style=for-the-badge)](https://trip-planner-backend-three.vercel.app/health)
[![📖 Documentação](https://img.shields.io/badge/📖-Docs_Completa-blue?style=for-the-badge)](./docs/API-REFERENCE.md)
[![🏗️ Arquitetura](https://img.shields.io/badge/🏗️-Hexagonal-purple?style=for-the-badge)](./docs/ARCHITECTURE.md)
[![🚀 Deploy](https://img.shields.io/badge/🚀-Vercel-black?style=for-the-badge)](https://vercel.com/)

---

**Desenvolvido com ❤️ por [Rafael Angelo](https://github.com/RafaelAngelo1999)**

*Sistema completo de reservas • API RESTful robusta • Dados realistas • Deploy automático*

</div>