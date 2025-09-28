export class PNRGeneratorService {
  private static usedPNRs = new Set<string>();

  /**
   * Gera um PNR único de 6 caracteres alfanuméricos
   */
  static generate(): string {
    let pnr: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      pnr = this.generateRandomPNR();
      attempts++;

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique PNR after maximum attempts');
      }
    } while (this.usedPNRs.has(pnr));

    this.usedPNRs.add(pnr);
    return pnr;
  }

  /**
   * Verifica se um PNR já foi usado
   */
  static isUsed(pnr: string): boolean {
    return this.usedPNRs.has(pnr);
  }

  /**
   * Marca um PNR como usado (para carregar PNRs existentes do banco)
   */
  static markAsUsed(pnr: string): void {
    this.usedPNRs.add(pnr);
  }

  /**
   * Remove um PNR da lista de usados (para cancelamentos)
   */
  static release(pnr: string): void {
    this.usedPNRs.delete(pnr);
  }

  /**
   * Limpa todos os PNRs usados (útil para testes)
   */
  static clear(): void {
    this.usedPNRs.clear();
  }

  private static generateRandomPNR(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';

    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  /**
   * Valida se um PNR tem o formato correto
   */
  static validate(pnr: string): boolean {
    const pnrRegex = /^[A-Z0-9]{6}$/;
    return pnrRegex.test(pnr);
  }
}
