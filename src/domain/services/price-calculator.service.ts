export interface SeasonalFactor {
  startMonth: number; // 1-12
  endMonth: number; // 1-12
  multiplier: number; // 0.5 - 2.0
  name: string;
}

export interface DemandFactor {
  daysAhead: number;
  multiplier: number;
}

export class PriceCalculatorService {
  private static readonly SEASONAL_FACTORS: SeasonalFactor[] = [
    {
      startMonth: 12,
      endMonth: 2,
      multiplier: 1.5,
      name: 'High Season (Summer)',
    },
    { startMonth: 6, endMonth: 8, multiplier: 1.3, name: 'Winter Vacation' },
    { startMonth: 3, endMonth: 5, multiplier: 1.1, name: 'Autumn' },
    { startMonth: 9, endMonth: 11, multiplier: 0.9, name: 'Spring' },
  ];

  private static readonly DEMAND_FACTORS: DemandFactor[] = [
    { daysAhead: 1, multiplier: 2.0 }, // Last minute
    { daysAhead: 7, multiplier: 1.8 }, // 1 week
    { daysAhead: 14, multiplier: 1.5 }, // 2 weeks
    { daysAhead: 30, multiplier: 1.2 }, // 1 month
    { daysAhead: 60, multiplier: 1.0 }, // 2 months
    { daysAhead: 90, multiplier: 0.9 }, // 3 months
    { daysAhead: 180, multiplier: 0.8 }, // 6 months
  ];

  /**
   * Calcula preço dinâmico para voos
   */
  static calculateFlightPrice(
    basePrice: number,
    departureDate: string,
    isInternational: boolean = false,
    availableSeats: number = 50,
    totalSeats: number = 150
  ): number {
    let finalPrice = basePrice;

    // Fator sazonal
    const seasonalMultiplier = this.getSeasonalMultiplier(departureDate);
    finalPrice *= seasonalMultiplier;

    // Fator de demanda (antecedência)
    const demandMultiplier = this.getDemandMultiplier(departureDate);
    finalPrice *= demandMultiplier;

    // Fator de disponibilidade
    const availabilityMultiplier = this.getAvailabilityMultiplier(
      availableSeats,
      totalSeats
    );
    finalPrice *= availabilityMultiplier;

    // Fator internacional
    if (isInternational) {
      finalPrice *= 1.2; // 20% mais caro para voos internacionais
    }

    // Adicionar variação aleatória de ±5%
    const randomFactor = 0.95 + Math.random() * 0.1;
    finalPrice *= randomFactor;

    return Math.round(finalPrice * 100) / 100; // Arredondar para 2 casas decimais
  }

  /**
   * Calcula preço dinâmico para hotéis
   */
  static calculateHotelPrice(
    basePrice: number,
    checkInDate: string,
    nights: number,
    availableRooms: number = 20,
    totalRooms: number = 50,
    isWeekend: boolean = false
  ): number {
    let finalPrice = basePrice;

    // Fator sazonal
    const seasonalMultiplier = this.getSeasonalMultiplier(checkInDate);
    finalPrice *= seasonalMultiplier;

    // Fator de demanda (antecedência)
    const demandMultiplier = this.getDemandMultiplier(checkInDate);
    finalPrice *= demandMultiplier;

    // Fator de disponibilidade
    const availabilityMultiplier = this.getAvailabilityMultiplier(
      availableRooms,
      totalRooms
    );
    finalPrice *= availabilityMultiplier;

    // Fator fim de semana
    if (isWeekend) {
      finalPrice *= 1.3; // 30% mais caro nos fins de semana
    }

    // Desconto para estadias longas
    if (nights >= 7) {
      finalPrice *= 0.9; // 10% desconto para 7+ noites
    } else if (nights >= 3) {
      finalPrice *= 0.95; // 5% desconto para 3+ noites
    }

    // Adicionar variação aleatória de ±3%
    const randomFactor = 0.97 + Math.random() * 0.06;
    finalPrice *= randomFactor;

    return Math.round(finalPrice * 100) / 100; // Arredondar para 2 casas decimais
  }

  /**
   * Obtém multiplicador sazonal baseado na data
   */
  private static getSeasonalMultiplier(date: string): number {
    const targetDate = new Date(date);
    const month = targetDate.getMonth() + 1; // getMonth() retorna 0-11

    for (const factor of this.SEASONAL_FACTORS) {
      if (this.isInSeason(month, factor.startMonth, factor.endMonth)) {
        return factor.multiplier;
      }
    }

    return 1.0; // Preço base se não encontrar temporada específica
  }

  /**
   * Verifica se o mês está na temporada especificada
   */
  private static isInSeason(
    month: number,
    startMonth: number,
    endMonth: number
  ): boolean {
    if (startMonth <= endMonth) {
      return month >= startMonth && month <= endMonth;
    } else {
      // Temporada que cruza o ano (ex: dezembro a fevereiro)
      return month >= startMonth || month <= endMonth;
    }
  }

  /**
   * Obtém multiplicador de demanda baseado na antecedência
   */
  private static getDemandMultiplier(date: string): number {
    const targetDate = new Date(date);
    const today = new Date();
    const daysAhead = Math.ceil(
      (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (const factor of this.DEMAND_FACTORS) {
      if (daysAhead <= factor.daysAhead) {
        return factor.multiplier;
      }
    }

    return 0.75; // Preço mais baixo para reservas muito antecipadas
  }

  /**
   * Obtém multiplicador de disponibilidade baseado na ocupação
   */
  private static getAvailabilityMultiplier(
    available: number,
    total: number
  ): number {
    const occupancyRate = (total - available) / total;

    if (occupancyRate >= 0.9) return 1.5; // 90%+ ocupado - muito caro
    if (occupancyRate >= 0.8) return 1.3; // 80%+ ocupado - caro
    if (occupancyRate >= 0.6) return 1.1; // 60%+ ocupado - ligeiramente mais caro
    if (occupancyRate >= 0.4) return 1.0; // 40%+ ocupado - preço normal
    if (occupancyRate >= 0.2) return 0.95; // 20%+ ocupado - ligeiro desconto

    return 0.9; // Baixa ocupação - desconto
  }

  /**
   * Simula flutuação de preços em tempo real
   */
  static simulateRealTimeFluctuation(currentPrice: number): number {
    // Variação de ±2% para simular flutuações do mercado
    const fluctuation = 0.98 + Math.random() * 0.04;
    return Math.round(currentPrice * fluctuation * 100) / 100;
  }

  /**
   * Calcula preço com desconto baseado em políticas
   */
  static applyDiscount(
    price: number,
    discountType: 'early_booking' | 'long_stay' | 'loyalty' | 'group',
    discountValue: number
  ): number {
    let finalPrice = price;

    switch (discountType) {
      case 'early_booking':
        finalPrice *= 1 - discountValue / 100;
        break;
      case 'long_stay':
        finalPrice *= 1 - discountValue / 100;
        break;
      case 'loyalty':
        finalPrice *= 1 - discountValue / 100;
        break;
      case 'group':
        finalPrice *= 1 - discountValue / 100;
        break;
      default:
        break;
    }

    return Math.round(finalPrice * 100) / 100;
  }
}
