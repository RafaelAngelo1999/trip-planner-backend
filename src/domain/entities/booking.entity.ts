import { z } from 'zod';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export enum BookingType {
  FLIGHT = 'flight',
  HOTEL = 'hotel',
}

export const BookingSchema = z.object({
  id: z.string().uuid(),
  pnr: z.string().length(6, 'PNR must be exactly 6 characters'),
  type: z.nativeEnum(BookingType),
  status: z.nativeEnum(BookingStatus).default(BookingStatus.PENDING),
  resourceId: z.string().uuid('Invalid resource ID'), // flight_id ou hotel_id
  bookingDate: z.date().default(() => new Date()),
  totalPrice: z.number().positive('Total price must be positive'),
  currency: z
    .string()
    .length(3, 'Currency must be a 3-letter code')
    .default('BRL'),

  // Passenger fields (embedded)
  passengerName: z.string().min(1, 'Passenger name is required'),
  passengerEmail: z.string().email('Invalid passenger email'),

  // Campos específicos para voos
  flightDate: z.string().date().optional(),
  seatNumber: z.string().optional(),

  // Campos específicos para hotéis
  checkInDate: z.string().date().optional(),
  checkOutDate: z.string().date().optional(),
  nights: z.number().int().positive().optional(),
  roomNumber: z.string().optional(),

  // Campos opcionais
  specialRequests: z.string().optional(),
  cancelReason: z.string().optional(),
  cancelledAt: z.date().optional(),

  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Booking = z.infer<typeof BookingSchema>;

export class BookingEntity {
  constructor(private data: Booking) {
    this.validate();
  }

  private validate(): void {
    // Validar campos obrigatórios por tipo
    if (this.data.type === BookingType.FLIGHT) {
      if (!this.data.flightDate) {
        throw new Error('Flight date is required for flight bookings');
      }
    }

    if (this.data.type === BookingType.HOTEL) {
      if (
        !this.data.checkInDate ||
        !this.data.checkOutDate ||
        !this.data.nights
      ) {
        throw new Error(
          'Check-in date, check-out date, and nights are required for hotel bookings'
        );
      }

      // Validar que check-out é depois de check-in
      const checkIn = new Date(this.data.checkInDate);
      const checkOut = new Date(this.data.checkOutDate);

      if (checkOut <= checkIn) {
        throw new Error('Check-out date must be after check-in date');
      }
    }

    // Validar que booking não é muito no passado (permite mesmo dia)
    const bookingDate = this.data.flightDate || this.data.checkInDate;
    if (bookingDate) {
      const date = new Date(bookingDate);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      if (date < yesterday) {
        throw new Error('Booking date cannot be in the past');
      }
    }
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get pnr(): string {
    return this.data.pnr;
  }
  get type(): BookingType {
    return this.data.type;
  }
  get status(): BookingStatus {
    return this.data.status;
  }
  get passengerName(): string {
    return this.data.passengerName;
  }
  get passengerEmail(): string {
    return this.data.passengerEmail;
  }
  get resourceId(): string {
    return this.data.resourceId;
  }
  get bookingDate(): Date {
    return this.data.bookingDate;
  }
  get totalPrice(): number {
    return this.data.totalPrice;
  }
  get currency(): string {
    return this.data.currency;
  }
  get flightDate(): string | undefined {
    return this.data.flightDate;
  }
  get seatNumber(): string | undefined {
    return this.data.seatNumber;
  }
  get checkInDate(): string | undefined {
    return this.data.checkInDate;
  }
  get checkOutDate(): string | undefined {
    return this.data.checkOutDate;
  }
  get nights(): number | undefined {
    return this.data.nights;
  }
  get roomNumber(): string | undefined {
    return this.data.roomNumber;
  }
  get specialRequests(): string | undefined {
    return this.data.specialRequests;
  }
  get cancelReason(): string | undefined {
    return this.data.cancelReason;
  }
  get cancelledAt(): Date | undefined {
    return this.data.cancelledAt;
  }

  // Business methods
  isFlightBooking(): boolean {
    return this.data.type === BookingType.FLIGHT;
  }

  isHotelBooking(): boolean {
    return this.data.type === BookingType.HOTEL;
  }

  isPending(): boolean {
    return this.data.status === BookingStatus.PENDING;
  }

  isConfirmed(): boolean {
    return this.data.status === BookingStatus.CONFIRMED;
  }

  isCancelled(): boolean {
    return this.data.status === BookingStatus.CANCELLED;
  }

  isCompleted(): boolean {
    return this.data.status === BookingStatus.COMPLETED;
  }

  canBeCancelled(): boolean {
    return (
      this.data.status === BookingStatus.PENDING ||
      this.data.status === BookingStatus.CONFIRMED
    );
  }

  confirm(): void {
    if (this.data.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }
    this.data.status = BookingStatus.CONFIRMED;
    this.data.updatedAt = new Date();
  }

  cancel(reason?: string): void {
    if (!this.canBeCancelled()) {
      throw new Error('Booking cannot be cancelled');
    }
    this.data.status = BookingStatus.CANCELLED;
    this.data.cancelReason = reason;
    this.data.cancelledAt = new Date();
    this.data.updatedAt = new Date();
  }

  complete(): void {
    if (this.data.status !== BookingStatus.CONFIRMED) {
      throw new Error('Only confirmed bookings can be completed');
    }
    this.data.status = BookingStatus.COMPLETED;
    this.data.updatedAt = new Date();
  }

  assignSeat(seatNumber: string): void {
    if (!this.isFlightBooking()) {
      throw new Error('Seat can only be assigned to flight bookings');
    }
    this.data.seatNumber = seatNumber;
    this.data.updatedAt = new Date();
  }

  assignRoom(roomNumber: string): void {
    if (!this.isHotelBooking()) {
      throw new Error('Room can only be assigned to hotel bookings');
    }
    this.data.roomNumber = roomNumber;
    this.data.updatedAt = new Date();
  }

  toJSON(): Booking {
    return { ...this.data };
  }

  static create(
    data: Omit<
      Booking,
      'id' | 'pnr' | 'bookingDate' | 'createdAt' | 'updatedAt'
    >
  ): BookingEntity {
    const booking = BookingSchema.parse({
      ...data,
      id: crypto.randomUUID(),
      pnr: generatePNR(),
      bookingDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return new BookingEntity(booking);
  }
}

// Função para gerar PNR único
function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
