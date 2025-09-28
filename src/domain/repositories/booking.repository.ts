import {
  BookingEntity,
  BookingStatus,
  BookingType,
} from '../entities/booking.entity';

export interface BookingSearchFilters {
  passengerId?: string;
  type?: BookingType;
  status?: BookingStatus;
  pnr?: string;
  resourceId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'bookingDate' | 'totalPrice' | 'pnr';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BookingRepository {
  findAll(filters?: BookingSearchFilters): Promise<BookingEntity[]>;
  findById(id: string): Promise<BookingEntity | null>;
  findByPNR(pnr: string): Promise<BookingEntity | null>;
  findByPassengerId(passengerId: string): Promise<BookingEntity[]>;
  create(booking: BookingEntity): Promise<BookingEntity>;
  update(id: string, booking: Partial<BookingEntity>): Promise<BookingEntity>;
  delete(id: string): Promise<void>;
  count(filters?: BookingSearchFilters): Promise<number>;
}
