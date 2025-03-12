import { Injectable, signal } from "@angular/core";
import { NetworkConfig, NetworkState, NetworkStatus } from "./network.types";
import { events } from "../events";

@Injectable({ providedIn: "root" })
export class NetworkService {
  private config: NetworkConfig = {
    checkInterval: 30000,
    testUrl: "https://www.google.com/favicon.ico",
    timeout: 5000,
  };

  private checkTimer?: number;
  private networkEvent = events.create<NetworkState>({
    type: "NETWORK_STATUS",
  });

  readonly state = signal<NetworkState>({
    status: "online",
    lastChange: Date.now(),
  });

  constructor() {
    // Écoute des événements natifs
    window.addEventListener("online", () => this.updateStatus("online"));
    window.addEventListener("offline", () => this.updateStatus("offline"));

    // Démarrage de la vérification
    this.startChecking();
  }

  /**
   * Configure le service
   */
  configure(config: Partial<NetworkConfig>): void {
    this.config = { ...this.config, ...config };
    this.startChecking();
  }

  /**
   * Vérifie la connexion manuellement
   */
  async check(): Promise<boolean> {
    try {
      const start = Date.now();
      const response = await fetch(this.config.testUrl!, {
        mode: "no-cors",
        cache: "no-cache",
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (response.type === "opaque") {
        const latency = Date.now() - start;
        this.updateStatus("online", latency);
        return true;
      }

      this.updateStatus("offline");
      return false;
    } catch {
      this.updateStatus("offline");
      return false;
    }
  }

  /**
   * Démarre la vérification périodique
   */
  private startChecking(): void {
    if (this.checkTimer) {
      window.clearInterval(this.checkTimer);
    }

    this.check();
    this.checkTimer = window.setInterval(
      () => this.check(),
      this.config.checkInterval
    );
  }

  /**
   * Met à jour le statut
   */
  private updateStatus(status: NetworkStatus, latency?: number): void {
    const current = this.state();
    if (current.status !== status) {
      const state: NetworkState = {
        status,
        lastChange: Date.now(),
        latency,
      };

      this.state.set(state);
      this.networkEvent.emit(state);
    }
  }
}
