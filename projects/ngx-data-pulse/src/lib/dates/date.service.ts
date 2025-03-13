import {
  DateDiffOptions,
  DateFormat,
  DateFormatOptions,
  RelativeTimeOptions,
} from "./date.types";

/**
 * Service de manipulation des dates
 */
export class DateService {
  private static readonly MONTHS = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  private static readonly DAYS = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];

  /**
   * Parse une date à partir d'une chaîne ou d'un timestamp
   */
  static parse(date: string | number | Date): Date {
    if (date instanceof Date) return date;
    return new Date(date);
  }

  /**
   * Formate une date selon le format spécifié
   */
  static format(
    date: string | number | Date,
    options: DateFormatOptions = {}
  ): string {
    const { format = "short", locale = "fr-FR", capitalize = true } = options;

    const d = this.parse(date);
    let result = "";

    switch (format) {
      case "short":
        result = d.toLocaleDateString(locale);
        break;
      case "medium":
        result = `${d.getDate()} ${
          this.MONTHS[d.getMonth()]
        } ${d.getFullYear()}`;
        break;
      case "long":
        result = `${d.getDate()} ${
          this.MONTHS[d.getMonth()]
        } ${d.getFullYear()} ${this.formatTime(d)}`;
        break;
      case "full":
        result = `${this.DAYS[d.getDay()]} ${d.getDate()} ${
          this.MONTHS[d.getMonth()]
        } ${d.getFullYear()} ${this.formatTime(d, true)}`;
        break;
      case "time":
        result = this.formatTime(d);
        break;
      case "timeWithSeconds":
        result = this.formatTime(d, true);
        break;
      case "dayMonth":
        result = `${d.getDate()} ${this.MONTHS[d.getMonth()]}`;
        break;
      case "monthYear":
        result = `${this.MONTHS[d.getMonth()]} ${d.getFullYear()}`;
        break;
    }

    return capitalize ? this.capitalize(result) : result;
  }

  /**
   * Calcule la différence entre deux dates
   */
  static diff(
    date1: string | number | Date,
    date2: string | number | Date,
    options: DateDiffOptions = {}
  ): number {
    const { unit = "days", round = true, absolute = true } = options;

    const d1 = this.parse(date1);
    const d2 = this.parse(date2);
    const diff = d2.getTime() - d1.getTime();
    let result = 0;

    switch (unit) {
      case "seconds":
        result = diff / 1000;
        break;
      case "minutes":
        result = diff / (1000 * 60);
        break;
      case "hours":
        result = diff / (1000 * 60 * 60);
        break;
      case "days":
        result = diff / (1000 * 60 * 60 * 24);
        break;
      case "months":
        result =
          (d2.getFullYear() - d1.getFullYear()) * 12 +
          d2.getMonth() -
          d1.getMonth();
        break;
      case "years":
        result = d2.getFullYear() - d1.getFullYear();
        break;
    }

    if (round) result = Math.round(result);
    return absolute ? Math.abs(result) : result;
  }

  /**
   * Calcule le temps relatif depuis une date
   */
  static fromNow(
    date: string | number | Date,
    options: RelativeTimeOptions = {}
  ): string {
    const { withSeconds = false, maxUnits = 1, locale = "fr-FR" } = options;

    const now = new Date();
    const d = this.parse(date);
    const diff = now.getTime() - d.getTime();
    const future = diff < 0;
    const absDiff = Math.abs(diff);

    const units: Array<[number, string, number]> = [
      [60, "seconde", 1000],
      [60, "minute", 1000 * 60],
      [24, "heure", 1000 * 60 * 60],
      [30, "jour", 1000 * 60 * 60 * 24],
      [12, "mois", 1000 * 60 * 60 * 24 * 30],
      [Infinity, "an", 1000 * 60 * 60 * 24 * 365],
    ];

    if (!withSeconds) units.shift();

    const parts: string[] = [];
    let remaining = absDiff;

    for (const [limit, unit, divisor] of units) {
      const value = Math.floor(remaining / divisor);
      if (value > 0) {
        const plural = value > 1 ? (unit === "mois" ? "" : "s") : "";
        parts.push(`${value} ${unit}${plural}`);
        remaining %= divisor;
        if (parts.length >= maxUnits) break;
      }
    }

    if (parts.length === 0) return "à l'instant";

    const result = parts.join(" et ");
    return future ? `dans ${result}` : `il y a ${result}`;
  }

  /**
   * Vérifie si une date est aujourd'hui
   */
  static isToday(date: string | number | Date): boolean {
    const d = this.parse(date);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Vérifie si une date est dans le futur
   */
  static isFuture(date: string | number | Date): boolean {
    return this.parse(date).getTime() > Date.now();
  }

  /**
   * Vérifie si une date est dans le passé
   */
  static isPast(date: string | number | Date): boolean {
    return this.parse(date).getTime() < Date.now();
  }

  /**
   * Ajoute une durée à une date
   */
  static add(
    date: string | number | Date,
    amount: number,
    unit: DateDiffOptions["unit"] = "days"
  ): Date {
    const d = this.parse(date);
    const ms = d.getTime();

    switch (unit) {
      case "seconds":
        return new Date(ms + amount * 1000);
      case "minutes":
        return new Date(ms + amount * 1000 * 60);
      case "hours":
        return new Date(ms + amount * 1000 * 60 * 60);
      case "days":
        return new Date(ms + amount * 1000 * 60 * 60 * 24);
      case "months":
        const newMonth = d.getMonth() + amount;
        const newDate = new Date(d);
        newDate.setMonth(newMonth);
        return newDate;
      case "years":
        const newYear = d.getFullYear() + amount;
        const newDateYear = new Date(d);
        newDateYear.setFullYear(newYear);
        return newDateYear;
      default:
        return d;
    }
  }

  /**
   * Soustrait une durée à une date
   */
  static subtract(
    date: string | number | Date,
    amount: number,
    unit: DateDiffOptions["unit"] = "days"
  ): Date {
    return this.add(date, -amount, unit);
  }

  /**
   * Convertit une date française (DD/MM/YYYY) en format ISO
   */
  static frToIso(date: string): string {
    const [day, month, year] = date.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  /**
   * Convertit une date ISO en format français (DD/MM/YYYY)
   */
  static isoToFr(date: string): string {
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  }

  /**
   * Convertit une date US (MM/DD/YYYY) en format français (DD/MM/YYYY)
   */
  static usToFr(date: string): string {
    const [month, day, year] = date.split("/");
    return `${day}/${month}/${year}`;
  }

  /**
   * Convertit une date française (DD/MM/YYYY) en format US (MM/DD/YYYY)
   */
  static frToUs(date: string): string {
    const [day, month, year] = date.split("/");
    return `${month}/${day}/${year}`;
  }

  /**
   * Convertit une date ISO en timestamp
   */
  static isoToTimestamp(date: string): number {
    return new Date(date).getTime();
  }

  /**
   * Convertit un timestamp en date ISO
   */
  static timestampToIso(timestamp: number): string {
    return new Date(timestamp).toISOString().split("T")[0];
  }

  /**
   * Convertit une date française en timestamp
   */
  static frToTimestamp(date: string): number {
    return new Date(this.frToIso(date)).getTime();
  }

  /**
   * Convertit un timestamp en date française
   */
  static timestampToFr(timestamp: number): string {
    return this.format(timestamp, { format: "short" });
  }

  /**
   * Convertit une date en format API (ISO avec timezone)
   */
  static toApiDate(date: string | number | Date): string {
    return this.parse(date).toISOString();
  }

  /**
   * Convertit une date API en format local
   */
  static fromApiDate(date: string): Date {
    return new Date(date);
  }

  private static formatTime(date: Date, withSeconds = false): string {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return withSeconds
      ? `${hours}:${minutes}:${seconds}`
      : `${hours}:${minutes}`;
  }

  private static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
