import { Injectable, signal } from "@angular/core";
import {
  NotificationConfig,
  NotificationItem,
  NotificationOptions,
  NotificationStyle,
  NotificationType,
} from "./notification.types";

/**
 * Service de gestion des notifications
 */
@Injectable({ providedIn: "root" })
export class NotificationService {
  private config: NotificationConfig = {
    position: "top-right",
    duration: 5000,
    maxWidth: "400px",
    gap: "10px",
    styles: {
      success: {
        background: "#4caf50",
        color: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      },
      error: {
        background: "#f44336",
        color: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      },
      warning: {
        background: "#ff9800",
        color: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      },
      info: {
        background: "#2196f3",
        color: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      },
    },
    icons: {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    },
    animation: {
      enter: "fade-in",
      leave: "fade-out",
    },
  };

  private notifications = signal<NotificationItem[]>([]);

  /**
   * Configure le service
   */
  configure(config: NotificationConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Affiche une notification de succès
   */
  success(content: string, options?: NotificationOptions): void {
    this.show(content, { ...options, type: "success" });
  }

  /**
   * Affiche une notification d'erreur
   */
  error(content: string, options?: NotificationOptions): void {
    this.show(content, { ...options, type: "error" });
  }

  /**
   * Affiche une notification d'avertissement
   */
  warning(content: string, options?: NotificationOptions): void {
    this.show(content, { ...options, type: "warning" });
  }

  /**
   * Affiche une notification d'information
   */
  info(content: string, options?: NotificationOptions): void {
    this.show(content, { ...options, type: "info" });
  }

  /**
   * Affiche une notification personnalisée
   */
  show(content: string, options: NotificationOptions = {}): void {
    const notification: NotificationItem = {
      id: crypto.randomUUID(),
      content,
      type: options.type || "info",
      duration: options.duration || this.config.duration,
      icon: options.icon || this.config.icons?.[options.type || "info"],
      style: this.mergeStyles(options.type || "info", options.style),
      closable: options.closable ?? true,
      createdAt: Date.now(),
    };

    this.notifications.update((items) => [...items, notification]);

    if (notification.duration) {
      setTimeout(() => this.remove(notification.id), notification.duration);
    }
  }

  /**
   * Supprime une notification
   */
  remove(id: string): void {
    this.notifications.update((items) =>
      items.filter((item) => item.id !== id)
    );
  }

  /**
   * Supprime toutes les notifications
   */
  clear(): void {
    this.notifications.set([]);
  }

  /**
   * Récupère les notifications actives
   */
  getNotifications() {
    return this.notifications;
  }

  /**
   * Récupère la configuration
   */
  getConfig() {
    return this.config;
  }

  private mergeStyles(
    type: NotificationType,
    custom?: NotificationStyle
  ): NotificationStyle {
    return {
      ...this.config.styles?.[type],
      ...custom,
    };
  }
}
