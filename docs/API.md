# 📡 Trip Planner API - Documentação Completa

## 🌐 **Base URL**

```
https://trip-planner-backend-three.vercel.app
```

## 🟢 **Health Check**

Verifica o status da API e conectividade do banco.

```http
GET /health
```

**Resposta:**

```json
{
  "status": "OK",
  "message": "Trip Planner Backend is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "environment": "production"
}
```

---

## ✈️ **Voos (Flights)**

### Listar Voos

Busca voos disponíveis com filtros opcionais.

```http
GET /api/flights?origin={origin}&destination={destination}&departureDate={date}
```

**Parâmetros de Query:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `origin` | string | Não | Código do aeroporto de origem (ex: CNF, GRU) |
| `destination` | string | Não | Código do aeroporto de destino |
| `departureDate` | string | Não | Data de partida (YYYY-MM-DD) |

**Exemplo de Requisição:**

```bash
curl "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=GRU"
```

**Resposta de Sucesso (200):**

```json
{
  "flights": [
    {
      "id": "flight-123",
      "flightNumber": "LA3721",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departureTime": "2024-02-15T08:30:00.000Z",
      "arrivalTime": "2024-02-15T10:15:00.000Z",
      "price": 485.9,
      "currency": "BRL",
      "duration": "1h 45m",
      "availableSeats": 42,
      "aircraft": "Airbus A320"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "hasNext": true
  }
}
```

---

## 🎫 **Reservas (Bookings)**

### Reservar Voo

Cria uma nova reserva para um voo específico.

```http
POST /api/flights/{flightId}/book
```

**Parâmetros de Rota:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `flightId` | string | ID único do voo |

**Corpo da Requisição:**

```json
{
  "passenger": {
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "+5511999887766",
    "document": "123.456.789-00"
  },
  "preferences": {
    "seatType": "window",
    "meal": "vegetarian",
    "baggage": "checked"
  }
}
```

**Exemplo de Requisição:**

```bash
curl -X POST https://trip-planner-backend-three.vercel.app/api/flights/flight-123/book \
  -H "Content-Type: application/json" \
  -d '{
    "passenger": {
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "+5511999887766",
      "document": "123.456.789-00"
    }
  }'
```

**Resposta de Sucesso (201):**

```json
{
  "booking": {
    "id": "booking-abc123",
    "flightId": "flight-123",
    "status": "CONFIRMED",
    "bookingReference": "ABC123",
    "passenger": {
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "+5511999887766",
      "document": "123.456.789-00"
    },
    "flight": {
      "flightNumber": "LA3721",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departureTime": "2024-02-15T08:30:00.000Z",
      "price": 485.9
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "totalPrice": 485.9,
    "currency": "BRL"
  }
}
```

### Consultar Reserva

Recupera detalhes de uma reserva específica.

```http
GET /api/bookings/{bookingId}
```

**Exemplo de Requisição:**

```bash
curl https://trip-planner-backend-three.vercel.app/api/bookings/booking-abc123
```

**Resposta de Sucesso (200):**

```json
{
  "booking": {
    "id": "booking-abc123",
    "status": "CONFIRMED",
    "bookingReference": "ABC123",
    "passenger": {
      "name": "João Silva",
      "email": "joao@email.com"
    },
    "flight": {
      "flightNumber": "LA3721",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departureTime": "2024-02-15T08:30:00.000Z"
    },
    "totalPrice": 485.9,
    "currency": "BRL",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Cancelar Reserva

Cancela uma reserva existente.

```http
PUT /api/bookings/{bookingId}/cancel
```

**Exemplo de Requisição:**

```bash
curl -X PUT https://trip-planner-backend-three.vercel.app/api/bookings/booking-abc123/cancel \
  -H "Content-Type: application/json" \
  -d '{"reason": "Mudança de planos"}'
```

**Resposta de Sucesso (200):**

```json
{
  "booking": {
    "id": "booking-abc123",
    "status": "CANCELLED",
    "bookingReference": "ABC123",
    "cancelledAt": "2024-01-15T11:00:00.000Z",
    "cancellationReason": "Mudança de planos",
    "refundAmount": 388.72,
    "refundCurrency": "BRL"
  },
  "message": "Reserva cancelada com sucesso"
}
```

---

## 🚨 **Códigos de Erro**

### Status HTTP

| Código | Status                | Descrição              |
| ------ | --------------------- | ---------------------- |
| 200    | OK                    | Sucesso                |
| 201    | Created               | Recurso criado         |
| 400    | Bad Request           | Dados inválidos        |
| 404    | Not Found             | Recurso não encontrado |
| 422    | Unprocessable Entity  | Erro de validação      |
| 500    | Internal Server Error | Erro interno           |

### Formato de Erro Padrão

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "passenger.email",
        "message": "Email é obrigatório"
      }
    ],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Códigos de Erro Específicos

| Código                      | Descrição                  |
| --------------------------- | -------------------------- |
| `FLIGHT_NOT_FOUND`          | Voo não encontrado         |
| `BOOKING_NOT_FOUND`         | Reserva não encontrada     |
| `FLIGHT_FULL`               | Voo lotado                 |
| `VALIDATION_ERROR`          | Erro de validação de dados |
| `BOOKING_ALREADY_CANCELLED` | Reserva já cancelada       |
| `CANCELLATION_NOT_ALLOWED`  | Cancelamento não permitido |

---

## 🔧 **Exemplos de Uso**

### Fluxo Completo de Reserva

```bash
# 1. Buscar voos
curl "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=GRU"

# 2. Reservar voo
curl -X POST https://trip-planner-backend-three.vercel.app/api/flights/flight-123/book \
  -H "Content-Type: application/json" \
  -d '{"passenger":{"name":"João Silva","email":"joao@email.com","phone":"+5511999887766","document":"123.456.789-00"}}'

# 3. Consultar reserva
curl https://trip-planner-backend-three.vercel.app/api/bookings/booking-abc123

# 4. Cancelar se necessário
curl -X PUT https://trip-planner-backend-three.vercel.app/api/bookings/booking-abc123/cancel \
  -H "Content-Type: application/json" \
  -d '{"reason":"Mudança de planos"}'
```

### Integração com JavaScript/TypeScript

```typescript
// Cliente TypeScript para Trip Planner API
class TripPlannerClient {
  private baseUrl = 'https://trip-planner-backend-three.vercel.app';

  async searchFlights(params: {
    origin?: string;
    destination?: string;
    departureDate?: string;
  }) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseUrl}/api/flights?${query}`);
    return response.json();
  }

  async bookFlight(flightId: string, passenger: any) {
    const response = await fetch(
      `${this.baseUrl}/api/flights/${flightId}/book`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passenger }),
      }
    );
    return response.json();
  }

  async getBooking(bookingId: string) {
    const response = await fetch(`${this.baseUrl}/api/bookings/${bookingId}`);
    return response.json();
  }

  async cancelBooking(bookingId: string, reason?: string) {
    const response = await fetch(
      `${this.baseUrl}/api/bookings/${bookingId}/cancel`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      }
    );
    return response.json();
  }
}
```

---

## 📊 **Rate Limits & Limites**

- **Rate Limit:** 100 requisições por minuto por IP
- **Payload máximo:** 10MB
- **Timeout:** 30 segundos
- **Cors:** Habilitado para todos os domínios

---

## 🛠️ **Ambiente de Desenvolvimento**

Para testar localmente:

```bash
git clone https://github.com/RafaelAngelo1999/trip-planner-backend.git
cd trip-planner-backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run server
```

Base URL local: `http://localhost:3001`
