import { Request, Response } from 'express';
import { PrismaBookingRepository } from '../../infrastructure/database/repositories/prisma-booking.repository';
import { BookingStatus } from '../../domain/entities/booking.entity';
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
          passengerId: booking.passengerId,
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
        passengerId,
        type,
        status,
        limit = '10',
        offset = '0',
      } = req.query;

      const filters: any = {};

      if (passengerId) filters.passengerId = passengerId as string;
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
        passengerId: booking.passengerId,
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
}
