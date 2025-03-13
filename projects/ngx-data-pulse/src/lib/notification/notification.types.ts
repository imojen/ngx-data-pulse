export type NotificationPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationStyle {
  /**
   * Couleur de fond
   */
  background?: string;

  /**
   * Couleur du texte
   */
  color?: string;

  /**
   * Bordure
   */
  border?: string;

  /**
   * Ombre
   */
  boxShadow?: string;

  /**
   * Classes CSS additionnelles
   */
  classes?: string[];
}

export interface NotificationConfig {
  /**
   * Position des notifications
   * @default "top-right"
   */
  position?: NotificationPosition;

  /**
   * Durée d'affichage en ms
   * @default 5000
   */
  duration?: number;

  /**
   * Styles par type de notification
   */
  styles?: {
    [key in NotificationType]?: NotificationStyle;
  };

  /**
   * Animation d'entrée/sortie
   */
  animation?: {
    enter?: string;
    leave?: string;
  };

  /**
   * Icônes par type
   */
  icons?: {
    [key in NotificationType]?: string;
  };

  /**
   * Largeur maximale
   * @default "400px"
   */
  maxWidth?: string;

  /**
   * Espacement entre les notifications
   * @default "10px"
   */
  gap?: string;
}

export interface NotificationOptions {
  /**
   * Type de notification
   * @default "info"
   */
  type?: NotificationType;

  /**
   * Durée d'affichage en ms
   * Si non défini, utilise la durée par défaut
   */
  duration?: number;

  /**
   * Icône personnalisée
   */
  icon?: string;

  /**
   * Style personnalisé
   */
  style?: NotificationStyle;

  /**
   * Possibilité de fermer manuellement
   * @default true
   */
  closable?: boolean;
}

export interface NotificationItem extends NotificationOptions {
  /**
   * ID unique
   */
  id: string;

  /**
   * Contenu HTML
   */
  content: string;

  /**
   * Date de création
   */
  createdAt: number;
}
