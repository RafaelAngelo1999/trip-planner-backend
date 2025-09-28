import { FlightEntity } from '../../domain/entities/flight.entity';
import {
  FlightRepository,
  FlightSearchFilters,
} from '../../domain/repositories/flight.repository';

export interface ListFlightsRequest {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  passengers?: number;
  bookingClass?: string;
  maxPrice?: number;
  airline?: string;
  stops?: number;
  sortBy?: 'price' | 'duration' | 'departure' | 'arrival';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ListFlightsResponse {
  flights: FlightEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListFlightsUseCase {
  constructor(private flightRepository: FlightRepository) {}

  async execute(request: ListFlightsRequest): Promise<ListFlightsResponse> {
    const page = request.page || 1;
    const limit = request.limit || 10;
    const offset = (page - 1) * limit;

    const filters: FlightSearchFilters = {
      ...request,
      limit,
      offset,
    };

    // Simular latência de API real
    await this.simulateLatency();

    // Simular falha ocasional (5% das vezes)
    if (Math.random() < 0.05) {
      throw new Error('Flight service temporarily unavailable');
    }

    const [flights, total] = await Promise.all([
      this.flightRepository.findAll(filters),
      this.flightRepository.count(filters),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      flights,
      total,
      page,
      limit,
      totalPages,
    };
  }

  private async simulateLatency(): Promise<void> {
    const latency = 200 + Math.random() * 1800; // 200ms a 2000ms
    return new Promise((resolve) => setTimeout(resolve, latency));
  }
}
