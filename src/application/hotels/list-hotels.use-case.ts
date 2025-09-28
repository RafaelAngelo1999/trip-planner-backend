import { HotelEntity } from '../../domain/entities/hotel.entity';
import {
  HotelRepository,
  HotelSearchFilters,
} from '../../domain/repositories/hotel.repository';

export interface ListHotelsRequest {
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

export interface ListHotelsResponse {
  hotels: HotelEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListHotelsUseCase {
  constructor(private hotelRepository: HotelRepository) {}

  async execute(request: ListHotelsRequest): Promise<ListHotelsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;
    const offset = (page - 1) * limit;

    const filters: HotelSearchFilters = {
      ...request,
      limit,
      offset,
    };

    // Simular latência de API real
    await this.simulateLatency();

    // Simular falha ocasional (5% das vezes)
    if (Math.random() < 0.05) {
      throw new Error('Hotel service temporarily unavailable');
    }

    const [hotels, total] = await Promise.all([
      this.hotelRepository.findAll(filters),
      this.hotelRepository.count(filters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      hotels,
      total,
      page,
      limit,
      totalPages,
    };
  }

  private async simulateLatency(): Promise<void> {
    const latency = 300 + Math.random() * 1700; // 300ms a 2000ms
    return new Promise((resolve) => setTimeout(resolve, latency));
  }
}
