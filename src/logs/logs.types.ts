export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogConfig {
  /**
   * Activer/désactiver les logs
   * @default true
   */
  enabled?: boolean;

  /**
   * Niveau minimum des logs
   * @default "debug"
   */
  minLevel?: LogLevel;

  /**
   * URL du service externe (Sentry, Datadog...)
   */
  externalServiceUrl?: string;

  /**
   * Clé d'API du service externe
   */
  apiKey?: string;

  /**
   * Environnement (dev, prod...)
   * @default "development"
   */
  environment?: string;

  /**
   * Tags additionnels
   */
  tags?: Record<string, string>;
}

export interface LogEntry {
  /**
   * Niveau de log
   */
  level: LogLevel;

  /**
   * Message
   */
  message: string;

  /**
   * Données additionnelles
   */
  data?: unknown;

  /**
   * Timestamp
   */
  timestamp: number;

  /**
   * Tags
   */
  tags?: Record<string, string>;
}
