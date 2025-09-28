import { HotelEntity } from '../../../domain/entities/hotel.entity';
import { HotelRepository, HotelSearchFilters } from '../../../domain/repositories/hotel.repository';

export interface GetHotelsParams {
  city?: string;
  state?: string;
  country?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  minRating?: number;
  maxPrice?: number;
  amenities?: string[];
  stars?: number;
  sortBy?: 'price' | 'rating' | 'stars' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GetHotelsResult {
  hotels: HotelEntity[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export class GetHotelsUseCase {
  constructor(private readonly hotelRepository: HotelRepository) {}

  async execute(params: GetHotelsParams = {}): Promise<GetHotelsResult> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    const filters: HotelSearchFilters = {
      ...params,
      limit,
      offset
    };

    // Buscar hotéis
    const hotels = await this.hotelRepository.findAll(filters);
    
    // Contar total de hotéis
    const total = await this.hotelRepository.count(filters);
    
    const totalPages = Math.ceil(total / limit);

    return {
      hotels,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1
      }
    };
  }
}