/**
 * Sistema de métricas para monitoramento da aplicação
 */
export class MetricsCollector {
  private static metrics = {
    requests: {
      total: 0,
      success: 0,
      errors: 0,
      byEndpoint: new Map<string, number>(),
      byStatus: new Map<number, number>(),
    },
    performance: {
      responseTime: {
        total: 0,
        count: 0,
        min: Infinity,
        max: 0,
      },
      databaseQueries: {
        total: 0,
        count: 0,
        slowQueries: 0, // > 1000ms
      },
    },
    business: {
      bookings: {
        total: 0,
        successful: 0,
        failed: 0,
        cancelled: 0,
      },
      searches: {
        flights: 0,
        hotels: 0,
      },
    },
    system: {
      startTime: Date.now(),
      uptime: 0,
    },
  };

  /**
   * Registra uma requisição HTTP
   */
  static recordRequest(
    endpoint: string,
    statusCode: number,
    responseTime: number
  ): void {
    // Métricas gerais
    this.metrics.requests.total++;

    if (statusCode >= 200 && statusCode < 400) {
      this.metrics.requests.success++;
    } else {
      this.metrics.requests.errors++;
    }

    // Por endpoint
    const endpointCount = this.metrics.requests.byEndpoint.get(endpoint) || 0;
    this.metrics.requests.byEndpoint.set(endpoint, endpointCount + 1);

    // Por status code
    const statusCount = this.metrics.requests.byStatus.get(statusCode) || 0;
    this.metrics.requests.byStatus.set(statusCode, statusCount + 1);

    // Performance
    this.recordResponseTime(responseTime);
  }

  /**
   * Registra tempo de resposta
   */
  static recordResponseTime(responseTime: number): void {
    const perf = this.metrics.performance.responseTime;
    perf.total += responseTime;
    perf.count++;
    perf.min = Math.min(perf.min, responseTime);
    perf.max = Math.max(perf.max, responseTime);
  }

  /**
   * Registra query de banco de dados
   */
  static recordDatabaseQuery(duration: number): void {
    const db = this.metrics.performance.databaseQueries;
    db.total += duration;
    db.count++;

    if (duration > 1000) {
      db.slowQueries++;
    }
  }

  /**
   * Registra evento de negócio
   */
  static recordBusinessEvent(
    event:
      | 'booking_success'
      | 'booking_failed'
      | 'booking_cancelled'
      | 'flight_search'
      | 'hotel_search'
  ): void {
    switch (event) {
      case 'booking_success':
        this.metrics.business.bookings.total++;
        this.metrics.business.bookings.successful++;
        break;
      case 'booking_failed':
        this.metrics.business.bookings.total++;
        this.metrics.business.bookings.failed++;
        break;
      case 'booking_cancelled':
        this.metrics.business.bookings.cancelled++;
        break;
      case 'flight_search':
        this.metrics.business.searches.flights++;
        break;
      case 'hotel_search':
        this.metrics.business.searches.hotels++;
        break;
    }
  }

  /**
   * Obtém todas as métricas
   */
  static getMetrics(): typeof MetricsCollector.metrics & {
    computed: {
      averageResponseTime: number;
      errorRate: number;
      successRate: number;
      averageDbQueryTime: number;
      bookingSuccessRate: number;
      uptimeHours: number;
    };
  } {
    // Atualizar uptime
    this.metrics.system.uptime = Date.now() - this.metrics.system.startTime;

    const computed = {
      averageResponseTime:
        this.metrics.performance.responseTime.count > 0
          ? this.metrics.performance.responseTime.total /
            this.metrics.performance.responseTime.count
          : 0,
      errorRate:
        this.metrics.requests.total > 0
          ? (this.metrics.requests.errors / this.metrics.requests.total) * 100
          : 0,
      successRate:
        this.metrics.requests.total > 0
          ? (this.metrics.requests.success / this.metrics.requests.total) * 100
          : 0,
      averageDbQueryTime:
        this.metrics.performance.databaseQueries.count > 0
          ? this.metrics.performance.databaseQueries.total /
            this.metrics.performance.databaseQueries.count
          : 0,
      bookingSuccessRate:
        this.metrics.business.bookings.total > 0
          ? (this.metrics.business.bookings.successful /
              this.metrics.business.bookings.total) *
            100
          : 0,
      uptimeHours:
        (Date.now() - this.metrics.system.startTime) / (1000 * 60 * 60),
    };

    return {
      ...this.metrics,
      computed,
    };
  }

  /**
   * Obtém métricas resumidas para health check
   */
  static getHealthMetrics(): {
    status: 'healthy' | 'warning' | 'critical';
    uptime: number;
    requests: number;
    errorRate: number;
    averageResponseTime: number;
  } {
    const metrics = this.getMetrics();
    const computed = metrics.computed;

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Determinar status baseado nas métricas
    if (computed.errorRate > 10 || computed.averageResponseTime > 2000) {
      status = 'critical';
    } else if (computed.errorRate > 5 || computed.averageResponseTime > 1000) {
      status = 'warning';
    }

    return {
      status,
      uptime: Math.round(computed.uptimeHours * 100) / 100,
      requests: metrics.requests.total,
      errorRate: Math.round(computed.errorRate * 100) / 100,
      averageResponseTime: Math.round(computed.averageResponseTime),
    };
  }

  /**
   * Obtém métricas em formato Prometheus (para futuras integrações)
   */
  static getPrometheusMetrics(): string {
    const metrics = this.getMetrics();

    const lines = [
      '# HELP http_requests_total Total number of HTTP requests',
      '# TYPE http_requests_total counter',
      `http_requests_total ${metrics.requests.total}`,
      '',
      '# HELP http_request_duration_seconds HTTP request duration in seconds',
      '# TYPE http_request_duration_seconds histogram',
      `http_request_duration_seconds_sum ${metrics.performance.responseTime.total / 1000}`,
      `http_request_duration_seconds_count ${metrics.performance.responseTime.count}`,
      '',
      '# HELP bookings_total Total number of bookings',
      '# TYPE bookings_total counter',
      `bookings_total ${metrics.business.bookings.total}`,
      '',
      '# HELP database_queries_total Total number of database queries',
      '# TYPE database_queries_total counter',
      `database_queries_total ${metrics.performance.databaseQueries.count}`,
    ];

    return lines.join('\n');
  }

  /**
   * Reset das métricas (útil para testes)
   */
  static reset(): void {
    this.metrics.requests = {
      total: 0,
      success: 0,
      errors: 0,
      byEndpoint: new Map(),
      byStatus: new Map(),
    };

    this.metrics.performance = {
      responseTime: {
        total: 0,
        count: 0,
        min: Infinity,
        max: 0,
      },
      databaseQueries: {
        total: 0,
        count: 0,
        slowQueries: 0,
      },
    };

    this.metrics.business = {
      bookings: {
        total: 0,
        successful: 0,
        failed: 0,
        cancelled: 0,
      },
      searches: {
        flights: 0,
        hotels: 0,
      },
    };

    this.metrics.system.startTime = Date.now();
  }
}
