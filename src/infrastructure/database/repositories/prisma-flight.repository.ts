import { FlightEntity } from '../../../domain/entities/flight.entity';
import {
  FlightRepository,
  FlightSearchFilters,
} from '../../../domain/repositories/flight.repository';
import { prisma } from '../prisma/client';

export class PrismaFlightRepository implements FlightRepository {
  async findAll(filters?: FlightSearchFilters): Promise<FlightEntity[]> {
    const where: any = {};

    if (filters?.origin) {
      where.origin = filters.origin;
    }

    if (filters?.destination) {
      where.destination = filters.destination;
    }

    if (filters?.departureDate) {
      // Buscar voos que partem na data especificada
      const startOfDay = new Date(filters.departureDate);
      const endOfDay = new Date(filters.departureDate);
      endOfDay.setDate(endOfDay.getDate() + 1);

      where.departureTime = {
        gte: startOfDay.toISOString(),
        lt: endOfDay.toISOString(),
      };
    }

    if (filters?.maxPrice) {
      where.price = { lte: filters.maxPrice };
    }

    if (filters?.airline) {
      where.airline = filters.airline;
    }

    if (filters?.stops !== undefined) {
      where.stops = filters.stops;
    }

    if (filters?.bookingClass) {
      where.bookingClass = filters.bookingClass;
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc';
    }

    const flights = await prisma.flight.findMany({
      where,
      orderBy:
        Object.keys(orderBy).length > 0 ? orderBy : { departureTime: 'asc' },
      take: filters?.limit,
      skip: filters?.offset,
    });

    return flights.map(this.toDomainEntity);
  }

  async findById(id: string): Promise<FlightEntity | null> {
    const flight = await prisma.flight.findUnique({
      where: { id },
    });

    return flight ? this.toDomainEntity(flight) : null;
  }

  async findByFlightNumber(flightNumber: string): Promise<FlightEntity | null> {
    const flight = await prisma.flight.findUnique({
      where: { flightNumber },
    });

    return flight ? this.toDomainEntity(flight) : null;
  }

  async create(flight: FlightEntity): Promise<FlightEntity> {
    const data = this.toPrismaData(flight);
    const created = await prisma.flight.create({ data });
    return this.toDomainEntity(created);
  }

  async update(
    id: string,
    flight: Partial<FlightEntity>
  ): Promise<FlightEntity> {
    const data = this.toPrismaData(flight as FlightEntity);
    const updated = await prisma.flight.update({
      where: { id },
      data,
    });
    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.flight.delete({
      where: { id },
    });
  }

  async reserveSeat(id: string): Promise<FlightEntity> {
    const flight = await this.findById(id);
    if (!flight) {
      throw new Error('Flight not found');
    }

    flight.reserveSeat();
    return this.update(id, flight);
  }

  async releaseSeat(id: string): Promise<FlightEntity> {
    const flight = await this.findById(id);
    if (!flight) {
      throw new Error('Flight not found');
    }

    flight.releaseSeat();
    return this.update(id, flight);
  }

  async count(filters?: FlightSearchFilters): Promise<number> {
    const where: any = {};

    if (filters?.origin) {
      where.origin = filters.origin;
    }

    if (filters?.destination) {
      where.destination = filters.destination;
    }

    if (filters?.departureDate) {
      const startOfDay = new Date(filters.departureDate);
      const endOfDay = new Date(filters.departureDate);
      endOfDay.setDate(endOfDay.getDate() + 1);

      where.departureTime = {
        gte: startOfDay.toISOString(),
        lt: endOfDay.toISOString(),
      };
    }

    return prisma.flight.count({ where });
  }

  private toDomainEntity(flight: any): FlightEntity {
    return new FlightEntity({
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      currency: flight.currency,
      availableSeats: flight.availableSeats,
      totalSeats: flight.totalSeats,
      aircraft: flight.aircraft,
      duration: flight.duration,
      stops: flight.stops,
      stopCities: flight.stopCities ? JSON.parse(flight.stopCities) : undefined,
      baggageIncluded: flight.baggageIncluded,
      mealIncluded: flight.mealIncluded,
      refundable: flight.refundable,
      bookingClass: flight.bookingClass as
        | 'economy'
        | 'premium_economy'
        | 'business'
        | 'first',
      createdAt: flight.createdAt,
      updatedAt: flight.updatedAt,
    });
  }

  private toPrismaData(flight: FlightEntity): any {
    return {
      id: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      price: flight.price,
      currency: flight.currency,
      availableSeats: flight.availableSeats,
      totalSeats: flight.totalSeats,
      aircraft: flight.aircraft,
      duration: flight.duration,
      stops: flight.stops,
      stopCities: flight.stopCities ? JSON.stringify(flight.stopCities) : null,
      baggageIncluded: flight.baggageIncluded,
      mealIncluded: flight.mealIncluded,
      refundable: flight.refundable,
      bookingClass: flight.bookingClass,
    };
  }
}
