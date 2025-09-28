import { z } from 'zod';

// DTO para busca de voos (compatível com LangGraph)
export const FlightSearchDTOSchema = z.object({
  origin: z
    .string()
    .length(3, 'Origin must be a 3-letter airport code')
    .optional(),
  destination: z
    .string()
    .length(3, 'Destination must be a 3-letter airport code')
    .optional(),
  departure_date: z.string().date('Invalid departure date format').optional(),
  return_date: z.string().date('Invalid return date format').optional(),
  passengers: z.number().int().min(1).max(9).default(1),
  class: z
    .enum(['economy', 'premium_economy', 'business', 'first'])
    .default('economy'),
  max_price: z.number().positive().optional(),
  airline: z.string().optional(),
  stops: z.number().int().min(0).optional(),
  sort_by: z
    .enum(['price', 'duration', 'departure', 'arrival'])
    .default('price'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export type FlightSearchDTO = z.infer<typeof FlightSearchDTOSchema>;

// DTO para resposta de voos (compatível com LangGraph)
export const FlightResponseDTOSchema = z.object({
  id: z.string().uuid(),
  flight_number: z.string(),
  airline: z.string(),
  origin: z.string(),
  destination: z.string(),
  departure_time: z.string(),
  arrival_time: z.string(),
  price: z.number(),
  currency: z.string(),
  available_seats: z.number(),
  total_seats: z.number(),
  aircraft: z.string(),
  duration: z.string(),
  stops: z.number(),
  stop_cities: z.array(z.string()).optional(),
  baggage_included: z.boolean(),
  meal_included: z.boolean(),
  refundable: z.boolean(),
  booking_class: z.string(),
});

export type FlightResponseDTO = z.infer<typeof FlightResponseDTOSchema>;

// DTO para booking de voos
export const FlightBookingDTOSchema = z.object({
  flight_id: z.string().uuid('Invalid flight ID'),
  passenger: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must have at least 10 digits'),
    date_of_birth: z.string().date('Invalid date format'),
    passport: z.string().optional(),
    nationality: z.string().min(1, 'Nationality is required'),
  }),
  flight_date: z.string().date('Invalid flight date format'),
  special_requests: z.string().optional(),
});

export type FlightBookingDTO = z.infer<typeof FlightBookingDTOSchema>;

// DTO para resposta de booking
export const BookingResponseDTOSchema = z.object({
  id: z.string().uuid(),
  pnr: z.string(),
  status: z.string(),
  type: z.string(),
  total_price: z.number(),
  currency: z.string(),
  booking_date: z.string(),
  passenger: z.object({
    id: z.string().uuid(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
  }),
  flight: z
    .object({
      id: z.string().uuid(),
      flight_number: z.string(),
      airline: z.string(),
      origin: z.string(),
      destination: z.string(),
      departure_time: z.string(),
      arrival_time: z.string(),
    })
    .optional(),
  hotel: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      city: z.string(),
      check_in_date: z.string(),
      check_out_date: z.string(),
    })
    .optional(),
});

export type BookingResponseDTO = z.infer<typeof BookingResponseDTOSchema>;
