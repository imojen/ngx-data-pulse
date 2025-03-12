import {
  CurrencyConvertOptions,
  CurrencyFormatOptions,
  NumberFormatOptions,
} from "./number.types";

/**
 * Service de manipulation des nombres
 */
export class NumberService {
  private static readonly DEFAULT_OPTIONS: NumberFormatOptions = {
    decimals: 2,
    decimalSeparator: ",",
    thousandSeparator: " ",
    forceDecimals: false,
  };

  private static readonly DEFAULT_CURRENCY_OPTIONS: CurrencyFormatOptions = {
    ...this.DEFAULT_OPTIONS,
    currency: "EUR",
    symbolPosition: "after",
    symbolSpace: true,
  };

  private static readonly CURRENCY_SYMBOLS: Record<string, string> = {
    EUR: "€",
    USD: "$",
    GBP: "£",
    JPY: "¥",
    CHF: "CHF",
  };

  /**
   * Formate un nombre
   */
  static format(value: number, options?: NumberFormatOptions): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const { decimals, decimalSeparator, thousandSeparator, forceDecimals } =
      opts;

    // Arrondir à la précision demandée
    const rounded = this.round(value, decimals);

    // Séparer partie entière et décimale
    const [int, dec] = rounded.toString().split(".");

    // Formatter la partie entière avec séparateur de milliers
    const formattedInt = int.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandSeparator || " "
    );

    // Gérer la partie décimale
    let formattedDec = dec || "";
    if (forceDecimals && formattedDec.length < (decimals || 2)) {
      formattedDec = formattedDec.padEnd(decimals || 2, "0");
    }

    // Assembler le résultat
    return formattedDec
      ? `${formattedInt}${decimalSeparator}${formattedDec}`
      : formattedInt;
  }

  /**
   * Formate un montant en devise
   */
  static currency(value: number, options?: CurrencyFormatOptions): string {
    const opts = { ...this.DEFAULT_CURRENCY_OPTIONS, ...options };
    const { currency, symbolPosition, symbolSpace } = opts;

    const amount = this.format(value, opts);
    const symbol = currency ? this.CURRENCY_SYMBOLS[currency] || currency : "€";
    const space = symbolSpace ? " " : "";

    return symbolPosition === "before"
      ? `${symbol}${space}${amount}`
      : `${amount}${space}${symbol}`;
  }

  /**
   * Convertit un montant d'une devise à une autre
   */
  static convert(amount: number, options: CurrencyConvertOptions): number {
    const { rate } = options;

    // Si un taux est fourni, l'utiliser directement
    if (rate) {
      return this.round(amount * rate, 2);
    }

    // TODO: Implémenter un service de taux de change
    throw new Error("Taux de change non disponible");
  }

  /**
   * Arrondit un nombre à la précision spécifiée
   */
  static round(value: number, decimals = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  /**
   * Tronque un nombre à la précision spécifiée
   */
  static truncate(value: number, decimals = 2): number {
    const factor = Math.pow(10, decimals);
    return Math.trunc(value * factor) / factor;
  }

  /**
   * Vérifie si une valeur est un nombre
   */
  static isNumber(value: any): boolean {
    return typeof value === "number" && !isNaN(value) && isFinite(value);
  }

  /**
   * Parse une chaîne en nombre
   */
  static parse(value: string, decimalSeparator = ","): number {
    if (!value) return 0;

    // Nettoyer la chaîne
    const cleaned = value
      .replace(/[^0-9-,\.]/g, "") // Garder uniquement chiffres, - et séparateurs
      .replace(decimalSeparator, "."); // Convertir en point décimal

    return Number(cleaned);
  }

  /**
   * Calcule un pourcentage
   */
  static percentage(value: number, total: number, decimals = 0): number {
    if (total === 0) return 0;
    return this.round((value / total) * 100, decimals);
  }
}
