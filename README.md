# 🚀 Trip Planner Backend

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Docker](https://img.shields.io/badge/Docker-supported-blue)](Dockerfile)

Backend Node.js/TypeScript com arquitetura hexagonal para sistema de planejamento de viagens, projetado para ser 100% compatível com o LangGraph Trip Planner. Oferece APIs robustas para reserva de voos, hotéis e gerenciamento de viagens.

## 🎯 Demonstração Rápida

```bash
# Clone e configure
git clone https://github.com/seu-usuario/trip-planner-backend.git
cd trip-planner-backend
npm install && npm run db:generate && npm run db:push && npm run db:seed

# Inicie o servidor
npm run server

# Teste a API
curl http://localhost:3001/api/flights
```

**Endpoints principais:**
- 🏥 Health Check: `GET /health`
- ✈️ Listar voos: `GET /api/flights`
- 📋 Reservar voo: `POST /api/flights/:id/book`
- ❌ Cancelar reserva: `PUT /api/bookings/:id/cancel`
- 📄 Ver reserva: `GET /api/bookings/:id`
- 🏨 Listar hotéis: `GET /api/hotels` (em breve)

## ✨ Características Principais

- **🏗️ Arquitetura Hexagonal**: Separação clara entre domínio, aplicação e infraestrutura
- **🔒 TypeScript**: Tipagem estática e desenvolvimento mais seguro  
- **🗄️ Prisma + SQLite**: ORM moderno com banco de dados leve e performático
- **🌐 APIs RESTful**: Endpoints totalmente compatíveis com LangGraph
- **📊 Monitoramento**: Logging estruturado com Winston e métricas detalhadas
- **🔄 Simulação Realista**: Latência variável, taxa de falha e preços dinâmicos
- **🐳 Docker**: Containerização completa com multi-stage builds
- **📚 Documentação**: APIs documentadas com Postman e exemplos práticos
- **🧪 Testes**: Suite completa de testes unitários e integração
- **🚀 CI/CD**: GitHub Actions para deploy automatizado

## 🛠️ Stack Tecnológica

- **Runtime**: Node.js 18+
- **Linguagem**: TypeScript
- **Framework**: Express.js
- **Banco de Dados**: SQLite com Prisma ORM
- **Validação**: Zod
- **Logging**: Winston
- **Testes**: Jest
- **Containerização**: Docker

## 📋 Pré-requisitos

- Node.js 18+
- npm 8+
- Docker (opcional)

## 🚀 Instalação e Setup

### 1. Clone e instale dependências

```bash
git clone <repository-url>
cd chat-backend
npm install
```

### 2. Configure o banco de dados

```bash
# Gerar cliente Prisma
npm run db:generate

# Aplicar schema ao banco
npm run db:push

# Popular com dados de exemplo
npm run db:seed
```

### 3. Execute em desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`

### 4. Execute com Docker (Recomendado)

```bash
# Build e start com docker-compose
npm run docker:up

# Para parar
npm run docker:down
```

## 📊 Dados de Exemplo

O sistema vem pré-populado com:

### ✈️ Voos (9 voos)

- **6 voos domésticos diretos**: CNF ↔ GRU, CNF ↔ GIG
- **3 voos internacionais**: CNF → SFO (via GRU, MIA, IAH)
- **Preços**: R$ 800-4.500 (doméstico), R$ 6.000-8.500 (internacional)
- **Companhias**: LATAM, Gol, Azul, American Airlines, United, Delta

### 🏨 Hotéis (7 hotéis em BH)

- Tryp by Wyndham, Radisson Blu, Holiday Inn Express
- Mercure, ibis, Hotel Fasano, Quality Hotel
- **Ratings**: 3.9-4.9 estrelas
- **Preços**: R$ 140-650/noite
- **Localização**: Diversos bairros de Belo Horizonte

## 🔌 Endpoints da API

### Voos

```http
GET    /api/flights                 # Buscar voos
GET    /api/flights/:id             # Detalhes do voo
POST   /api/flights/:id/book        # Reservar voo
```

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
npm run db:push      # Aplicar schema
npm run db:seed      # Popular banco com dados
npm run db:studio    # Interface visual do banco
npm run lint         # Verificar código
npm run format       # Formatar código
npm run docker:up    # Docker compose up
npm run docker:down  # Docker compose down
```

## 🌍 Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
ENABLE_FILE_LOGGING=false
DATABASE_URL="file:./dev.db"
```

## 🚀 Deploy

### Docker Production

```bash
# Build da imagem
docker build -t trip-planner-backend .

# Run container
docker run -p 3001:3001 \
  -e NODE_ENV=production \
  -e LOG_LEVEL=info \
  trip-planner-backend
```

### Manual Deploy

```bash
# Build do projeto
npm run build

# Preparar banco
npm run db:generate
npm run db:push
npm run db:seed

# Executar
npm start
```

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3001/health
```

### Métricas

- **Requests**: Total, sucessos, erros por endpoint
- **Performance**: Tempo de resposta, queries lentas
- **Business**: Bookings, buscas, taxa de conversão
- **Sistema**: Uptime, uso de recursos

## 🔮 Próximos Passos

- [ ] Implementar rotas de hotéis
- [ ] Adicionar autenticação JWT
- [ ] Integração com APIs reais (Amadeus, Booking.com)
- [ ] Cache com Redis
- [ ] Swagger UI completo
- [ ] Testes de integração
- [ ] CI/CD pipeline
- [ ] Métricas Prometheus

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/user/repo/issues)
- **Email**: rafael@example.com

---

**Desenvolvido com ❤️ para integração perfeita com LangGraph Trip Planner**
