import { z } from 'zod';

export const HotelSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Hotel name is required'),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  totalRooms: z.number().int().positive('Total rooms must be positive'),
  availableRooms: z.number().int().min(0, 'Available rooms cannot be negative'),
  pricePerNight: z.number().positive('Price per night must be positive'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .default('BRL'),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  checkInTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Check-in time must be in HH:MM format')
    .default('14:00'),
  checkOutTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Check-out time must be in HH:MM format')
    .default('12:00'),
  cancellationPolicy: z
    .string()
    .default('Free cancellation up to 24 hours before check-in'),
  breakfastIncluded: z.boolean().default(false),
  wifiIncluded: z.boolean().default(true),
  parkingIncluded: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  stars: z.number().int().min(1).max(5).default(3),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Hotel = z.infer<typeof HotelSchema>;

export class HotelEntity {
  constructor(private data: Hotel) {
    this.validate();
  }

  private validate(): void {
    // Validar disponibilidade de quartos
    if (this.data.availableRooms > this.data.totalRooms) {
      throw new Error('Available rooms cannot exceed total rooms');
    }

    // Validar coordenadas se fornecidas
    if (
      (this.data.latitude && !this.data.longitude) ||
      (!this.data.latitude && this.data.longitude)
    ) {
      throw new Error('Both latitude and longitude must be provided together');
    }
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get name(): string {
    return this.data.name;
  }
  get description(): string | undefined {
    return this.data.description;
  }
  get address(): string {
    return this.data.address;
  }
  get city(): string {
    return this.data.city;
  }
  get state(): string {
    return this.data.state;
  }
  get country(): string {
    return this.data.country;
  }
  get zipCode(): string {
    return this.data.zipCode;
  }
  get latitude(): number | undefined {
    return this.data.latitude;
  }
  get longitude(): number | undefined {
    return this.data.longitude;
  }
  get rating(): number {
    return this.data.rating;
  }
  get totalRooms(): number {
    return this.data.totalRooms;
  }
  get availableRooms(): number {
    return this.data.availableRooms;
  }
  get pricePerNight(): number {
    return this.data.pricePerNight;
  }
  get currency(): string {
    return this.data.currency;
  }
  get amenities(): string[] {
    return this.data.amenities;
  }
  get images(): string[] {
    return this.data.images;
  }
  get checkInTime(): string {
    return this.data.checkInTime;
  }
  get checkOutTime(): string {
    return this.data.checkOutTime;
  }
  get cancellationPolicy(): string {
    return this.data.cancellationPolicy;
  }
  get breakfastIncluded(): boolean {
    return this.data.breakfastIncluded;
  }
  get wifiIncluded(): boolean {
    return this.data.wifiIncluded;
  }
  get parkingIncluded(): boolean {
    return this.data.parkingIncluded;
  }
  get petFriendly(): boolean {
    return this.data.petFriendly;
  }
  get stars(): number {
    return this.data.stars;
  }

  // Business methods
  isAvailable(): boolean {
    return this.data.availableRooms > 0;
  }

  hasAmenity(amenity: string): boolean {
    return this.data.amenities.includes(amenity);
  }

  getFullAddress(): string {
    return `${this.data.address}, ${this.data.city}, ${this.data.state}, ${this.data.country} ${this.data.zipCode}`;
  }

  isLuxury(): boolean {
    return this.data.stars >= 4 && this.data.rating >= 4.0;
  }

  reserveRoom(): void {
    if (!this.isAvailable()) {
      throw new Error('No rooms available for reservation');
    }
    this.data.availableRooms -= 1;
    this.data.updatedAt = new Date();
  }

  releaseRoom(): void {
    if (this.data.availableRooms >= this.data.totalRooms) {
      throw new Error('Cannot release more rooms than total capacity');
    }
    this.data.availableRooms += 1;
    this.data.updatedAt = new Date();
  }

  calculateTotalPrice(nights: number): number {
    if (nights <= 0) {
      throw new Error('Number of nights must be positive');
    }
    return this.data.pricePerNight * nights;
  }

  toJSON(): Hotel {
    return { ...this.data };
  }

  static create(
    data: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>
  ): HotelEntity {
    const hotel = HotelSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new HotelEntity(hotel);
  }
}
