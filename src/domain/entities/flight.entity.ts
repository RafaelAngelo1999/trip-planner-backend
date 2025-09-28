import { z } from 'zod';

export const FlightSchema = z.object({
  id: z.string().uuid(),
  flightNumber: z.string().min(1, 'Flight number is required'),
  airline: z.string().min(1, 'Airline is required'),
  origin: z.string().length(3, 'Origin must be a 3-letter airport code'),
  destination: z
    .string()
    .length(3, 'Destination must be a 3-letter airport code'),
  departureTime: z.string().datetime('Invalid departure time format'),
  arrivalTime: z.string().datetime('Invalid arrival time format'),
  price: z.number().positive('Price must be positive'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .default('BRL'),
  availableSeats: z.number().int().min(0, 'Available seats cannot be negative'),
  totalSeats: z.number().int().positive('Total seats must be positive'),
  aircraft: z.string().min(1, 'Aircraft type is required'),
  duration: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Duration must be in HH:MM format'),
  stops: z.number().int().min(0, 'Stops cannot be negative').default(0),
  stopCities: z.array(z.string()).optional(),
  baggageIncluded: z.boolean().default(true),
  mealIncluded: z.boolean().default(false),
  refundable: z.boolean().default(false),
  bookingClass: z
    .enum(['economy', 'premium_economy', 'business', 'first'])
    .default('economy'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Flight = z.infer<typeof FlightSchema>;

export class FlightEntity {
  constructor(private data: Flight) {
    this.validate();
  }

  private validate(): void {
    // Validar que arrival time é depois de departure time
    const departure = new Date(this.data.departureTime);
    const arrival = new Date(this.data.arrivalTime);

    if (arrival <= departure) {
      throw new Error('Arrival time must be after departure time');
    }

    // Validar que origem e destino são diferentes
    if (this.data.origin === this.data.destination) {
      throw new Error('Origin and destination cannot be the same');
    }

    // Validar disponibilidade de assentos
    if (this.data.availableSeats > this.data.totalSeats) {
      throw new Error('Available seats cannot exceed total seats');
    }
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get flightNumber(): string {
    return this.data.flightNumber;
  }
  get airline(): string {
    return this.data.airline;
  }
  get origin(): string {
    return this.data.origin;
  }
  get destination(): string {
    return this.data.destination;
  }
  get departureTime(): string {
    return this.data.departureTime;
  }
  get arrivalTime(): string {
    return this.data.arrivalTime;
  }
  get price(): number {
    return this.data.price;
  }
  get currency(): string {
    return this.data.currency;
  }
  get availableSeats(): number {
    return this.data.availableSeats;
  }
  get totalSeats(): number {
    return this.data.totalSeats;
  }
  get aircraft(): string {
    return this.data.aircraft;
  }
  get duration(): string {
    return this.data.duration;
  }
  get stops(): number {
    return this.data.stops;
  }
  get stopCities(): string[] | undefined {
    return this.data.stopCities;
  }
  get baggageIncluded(): boolean {
    return this.data.baggageIncluded;
  }
  get mealIncluded(): boolean {
    return this.data.mealIncluded;
  }
  get refundable(): boolean {
    return this.data.refundable;
  }
  get bookingClass(): string {
    return this.data.bookingClass;
  }

  // Business methods
  isAvailable(): boolean {
    return this.data.availableSeats > 0;
  }

  isDirect(): boolean {
    return this.data.stops === 0;
  }

  isInternational(): boolean {
    // Assumindo que códigos brasileiros começam com certas letras
    const brazilianAirports = [
      'CNF',
      'GRU',
      'GIG',
      'BSB',
      'SSA',
      'FOR',
      'REC',
      'POA',
      'CWB',
      'BEL',
    ];
    const originIsBrazil = brazilianAirports.includes(this.data.origin);
    const destinationIsBrazil = brazilianAirports.includes(
      this.data.destination
    );

    return !(originIsBrazil && destinationIsBrazil);
  }

  reserveSeat(): void {
    if (!this.isAvailable()) {
      throw new Error('No seats available for reservation');
    }
    this.data.availableSeats -= 1;
    this.data.updatedAt = new Date();
  }

  releaseSeat(): void {
    if (this.data.availableSeats >= this.data.totalSeats) {
      throw new Error('Cannot release more seats than total capacity');
    }
    this.data.availableSeats += 1;
    this.data.updatedAt = new Date();
  }

  toJSON(): Flight {
    return { ...this.data };
  }

  static create(
    data: Omit<Flight, 'id' | 'createdAt' | 'updatedAt'>
  ): FlightEntity {
    const flight = FlightSchema.parse({
      ...data,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new FlightEntity(flight);
  }
}

// Função para gerar UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
