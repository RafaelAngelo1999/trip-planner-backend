import {
  BookingEntity,
  BookingType,
  BookingStatus,
} from '../../domain/entities/booking.entity';
import { FlightEntity } from '../../domain/entities/flight.entity';
import { PassengerEntity } from '../../domain/entities/passenger.entity';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { FlightRepository } from '../../domain/repositories/flight.repository';
import { PNRGeneratorService } from '../../domain/services/pnr-generator.service';

export interface BookFlightRequest {
  flightId: string;
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    passport?: string;
    nationality: string;
  };
  flightDate: string;
  specialRequests?: string;
}

export interface BookFlightResponse {
  booking: BookingEntity;
  flight: FlightEntity;
  passenger: PassengerEntity;
  pnr: string;
}

export class BookFlightUseCase {
  constructor(
    private flightRepository: FlightRepository,
    private bookingRepository: BookingRepository
  ) {}

  async execute(request: BookFlightRequest): Promise<BookFlightResponse> {
    // Simular latência de API real
    await this.simulateLatency();

    // Simular falha ocasional (5% das vezes)
    if (Math.random() < 0.05) {
      throw new Error('Booking service temporarily unavailable');
    }

    // Buscar o voo
    const flight = await this.flightRepository.findById(request.flightId);
    if (!flight) {
      throw new Error('Flight not found');
    }

    // Verificar disponibilidade
    if (!flight.isAvailable()) {
      throw new Error('No seats available for this flight');
    }

    // Criar passageiro
    const passenger = PassengerEntity.create(request.passenger);

    // Reservar assento
    await this.flightRepository.reserveSeat(request.flightId);

    // Gerar PNR
    const pnr = PNRGeneratorService.generate();

    // Criar booking
    const booking = BookingEntity.create({
      type: BookingType.FLIGHT,
      status: BookingStatus.PENDING,
      passengerId: passenger.id,
      resourceId: request.flightId,
      totalPrice: flight.price,
      currency: flight.currency,
      flightDate: request.flightDate,
      specialRequests: request.specialRequests,
    });

    // Salvar booking
    const savedBooking = await this.bookingRepository.create(booking);

    // Confirmar booking automaticamente (simular processamento de pagamento)
    savedBooking.confirm();
    await this.bookingRepository.update(savedBooking.id, savedBooking);

    return {
      booking: savedBooking,
      flight,
      passenger,
      pnr: savedBooking.pnr,
    };
  }

  private async simulateLatency(): Promise<void> {
    const latency = 500 + Math.random() * 1500; // 500ms a 2000ms (booking é mais demorado)
    return new Promise((resolve) => setTimeout(resolve, latency));
  }
}
