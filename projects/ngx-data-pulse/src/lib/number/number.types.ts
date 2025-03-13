/**
 * Options de formatage des nombres
 */
export interface NumberFormatOptions {
  /**
   * Nombre de décimales
   * @default 2
   */
  decimals?: number;

  /**
   * Séparateur décimal
   * @default ","
   */
  decimalSeparator?: string;

  /**
   * Séparateur des milliers
   * @default " "
   */
  thousandSeparator?: string;

  /**
   * Forcer l'affichage des décimales même si 0
   * @default false
   */
  forceDecimals?: boolean;
}

/**
 * Options de formatage des devises
 */
export interface CurrencyFormatOptions extends NumberFormatOptions {
  /**
   * Code de la devise
   * @default "EUR"
   */
  currency?: string;

  /**
   * Position du symbole
   * @default "after"
   */
  symbolPosition?: "before" | "after";

  /**
   * Espace entre le montant et le symbole
   * @default true
   */
  symbolSpace?: boolean;
}

/**
 * Options de conversion des devises
 */
export interface CurrencyConvertOptions {
  /**
   * Devise source
   */
  from: string;

  /**
   * Devise cible
   */
  to: string;

  /**
   * Taux de change personnalisé
   * @optional
   */
  rate?: number;
}
