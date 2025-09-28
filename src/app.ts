import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { flightRoutes } from './presentation/routes/flights.routes';
import { ErrorHandler } from './presentation/middlewares/error-handler';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration for LangGraph integration
    this.app.use(
      cors({
        origin: [
          'http://localhost:2024', // LangGraph default port
          'http://localhost:3000', // React development
          'http://localhost:3001', // Alternative React port
          'http://127.0.0.1:2024',
          'http://127.0.0.1:3000',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Trip Planner Backend is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      });
    });

    // API routes
    this.app.use('/api/flights', flightRoutes);
    // this.app.use('/api/hotels', hotelRoutes); // TODO: Implement
    // this.app.use('/api/bookings', bookingRoutes); // TODO: Implement

    // API documentation
    this.app.get('/api', (req, res) => {
      res.json({
        success: true,
        message: 'Trip Planner Backend API',
        version: '1.0.0',
        endpoints: {
          flights: '/api/flights',
          hotels: '/api/hotels',
          bookings: '/api/bookings',
          health: '/health',
        },
        documentation: '/api/docs', // TODO: Implement Swagger UI
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use(ErrorHandler.notFound);

    // Global error handler
    this.app.use(ErrorHandler.handle);
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`🚀 Trip Planner Backend running on port ${port}`);
      console.log(`📖 API documentation: http://localhost:${port}/api`);
      console.log(`💚 Health check: http://localhost:${port}/health`);
    });
  }
}

export default App;
