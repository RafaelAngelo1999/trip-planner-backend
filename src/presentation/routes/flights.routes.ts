import { Router } from 'express';
import { FlightsController } from '../controllers/flights.controller';
import { ListFlightsUseCase } from '../../application/flights/list-flights.use-case';
import { BookFlightUseCase } from '../../application/flights/book-flight.use-case';
import { PrismaFlightRepository } from '../../infrastructure/database/repositories/prisma-flight.repository';
import { PrismaBookingRepository } from '../../infrastructure/database/repositories/prisma-booking.repository';

const router = Router();

// Dependency injection (em um projeto real, isso seria feito com um container DI)
const flightRepository = new PrismaFlightRepository();
const bookingRepository = new PrismaBookingRepository();

const listFlightsUseCase = new ListFlightsUseCase(flightRepository);
const bookFlightUseCase = new BookFlightUseCase(
  flightRepository,
  bookingRepository
);

const flightsController = new FlightsController(
  listFlightsUseCase,
  bookFlightUseCase
);

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Search for flights
 *     tags: [Flights]
 *     parameters:
 *       - in: query
 *         name: origin
 *         schema:
 *           type: string
 *         description: Origin airport code (3 letters)
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Destination airport code (3 letters)
 *       - in: query
 *         name: departure_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Departure date (YYYY-MM-DD)
 *       - in: query
 *         name: passengers
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 9
 *         description: Number of passengers
 *       - in: query
 *         name: class
 *         schema:
 *           type: string
 *           enum: [economy, premium_economy, business, first]
 *         description: Booking class
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: List of flights matching the criteria
 *       400:
 *         description: Invalid request parameters
 *       500:
 *         description: Internal server error
 */
router.get('/', (req, res) => flightsController.searchFlights(req, res));

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Get flight by ID
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID
 *     responses:
 *       200:
 *         description: Flight details
 *       404:
 *         description: Flight not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', (req, res) => flightsController.getFlightById(req, res));

/**
 * @swagger
 * /api/flights/{id}/book:
 *   post:
 *     summary: Book a flight
 *     tags: [Flights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Flight ID to book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - passenger
 *               - flight_date
 *             properties:
 *               passenger:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phone:
 *                     type: string
 *                   date_of_birth:
 *                     type: string
 *                     format: date
 *                   nationality:
 *                     type: string
 *                   passport:
 *                     type: string
 *               flight_date:
 *                 type: string
 *                 format: date
 *               special_requests:
 *                 type: string
 *     responses:
 *       201:
 *         description: Flight booked successfully
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Flight not found
 *       409:
 *         description: No seats available
 *       500:
 *         description: Internal server error
 */
router.post('/:id/book', (req, res) => flightsController.bookFlight(req, res));

export { router as flightRoutes };
