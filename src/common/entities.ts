// Simulação básica das entidades para fazer o projeto funcionar
import { z } from 'zod';

// Flight Entity
export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  currency: string;
  availableSeats: number;
  totalSeats: number;
  aircraft: string;
  duration: string;
  stops: number;
  stopCities?: string[];
  baggageIncluded: boolean;
  mealIncluded: boolean;
  refundable: boolean;
  bookingClass: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FlightEntity {
  constructor(private data: Flight) {}

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

  isAvailable(): boolean {
    return this.data.availableSeats > 0;
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
    const flight: Flight = {
      ...data,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new FlightEntity(flight);
  }
}

// Hotel Entity
export interface Hotel {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  images: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  breakfastIncluded: boolean;
  wifiIncluded: boolean;
  parkingIncluded: boolean;
  petFriendly: boolean;
  stars: number;
  createdAt: Date;
  updatedAt: Date;
}

export class HotelEntity {
  constructor(private data: Hotel) {}

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

  isAvailable(): boolean {
    return this.data.availableRooms > 0;
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

  toJSON(): Hotel {
    return { ...this.data };
  }

  static create(
    data: Omit<Hotel, 'id' | 'createdAt' | 'updatedAt'>
  ): HotelEntity {
    const hotel: Hotel = {
      ...data,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new HotelEntity(hotel);
  }
}

// Passenger Entity
export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  passport?: string;
  nationality: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PassengerEntity {
  constructor(private data: Passenger) {}

  get id(): string {
    return this.data.id;
  }
  get firstName(): string {
    return this.data.firstName;
  }
  get lastName(): string {
    return this.data.lastName;
  }
  get email(): string {
    return this.data.email;
  }
  get phone(): string {
    return this.data.phone;
  }
  get dateOfBirth(): string {
    return this.data.dateOfBirth;
  }
  get passport(): string | undefined {
    return this.data.passport;
  }
  get nationality(): string {
    return this.data.nationality;
  }

  getFullName(): string {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  toJSON(): Passenger {
    return { ...this.data };
  }

  static create(
    data: Omit<Passenger, 'id' | 'createdAt' | 'updatedAt'>
  ): PassengerEntity {
    const passenger: Passenger = {
      ...data,
      id: generateUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new PassengerEntity(passenger);
  }
}

// Booking Types and Entity
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum BookingType {
  FLIGHT = 'FLIGHT',
  HOTEL = 'HOTEL',
}

export interface Booking {
  id: string;
  pnr: string;
  type: BookingType;
  status: BookingStatus;
  passengerId: string;
  resourceId: string;
  bookingDate: Date;
  totalPrice: number;
  currency: string;
  flightDate?: string;
  seatNumber?: string;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
  roomNumber?: string;
  specialRequests?: string;
  cancelReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class BookingEntity {
  constructor(private data: Booking) {}

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
  get passengerId(): string {
    return this.data.passengerId;
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

  isFlightBooking(): boolean {
    return this.data.type === BookingType.FLIGHT;
  }

  isHotelBooking(): boolean {
    return this.data.type === BookingType.HOTEL;
  }

  confirm(): void {
    if (this.data.status !== BookingStatus.PENDING) {
      throw new Error('Only pending bookings can be confirmed');
    }
    this.data.status = BookingStatus.CONFIRMED;
    this.data.updatedAt = new Date();
  }

  cancel(reason?: string): void {
    this.data.status = BookingStatus.CANCELLED;
    this.data.cancelReason = reason;
    this.data.cancelledAt = new Date();
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
    const booking: Booking = {
      ...data,
      id: generateUUID(),
      pnr: generatePNR(),
      bookingDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new BookingEntity(booking);
  }
}

// Utility functions
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
