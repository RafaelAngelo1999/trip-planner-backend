import { BookingEntity } from '../../../domain/entities/booking.entity';
import {
  BookingRepository,
  BookingSearchFilters,
} from '../../../domain/repositories/booking.repository';
import { prisma } from '../prisma/client';

export class PrismaBookingRepository implements BookingRepository {
  async findAll(filters?: BookingSearchFilters): Promise<BookingEntity[]> {
    const where: any = {};

    if (filters?.passengerId) {
      where.passengerId = filters.passengerId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.pnr) {
      where.pnr = filters.pnr;
    }

    if (filters?.resourceId) {
      where.resourceId = filters.resourceId;
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy:
        Object.keys(orderBy).length > 0 ? orderBy : { bookingDate: 'desc' },
      take: filters?.limit,
      skip: filters?.offset,
    });

    return bookings.map(this.toDomainEntity);
  }

  async findById(id: string): Promise<BookingEntity | null> {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    return booking ? this.toDomainEntity(booking) : null;
  }

  async findByPNR(pnr: string): Promise<BookingEntity | null> {
    const booking = await prisma.booking.findUnique({
      where: { pnr },
    });

    return booking ? this.toDomainEntity(booking) : null;
  }

  async findByPassengerId(passengerId: string): Promise<BookingEntity[]> {
    const bookings = await prisma.booking.findMany({
      where: { passengerId },
      orderBy: { bookingDate: 'desc' },
    });

    return bookings.map(this.toDomainEntity);
  }

  async create(booking: BookingEntity): Promise<BookingEntity> {
    const data = this.toPrismaData(booking);
    const created = await prisma.booking.create({ data });
    return this.toDomainEntity(created);
  }

  async update(
    id: string,
    booking: Partial<BookingEntity>
  ): Promise<BookingEntity> {
    const data = this.toPrismaData(booking as BookingEntity);
    const updated = await prisma.booking.update({
      where: { id },
      data,
    });
    return this.toDomainEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.booking.delete({
      where: { id },
    });
  }

  async count(filters?: BookingSearchFilters): Promise<number> {
    const where: any = {};

    if (filters?.passengerId) {
      where.passengerId = filters.passengerId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return prisma.booking.count({ where });
  }

  private toDomainEntity(booking: any): BookingEntity {
    return new BookingEntity({
      id: booking.id,
      pnr: booking.pnr,
      type: booking.type as any,
      status: booking.status as any,
      passengerId: booking.passengerId,
      resourceId: booking.resourceId,
      bookingDate: booking.bookingDate,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      flightDate: booking.flightDate || undefined,
      seatNumber: booking.seatNumber || undefined,
      checkInDate: booking.checkInDate || undefined,
      checkOutDate: booking.checkOutDate || undefined,
      nights: booking.nights || undefined,
      roomNumber: booking.roomNumber || undefined,
      specialRequests: booking.specialRequests || undefined,
      cancelReason: booking.cancelReason || undefined,
      cancelledAt: booking.cancelledAt || undefined,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    });
  }

  private toPrismaData(booking: BookingEntity): any {
    return {
      id: booking.id,
      pnr: booking.pnr,
      type: booking.type,
      status: booking.status,
      passengerId: booking.passengerId,
      resourceId: booking.resourceId,
      bookingDate: booking.bookingDate,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      flightDate: booking.flightDate,
      seatNumber: booking.seatNumber,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      nights: booking.nights,
      roomNumber: booking.roomNumber,
      specialRequests: booking.specialRequests,
      cancelReason: booking.cancelReason,
      cancelledAt: booking.cancelledAt,
    };
  }
}
