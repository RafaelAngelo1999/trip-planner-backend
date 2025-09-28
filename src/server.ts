import express, { Request, Response } from 'express';
import cors from 'cors';
import { FlightEntity, HotelEntity, BookingEntity, BookingType, PassengerEntity } from './common/entities';

const app = express();
const PORT = process.env.PORT || 3001;

// Mock databases
const flights: FlightEntity[] = [];
const hotels: HotelEntity[] = [];
const bookings: BookingEntity[] = [];

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:2024', 'http://localhost:3000', 'http://127.0.0.1:2024', 'http://127.0.0.1:3000'],
  credentials: true,
}));

// Populate with sample data
function initializeSampleData() {
  // Sample flights
  const flightData = [
    {
      flightNumber: 'LA3001',
      airline: 'LATAM',
      origin: 'CNF',
      destination: 'GRU',
      departureTime: '2024-12-15T06:00:00Z',
      arrivalTime: '2024-12-15T07:20:00Z',
      price: 800,
      currency: 'BRL',
      availableSeats: 150,
      totalSeats: 180,
      aircraft: 'Airbus A320',
      duration: '01:20',
      stops: 0,
      baggageIncluded: true,
      mealIncluded: false,
      refundable: false,
      bookingClass: 'economy',
    },
    {
      flightNumber: 'G31234',
      airline: 'Gol',
      origin: 'CNF',
      destination: 'GRU',
      departureTime: '2024-12-15T09:30:00Z',
      arrivalTime: '2024-12-15T10:50:00Z',
      price: 1200,
      currency: 'BRL',
      availableSeats: 120,
      totalSeats: 160,
      aircraft: 'Boeing 737-800',
      duration: '01:20',
      stops: 0,
      baggageIncluded: true,
      mealIncluded: true,
      refundable: true,
      bookingClass: 'economy',
    },
    {
      flightNumber: 'LA8001',
      airline: 'LATAM',
      origin: 'CNF',
      destination: 'SFO',
      departureTime: '2024-12-20T22:30:00Z',
      arrivalTime: '2024-12-21T14:45:00Z',
      price: 6800,
      currency: 'BRL',
      availableSeats: 35,
      totalSeats: 300,
      aircraft: 'Boeing 787-9',
      duration: '16:15',
      stops: 1,
      stopCities: ['GRU'],
      baggageIncluded: true,
      mealIncluded: true,
      refundable: true,
      bookingClass: 'economy',
    }
  ];

  flightData.forEach(data => {
    flights.push(FlightEntity.create(data));
  });

  // Sample hotels
  const hotelData = [
    {
      name: 'Tryp by Wyndham Belo Horizonte Savassi',
      description: 'Modern hotel in the heart of Savassi',
      address: 'Rua Antônio de Albuquerque, 335',
      city: 'Belo Horizonte',
      state: 'Minas Gerais',
      country: 'Brazil',
      zipCode: '30112-010',
      latitude: -19.9395,
      longitude: -43.9378,
      rating: 4.2,
      totalRooms: 120,
      availableRooms: 45,
      pricePerNight: 280,
      currency: 'BRL',
      amenities: ['WiFi gratuito', 'Ar condicionado', 'Academia'],
      images: [],
      checkInTime: '15:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Cancelamento gratuito até 24 horas antes do check-in',
      breakfastIncluded: true,
      wifiIncluded: true,
      parkingIncluded: true,
      petFriendly: false,
      stars: 4,
    },
    {
      name: 'Hotel Fasano Belo Horizonte',
      description: 'Ultra-luxury hotel offering world-class service',
      address: 'Avenida Getúlio Vargas, 1640',
      city: 'Belo Horizonte',
      state: 'Minas Gerais',
      country: 'Brazil',
      zipCode: '30170-044',
      latitude: -19.9278,
      longitude: -43.9422,
      rating: 4.9,
      totalRooms: 80,
      availableRooms: 8,
      pricePerNight: 650,
      currency: 'BRL',
      amenities: ['WiFi gratuito', 'Piscina', 'Spa', 'Restaurante gourmet'],
      images: [],
      checkInTime: '15:00',
      checkOutTime: '12:00',
      cancellationPolicy: 'Cancelamento gratuito até 72 horas antes do check-in',
      breakfastIncluded: true,
      wifiIncluded: true,
      parkingIncluded: true,
      petFriendly: true,
      stars: 5,
    }
  ];

  hotelData.forEach(data => {
    hotels.push(HotelEntity.create(data));
  });

  console.log(`✅ Initialized with ${flights.length} flights and ${hotels.length} hotels`);
}

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Trip Planner Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Trip Planner Backend API',
    version: '1.0.0',
    endpoints: {
      flights: '/api/flights',
      hotels: '/api/hotels (coming soon)',
      bookings: '/api/bookings (coming soon)',
      health: '/health',
    },
  });
});

// Flight routes
app.get('/api/flights', (req: Request, res: Response) => {
  try {
    const { origin, destination, departure_date, passengers = 1, page = 1, limit = 10 } = req.query;
    
    let filteredFlights = [...flights];
    
    if (origin) {
      filteredFlights = filteredFlights.filter(f => f.origin === origin);
    }
    
    if (destination) {
      filteredFlights = filteredFlights.filter(f => f.destination === destination);
    }
    
    if (departure_date) {
      const searchDate = new Date(departure_date as string);
      filteredFlights = filteredFlights.filter(f => {
        const flightDate = new Date(f.departureTime);
        return flightDate.toDateString() === searchDate.toDateString();
      });
    }

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedFlights = filteredFlights.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: {
        flights: paginatedFlights.map(flight => ({
          id: flight.id,
          flight_number: flight.flightNumber,
          airline: flight.airline,
          origin: flight.origin,
          destination: flight.destination,
          departure_time: flight.departureTime,
          arrival_time: flight.arrivalTime,
          price: flight.price,
          currency: flight.currency,
          available_seats: flight.availableSeats,
          total_seats: flight.totalSeats,
          aircraft: flight.aircraft,
          duration: flight.duration,
          stops: flight.stops,
          stop_cities: flight.stopCities,
          baggage_included: flight.baggageIncluded,
          meal_included: flight.mealIncluded,
          refundable: flight.refundable,
          booking_class: flight.bookingClass,
        })),
        pagination: {
          total: filteredFlights.length,
          page: Number(page),
          limit: Number(limit),
          total_pages: Math.ceil(filteredFlights.length / Number(limit)),
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.get('/api/flights/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flight = flights.find(f => f.id === id);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: 'Flight not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        flight: {
          id: flight.id,
          flight_number: flight.flightNumber,
          airline: flight.airline,
          origin: flight.origin,
          destination: flight.destination,
          departure_time: flight.departureTime,
          arrival_time: flight.arrivalTime,
          price: flight.price,
          currency: flight.currency,
          available_seats: flight.availableSeats,
          total_seats: flight.totalSeats,
          aircraft: flight.aircraft,
          duration: flight.duration,
          stops: flight.stops,
          stop_cities: flight.stopCities,
          baggage_included: flight.baggageIncluded,
          meal_included: flight.mealIncluded,
          refundable: flight.refundable,
          booking_class: flight.bookingClass,
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/api/flights/:id/book', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { passenger, flight_date, special_requests } = req.body;
    
    const flight = flights.find(f => f.id === id);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: 'Flight not found'
      });
    }
    
    if (!flight.isAvailable()) {
      return res.status(409).json({
        success: false,
        error: 'No seats available for this flight'
      });
    }
    
    // Create passenger
    const newPassenger = PassengerEntity.create({
      firstName: passenger.first_name,
      lastName: passenger.last_name,
      email: passenger.email,
      phone: passenger.phone,
      dateOfBirth: passenger.date_of_birth,
      passport: passenger.passport,
      nationality: passenger.nationality,
    });
    
    // Reserve seat
    flight.reserveSeat();
    
    // Create booking
    const booking = BookingEntity.create({
      type: BookingType.FLIGHT,
      status: 'PENDING' as any,
      passengerId: newPassenger.id,
      resourceId: flight.id,
      totalPrice: flight.price,
      currency: flight.currency,
      flightDate: flight_date,
      specialRequests: special_requests,
    });
    
    booking.confirm();
    bookings.push(booking);
    
    res.status(201).json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          pnr: booking.pnr,
          status: booking.status,
          type: booking.type,
          total_price: booking.totalPrice,
          currency: booking.currency,
          booking_date: booking.bookingDate.toISOString(),
          passenger: {
            id: newPassenger.id,
            first_name: newPassenger.firstName,
            last_name: newPassenger.lastName,
            email: newPassenger.email,
          },
          flight: {
            id: flight.id,
            flight_number: flight.flightNumber,
            airline: flight.airline,
            origin: flight.origin,
            destination: flight.destination,
            departure_time: flight.departureTime,
            arrival_time: flight.arrivalTime,
          }
        },
        pnr: booking.pnr,
      }
    });
  } catch (error: any) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

app.put('/api/bookings/:id/cancel', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    if (booking.status === 'CANCELLED') {
      return res.status(409).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }
    
    // Cancel booking
    booking.cancel(reason);
    
    res.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          pnr: booking.pnr,
          status: booking.status,
          cancel_reason: booking.cancelReason,
          cancelled_at: booking.cancelledAt?.toISOString(),
        }
      },
      message: 'Booking cancelled successfully'
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

app.get('/api/bookings/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        booking: {
          id: booking.id,
          pnr: booking.pnr,
          status: booking.status,
          type: booking.type,
          total_price: booking.totalPrice,
          currency: booking.currency,
          booking_date: booking.bookingDate.toISOString(),
          cancel_reason: booking.cancelReason,
          cancelled_at: booking.cancelledAt?.toISOString(),
        }
      }
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
});

// Error handling
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Initialize data immediately for serverless
initializeSampleData();

// Start server (for local development)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Trip Planner Backend running on port ${PORT}`);
    console.log(`📖 API documentation: http://localhost:${PORT}/api`);
    console.log(`💚 Health check: http://localhost:${PORT}/health`);
    console.log(`✈️  Flights: http://localhost:${PORT}/api/flights`);
  });
}

export default app;