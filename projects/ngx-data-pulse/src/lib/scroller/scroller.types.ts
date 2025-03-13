export type ScrollDirection = "up" | "down" | "none";
export type ScrollPosition = "top" | "bottom" | "middle";
export type ScrollEffect =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom";

export interface ScrollConfig {
  /**
   * Seuil pour détecter le haut de page
   * @default 100
   */
  topThreshold?: number;

  /**
   * Seuil pour détecter le bas de page
   * @default 100
   */
  bottomThreshold?: number;

  /**
   * Comportement du scroll
   * @default "smooth"
   */
  behavior?: ScrollBehavior;

  /**
   * Délai de debounce en ms
   * @default 100
   */
  debounceDelay?: number;

  /**
   * Offset pour le scroll vers un élément
   */
  offset?: {
    top?: number;
    left?: number;
  };
}

export interface ScrollState {
  /**
   * Position actuelle
   */
  position: ScrollPosition;

  /**
   * Direction du scroll
   */
  direction: ScrollDirection;

  /**
   * Position Y
   */
  y: number;

  /**
   * Position X
   */
  x: number;

  /**
   * Hauteur totale
   */
  maxY: number;

  /**
   * Largeur totale
   */
  maxX: number;

  /**
   * Pourcentage de scroll (0-100)
   */
  progress: number;

  /**
   * Scroll verrouillé
   */
  locked: boolean;
}

export interface ScrollToOptions extends ScrollIntoViewOptions {
  /**
   * Offset par rapport au haut
   */
  offsetTop?: number;

  /**
   * Offset par rapport à la gauche
   */
  offsetLeft?: number;
}

export interface ScrollAnimation {
  /**
   * Type d'effet
   */
  effect: ScrollEffect;

  /**
   * Seuil de déclenchement (0-1)
   * @default 0.5
   */
  threshold?: number;

  /**
   * Délai avant animation (ms)
   */
  delay?: number;

  /**
   * Durée de l'animation (ms)
   * @default 500
   */
  duration?: number;

  /**
   * Timing de l'animation
   * @default "ease"
   */
  timing?: string;

  /**
   * Une seule fois
   * @default true
   */
  once?: boolean;
}
