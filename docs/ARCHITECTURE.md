# 🏗️ Arquitetura do Sistema - Trip Planner Backend

## 🎯 **Visão Geral**

O Trip Planner Backend foi construído seguindo os princípios da **Arquitetura Hexagonal (Ports & Adapters)**, proporcionando alta testabilidade, flexibilidade e manutenibilidade. O sistema é projetado para ser facilmente extensível e integrar-se perfeitamente com agentes de IA como o LangGraph.

## 📐 **Padrão Arquitetural: Hexagonal Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Express   │  │   Prisma    │  │   Vercel    │      │
│  │  REST API   │  │  Database   │  │  Hosting    │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │            HTTP Routes & Controllers                ││
│  │  /health  /api/flights  /api/bookings              ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                    APPLICATION                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Flight    │  │   Booking   │  │   Cancel    │      │
│  │  Use Cases  │  │  Use Cases  │  │  Use Cases  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                      DOMAIN                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │   Flight    │  │   Booking   │  │  Passenger  │      │
│  │   Entity    │  │   Entity    │  │   Entity    │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

## 🏛️ **Estrutura de Diretórios**

```
src/
├── domain/                 # 🧠 Regras de negócio puras
│   ├── entities/          # Entidades do domínio
│   │   ├── Flight.ts
│   │   ├── Booking.ts
│   │   └── Passenger.ts
│   ├── repositories/      # Interfaces dos repositórios
│   │   ├── FlightRepository.ts
│   │   └── BookingRepository.ts
│   └── services/          # Serviços de domínio
│       └── BookingService.ts
│
├── application/           # 🔄 Casos de uso da aplicação
│   ├── use-cases/        # Implementação dos casos de uso
│   │   ├── GetFlights.ts
│   │   ├── BookFlight.ts
│   │   ├── GetBooking.ts
│   │   └── CancelBooking.ts
│   └── dtos/             # Data Transfer Objects
│       ├── FlightDto.ts
│       └── BookingDto.ts
│
├── infrastructure/        # 🔧 Implementações técnicas
│   ├── database/         # Configuração do banco
│   │   ├── prisma/
│   │   ├── repositories/ # Implementações dos repositórios
│   │   └── migrations/
│   └── external/         # Serviços externos
│       └── airlines/
│
├── presentation/         # 🌐 Interface HTTP
│   ├── controllers/     # Controladores REST
│   │   ├── FlightController.ts
│   │   ├── BookingController.ts
│   │   └── HealthController.ts
│   ├── routes/         # Definição de rotas
│   │   ├── flights.ts
│   │   ├── bookings.ts
│   │   └── health.ts
│   ├── middleware/     # Middlewares HTTP
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── cors.ts
│   └── schemas/        # Validação Zod
│       ├── flight.ts
│       └── booking.ts
│
└── shared/              # 🛠️ Utilitários compartilhados
    ├── utils/
    ├── constants/
    └── types/
```

## 🔄 **Fluxo de Dados**

### 1. **Requisição HTTP** → **Apresentação**

```typescript
// 1. Rota recebe requisição
app.get('/api/flights', FlightController.getFlights);

// 2. Controller valida dados
const validatedQuery = flightSearchSchema.parse(req.query);

// 3. Controller chama Use Case
const result = await getFlightsUseCase.execute(validatedQuery);
```

### 2. **Apresentação** → **Aplicação**

```typescript
// Use Case coordena a operação
class GetFlightsUseCase {
  async execute(params: FlightSearchParams): Promise<FlightDto[]> {
    // Lógica de negócio
    const flights = await this.flightRepository.findMany(params);
    return flights.map((flight) => FlightDto.fromDomain(flight));
  }
}
```

### 3. **Aplicação** → **Domínio**

```typescript
// Entidade de domínio com regras de negócio
class Flight {
  constructor(
    private id: FlightId,
    private flightNumber: string,
    private price: Money
    // ...
  ) {}

  isBookable(): boolean {
    return this.availableSeats > 0 && !this.isDeparted();
  }
}
```

### 4. **Domínio** → **Infraestrutura**

```typescript
// Repositório implementa persistência
class PrismaFlightRepository implements FlightRepository {
  async findMany(params: FlightSearchParams): Promise<Flight[]> {
    const flights = await this.prisma.flight.findMany({
      where: this.buildWhereClause(params),
    });
    return flights.map((f) => Flight.fromPersistence(f));
  }
}
```

## 🎯 **Princípios Arquiteturais**

### **1. Inversão de Dependência**

```typescript
// ❌ Dependência direta (acoplado)
class BookingService {
  constructor(private database: PrismaClient) {} // Acoplado ao Prisma
}

// ✅ Inversão de dependência (desacoplado)
class BookingService {
  constructor(private repository: BookingRepository) {} // Interface abstrata
}
```

### **2. Separação de Responsabilidades**

- **Domain:** Regras de negócio puras, sem dependências externas
- **Application:** Orquestração de casos de uso
- **Infrastructure:** Implementações técnicas (DB, APIs externas)
- **Presentation:** Interface HTTP e validação

### **3. Ports & Adapters**

```typescript
// Port (Interface)
interface FlightRepository {
  findById(id: FlightId): Promise<Flight | null>;
  findMany(params: FlightSearchParams): Promise<Flight[]>;
}

// Adapter (Implementação)
class PrismaFlightRepository implements FlightRepository {
  // Implementação específica do Prisma
}
```

## 🔧 **Tecnologias por Camada**

### **Domain Layer**

- **Linguagem:** TypeScript puro
- **Dependências:** Nenhuma (regras de negócio puras)
- **Padrões:** Entities, Value Objects, Domain Services

### **Application Layer**

- **Casos de Uso:** Coordenação de operações
- **DTOs:** Transferência de dados entre camadas
- **Interfaces:** Contratos para infraestrutura

### **Infrastructure Layer**

- **ORM:** Prisma (SQLite)
- **Validação:** Zod
- **Database:** SQLite (desenvolvimento), PostgreSQL (produção)
- **Deploy:** Vercel Serverless

### **Presentation Layer**

- **Framework:** Express.js
- **Middleware:** CORS, Rate Limiting, Error Handling
- **Validação:** Zod Schemas
- **Documentação:** OpenAPI/Swagger

## 🧪 **Testabilidade**

A arquitetura hexagonal facilita testes em todas as camadas:

### **Testes Unitários - Domain**

```typescript
describe('Flight Entity', () => {
  it('should not be bookable when full', () => {
    const flight = new Flight(/* ... */, { availableSeats: 0 })
    expect(flight.isBookable()).toBe(false)
  })
})
```

### **Testes de Integração - Application**

```typescript
describe('BookFlightUseCase', () => {
  it('should create booking successfully', async () => {
    // Mock repository
    const mockRepo = jest.mocked(flightRepository);
    const useCase = new BookFlightUseCase(mockRepo);

    const result = await useCase.execute(validBookingData);
    expect(result.status).toBe('CONFIRMED');
  });
});
```

### **Testes E2E - Presentation**

```typescript
describe('Flight API', () => {
  it('should return flights for valid search', async () => {
    const response = await request(app)
      .get('/api/flights?origin=CNF&destination=GRU')
      .expect(200);

    expect(response.body.flights).toHaveLength(3);
  });
});
```

## 🚀 **Benefícios da Arquitetura**

### **1. Flexibilidade**

- Trocar Prisma por TypeORM sem afetar regras de negócio
- Migrar de Express para Fastify mantendo casos de uso
- Adicionar GraphQL junto ao REST

### **2. Testabilidade**

- Testes unitários rápidos no domain
- Mocks fáceis nas interfaces
- Testes E2E isolados

### **3. Manutenibilidade**

- Responsabilidades bem definidas
- Baixo acoplamento entre camadas
- Alto coesão dentro das camadas

### **4. Evolução**

- Novas features seguem o mesmo padrão
- Refatorações seguras
- Integração com IA/LangGraph simplificada

## 🔄 **Próximas Evoluções**

### **Phase 1: Hotéis**

- `HotelEntity`, `HotelRepository`
- `BookHotelUseCase`, `CancelHotelBookingUseCase`
- Endpoints `/api/hotels/*`

### **Phase 2: Pacotes**

- `TripPackageEntity` (Voo + Hotel)
- `PackageBookingService`
- Endpoints `/api/packages/*`

### **Phase 3: Inteligência**

- `RecommendationService`
- `PriceOptimizationService`
- Integração com LangGraph AI Agent
