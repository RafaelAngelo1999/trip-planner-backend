import { FlightEntity } from '../entities/flight.entity';

export interface FlightSearchFilters {
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
  limit?: number;
  offset?: number;
}

export interface FlightRepository {
  findAll(filters?: FlightSearchFilters): Promise<FlightEntity[]>;
  findById(id: string): Promise<FlightEntity | null>;
  findByFlightNumber(flightNumber: string): Promise<FlightEntity | null>;
  create(flight: FlightEntity): Promise<FlightEntity>;
  update(id: string, flight: Partial<FlightEntity>): Promise<FlightEntity>;
  delete(id: string): Promise<void>;
  reserveSeat(id: string): Promise<FlightEntity>;
  releaseSeat(id: string): Promise<FlightEntity>;
  count(filters?: FlightSearchFilters): Promise<number>;
}
