export type NetworkStatus = "online" | "offline";

export interface NetworkConfig {
  /**
   * Délai de vérification en ms
   * @default 30000 (30s)
   */
  checkInterval?: number;

  /**
   * URL de test de connexion
   * @default "https://www.google.com/favicon.ico"
   */
  testUrl?: string;

  /**
   * Timeout des requêtes en ms
   * @default 5000 (5s)
   */
  timeout?: number;
}

export interface NetworkState {
  /**
   * État de la connexion
   */
  status: NetworkStatus;

  /**
   * Date du dernier changement
   */
  lastChange: number;

  /**
   * Latence en ms
   */
  latency?: number;
}
