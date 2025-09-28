/**
 * Simulador de funcionalidades de API real para criar um ambiente de desenvolvimento realista
 */
export class APISimulator {
  private static failureRate = 0.05; // 5% de taxa de falha
  private static minLatency = 200; // Latência mínima em ms
  private static maxLatency = 2000; // Latência máxima em ms

  /**
   * Simula latência variável como APIs reais
   */
  static async simulateLatency(
    operation: 'search' | 'booking' | 'cancel' = 'search'
  ): Promise<void> {
    let baseLatency = this.minLatency;
    let maxVariation = this.maxLatency - this.minLatency;

    // Diferentes tipos de operação têm latências diferentes
    switch (operation) {
      case 'search':
        baseLatency = 200;
        maxVariation = 800;
        break;
      case 'booking':
        baseLatency = 500;
        maxVariation = 1500;
        break;
      case 'cancel':
        baseLatency = 300;
        maxVariation = 700;
        break;
    }

    const latency = baseLatency + Math.random() * maxVariation;
    return new Promise((resolve) => setTimeout(resolve, latency));
  }

  /**
   * Simula falhas ocasionais como serviços reais
   */
  static simulateFailure(operation: string): void {
    if (Math.random() < this.failureRate) {
      const errors = [
        `${operation} service temporarily unavailable`,
        `Connection timeout to ${operation} provider`,
        `Rate limit exceeded for ${operation} API`,
        `Temporary maintenance on ${operation} system`,
      ];

      const randomError = errors[Math.floor(Math.random() * errors.length)];
      throw new Error(randomError);
    }
  }

  /**
   * Simula capacidade limitada (esgotamento de recursos)
   */
  static simulateCapacityLimits(
    availableQuantity: number,
    demand: number
  ): boolean {
    // Simula uma chance de esgotamento baseada na demanda vs disponibilidade
    const occupancyRate = (100 - availableQuantity) / 100;
    const demandPressure = Math.min(demand / 10, 1); // Normalizar demanda

    const failureChance = occupancyRate * demandPressure * 0.1; // Máximo 10% chance

    return Math.random() > failureChance;
  }

  /**
   * Gera variações de preço dinâmicas
   */
  static applyDynamicPricing(
    basePrice: number,
    type: 'flight' | 'hotel'
  ): number {
    // Simula flutuação de mercado em tempo real
    const marketVolatility = 0.02; // ±2% variação
    const variation = (Math.random() - 0.5) * 2 * marketVolatility;

    // Simula picos de demanda
    const demandSpike = Math.random() < 0.1 ? 1.05 + Math.random() * 0.1 : 1; // 10% chance de alta de 5-15%

    // Simula descontos promocionais
    const promotion = Math.random() < 0.15 ? 0.85 + Math.random() * 0.1 : 1; // 15% chance de desconto 10-15%

    let finalPrice = basePrice * (1 + variation) * demandSpike * promotion;

    // Adiciona variação específica por tipo
    if (type === 'flight') {
      // Voos são mais voláteis
      const volatilityMultiplier = 0.95 + Math.random() * 0.1; // ±5%
      finalPrice *= volatilityMultiplier;
    } else if (type === 'hotel') {
      // Hotéis têm variação mais suave
      const stabilityMultiplier = 0.98 + Math.random() * 0.04; // ±2%
      finalPrice *= stabilityMultiplier;
    }

    return Math.round(finalPrice * 100) / 100;
  }

  /**
   * Simula diferentes status de conectividade
   */
  static simulateNetworkConditions(): 'fast' | 'slow' | 'unstable' {
    const random = Math.random();

    if (random < 0.7) return 'fast';
    if (random < 0.9) return 'slow';
    return 'unstable';
  }

  /**
   * Aplica condições de rede à latência
   */
  static async applyNetworkConditions(baseLatency: number): Promise<void> {
    const condition = this.simulateNetworkConditions();
    let multiplier = 1;
    let jitter = 0;

    switch (condition) {
      case 'fast':
        multiplier = 0.8;
        jitter = 0.1;
        break;
      case 'slow':
        multiplier = 2.5;
        jitter = 0.3;
        break;
      case 'unstable':
        multiplier = 1.5 + Math.random() * 2;
        jitter = 0.5;
        break;
    }

    const finalLatency =
      baseLatency * multiplier * (1 + (Math.random() - 0.5) * jitter);
    return new Promise((resolve) => setTimeout(resolve, finalLatency));
  }

  /**
   * Simula cache hit/miss
   */
  static simulateCacheHit(cacheKey: string): boolean {
    // Simula diferentes taxas de cache baseadas no tipo de dados
    let hitRate = 0.7; // 70% default

    if (cacheKey.includes('popular')) hitRate = 0.9; // 90% para dados populares
    if (cacheKey.includes('recent')) hitRate = 0.8; // 80% para dados recentes
    if (cacheKey.includes('unique')) hitRate = 0.3; // 30% para consultas únicas

    return Math.random() < hitRate;
  }

  /**
   * Gera IDs de tracking realistas para logs
   */
  static generateTrackingId(prefix: string = 'TXN'): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Simula métricas de sistema
   */
  static generateSystemMetrics(): {
    cpuUsage: number;
    memoryUsage: number;
    responseTime: number;
    requestsPerSecond: number;
    errorRate: number;
  } {
    return {
      cpuUsage: 20 + Math.random() * 60, // 20-80%
      memoryUsage: 30 + Math.random() * 50, // 30-80%
      responseTime: 100 + Math.random() * 400, // 100-500ms
      requestsPerSecond: 50 + Math.random() * 200, // 50-250 RPS
      errorRate: Math.random() * 2, // 0-2%
    };
  }

  /**
   * Configura taxa de falha global
   */
  static setFailureRate(rate: number): void {
    this.failureRate = Math.max(0, Math.min(1, rate));
  }

  /**
   * Configura limites de latência
   */
  static setLatencyRange(min: number, max: number): void {
    this.minLatency = Math.max(0, min);
    this.maxLatency = Math.max(min, max);
  }
}
