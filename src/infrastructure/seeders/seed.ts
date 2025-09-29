import { prisma } from '../database/prisma/client';
import { seedFlights } from './flights-expanded.seed';
import { seedHotels } from './hotels-expanded.seed';

async function main() {
  console.log('🚀 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.booking.deleteMany();
    await prisma.flight.deleteMany();
    await prisma.hotel.deleteMany();

    // Seed flights
    const flights = await seedFlights();
    for (const flight of flights) {
      await prisma.flight.create({
        data: {
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
          stopCities: flight.stopCities
            ? JSON.stringify(flight.stopCities)
            : null,
          baggageIncluded: flight.baggageIncluded,
          mealIncluded: flight.mealIncluded,
          refundable: flight.refundable,
          bookingClass: flight.bookingClass,
        },
      });
    }

    // Seed hotels
    const hotels = await seedHotels();
    for (const hotel of hotels) {
      await prisma.hotel.create({
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
        },
      });
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Flights: ${flights.length}`);
    console.log(`   - Hotels: ${hotels.length}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
