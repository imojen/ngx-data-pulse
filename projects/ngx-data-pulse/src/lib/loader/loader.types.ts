export type LoaderType = "spinner" | "progress" | "dots" | "pulse" | "custom";
export type LoaderMode = "fullscreen" | "inline" | "block";
export type LoaderPosition = "center" | "top" | "bottom" | "left" | "right";

export interface LoaderAnimation {
  /**
   * Nom de l'animation
   */
  name: string;

  /**
   * Durée en ms
   */
  duration: number;

  /**
   * Type d'animation (CSS)
   */
  timing: string;

  /**
   * Délai avant démarrage
   */
  delay?: number;

  /**
   * Nombre d'itérations
   */
  iterations?: number;
}

export interface LoaderStyle {
  /**
   * Classes CSS personnalisées
   */
  classes?: {
    container?: string;
    overlay?: string;
    loader?: string;
    text?: string;
  };

  /**
   * Couleurs
   */
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };

  /**
   * Taille du loader
   */
  size?: {
    width?: string;
    height?: string;
    thickness?: string;
  };
}

export interface LoaderConfig {
  /**
   * Type de loader
   * @default "spinner"
   */
  type?: LoaderType;

  /**
   * Mode d'affichage
   * @default "fullscreen"
   */
  mode?: LoaderMode;

  /**
   * Position du loader
   * @default "center"
   */
  position?: LoaderPosition;

  /**
   * Texte à afficher
   */
  text?: string;

  /**
   * Styles personnalisés
   */
  style?: LoaderStyle;

  /**
   * Animation personnalisée
   */
  animation?: LoaderAnimation;

  /**
   * Délai avant affichage (ms)
   * @default 200
   */
  delay?: number;

  /**
   * Durée minimale d'affichage (ms)
   * @default 0
   */
  minDuration?: number;

  /**
   * Template HTML personnalisé
   */
  template?: string;

  /**
   * Overlay
   * @default true pour fullscreen, false pour les autres modes
   */
  overlay?: boolean;

  /**
   * Opacité de l'overlay
   * @default 0.5
   */
  overlayOpacity?: number;

  /**
   * Timestamp de début
   * @internal
   */
  startTime?: number;
}

export interface LoaderState {
  /**
   * État d'affichage
   */
  visible: boolean;

  /**
   * Configuration actuelle
   */
  config: LoaderConfig;

  /**
   * Timestamp de début
   */
  startTime?: number;
}

export interface LoaderInstance {
  /**
   * ID unique
   */
  id: string;

  /**
   * État du loader
   */
  state: LoaderState;
}
