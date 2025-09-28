import { Request, Response } from 'express';
import { PrismaBookingRepository } from '../../infrastructure/database/repositories/prisma-booking.repository';
import {
  BookingEntity,
  BookingStatus,
} from '../../domain/entities/booking.entity';
import { prisma } from '../../infrastructure/database/prisma/client';

export class BookingsController {
  private bookingRepository: PrismaBookingRepository;

  constructor() {
    this.bookingRepository = new PrismaBookingRepository();
  }

  /**
   * GET /bookings/:bookingId - Get booking details by ID
   */
  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        res.status(400).json({
          success: false,
          error: 'Booking ID is required',
        });
        return;
      }

      const booking = await this.bookingRepository.findById(bookingId);

      if (!booking) {
        res.status(404).json({
          success: false,
          error: 'Booking not found',
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: booking.id,
          pnr: booking.pnr,
          type: booking.type,
          status: booking.status,
          passengerName: booking.passengerName,
          passengerEmail: booking.passengerEmail,
          resourceId: booking.resourceId,
          totalPrice: booking.totalPrice,
          currency: booking.currency,
          bookingDate: booking.bookingDate,
          flightDate: booking.flightDate,
          specialRequests: booking.specialRequests,
        },
      });
    } catch (error: any) {
      console.error('Error in getBookingById:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * GET /bookings - Get all bookings with optional filters
   */
  async getAllBookings(req: Request, res: Response): Promise<void> {
    try {
      const {
        passengerEmail,
        type,
        status,
        limit = '10',
        offset = '0',
      } = req.query;

      const filters: any = {};

      if (passengerEmail) filters.passengerEmail = passengerEmail as string;
      if (type) filters.type = type as string;
      if (status) filters.status = status as string;
      if (limit) filters.limit = parseInt(limit as string);
      if (offset) filters.offset = parseInt(offset as string);

      const bookings = await this.bookingRepository.findAll(filters);

      const bookingsResponse = bookings.map((booking) => ({
        id: booking.id,
        pnr: booking.pnr,
        type: booking.type,
        status: booking.status,
        passengerName: booking.passengerName,
        passengerEmail: booking.passengerEmail,
        resourceId: booking.resourceId,
        totalPrice: booking.totalPrice,
        currency: booking.currency,
        bookingDate: booking.bookingDate,
        flightDate: booking.flightDate,
        specialRequests: booking.specialRequests,
      }));

      res.json({
        success: true,
        data: bookingsResponse,
        count: bookingsResponse.length,
      });
    } catch (error: any) {
      console.error('Error in getAllBookings:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * PUT /bookings/:bookingId/cancel - Cancel a booking
   */
  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        res.status(400).json({
          success: false,
          error: 'Booking ID is required',
        });
        return;
      }

      const booking = await this.bookingRepository.findById(bookingId);

      if (!booking) {
        res.status(404).json({
          success: false,
          error: 'Booking not found',
        });
        return;
      }

      // Simple cancellation logic - just mark as cancelled
      const updatedBooking = await this.bookingRepository.update(bookingId, {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
      });

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          id: updatedBooking!.id,
          status: updatedBooking!.status,
          cancelledAt: updatedBooking!.cancelledAt,
        },
      });
    } catch (error: any) {
      console.error('Error in cancelBooking:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * PUT /bookings/:identifier/cancel - Cancel a booking by PNR or booking ID
   */
  async cancelBookingByIdentifier(req: Request, res: Response): Promise<void> {
    try {
      const { identifier } = req.params;

      if (!identifier) {
        res.status(400).json({
          success: false,
          error: 'Identifier (PNR or booking ID) is required',
        });
        return;
      }

      let booking: BookingEntity | null = null;

      // Check if identifier is PNR (6 characters) or booking ID (UUID format)
      if (identifier.length === 6) {
        // It's a PNR
        booking = await this.bookingRepository.findByPNR(identifier);
      } else {
        // It's a booking ID
        booking = await this.bookingRepository.findById(identifier);
      }

      if (!booking) {
        res.status(404).json({
          success: false,
          error: 'Booking not found for the provided identifier',
        });
        return;
      }

      // Check if booking can be cancelled
      if (!booking.canBeCancelled()) {
        res.status(400).json({
          success: false,
          error:
            'Booking cannot be cancelled. It may already be cancelled or completed.',
        });
        return;
      }

      // Cancel the booking using the entity method
      booking.cancel('Cancelled by user request');
      const updatedBooking = await this.bookingRepository.update(
        booking.id,
        booking
      );

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          id: updatedBooking!.id,
          pnr: updatedBooking!.pnr,
          status: updatedBooking!.status,
          cancelledAt: updatedBooking!.cancelledAt,
          cancelReason: updatedBooking!.cancelReason,
        },
      });
    } catch (error: any) {
      console.error('Error in cancelBookingByIdentifier:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * PUT /bookings/:pnr/cancel - Cancel a booking by PNR (deprecated - use cancelBookingByIdentifier)
   */
  async cancelBookingByPNR(req: Request, res: Response): Promise<void> {
    try {
      const { pnr } = req.params;

      if (!pnr) {
        res.status(400).json({
          success: false,
          error: 'PNR is required',
        });
        return;
      }

      const booking = await this.bookingRepository.findByPNR(pnr);

      if (!booking) {
        res.status(404).json({
          success: false,
          error: 'Booking not found for the provided PNR',
        });
        return;
      }

      // Check if booking can be cancelled
      if (!booking.canBeCancelled()) {
        res.status(400).json({
          success: false,
          error:
            'Booking cannot be cancelled. It may already be cancelled or completed.',
        });
        return;
      }

      // Cancel the booking using the entity method
      booking.cancel('Cancelled by user request');
      const updatedBooking = await this.bookingRepository.update(
        booking.id,
        booking
      );

      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {
          id: updatedBooking!.id,
          pnr: updatedBooking!.pnr,
          status: updatedBooking!.status,
          cancelledAt: updatedBooking!.cancelledAt,
          cancelReason: updatedBooking!.cancelReason,
        },
      });
    } catch (error: any) {
      console.error('Error in cancelBookingByPNR:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
