import { PrismaClient } from '@prisma/client';
import { HotelEntity } from '../../../domain/entities/hotel.entity';
import {
  HotelRepository,
  HotelSearchFilters,
} from '../../../domain/repositories/hotel.repository';

export class PrismaHotelRepository implements HotelRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filters?: HotelSearchFilters): Promise<HotelEntity[]> {
    const where: any = {};

    if (filters?.city) {
      where.city = {
        contains: filters.city,
      };
    }

    const hotels = await this.prisma.hotel.findMany({
      where,
      orderBy: {
        rating: 'desc',
      },
    });

    return hotels.map((hotel: any) => HotelEntity.fromPrisma(hotel));
  }

  async findById(id: string): Promise<HotelEntity | null> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
    });

    return hotel ? HotelEntity.fromPrisma(hotel) : null;
  }

  async findByHotelId(hotelId: string): Promise<HotelEntity | null> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { hotelId },
    });

    return hotel ? HotelEntity.fromPrisma(hotel) : null;
  }

  async findByCity(city: string): Promise<HotelEntity[]> {
    const hotels = await this.prisma.hotel.findMany({
      where: {
        city: {
          contains: city,
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return hotels.map((hotel: any) => HotelEntity.fromPrisma(hotel));
  }

  async create(hotel: HotelEntity): Promise<HotelEntity> {
    const createdHotel = await this.prisma.hotel.create({
      data: {
        id: hotel.id,
        hotelId: hotel.hotelId,
        name: hotel.name,
        nightly: hotel.nightly,
        total: hotel.total,
        rating: hotel.rating,
        policy: hotel.policy,
        currency: hotel.currency,
        city: hotel.city,
        createdAt: hotel.createdAt,
        updatedAt: hotel.updatedAt,
      },
    });

    return HotelEntity.fromPrisma(hotel);
  }

  async update(
    id: string,
    hotelData: Partial<HotelEntity>
  ): Promise<HotelEntity> {
    const hotel = await this.prisma.hotel.update({
      where: { id },
      data: hotelData,
    });

    return HotelEntity.fromPrisma(hotel);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.hotel.delete({
      where: { id },
    });
  }

  async findByName(name: string): Promise<HotelEntity | null> {
    const hotel = await this.prisma.hotel.findFirst({
      where: {
        name: {
          contains: name,
        },
      },
    });

    return hotel ? HotelEntity.fromPrisma(hotel) : null;
  }

  async reserveRoom(id: string): Promise<HotelEntity> {
    // Simplified implementation - just return the hotel as-is
    const hotel = await this.findById(id);
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    return hotel;
  }

  async releaseRoom(id: string): Promise<HotelEntity> {
    // Simplified implementation - just return the hotel as-is
    const hotel = await this.findById(id);
    if (!hotel) {
      throw new Error('Hotel not found');
    }
    return hotel;
  }

  async count(filters?: HotelSearchFilters): Promise<number> {
    const where: any = {};

    if (filters?.city) {
      where.city = {
        contains: filters.city,
      };
    }

    return this.prisma.hotel.count({ where });
  }
}
