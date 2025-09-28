# Exemplos de Requisições Postman - Trip Planner Backend

Base URL: `http://localhost:3001`

## 1. Health Check

**GET** `/health`

**Resposta:**
```json
{
  "success": true,
  "message": "Trip Planner Backend is running",
  "timestamp": "2025-09-28T15:30:00.000Z",
  "version": "1.0.0"
}
```

---

## 2. Listar Endpoints Disponíveis

**GET** `/api`

**Resposta:**
```json
{
  "success": true,
  "message": "Trip Planner Backend API",
  "version": "1.0.0",
  "endpoints": {
    "flights": "/api/flights",
    "hotels": "/api/hotels (coming soon)",
    "bookings": "/api/bookings (coming soon)",
    "health": "/health"
  }
}
```

---

## 3. Listar Todos os Voos

**GET** `/api/flights`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "flights": [
      {
        "id": "flight-uuid-123",
        "flight_number": "LA3001",
        "airline": "LATAM",
        "origin": "CNF",
        "destination": "GRU",
        "departure_time": "2024-12-15T06:00:00Z",
        "arrival_time": "2024-12-15T07:20:00Z",
        "price": 800,
        "currency": "BRL",
        "available_seats": 150,
        "total_seats": 180,
        "aircraft": "Airbus A320",
        "duration": "01:20",
        "stops": 0,
        "baggage_included": true,
        "meal_included": false,
        "refundable": false,
        "booking_class": "economy"
      }
    ],
    "pagination": {
      "total": 3,
      "page": 1,
      "limit": 10,
      "total_pages": 1
    }
  }
}
```

---

## 4. Buscar Voos com Filtros

**GET** `/api/flights?origin=CNF&destination=GRU&departure_date=2024-12-15&passengers=1`

**Parâmetros de Query:**
- `origin`: Código do aeroporto de origem (CNF, GRU, GIG, SFO)
- `destination`: Código do aeroporto de destino
- `departure_date`: Data de partida (YYYY-MM-DD)
- `passengers`: Número de passageiros (padrão: 1)
- `page`: Página para paginação (padrão: 1)
- `limit`: Limite por página (padrão: 10)

---

## 5. Buscar Voo por ID

**GET** `/api/flights/{flight_id}`

**Exemplo:** `/api/flights/550e8400-e29b-41d4-a716-446655440000`

**Resposta:**
```json
{
  "success": true,
  "data": {
    "flight": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "flight_number": "LA3001",
      "airline": "LATAM",
      "origin": "CNF",
      "destination": "GRU",
      "departure_time": "2024-12-15T06:00:00Z",
      "arrival_time": "2024-12-15T07:20:00Z",
      "price": 800,
      "currency": "BRL",
      "available_seats": 150,
      "total_seats": 180,
      "aircraft": "Airbus A320",
      "duration": "01:20",
      "stops": 0,
      "baggage_included": true,
      "meal_included": false,
      "refundable": false,
      "booking_class": "economy"
    }
  }
}
```

---

## 6. Reservar Voo (Criar Passagem)

**POST** `/api/flights/{flight_id}/book`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "passenger": {
    "first_name": "João",
    "last_name": "Silva",
    "email": "joao.silva@email.com",
    "phone": "+5511999887766",
    "date_of_birth": "1990-05-15",
    "passport": "BR123456789",
    "nationality": "Brazilian"
  },
  "flight_date": "2024-12-15",
  "special_requests": "Assento próximo à janela, refeição vegetariana"
}
```

**Resposta de Sucesso (201):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-uuid-456",
      "pnr": "ABC123",
      "status": "CONFIRMED",
      "type": "FLIGHT",
      "total_price": 800,
      "currency": "BRL",
      "booking_date": "2025-09-28T15:30:00.000Z",
      "passenger": {
        "id": "passenger-uuid-789",
        "first_name": "João",
        "last_name": "Silva",
        "email": "joao.silva@email.com"
      },
      "flight": {
        "id": "flight-uuid-123",
        "flight_number": "LA3001",
        "airline": "LATAM",
        "origin": "CNF",
        "destination": "GRU",
        "departure_time": "2024-12-15T06:00:00Z",
        "arrival_time": "2024-12-15T07:20:00Z"
      }
    },
    "pnr": "ABC123"
  }
}
```

**Possíveis Erros:**

**404 - Voo não encontrado:**
```json
{
  "success": false,
  "error": "Flight not found"
}
```

**409 - Sem assentos disponíveis:**
```json
{
  "success": false,
  "error": "No seats available for this flight"
}
```

**500 - Erro interno:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## 7. Cancelar Reserva

**PUT** `/api/bookings/{booking_id}/cancel`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "reason": "Mudança de planos - viagem cancelada"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-uuid-456",
      "pnr": "ABC123",
      "status": "CANCELLED",
      "cancel_reason": "Mudança de planos - viagem cancelada",
      "cancelled_at": "2025-09-28T16:45:00.000Z"
    }
  },
  "message": "Booking cancelled successfully"
}
```

**Possíveis Erros:**
- **404**: Reserva não encontrada
- **409**: Reserva já cancelada

---

## 8. Consultar Reserva

**GET** `/api/bookings/{booking_id}`

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-uuid-456",
      "pnr": "ABC123",
      "status": "CONFIRMED",
      "type": "FLIGHT",
      "total_price": 800,
      "currency": "BRL",
      "booking_date": "2025-09-28T15:30:00.000Z",
      "cancel_reason": null,
      "cancelled_at": null
    }
  }
}
```

---

## Exemplos Práticos no Postman

### Collection JSON para importar no Postman:

```json
{
  "info": {
    "name": "Trip Planner Backend",
    "description": "API para planejamento de viagens",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Listar Voos",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/flights",
          "host": ["{{base_url}}"],
          "path": ["api", "flights"]
        }
      }
    },
    {
      "name": "Buscar Voos CNF -> GRU",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/flights?origin=CNF&destination=GRU&departure_date=2024-12-15",
          "host": ["{{base_url}}"],
          "path": ["api", "flights"],
          "query": [
            {"key": "origin", "value": "CNF"},
            {"key": "destination", "value": "GRU"},
            {"key": "departure_date", "value": "2024-12-15"}
          ]
        }
      }
    },
    {
      "name": "Reservar Voo",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"passenger\": {\n    \"first_name\": \"João\",\n    \"last_name\": \"Silva\",\n    \"email\": \"joao.silva@email.com\",\n    \"phone\": \"+5511999887766\",\n    \"date_of_birth\": \"1990-05-15\",\n    \"passport\": \"BR123456789\",\n    \"nationality\": \"Brazilian\"\n  },\n  \"flight_date\": \"2024-12-15\",\n  \"special_requests\": \"Assento próximo à janela\"\n}"
        },
        "url": {
          "raw": "{{base_url}}/api/flights/{{flight_id}}/book",
          "host": ["{{base_url}}"],
          "path": ["api", "flights", "{{flight_id}}", "book"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3001"
    },
    {
      "key": "flight_id",
      "value": "SUBSTITUIR_PELO_ID_DO_VOO"
    }
  ]
}
```

---

## Fluxo Completo de Teste

1. **Verificar se o servidor está rodando:**
   - GET `/health`

2. **Listar voos disponíveis:**
   - GET `/api/flights`
   - Copie o `id` de um voo para usar na reserva

3. **Buscar voos específicos:**
   - GET `/api/flights?origin=CNF&destination=GRU`

4. **Reservar um voo:**
   - POST `/api/flights/{flight_id}/book`
   - Use o ID copiado no passo 2
   - Inclua os dados do passageiro no body

5. **Verificar detalhes de um voo:**
   - GET `/api/flights/{flight_id}`

## Dados de Teste Disponíveis

**Voos pré-cadastrados:**
- **LA3001**: CNF → GRU (06:00 - 07:20) - R$ 800
- **G31234**: CNF → GRU (09:30 - 10:50) - R$ 1.200  
- **LA8001**: CNF → SFO (22:30 - 14:45+1) - R$ 6.800

**Códigos de Aeroportos:**
- CNF: Belo Horizonte (Confins)
- GRU: São Paulo (Guarulhos)
- GIG: Rio de Janeiro (Galeão)
- SFO: San Francisco

Para iniciar os testes, certifique-se de que o servidor está rodando com:
```bash
npm run server
```