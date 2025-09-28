import { Request, Response, NextFunction } from 'express';

export class ErrorHandler {
  static handle(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error('Error caught by global handler:', err);

    // Zod validation errors
    if (err.name === 'ZodError') {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: err.errors,
      });
      return;
    }

    // Prisma errors
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        error: 'Duplicate entry. Resource already exists.',
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: 'Resource not found.',
      });
      return;
    }

    // Business logic errors
    if (err.message.includes('not found')) {
      res.status(404).json({
        success: false,
        error: err.message,
      });
      return;
    }

    if (
      err.message.includes('unavailable') ||
      err.message.includes('No seats') ||
      err.message.includes('No rooms')
    ) {
      res.status(409).json({
        success: false,
        error: err.message,
      });
      return;
    }

    // Default server error
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'Internal server error',
    });
  }

  static notFound(req: Request, res: Response): void {
    res.status(404).json({
      success: false,
      error: `Route ${req.method} ${req.originalUrl} not found`,
    });
  }
}
