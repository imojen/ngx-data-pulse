/**
 * Type d'événement
 */
export type EventType = string;

/**
 * Fonction de callback pour les événements
 */
export type EventCallback<T = unknown> = (data: T) => void;

/**
 * Configuration d'un événement
 */
export interface EventConfig<T = unknown> {
  /**
   * Type d'événement
   */
  type: EventType;

  /**
   * Données initiales
   */
  initialData?: T;

  /**
   * Conserver l'historique des événements
   * @default false
   */
  keepHistory?: boolean;

  /**
   * Taille maximale de l'historique
   * @default 10
   */
  historySize?: number;
}

/**
 * Événement avec son historique
 */
export interface EventWithHistory<T = unknown> {
  /**
   * Données actuelles
   */
  data: T;

  /**
   * Historique des données
   */
  history: T[];

  /**
   * Date de dernière émission
   */
  lastEmitted?: number;
}
