import winston from 'winston';
import path from 'path';

// Configuração de níveis de log personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Formato para desenvolvimento
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Formato para produção
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transports baseados no ambiente
const transports = [];

// Console transport sempre ativo
transports.push(
  new winston.transports.Console({
    format:
      process.env.NODE_ENV === 'development'
        ? developmentFormat
        : productionFormat,
  })
);

// File transports apenas em produção ou quando especificado
if (
  process.env.NODE_ENV === 'production' ||
  process.env.ENABLE_FILE_LOGGING === 'true'
) {
  // Log de erro
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Log combinado
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Log de HTTP requests
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'http.log'),
      level: 'http',
      format: productionFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    })
  );
}

// Criar logger principal
const logger = winston.createLogger({
  level:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
  levels,
  transports,
});

// Logger específico para requests HTTP
export const httpLogger = winston.createLogger({
  level: 'http',
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        })
      ),
    }),
  ],
});

// Métodos utilitários para logging estruturado
export const logRequest = (req: any, res: any, duration: number) => {
  httpLogger.http('HTTP Request', {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });
};

export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error('Error occurred', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

export const logBusinessEvent = (event: string, data?: Record<string, any>) => {
  logger.info('Business Event', {
    event,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: Record<string, any>
) => {
  logger.info('Performance Metric', {
    operation,
    duration: `${duration}ms`,
    metadata,
    timestamp: new Date().toISOString(),
  });
};

export const logDatabaseQuery = (
  query: string,
  duration: number,
  params?: any[]
) => {
  logger.debug('Database Query', {
    query: query.substring(0, 200) + (query.length > 200 ? '...' : ''),
    duration: `${duration}ms`,
    paramCount: params?.length || 0,
    timestamp: new Date().toISOString(),
  });
};

export default logger;
