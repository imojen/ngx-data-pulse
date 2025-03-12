export type ModalType = "alert" | "info" | "error" | "confirm";

export interface ModalClasses {
  container?: string;
  overlay?: string;
  modal?: string;
  header?: string;
  body?: string;
  footer?: string;
  closeButton?: string;
  actionButton?: string;
}

export interface ModalConfig {
  /**
   * Type de modal
   * @default "info"
   */
  type?: ModalType;

  /**
   * Titre de la modal
   */
  title?: string;

  /**
   * Contenu HTML
   */
  content: string;

  /**
   * Classes CSS personnalisées
   */
  classes?: ModalClasses;

  /**
   * Styles par défaut
   * @default true
   */
  defaultStyles?: boolean;

  /**
   * Fermeture au clic sur l'overlay
   * @default true
   */
  closeOnOverlay?: boolean;

  /**
   * Fermeture avec la touche Escape
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Afficher le bouton de fermeture
   * @default true
   */
  showClose?: boolean;

  /**
   * Texte des boutons
   */
  buttons?: {
    close?: string;
    confirm?: string;
    cancel?: string;
  };

  /**
   * Callback après ouverture
   */
  onOpen?: () => void;

  /**
   * Callback après fermeture
   */
  onClose?: () => void;

  /**
   * Callback après confirmation
   */
  onConfirm?: () => void;

  /**
   * Callback après annulation
   */
  onCancel?: () => void;

  /**
   * Animation d'entrée/sortie
   */
  animation?: {
    enter?: string;
    leave?: string;
  };
}

export interface ModalGlobalConfig
  extends Omit<Partial<ModalConfig>, "content" | "type" | "classes"> {
  /**
   * Classes CSS par type de modal
   */
  classes?: {
    default?: ModalClasses;
    info?: ModalClasses;
    alert?: ModalClasses;
    error?: ModalClasses;
    confirm?: ModalClasses;
  };
}

export interface ModalState {
  isOpen: boolean;
  config?: ModalConfig;
}
