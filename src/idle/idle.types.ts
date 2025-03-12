export interface IdleAction {
  /**
   * Délai avant déclenchement en ms
   */
  timeout: number;

  /**
   * Action à exécuter
   */
  callback: () => void;

  /**
   * Description de l'action (optionnel)
   */
  description?: string;
}

export interface IdleConfig {
  /**
   * Délai d'inactivité en ms avant déclenchement
   * @default 900000 (15min)
   */
  timeout: number;

  /**
   * Délai d'avertissement en ms avant timeout
   * @default 60000 (1min)
   */
  warningDelay?: number;

  /**
   * Actions à surveiller
   * @default ["mousemove", "keydown", "click", "scroll", "touchstart"]
   */
  events?: string[];

  /**
   * Déconnexion automatique
   * @default true
   */
  autoLogout?: boolean;

  /**
   * Fonction de déconnexion personnalisée
   * Par défaut: window.location.href = "/logout"
   */
  onLogout?: () => void;

  /**
   * Afficher un avertissement
   * @default true
   */
  showWarning?: boolean;

  /**
   * Actions personnalisées à déclencher
   */
  actions?: IdleAction[];
}

export interface IdleState {
  /**
   * État d'inactivité
   */
  isIdle: boolean;

  /**
   * État d'avertissement
   */
  isWarning: boolean;

  /**
   * Temps restant avant déconnexion
   */
  remainingTime: number;

  /**
   * Date de dernière activité
   */
  lastActivity: number;
}
