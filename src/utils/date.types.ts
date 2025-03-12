/**
 * Format de date disponibles
 */
export type DateFormat =
  | "short" // 01/01/2024
  | "medium" // 1 janvier 2024
  | "long" // 1 janvier 2024 14:30
  | "full" // mardi 1 janvier 2024 14:30:00
  | "time" // 14:30
  | "timeWithSeconds" // 14:30:00
  | "dayMonth" // 1 janvier
  | "monthYear"; // janvier 2024

/**
 * Options de formatage
 */
export interface DateFormatOptions {
  /**
   * Format de date
   * @default "short"
   */
  format?: DateFormat;

  /**
   * Locale
   * @default "fr-FR"
   */
  locale?: string;

  /**
   * Capitaliser la première lettre
   * @default true
   */
  capitalize?: boolean;
}

/**
 * Options pour le calcul de différence
 */
export interface DateDiffOptions {
  /**
   * Unité de temps pour le résultat
   * @default "days"
   */
  unit?: "seconds" | "minutes" | "hours" | "days" | "months" | "years";

  /**
   * Arrondir le résultat
   * @default true
   */
  round?: boolean;

  /**
   * Valeur absolue
   * @default true
   */
  absolute?: boolean;
}

/**
 * Options pour le calcul de temps relatif
 */
export interface RelativeTimeOptions {
  /**
   * Afficher les secondes
   * @default false
   */
  withSeconds?: boolean;

  /**
   * Nombre maximum d'unités à afficher
   * @default 1
   */
  maxUnits?: number;

  /**
   * Locale
   * @default "fr-FR"
   */
  locale?: string;
}
