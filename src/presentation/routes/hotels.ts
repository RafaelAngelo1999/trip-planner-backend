import { Router } from 'express';
import { HotelController } from '../controllers/hotel.controller';
import { GetHotelsUseCase } from '../../application/use-cases/hotels/get-hotels.use-case';
import { PrismaHotelRepository } from '../../infrastructure/database/repositories/prisma-hotel.repository';
import { prisma } from '../../infrastructure/database/prisma/client';

const router = Router();

// Dependency injection
const hotelRepository = new PrismaHotelRepository(prisma);
const getHotelsUseCase = new GetHotelsUseCase(hotelRepository);
const hotelController = new HotelController(getHotelsUseCase);

/**
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: Search for hotels
 *     tags: [Hotels]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City name to filter hotels
 *       - in: query
 *         name: checkInDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-in date (YYYY-MM-DD)
 *       - in: query
 *         name: checkOutDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Check-out date (YYYY-MM-DD)
 *       - in: query
 *         name: guests
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Number of guests
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum hotel rating
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price per night
 *       - in: query
 *         name: stars
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Hotel star rating
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, stars, name]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of hotels found
 *       400:
 *         description: Invalid query parameters
 */
router.get('/', (req, res) => hotelController.getHotels(req, res));

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel details
 *       404:
 *         description: Hotel not found
 */
router.get('/:id', (req, res) => hotelController.getHotelById(req, res));

/**
 * @swagger
 * /api/hotels/city/{city}:
 *   get:
 *     summary: Get hotels by city
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of hotels in the city
 *       400:
 *         description: Invalid city parameter
 */
router.get('/city/:city', (req, res) =>
  hotelController.getHotelsByCity(req, res)
);

export default router;
