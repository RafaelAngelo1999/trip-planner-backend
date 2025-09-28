# 🔗 API Reference - Trip Planner Backend

## 📍 **Base URL**

```
https://trip-planner-backend-three.vercel.app
```

---

## 🟢 **Health Check**

### `GET /health`

Verifica o status da API e conectividade.

**Headers:** Nenhum

**Query Parameters:** Nenhum

**Request Body:** Nenhum

**Response (200 OK):**

```json
{
  "status": "OK",
  "message": "Trip Planner Backend is running",
  "timestamp": "2025-09-28T10:30:00.000Z",
  "environment": "production"
}
```

**Exemplo cURL:**

```bash
curl -X GET https://trip-planner-backend-three.vercel.app/health
```

---

## ✈️ **Flights (Voos)**

### `GET /api/flights`

Lista todos os voos disponíveis com filtros opcionais.

**Headers:**

```
Content-Type: application/json
```

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|---------|
| `origin` | string | Não | Código do aeroporto de origem | CNF, GRU, GIG |
| `destination` | string | Não | Código do aeroporto de destino | CNF, GRU, GIG |
| `departureDate` | string | Não | Data de partida (YYYY-MM-DD) | 2025-12-15 |
| `page` | number | Não | Número da página (padrão: 1) | 1 |
| `limit` | number | Não | Itens por página (padrão: 10) | 10 |

**Request Body:** Nenhum

**Response (200 OK):**

```json
{
  "flights": [
    {
      "id": "cm1ll0s9q0000bx4ac1bcuzkp",
      "flightNumber": "LA3721",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departureTime": "2025-02-15T08:30:00.000Z",
      "arrivalTime": "2025-02-15T10:15:00.000Z",
      "price": 485.9,
      "currency": "BRL",
      "duration": "1h 45m",
      "availableSeats": 42,
      "aircraft": "Airbus A320",
      "status": "SCHEDULED"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "hasNext": true,
    "hasPrevious": false,
    "totalPages": 2
  }
}
```

**Response (400 Bad Request):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Parâmetros de consulta inválidos",
    "details": [
      {
        "field": "departureDate",
        "message": "Data deve estar no formato YYYY-MM-DD"
      }
    ],
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Exemplo cURL:**

```bash
# Listar todos os voos
curl -X GET https://trip-planner-backend-three.vercel.app/api/flights

# Buscar voos CNF → GRU
curl -X GET "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=GRU"

# Buscar voos com data específica
curl -X GET "https://trip-planner-backend-three.vercel.app/api/flights?origin=CNF&destination=GRU&departureDate=2025-12-15"
```

---

### `GET /api/flights/:id`

Recupera detalhes de um voo específico.

**Headers:**

```
Content-Type: application/json
```

**Path Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | Sim | ID único do voo |

**Query Parameters:** Nenhum

**Request Body:** Nenhum

**Response (200 OK):**

```json
{
  "flight": {
    "id": "cm1ll0s9q0000bx4ac1bcuzkp",
    "flightNumber": "LA3721",
    "airline": "LATAM",
    "origin": "CNF",
    "destination": "GRU",
    "departureTime": "2025-02-15T08:30:00.000Z",
    "arrivalTime": "2025-02-15T10:15:00.000Z",
    "price": 485.9,
    "currency": "BRL",
    "duration": "1h 45m",
    "availableSeats": 42,
    "aircraft": "Airbus A320",
    "status": "SCHEDULED",
    "gates": {
      "departure": "A12",
      "arrival": "B5"
    },
    "policies": {
      "baggage": "23kg incluído",
      "cancellation": "Cancelamento gratuito até 24h antes",
      "changes": "Taxa de R$ 150 para alterações"
    }
  }
}
```

**Response (404 Not Found):**

```json
{
  "error": {
    "code": "FLIGHT_NOT_FOUND",
    "message": "Voo não encontrado",
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Exemplo cURL:**

```bash
curl -X GET https://trip-planner-backend-three.vercel.app/api/flights/cm1ll0s9q0000bx4ac1bcuzkp
```

---

### `POST /api/flights/:id/book`

Cria uma nova reserva para um voo específico.

**Headers:**

```
Content-Type: application/json
```

**Path Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | Sim | ID único do voo |

**Request Body:**

```json
{
  "passenger": {
    "name": "João Silva Santos",
    "email": "joao.silva@email.com",
    "phone": "+5511999887766",
    "document": "123.456.789-00",
    "dateOfBirth": "1990-05-15",
    "nationality": "Brazilian"
  },
  "preferences": {
    "seatType": "window",
    "meal": "vegetarian",
    "baggage": "checked"
  },
  "emergencyContact": {
    "name": "Maria Silva",
    "phone": "+5511888776655",
    "relationship": "spouse"
  }
}
```

**Schema de Validação:**

```typescript
// passenger (obrigatório)
{
  name: string (min: 2, max: 100),
  email: string (formato email válido),
  phone: string (formato internacional),
  document: string (formato brasileiro),
  dateOfBirth?: string (YYYY-MM-DD),
  nationality?: string
}

// preferences (opcional)
{
  seatType?: "window" | "aisle" | "middle",
  meal?: "regular" | "vegetarian" | "vegan" | "halal",
  baggage?: "carry-on" | "checked" | "extra"
}

// emergencyContact (opcional)
{
  name?: string,
  phone?: string,
  relationship?: string
}
```

**Response (201 Created):**

```json
{
  "booking": {
    "id": "cm1ll0s9q0001bx4ac1bcuzkq",
    "bookingReference": "ABC123",
    "status": "CONFIRMED",
    "flightId": "cm1ll0s9q0000bx4ac1bcuzkp",
    "passenger": {
      "name": "João Silva Santos",
      "email": "joao.silva@email.com",
      "phone": "+5511999887766",
      "document": "123.456.789-00"
    },
    "flight": {
      "flightNumber": "LA3721",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departureTime": "2025-02-15T08:30:00.000Z",
      "arrivalTime": "2025-02-15T10:15:00.000Z"
    },
    "preferences": {
      "seatType": "window",
      "meal": "vegetarian",
      "baggage": "checked"
    },
    "totalPrice": 485.9,
    "currency": "BRL",
    "createdAt": "2025-09-28T10:30:00.000Z",
    "policies": {
      "cancellation": "Cancelamento gratuito até 24h antes",
      "changes": "Taxa de R$ 150 para alterações"
    }
  },
  "message": "Reserva criada com sucesso"
}
```

**Response (400 Bad Request):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos",
    "details": [
      {
        "field": "passenger.email",
        "message": "Email é obrigatório"
      },
      {
        "field": "passenger.name",
        "message": "Nome deve ter pelo menos 2 caracteres"
      }
    ],
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Response (422 Unprocessable Entity):**

```json
{
  "error": {
    "code": "FLIGHT_FULL",
    "message": "Voo lotado - não há assentos disponíveis",
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Exemplo cURL:**

```bash
curl -X POST https://trip-planner-backend-three.vercel.app/api/flights/cm1ll0s9q0000bx4ac1bcuzkp/book \
  -H "Content-Type: application/json" \
  -d '{
    "passenger": {
      "name": "João Silva Santos",
      "email": "joao.silva@email.com",
      "phone": "+5511999887766",
      "document": "123.456.789-00"
    }
  }'
```

---

## 🎫 **Bookings (Reservas)**

### `GET /api/bookings/:id`

Recupera detalhes de uma reserva específica.

**Headers:**

```
Content-Type: application/json
```

**Path Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | Sim | ID único da reserva |

**Response (200 OK):**

```json
{
  "booking": {
    "id": "cm1ll0s9q0001bx4ac1bcuzkq",
    "bookingReference": "ABC123",
    "status": "CONFIRMED",
    "flightId": "cm1ll0s9q0000bx4ac1bcuzkp",
    "passenger": {
      "name": "João Silva Santos",
      "email": "joao.silva@email.com",
      "phone": "+5511999887766",
      "document": "123.456.789-00"
    },
    "flight": {
      "flightNumber": "LA3721",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departureTime": "2025-02-15T08:30:00.000Z",
      "arrivalTime": "2025-02-15T10:15:00.000Z"
    },
    "totalPrice": 485.9,
    "currency": "BRL",
    "createdAt": "2025-09-28T10:30:00.000Z",
    "updatedAt": "2025-09-28T10:30:00.000Z"
  }
}
```

**Response (404 Not Found):**

```json
{
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "Reserva não encontrada",
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Exemplo cURL:**

```bash
curl -X GET https://trip-planner-backend-three.vercel.app/api/bookings/cm1ll0s9q0001bx4ac1bcuzkq
```

---

### `PUT /api/bookings/:id/cancel`

Cancela uma reserva existente.

**Headers:**

```
Content-Type: application/json
```

**Path Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| `id` | string | Sim | ID único da reserva |

**Request Body:**

```json
{
  "reason": "Mudança de planos pessoais",
  "refundMethod": "original_payment"
}
```

**Schema de Validação:**

```typescript
{
  reason?: string (max: 500),
  refundMethod?: "original_payment" | "credit" | "voucher"
}
```

**Response (200 OK):**

```json
{
  "booking": {
    "id": "cm1ll0s9q0001bx4ac1bcuzkq",
    "bookingReference": "ABC123",
    "status": "CANCELLED",
    "flightId": "cm1ll0s9q0000bx4ac1bcuzkp",
    "passenger": {
      "name": "João Silva Santos",
      "email": "joao.silva@email.com"
    },
    "flight": {
      "flightNumber": "LA3721",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departureTime": "2025-02-15T08:30:00.000Z"
    },
    "totalPrice": 485.9,
    "currency": "BRL",
    "createdAt": "2025-09-28T10:30:00.000Z",
    "cancelledAt": "2025-09-28T11:00:00.000Z",
    "cancellationReason": "Mudança de planos pessoais",
    "refund": {
      "amount": 388.72,
      "currency": "BRL",
      "method": "original_payment",
      "processingTime": "3-5 dias úteis",
      "fees": 97.18
    }
  },
  "message": "Reserva cancelada com sucesso"
}
```

**Response (400 Bad Request):**

```json
{
  "error": {
    "code": "BOOKING_ALREADY_CANCELLED",
    "message": "Esta reserva já foi cancelada",
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Response (422 Unprocessable Entity):**

```json
{
  "error": {
    "code": "CANCELLATION_NOT_ALLOWED",
    "message": "Cancelamento não permitido - voo parte em menos de 2 horas",
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Exemplo cURL:**

```bash
curl -X PUT https://trip-planner-backend-three.vercel.app/api/bookings/cm1ll0s9q0001bx4ac1bcuzkq/cancel \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Mudança de planos pessoais",
    "refundMethod": "original_payment"
  }'
```

---

## 🚨 **Status de Resposta HTTP**

| Código  | Status                | Descrição                     |
| ------- | --------------------- | ----------------------------- |
| **200** | OK                    | Requisição bem-sucedida       |
| **201** | Created               | Recurso criado com sucesso    |
| **400** | Bad Request           | Dados inválidos na requisição |
| **404** | Not Found             | Recurso não encontrado        |
| **422** | Unprocessable Entity  | Regra de negócio violada      |
| **429** | Too Many Requests     | Rate limit excedido           |
| **500** | Internal Server Error | Erro interno do servidor      |

---

## 🔄 **Estados de Reserva**

| Status      | Descrição                       |
| ----------- | ------------------------------- |
| `CONFIRMED` | Reserva confirmada e ativa      |
| `CANCELLED` | Reserva cancelada pelo usuário  |
| `EXPIRED`   | Reserva expirou (não utilizada) |
| `COMPLETED` | Viagem concluída                |

---

## 🔄 **Estados de Voo**

| Status      | Descrição             |
| ----------- | --------------------- |
| `SCHEDULED` | Voo programado        |
| `DELAYED`   | Voo atrasado          |
| `CANCELLED` | Voo cancelado         |
| `BOARDING`  | Embarque em andamento |
| `DEPARTED`  | Voo partiu            |
| `ARRIVED`   | Voo chegou ao destino |

---

## 🌍 **Códigos de Aeroporto Suportados**

| Código  | Aeroporto                              | Cidade             |
| ------- | -------------------------------------- | ------------------ |
| **CNF** | Aeroporto Internacional Tancredo Neves | Belo Horizonte, MG |
| **GRU** | Aeroporto Internacional de São Paulo   | São Paulo, SP      |
| **GIG** | Aeroporto Internacional Tom Jobim      | Rio de Janeiro, RJ |
| **SFO** | San Francisco International Airport    | San Francisco, CA  |
| **MIA** | Miami International Airport            | Miami, FL          |
| **IAH** | George Bush Intercontinental Airport   | Houston, TX        |

---

## 📋 **Exemplos de Integração**

### **JavaScript/TypeScript Client**

```typescript
class TripPlannerAPI {
  private baseUrl = 'https://trip-planner-backend-three.vercel.app';

  async searchFlights(params: {
    origin?: string;
    destination?: string;
    departureDate?: string;
  }) {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseUrl}/api/flights?${query}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async bookFlight(flightId: string, bookingData: any) {
    const response = await fetch(
      `${this.baseUrl}/api/flights/${flightId}/book`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }

  async getBooking(bookingId: string) {
    const response = await fetch(`${this.baseUrl}/api/bookings/${bookingId}`);

    if (!response.ok) {
      throw new Error(`Booking not found: ${bookingId}`);
    }

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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error.message);
    }

    return response.json();
  }
}

// Uso
const api = new TripPlannerAPI();

// Buscar voos
const flights = await api.searchFlights({
  origin: 'CNF',
  destination: 'GRU',
  departureDate: '2025-12-15',
});

// Reservar voo
const booking = await api.bookFlight(flightId, {
  passenger: {
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '+5511999887766',
    document: '123.456.789-00',
  },
});
```

### **Python Client**

```python
import requests
from typing import Optional, Dict, Any

class TripPlannerAPI:
    def __init__(self):
        self.base_url = "https://trip-planner-backend-three.vercel.app"

    def search_flights(self, origin: Optional[str] = None,
                      destination: Optional[str] = None,
                      departure_date: Optional[str] = None) -> Dict[str, Any]:
        params = {}
        if origin:
            params['origin'] = origin
        if destination:
            params['destination'] = destination
        if departure_date:
            params['departureDate'] = departure_date

        response = requests.get(f"{self.base_url}/api/flights", params=params)
        response.raise_for_status()
        return response.json()

    def book_flight(self, flight_id: str, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        response = requests.post(
            f"{self.base_url}/api/flights/{flight_id}/book",
            json=booking_data,
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status()
        return response.json()

    def get_booking(self, booking_id: str) -> Dict[str, Any]:
        response = requests.get(f"{self.base_url}/api/bookings/{booking_id}")
        response.raise_for_status()
        return response.json()

    def cancel_booking(self, booking_id: str, reason: Optional[str] = None) -> Dict[str, Any]:
        data = {}
        if reason:
            data['reason'] = reason

        response = requests.put(
            f"{self.base_url}/api/bookings/{booking_id}/cancel",
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status()
        return response.json()

# Uso
api = TripPlannerAPI()

# Buscar voos
flights = api.search_flights(origin='CNF', destination='GRU')

# Reservar voo
booking = api.book_flight(flight_id, {
    'passenger': {
        'name': 'João Silva',
        'email': 'joao@email.com',
        'phone': '+5511999887766',
        'document': '123.456.789-00'
    }
})
```

---

## 🔐 **Rate Limiting**

- **Limite:** 100 requisições por minuto por IP
- **Headers de resposta:**
  - `X-RateLimit-Limit`: Limite máximo
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset

**Response (429 Too Many Requests):**

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Muitas requisições. Tente novamente em 60 segundos.",
    "retryAfter": 60,
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

---

## ⚡ **Performance & Caching**

- **Response Time:** < 500ms (média)
- **Uptime:** 99.9%
- **Cache:** Dados de voos cached por 5 minutos
- **Timeout:** 30 segundos

---

## 🛠️ **Ambiente de Teste**

Para testar localmente, siga as instruções do [README.md](../README.md).

**Base URL Local:**

```
http://localhost:3001
```

---

## 🏨 **Hotels (Hotéis)**

### `GET /api/hotels`
Lista todos os hotéis disponíveis com filtros opcionais.

**Headers:**
```
Content-Type: application/json
```

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição | Exemplo |
|-----------|------|-------------|-----------|------|
| `city` | string | Não | Nome da cidade | Belo Horizonte |
| `checkInDate` | string | Não | Data de check-in (YYYY-MM-DD) | 2025-10-01 |
| `checkOutDate` | string | Não | Data de check-out (YYYY-MM-DD) | 2025-10-10 |
| `guests` | number | Não | Número de hóspedes | 2 |
| `minRating` | number | Não | Rating mínimo (0-5) | 4.0 |
| `maxPrice` | number | Não | Preço máximo por noite | 500 |
| `stars` | number | Não | Classificação em estrelas (1-5) | 4 |
| `sortBy` | string | Não | Campo de ordenação | price, rating, stars, name |
| `sortOrder` | string | Não | Ordem de classificação | asc, desc |
| `page` | number | Não | Número da página (padrão: 1) | 1 |
| `limit` | number | Não | Itens por página (padrão: 10) | 10 |

**Request Body:** Nenhum

**Response (200 OK):**
```json
{
  "hotels": [
    {
      "id": "cm1ll0s9q0002bx4ac1bcuzkr",
      "hotelId": "bh-001",
      "name": "Tryp by Wyndham Belo Horizonte Savassi",
      "city": "Belo Horizonte",
      "rating": 4.6,
      "nightly": 280.0,
      "total": 560.0,
      "currency": "BRL",
      "policy": "Cancelamento gratuito até 24h antes - Café da manhã incluído",
      "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      "stars": 5,
      "amenities": [
        "Wi-Fi Gratuito",
        "Ar Condicionado",
        "TV a Cabo",
        "Café da Manhã",
        "Academia"
      ],
      "availability": {
        "isAvailable": true,
        "availableRooms": 45,
        "totalRooms": 100
      },
      "checkIn": "14:00",
      "checkOut": "12:00",
      "features": {
        "freeCancellation": true,
        "breakfastIncluded": true,
        "wifiIncluded": true,
        "parkingIncluded": true,
        "petFriendly": false
      }
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  }
}
```

**Exemplo cURL:**
```bash
# Listar todos os hotéis
curl -X GET https://trip-planner-backend-three.vercel.app/api/hotels

# Buscar hotéis em Belo Horizonte
curl -X GET "https://trip-planner-backend-three.vercel.app/api/hotels?city=Belo%20Horizonte"

# Buscar hotéis com filtros específicos
curl -X GET "https://trip-planner-backend-three.vercel.app/api/hotels?city=Belo%20Horizonte&minRating=4.0&maxPrice=400&sortBy=rating&sortOrder=desc"
```

---

### `GET /api/hotels/:id`
Recupera detalhes de um hotel específico.

**Headers:**
```
Content-Type: application/json
```

**Path Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------||
| `id` | string | Sim | ID único do hotel (UUID) |

**Response (200 OK):**
```json
{
  "hotel": {
    "id": "cm1ll0s9q0002bx4ac1bcuzkr",
    "hotelId": "bh-001",
    "name": "Tryp by Wyndham Belo Horizonte Savassi",
    "description": "Hotel moderno no coração de Savassi, próximo aos melhores restaurantes e bares da cidade.",
    "address": "Rua Antônio de Albuquerque, 335 - Savassi",
    "city": "Belo Horizonte",
    "state": "Minas Gerais",
    "country": "Brazil",
    "zipCode": "30112-010",
    "rating": 4.6,
    "nightly": 280.0,
    "total": 560.0,
    "currency": "BRL",
    "policy": "Cancelamento gratuito até 24h antes - Café da manhã incluído",
    "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    "stars": 5,
    "amenities": [
      "Wi-Fi Gratuito",
      "Ar Condicionado",
      "TV a Cabo",
      "Café da Manhã",
      "Academia"
    ],
    "availability": {
      "isAvailable": true,
      "availableRooms": 45,
      "totalRooms": 100
    },
    "checkIn": "14:00",
    "checkOut": "12:00",
    "features": {
      "freeCancellation": true,
      "breakfastIncluded": true,
      "wifiIncluded": true,
      "parkingIncluded": true,
      "petFriendly": false
    }
  }
}
```

**Response (404 Not Found):**
```json
{
  "error": {
    "code": "HOTEL_NOT_FOUND",
    "message": "Hotel não encontrado",
    "timestamp": "2025-09-28T10:30:00.000Z"
  }
}
```

**Exemplo cURL:**
```bash
curl -X GET https://trip-planner-backend-three.vercel.app/api/hotels/cm1ll0s9q0002bx4ac1bcuzkr
```

---

### `GET /api/hotels/city/:city`
Busca hotéis por cidade específica.

**Headers:**
```
Content-Type: application/json
```

**Path Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------||
| `city` | string | Sim | Nome da cidade |

**Query Parameters:**
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------||
| `page` | number | Não | Número da página (padrão: 1) |
| `limit` | number | Não | Itens por página (padrão: 10) |

**Response (200 OK):**
```json
{
  "hotels": [
    {
      "id": "cm1ll0s9q0002bx4ac1bcuzkr",
      "hotelId": "bh-001",
      "name": "Tryp by Wyndham Belo Horizonte Savassi",
      "city": "Belo Horizonte",
      "rating": 4.6,
      "nightly": 280.0,
      "currency": "BRL"
    }
  ],
  "pagination": {
    "total": 7,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrevious": false
  },
  "city": "Belo Horizonte"
}
```

**Exemplo cURL:**
```bash
curl -X GET "https://trip-planner-backend-three.vercel.app/api/hotels/city/Belo%20Horizonte"
```

---

<div align="center">
  <strong>🔗 API Reference Completa - Trip Planner Backend</strong>
  <br><br>
  <a href="https://trip-planner-backend-three.vercel.app/health">🟢 Test API Live</a> •
  <a href="../README.md">📖 README</a> •
  <a href="./ARCHITECTURE.md">🏗️ Architecture</a>
</div>
