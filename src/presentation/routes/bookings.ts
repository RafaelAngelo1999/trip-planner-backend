import { Router } from 'express';
import { BookingsController } from '../controllers/bookings.controller';

const router = Router();

// Initialize controller
const bookingsController = new BookingsController();

/**
 * @swagger
 * /bookings/{bookingId}:
 *   get:
 *     summary: Get booking details by ID
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     pnr:
 *                       type: string
 *                     type:
 *                       type: string
 *                     status:
 *                       type: string
 *                     passengerId:
 *                       type: string
 *                     resourceId:
 *                       type: string
 *                     totalPrice:
 *                       type: number
 *                     currency:
 *                       type: string
 *                     bookingDate:
 *                       type: string
 *                     flightDate:
 *                       type: string
 *                     specialRequests:
 *                       type: string
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.get('/:bookingId', (req, res) =>
  bookingsController.getBookingById(req, res)
);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings with optional filters
 *     parameters:
 *       - in: query
 *         name: passengerId
 *         schema:
 *           type: string
 *         description: Filter by passenger ID
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by booking type (FLIGHT, HOTEL)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by booking status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 count:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
router.get('/', (req, res) => bookingsController.getAllBookings(req, res));

/**
 * @swagger
 * /bookings/{bookingId}/cancel:
 *   put:
 *     summary: Cancel a booking
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The booking ID to cancel
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     status:
 *                       type: string
 *                     cancelledAt:
 *                       type: string
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Internal server error
 */
router.put('/:bookingId/cancel', (req, res) =>
  bookingsController.cancelBooking(req, res)
);

export default router;
