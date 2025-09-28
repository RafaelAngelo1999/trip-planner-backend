import { Request, Response } from 'express';
import { z } from 'zod';
import { GetHotelsUseCase } from '../../application/use-cases/hotels/get-hotels.use-case';
import { HotelEntity } from '../../domain/entities/hotel.entity';

// Schema para validação dos parâmetros de busca
const hotelSearchSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guests: z.coerce.number().int().positive().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  amenities: z.string().transform(val => val.split(',')).optional(),
  stars: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: z.enum(['price', 'rating', 'stars', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});

export class HotelController {
  constructor(private readonly getHotelsUseCase: GetHotelsUseCase) {}

  /**
   * GET /api/hotels
   * Lista hotéis com filtros opcionais
   */
  async getHotels(req: Request, res: Response): Promise<void> {
    try {
      // Validar parâmetros de query
      const validatedParams = hotelSearchSchema.parse(req.query);

      // Executar caso de uso
      const result = await this.getHotelsUseCase.execute(validatedParams);

      // Converter entidades para resposta da API
      const hotelsResponse = result.hotels.map(hotel => hotel.toApiResponse());

      res.json({
        hotels: hotelsResponse,
        pagination: result.pagination
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Parâmetros de consulta inválidos',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            })),
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      console.error('Error in getHotels:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro interno do servidor',
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * GET /api/hotels/:id
   * Busca hotel por ID
   */
  async getHotelById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validar formato do ID (UUID)
      if (!z.string().uuid().safeParse(id).success) {
        res.status(400).json({
          error: {
            code: 'INVALID_ID',
            message: 'ID do hotel deve ser um UUID válido',
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      // Buscar hotel (aqui você implementaria um GetHotelByIdUseCase)
      // Por agora vou deixar um placeholder
      res.status(501).json({
        error: {
          code: 'NOT_IMPLEMENTED',
          message: 'Endpoint não implementado ainda',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in getHotelById:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro interno do servidor',
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * GET /api/hotels/city/:city
   * Busca hotéis por cidade
   */
  async getHotelsByCity(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!city || city.trim().length === 0) {
        res.status(400).json({
          error: {
            code: 'INVALID_CITY',
            message: 'Nome da cidade é obrigatório',
            timestamp: new Date().toISOString()
          }
        });
        return;
      }

      const result = await this.getHotelsUseCase.execute({
        city: city.trim(),
        page: Number(page),
        limit: Number(limit)
      });

      const hotelsResponse = result.hotels.map(hotel => hotel.toApiResponse());

      res.json({
        hotels: hotelsResponse,
        pagination: result.pagination,
        city: city.trim()
      });
    } catch (error) {
      console.error('Error in getHotelsByCity:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Erro interno do servidor',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
}