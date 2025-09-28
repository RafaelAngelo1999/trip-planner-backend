import { z } from 'zod';

export const HotelSchema = z.object({
  id: z.string().uuid(),
  hotelId: z.string().min(1, 'Hotel ID is required'),
  name: z.string().min(1, 'Hotel name is required'),
  nightly: z.number().positive('Nightly price must be positive'),
  total: z.number().positive('Total price must be positive'),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  policy: z.string().min(1, 'Policy is required'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .default('BRL'),
  city: z.string().min(1, 'City is required'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type HotelData = z.infer<typeof HotelSchema>;

export class HotelEntity {
  private data: HotelData;

  constructor(data: Partial<HotelData>) {
    this.data = HotelSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }

  get hotelId(): string {
    return this.data.hotelId;
  }

  get name(): string {
    return this.data.name;
  }

  get nightly(): number {
    return this.data.nightly;
  }

  get total(): number {
    return this.data.total;
  }

  get rating(): number {
    return this.data.rating;
  }

  get policy(): string {
    return this.data.policy;
  }

  get currency(): string {
    return this.data.currency;
  }

  get city(): string {
    return this.data.city;
  }

  get createdAt(): Date {
    return this.data.createdAt;
  }

  get updatedAt(): Date {
    return this.data.updatedAt;
  }

  // Business methods
  isAvailable(): boolean {
    return true; // Simplified - always available for listing
  }

  // Return data for API responses
  toJSON(): {
    hotelId: string;
    name: string;
    nightly: number;
    total: number;
    rating: number;
    policy: string;
    currency: string;
  } {
    return {
      hotelId: this.data.hotelId,
      name: this.data.name,
      nightly: this.data.nightly,
      total: this.data.total,
      rating: this.data.rating,
      policy: this.data.policy,
      currency: this.data.currency,
    };
  }

  // Static factory methods
  static create(
    data: Omit<HotelData, 'id' | 'createdAt' | 'updatedAt'>
  ): HotelEntity {
    return new HotelEntity({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPrisma(prismaHotel: any): HotelEntity {
    return new HotelEntity({
      id: prismaHotel.id,
      hotelId: prismaHotel.hotelId,
      name: prismaHotel.name,
      nightly: prismaHotel.nightly,
      total: prismaHotel.total,
      rating: prismaHotel.rating,
      policy: prismaHotel.policy,
      currency: prismaHotel.currency,
      city: prismaHotel.city,
      createdAt: prismaHotel.createdAt,
      updatedAt: prismaHotel.updatedAt,
    });
  }
}
