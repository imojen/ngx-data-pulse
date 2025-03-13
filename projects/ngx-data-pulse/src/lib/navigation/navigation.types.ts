export interface NavigationGuard {
  /**
   * Vérifie si la navigation est autorisée
   */
  canNavigate: () => boolean | Promise<boolean>;

  /**
   * Message à afficher si la navigation est bloquée
   */
  message?: string;
}

export interface NavigationConfig {
  /**
   * URL de redirection après login
   * @default "/dashboard"
   */
  afterLoginUrl?: string;

  /**
   * URL de redirection après logout
   * @default "/login"
   */
  afterLogoutUrl?: string;

  /**
   * Nombre maximum d'entrées dans l'historique
   * @default 50
   */
  maxHistorySize?: number;

  /**
   * Gardes de navigation globaux
   */
  guards?: NavigationGuard[];
}

export interface NavigationState {
  /**
   * URL actuelle
   */
  currentUrl: string;

  /**
   * URL précédente
   */
  previousUrl?: string;

  /**
   * Historique de navigation
   */
  history: string[];

  /**
   * URL de redirection après login
   */
  redirectUrl?: string;
}

export interface NavigationOptions {
  /**
   * Gardes de navigation spécifiques
   */
  guards?: NavigationGuard[];

  /**
   * Forcer la navigation même si les gardes la bloquent
   */
  force?: boolean;

  /**
   * Remplacer l'entrée actuelle dans l'historique
   */
  replace?: boolean;
}
