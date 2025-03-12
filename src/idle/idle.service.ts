import { Injectable, signal } from "@angular/core";
import { IdleConfig, IdleState } from "./idle.types";
import { events } from "../events";
import { notif } from "../notification";

@Injectable({ providedIn: "root" })
export class IdleService {
  private config: IdleConfig = {
    timeout: 900000, // 15min
    warningDelay: 60000, // 1min
    events: ["mousemove", "keydown", "click", "scroll", "touchstart"],
    autoLogout: true,
    showWarning: true,
  };

  private idleTimer?: number;
  private warningTimer?: number;
  private idleEvent = events.create<IdleState>({ type: "IDLE_STATUS" });

  readonly state = signal<IdleState>({
    isIdle: false,
    isWarning: false,
    remainingTime: this.config.timeout,
    lastActivity: Date.now(),
  });

  constructor() {
    this.start();
  }

  /**
   * Configure le service
   */
  configure(config: Partial<IdleConfig>): void {
    this.config = { ...this.config, ...config };
    this.restart();
  }

  /**
   * Démarre la détection
   */
  start(): void {
    // Écoute des événements d'activité
    this.config.events?.forEach((event) => {
      window.addEventListener(event, () => this.resetTimer());
    });

    // Démarrage du timer
    this.resetTimer();
  }

  /**
   * Arrête la détection
   */
  stop(): void {
    // Suppression des écouteurs
    this.config.events?.forEach((event) => {
      window.removeEventListener(event, () => this.resetTimer());
    });

    // Arrêt des timers
    if (this.idleTimer) {
      window.clearTimeout(this.idleTimer);
    }
    if (this.warningTimer) {
      window.clearTimeout(this.warningTimer);
    }
  }

  /**
   * Redémarre la détection
   */
  restart(): void {
    this.stop();
    this.start();
  }

  /**
   * Réinitialise le timer
   */
  private resetTimer(): void {
    const now = Date.now();

    // Mise à jour de l'état
    this.state.set({
      isIdle: false,
      isWarning: false,
      remainingTime: this.config.timeout,
      lastActivity: now,
    });

    // Émission de l'événement
    this.idleEvent.emit(this.state());

    // Réinitialisation des timers
    if (this.idleTimer) {
      window.clearTimeout(this.idleTimer);
    }
    if (this.warningTimer) {
      window.clearTimeout(this.warningTimer);
    }

    // Timer d'avertissement
    if (this.config.showWarning && this.config.warningDelay) {
      const warningTime = this.config.timeout - this.config.warningDelay;
      this.warningTimer = window.setTimeout(() => {
        this.state.update((state) => ({
          ...state,
          isWarning: true,
          remainingTime: this.config.warningDelay!,
        }));

        // Émission de l'événement
        this.idleEvent.emit(this.state());

        // Affichage de l'avertissement
        notif.warning(
          `Déconnexion dans ${Math.round(this.config.warningDelay! / 1000)}s...`
        );
      }, warningTime);
    }

    // Timer d'inactivité
    this.idleTimer = window.setTimeout(() => {
      this.state.update((state) => ({
        ...state,
        isIdle: true,
        remainingTime: 0,
      }));

      // Émission de l'événement
      this.idleEvent.emit(this.state());

      // Déconnexion automatique
      if (this.config.autoLogout) {
        window.location.href = "/logout";
      }
    }, this.config.timeout);
  }
}
