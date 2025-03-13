import { Injectable, signal } from "@angular/core";
import { LogConfig, LogEntry, LogLevel } from "./logs.types";

@Injectable({ providedIn: "root" })
export class LogsService {
  private config: LogConfig = {
    enabled: true,
    minLevel: "debug",
    environment: "development",
  };

  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  readonly history = signal<LogEntry[]>([]);

  /**
   * Configure le service
   */
  configure(config: LogConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Log de debug
   */
  debug(message: string, data?: unknown): void {
    this.log("debug", message, data);
  }

  /**
   * Log d'info
   */
  info(message: string, data?: unknown): void {
    this.log("info", message, data);
  }

  /**
   * Log d'avertissement
   */
  warn(message: string, data?: unknown): void {
    this.log("warn", message, data);
  }

  /**
   * Log d'erreur
   */
  error(message: string, data?: unknown): void {
    this.log("error", message, data);
  }

  /**
   * Vide l'historique des logs
   */
  clear(): void {
    this.history.set([]);
  }

  /**
   * Log générique
   */
  private log(level: LogLevel, message: string, data?: unknown): void {
    if (!this.config.enabled) return;
    if (this.logLevels[level] < this.logLevels[this.config.minLevel!]) return;

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now(),
      tags: this.config.tags,
    };

    // Ajout à l'historique
    this.history.update((entries) => [...entries, entry]);

    // Log console
    this.consoleLog(entry);

    // Envoi au service externe si nécessaire
    if (level === "error" && this.config.externalServiceUrl) {
      this.sendToExternalService(entry);
    }
  }

  /**
   * Log dans la console
   */
  private consoleLog(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

    switch (entry.level) {
      case "debug":
        console.log(prefix, entry.message, entry.data || "");
        break;
      case "info":
        console.info(prefix, entry.message, entry.data || "");
        break;
      case "warn":
        console.warn(prefix, entry.message, entry.data || "");
        break;
      case "error":
        console.error(prefix, entry.message, entry.data || "");
        break;
    }
  }

  /**
   * Envoi au service externe
   */
  private async sendToExternalService(entry: LogEntry): Promise<void> {
    if (!this.config.externalServiceUrl || !this.config.apiKey) return;

    try {
      await fetch(this.config.externalServiceUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          ...entry,
          environment: this.config.environment,
        }),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi au service externe:", error);
    }
  }
}
