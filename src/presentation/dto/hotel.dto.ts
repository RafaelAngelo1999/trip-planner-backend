import { z } from 'zod';

// DTO para busca de hotéis (compatível com LangGraph)
export const HotelSearchDTOSchema = z.object({
  city: z.string().min(1, 'City is required').optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  check_in_date: z.string().date('Invalid check-in date format').optional(),
  check_out_date: z.string().date('Invalid check-out date format').optional(),
  guests: z.number().int().min(1).max(10).default(1),
  min_rating: z.number().min(0).max(5).optional(),
  max_price: z.number().positive().optional(),
  amenities: z.array(z.string()).optional(),
  stars: z.number().int().min(1).max(5).optional(),
  sort_by: z.enum(['price', 'rating', 'stars', 'name']).default('price'),
  sort_order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
});

export type HotelSearchDTO = z.infer<typeof HotelSearchDTOSchema>;

// DTO para resposta de hotéis (compatível com LangGraph)
export const HotelResponseDTOSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip_code: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  rating: z.number(),
  total_rooms: z.number(),
  available_rooms: z.number(),
  price_per_night: z.number(),
  currency: z.string(),
  amenities: z.array(z.string()),
  images: z.array(z.string()),
  check_in_time: z.string(),
  check_out_time: z.string(),
  cancellation_policy: z.string(),
  breakfast_included: z.boolean(),
  wifi_included: z.boolean(),
  parking_included: z.boolean(),
  pet_friendly: z.boolean(),
  stars: z.number(),
});

export type HotelResponseDTO = z.infer<typeof HotelResponseDTOSchema>;

// DTO para booking de hotéis
export const HotelBookingDTOSchema = z.object({
  hotel_id: z.string().uuid('Invalid hotel ID'),
  passenger: z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email format'),
    phone: z.string().min(10, 'Phone number must have at least 10 digits'),
    date_of_birth: z.string().date('Invalid date format'),
    passport: z.string().optional(),
    nationality: z.string().min(1, 'Nationality is required'),
  }),
  check_in_date: z.string().date('Invalid check-in date format'),
  check_out_date: z.string().date('Invalid check-out date format'),
  nights: z.number().int().min(1, 'Number of nights must be at least 1'),
  special_requests: z.string().optional(),
});

export type HotelBookingDTO = z.infer<typeof HotelBookingDTOSchema>;
