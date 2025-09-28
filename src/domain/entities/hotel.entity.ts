import { z } from 'zod';

export const HotelSchema = z.object({
  id: z.string().uuid(),
  hotelId: z.string().min(1, 'Hotel ID is required'),
  name: z.string().min(1, 'Hotel name is required'),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  country: z.string().default('Brazil'),
  zipCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  nightly: z.number().positive('Nightly price must be positive'),
  total: z.number().positive().optional(),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .default('BRL'),
  policy: z.string().min(1, 'Policy is required'),
  image: z.string().url().optional(),
  totalRooms: z.number().int().positive().default(100),
  availableRooms: z.number().int().min(0).default(50),
  amenities: z.array(z.string()).optional(),
  checkInTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Check-in time must be in HH:MM format')
    .default('14:00'),
  checkOutTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Check-out time must be in HH:MM format')
    .default('12:00'),
  breakfastIncluded: z.boolean().default(false),
  wifiIncluded: z.boolean().default(true),
  parkingIncluded: z.boolean().default(false),
  petFriendly: z.boolean().default(false),
  stars: z.number().int().min(1).max(5).optional(),
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
  get hotelId(): string {
    return this.data.hotelId;
  }
  get name(): string {
    return this.data.name;
  }
  get description(): string | undefined {
    return this.data.description;
  }
  get address(): string | undefined {
    return this.data.address;
  }
  get city(): string {
    return this.data.city;
  }
  get state(): string | undefined {
    return this.data.state;
  }
  get country(): string {
    return this.data.country;
  }
  get zipCode(): string | undefined {
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
  get nightly(): number {
    return this.data.nightly;
  }
  get total(): number | undefined {
    return this.data.total;
  }
  get currency(): string {
    return this.data.currency;
  }
  get policy(): string {
    return this.data.policy;
  }
  get image(): string | undefined {
    return this.data.image;
  }
  get totalRooms(): number {
    return this.data.totalRooms;
  }
  get availableRooms(): number {
    return this.data.availableRooms;
  }
  get amenities(): string[] | undefined {
    return this.data.amenities;
  }
  get checkInTime(): string {
    return this.data.checkInTime;
  }
  get checkOutTime(): string {
    return this.data.checkOutTime;
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
  get stars(): number | undefined {
    return this.data.stars;
  }

  // Business methods
  isAvailable(): boolean {
    return this.data.availableRooms > 0;
  }

  hasAmenity(amenity: string): boolean {
    return this.data.amenities?.includes(amenity) || false;
  }

  getFullAddress(): string {
    const parts = [this.data.address, this.data.city, this.data.state, this.data.country, this.data.zipCode].filter(Boolean);
    return parts.join(', ');
  }

  isLuxury(): boolean {
    return (this.data.stars || 0) >= 4 && this.data.rating >= 4.0;
  }

  getStarsFromRating(): number {
    if (this.data.rating >= 4.8) return 5;
    if (this.data.rating >= 4.2) return 4;
    if (this.data.rating >= 3.5) return 3;
    if (this.data.rating >= 2.8) return 2;
    return 1;
  }

  hasFreeCancellation(): boolean {
    return this.data.policy.toLowerCase().includes('cancelamento gratuito') || 
           this.data.policy.toLowerCase().includes('free cancellation');
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
    return this.data.nightly * nights;
  }

  getAllAmenities(): string[] {
    const amenities: string[] = [];
    
    if (this.data.wifiIncluded) amenities.push('Wi-Fi Gratuito');
    if (this.data.breakfastIncluded) amenities.push('Café da Manhã');
    if (this.data.parkingIncluded) amenities.push('Estacionamento');
    if (this.data.petFriendly) amenities.push('Pet Friendly');
    
    if (this.data.amenities) {
      amenities.push(...this.data.amenities);
    }
    
    return amenities;
  }

  toApiResponse(): any {
    return {
      id: this.data.id,
      hotelId: this.data.hotelId,
      name: this.data.name,
      city: this.data.city,
      rating: this.data.rating,
      nightly: this.data.nightly,
      total: this.data.total,
      currency: this.data.currency,
      policy: this.data.policy,
      image: this.data.image,
      stars: this.data.stars || this.getStarsFromRating(),
      amenities: this.getAllAmenities(),
      availability: {
        isAvailable: this.isAvailable(),
        availableRooms: this.data.availableRooms,
        totalRooms: this.data.totalRooms
      },
      checkIn: this.data.checkInTime,
      checkOut: this.data.checkOutTime,
      features: {
        freeCancellation: this.hasFreeCancellation(),
        breakfastIncluded: this.data.breakfastIncluded,
        wifiIncluded: this.data.wifiIncluded,
        parkingIncluded: this.data.parkingIncluded,
        petFriendly: this.data.petFriendly
      }
    };
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
