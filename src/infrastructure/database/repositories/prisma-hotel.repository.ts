import { PrismaClient } from '@prisma/client';
import { HotelEntity } from '../../../domain/entities/hotel.entity';
import { HotelRepository, HotelSearchFilters } from '../../../domain/repositories/hotel.repository';

export class PrismaHotelRepository implements HotelRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(filters?: HotelSearchFilters): Promise<HotelEntity[]> {
    const where: any = {};

    if (filters?.city) {
      where.city = {
        contains: filters.city,
        mode: 'insensitive'
      };
    }

    if (filters?.state) {
      where.state = {
        contains: filters.state,
        mode: 'insensitive'
      };
    }

    if (filters?.country) {
      where.country = {
        contains: filters.country,
        mode: 'insensitive'
      };
    }

    if (filters?.minRating) {
      where.rating = {
        gte: filters.minRating
      };
    }

    if (filters?.maxPrice) {
      where.nightly = {
        lte: filters.maxPrice
      };
    }

    if (filters?.stars) {
      where.stars = filters.stars;
    }

    const orderBy: any = {};
    if (filters?.sortBy) {
      const sortField = filters.sortBy === 'price' ? 'nightly' : filters.sortBy;
      orderBy[sortField] = filters.sortOrder || 'asc';
    } else {
      orderBy.rating = 'desc'; // Default sort by rating
    }

    const hotels = await this.prisma.hotel.findMany({
      where,
      orderBy,
      take: filters?.limit,
      skip: filters?.offset
    });

    return hotels.map(hotel => this.mapToEntity(hotel));
  }

  async findById(id: string): Promise<HotelEntity | null> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id }
    });

    return hotel ? this.mapToEntity(hotel) : null;
  }

  async findByName(name: string): Promise<HotelEntity | null> {
    const hotel = await this.prisma.hotel.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });

    return hotel ? this.mapToEntity(hotel) : null;
  }

  async findByCity(city: string): Promise<HotelEntity[]> {
    const hotels = await this.prisma.hotel.findMany({
      where: {
        city: {
          contains: city,
          mode: 'insensitive'
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    return hotels.map(hotel => this.mapToEntity(hotel));
  }

  async create(hotel: HotelEntity): Promise<HotelEntity> {
    const data = {
      id: hotel.id,
      hotelId: hotel.hotelId,
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      city: hotel.city,
      state: hotel.state,
      country: hotel.country,
      zipCode: hotel.zipCode,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
      rating: hotel.rating,
      nightly: hotel.nightly,
      total: hotel.total,
      currency: hotel.currency,
      policy: hotel.policy,
      image: hotel.image,
      totalRooms: hotel.totalRooms,
      availableRooms: hotel.availableRooms,
      amenities: hotel.amenities ? JSON.stringify(hotel.amenities) : null,
      checkInTime: hotel.checkInTime,
      checkOutTime: hotel.checkOutTime,
      breakfastIncluded: hotel.breakfastIncluded,
      wifiIncluded: hotel.wifiIncluded,
      parkingIncluded: hotel.parkingIncluded,
      petFriendly: hotel.petFriendly,
      stars: hotel.stars
    };

    const createdHotel = await this.prisma.hotel.create({
      data
    });

    return this.mapToEntity(createdHotel);
  }

  async update(id: string, hotelData: Partial<HotelEntity>): Promise<HotelEntity> {
    const data: any = {};

    if (hotelData.name !== undefined) data.name = hotelData.name;
    if (hotelData.description !== undefined) data.description = hotelData.description;
    if (hotelData.address !== undefined) data.address = hotelData.address;
    if (hotelData.city !== undefined) data.city = hotelData.city;
    if (hotelData.state !== undefined) data.state = hotelData.state;
    if (hotelData.country !== undefined) data.country = hotelData.country;
    if (hotelData.zipCode !== undefined) data.zipCode = hotelData.zipCode;
    if (hotelData.latitude !== undefined) data.latitude = hotelData.latitude;
    if (hotelData.longitude !== undefined) data.longitude = hotelData.longitude;
    if (hotelData.rating !== undefined) data.rating = hotelData.rating;
    if (hotelData.nightly !== undefined) data.nightly = hotelData.nightly;
    if (hotelData.total !== undefined) data.total = hotelData.total;
    if (hotelData.currency !== undefined) data.currency = hotelData.currency;
    if (hotelData.policy !== undefined) data.policy = hotelData.policy;
    if (hotelData.image !== undefined) data.image = hotelData.image;
    if (hotelData.totalRooms !== undefined) data.totalRooms = hotelData.totalRooms;
    if (hotelData.availableRooms !== undefined) data.availableRooms = hotelData.availableRooms;
    if (hotelData.amenities !== undefined) data.amenities = JSON.stringify(hotelData.amenities);
    if (hotelData.checkInTime !== undefined) data.checkInTime = hotelData.checkInTime;
    if (hotelData.checkOutTime !== undefined) data.checkOutTime = hotelData.checkOutTime;
    if (hotelData.breakfastIncluded !== undefined) data.breakfastIncluded = hotelData.breakfastIncluded;
    if (hotelData.wifiIncluded !== undefined) data.wifiIncluded = hotelData.wifiIncluded;
    if (hotelData.parkingIncluded !== undefined) data.parkingIncluded = hotelData.parkingIncluded;
    if (hotelData.petFriendly !== undefined) data.petFriendly = hotelData.petFriendly;
    if (hotelData.stars !== undefined) data.stars = hotelData.stars;

    data.updatedAt = new Date();

    const updatedHotel = await this.prisma.hotel.update({
      where: { id },
      data
    });

    return this.mapToEntity(updatedHotel);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.hotel.delete({
      where: { id }
    });
  }

  async reserveRoom(id: string): Promise<HotelEntity> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id }
    });

    if (!hotel) {
      throw new Error('Hotel not found');
    }

    if (hotel.availableRooms <= 0) {
      throw new Error('No rooms available');
    }

    const updatedHotel = await this.prisma.hotel.update({
      where: { id },
      data: {
        availableRooms: hotel.availableRooms - 1,
        updatedAt: new Date()
      }
    });

    return this.mapToEntity(updatedHotel);
  }

  async releaseRoom(id: string): Promise<HotelEntity> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id }
    });

    if (!hotel) {
      throw new Error('Hotel not found');
    }

    if (hotel.availableRooms >= hotel.totalRooms) {
      throw new Error('Cannot release more rooms than total capacity');
    }

    const updatedHotel = await this.prisma.hotel.update({
      where: { id },
      data: {
        availableRooms: hotel.availableRooms + 1,
        updatedAt: new Date()
      }
    });

    return this.mapToEntity(updatedHotel);
  }

  async count(filters?: HotelSearchFilters): Promise<number> {
    const where: any = {};

    if (filters?.city) {
      where.city = {
        contains: filters.city,
        mode: 'insensitive'
      };
    }

    if (filters?.state) {
      where.state = {
        contains: filters.state,
        mode: 'insensitive'
      };
    }

    if (filters?.country) {
      where.country = {
        contains: filters.country,
        mode: 'insensitive'
      };
    }

    if (filters?.minRating) {
      where.rating = {
        gte: filters.minRating
      };
    }

    if (filters?.maxPrice) {
      where.nightly = {
        lte: filters.maxPrice
      };
    }

    if (filters?.stars) {
      where.stars = filters.stars;
    }

    return await this.prisma.hotel.count({ where });
  }

  private mapToEntity(hotelData: any): HotelEntity {
    const data = {
      id: hotelData.id,
      hotelId: hotelData.hotelId,
      name: hotelData.name,
      description: hotelData.description,
      address: hotelData.address,
      city: hotelData.city,
      state: hotelData.state,
      country: hotelData.country,
      zipCode: hotelData.zipCode,
      latitude: hotelData.latitude,
      longitude: hotelData.longitude,
      rating: hotelData.rating,
      nightly: hotelData.nightly,
      total: hotelData.total,
      currency: hotelData.currency,
      policy: hotelData.policy,
      image: hotelData.image,
      totalRooms: hotelData.totalRooms,
      availableRooms: hotelData.availableRooms,
      amenities: hotelData.amenities ? JSON.parse(hotelData.amenities) : undefined,
      checkInTime: hotelData.checkInTime,
      checkOutTime: hotelData.checkOutTime,
      breakfastIncluded: hotelData.breakfastIncluded,
      wifiIncluded: hotelData.wifiIncluded,
      parkingIncluded: hotelData.parkingIncluded,
      petFriendly: hotelData.petFriendly,
      stars: hotelData.stars,
      createdAt: hotelData.createdAt,
      updatedAt: hotelData.updatedAt
    };

    return new HotelEntity(data);
  }
}