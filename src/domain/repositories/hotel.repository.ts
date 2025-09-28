import { HotelEntity } from '../entities/hotel.entity';

export interface HotelSearchFilters {
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
  limit?: number;
  offset?: number;
}

export interface HotelRepository {
  findAll(filters?: HotelSearchFilters): Promise<HotelEntity[]>;
  findById(id: string): Promise<HotelEntity | null>;
  findByName(name: string): Promise<HotelEntity | null>;
  findByCity(city: string): Promise<HotelEntity[]>;
  create(hotel: HotelEntity): Promise<HotelEntity>;
  update(id: string, hotel: Partial<HotelEntity>): Promise<HotelEntity>;
  delete(id: string): Promise<void>;
  reserveRoom(id: string): Promise<HotelEntity>;
  releaseRoom(id: string): Promise<HotelEntity>;
  count(filters?: HotelSearchFilters): Promise<number>;
}
