import { Request, Response } from 'express';
import { ListFlightsUseCase } from '../../application/flights/list-flights.use-case';
import { BookFlightUseCase } from '../../application/flights/book-flight.use-case';
import {
  FlightSearchDTOSchema,
  FlightBookingDTOSchema,
} from '../dto/flight.dto';
import { FlightEntity } from '../../domain/entities/flight.entity';
import { BookingEntity } from '../../domain/entities/booking.entity';
import { PassengerEntity } from '../../domain/entities/passenger.entity';

export class FlightsController {
  constructor(
    private listFlightsUseCase: ListFlightsUseCase,
    private bookFlightUseCase: BookFlightUseCase
  ) {}

  /**
   * GET /flights - Lista voos com filtros
   */
  async searchFlights(req: Request, res: Response): Promise<void> {
    try {
      const searchParams = FlightSearchDTOSchema.parse(req.query);

      const result = await this.listFlightsUseCase.execute({
        origin: searchParams.origin,
        destination: searchParams.destination,
        departureDate: searchParams.departure_date,
        returnDate: searchParams.return_date,
        passengers: searchParams.passengers,
        bookingClass: searchParams.class,
        maxPrice: searchParams.max_price,
        airline: searchParams.airline,
        stops: searchParams.stops,
        sortBy: searchParams.sort_by,
        sortOrder: searchParams.sort_order,
        page: searchParams.page,
        limit: searchParams.limit,
      });

      const response = {
        success: true,
        data: {
          flights: result.flights.map(this.mapFlightToResponse),
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            total_pages: result.totalPages,
          },
        },
      };

      res.json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * GET /flights/:id - Busca voo por ID
   */
  async getFlightById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Aqui você injetaria um GetFlightByIdUseCase
      // Por simplicidade, usando o repository diretamente
      // const flight = await this.flightRepository.findById(id);

      res.json({
        success: true,
        data: { flight: null }, // Implementar depois
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * POST /flights/:id/book - Reserva um voo
   */
  async bookFlight(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const bookingData = FlightBookingDTOSchema.parse(req.body);

      const result = await this.bookFlightUseCase.execute({
        flightId: id,
        passenger: {
          firstName: bookingData.passenger.first_name,
          lastName: bookingData.passenger.last_name,
          email: bookingData.passenger.email,
          phone: bookingData.passenger.phone,
          dateOfBirth: bookingData.passenger.date_of_birth,
          passport: bookingData.passenger.passport,
          nationality: bookingData.passenger.nationality,
        },
        flightDate: bookingData.flight_date,
        specialRequests: bookingData.special_requests,
      });

      const response = {
        success: true,
        data: {
          booking: this.mapBookingToResponse(
            result.booking,
            result.passenger,
            result.flight
          ),
          pnr: result.pnr,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  private mapFlightToResponse(flight: FlightEntity) {
    return {
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
    };
  }

  private mapBookingToResponse(
    booking: BookingEntity,
    passenger: PassengerEntity,
    flight?: FlightEntity
  ) {
    return {
      id: booking.id,
      pnr: booking.pnr,
      status: booking.status,
      type: booking.type,
      total_price: booking.totalPrice,
      currency: booking.currency,
      booking_date: booking.bookingDate.toISOString(),
      passenger: {
        id: passenger.id,
        first_name: passenger.firstName,
        last_name: passenger.lastName,
        email: passenger.email,
      },
      flight: flight
        ? {
            id: flight.id,
            flight_number: flight.flightNumber,
            airline: flight.airline,
            origin: flight.origin,
            destination: flight.destination,
            departure_time: flight.departureTime,
            arrival_time: flight.arrivalTime,
          }
        : undefined,
    };
  }

  private handleError(res: Response, error: any): void {
    console.error('Flight Controller Error:', error);

    if (error.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }

    if (error.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
      return;
    }

    if (
      error.message.includes('unavailable') ||
      error.message.includes('No seats')
    ) {
      res.status(409).json({
        success: false,
        error: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }

  /**
   * POST /flights/:itineraryId/book - Book flight by itinerary ID
   */
  async bookFlightByItinerary(req: Request, res: Response): Promise<void> {
    try {
      const { itineraryId } = req.params;

      // Remap itineraryId to id for the existing booking logic
      req.params.id = itineraryId;

      // Reuse existing booking logic
      await this.bookFlight(req, res);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
