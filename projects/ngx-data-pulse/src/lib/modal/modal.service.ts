import { Injectable, signal } from "@angular/core";
import {
  ModalConfig,
  ModalGlobalConfig,
  ModalState,
  ModalClasses,
} from "./modal.types";

@Injectable({ providedIn: "root" })
export class ModalService {
  private defaultConfig: ModalGlobalConfig = {
    defaultStyles: true,
    closeOnOverlay: true,
    closeOnEscape: true,
    showClose: true,
    buttons: {
      close: "Fermer",
      confirm: "Confirmer",
      cancel: "Annuler",
    },
    animation: {
      enter: "fade-in",
      leave: "fade-out",
    },
    classes: {
      default: {},
      info: {},
      alert: {},
      error: {},
      confirm: {},
    },
  };

  readonly state = signal<ModalState>({
    isOpen: false,
  });

  constructor() {
    // Gestion de la touche Escape
    window.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.state().isOpen &&
        this.state().config?.closeOnEscape
      ) {
        this.close();
      }
    });
  }

  /**
   * Configure le service
   */
  configure(config: ModalGlobalConfig): void {
    this.defaultConfig = {
      ...this.defaultConfig,
      ...config,
      classes: {
        default: {
          ...this.defaultConfig.classes?.default,
          ...config.classes?.default,
        },
        info: { ...this.defaultConfig.classes?.info, ...config.classes?.info },
        alert: {
          ...this.defaultConfig.classes?.alert,
          ...config.classes?.alert,
        },
        error: {
          ...this.defaultConfig.classes?.error,
          ...config.classes?.error,
        },
        confirm: {
          ...this.defaultConfig.classes?.confirm,
          ...config.classes?.confirm,
        },
      },
    };
  }

  /**
   * Récupère les classes CSS pour un type de modal
   */
  private getClassesForType(
    type: string,
    customClasses?: ModalClasses
  ): ModalClasses {
    return {
      ...this.defaultConfig.classes?.default,
      ...this.defaultConfig.classes?.[
        type as keyof typeof this.defaultConfig.classes
      ],
      ...customClasses,
    };
  }

  /**
   * Ouvre une modal d'alerte
   */
  alert(content: string, config?: Partial<ModalConfig>): void {
    this.open({
      ...config,
      type: "alert",
      content,
      closeOnOverlay: false,
      classes: this.getClassesForType("alert", config?.classes),
    });
  }

  /**
   * Ouvre une modal d'information
   */
  info(content: string, config?: Partial<ModalConfig>): void {
    this.open({
      ...config,
      type: "info",
      content,
      classes: this.getClassesForType("info", config?.classes),
    });
  }

  /**
   * Ouvre une modal d'erreur
   */
  error(content: string, config?: Partial<ModalConfig>): void {
    this.open({
      ...config,
      type: "error",
      content,
      closeOnOverlay: false,
      classes: this.getClassesForType("error", config?.classes),
    });
  }

  /**
   * Ouvre une modal de confirmation
   */
  confirm(content: string, config?: Partial<ModalConfig>): void {
    this.open({
      ...config,
      type: "confirm",
      content,
      closeOnOverlay: false,
      classes: this.getClassesForType("confirm", config?.classes),
    });
  }

  /**
   * Ouvre une modal personnalisée
   */
  open(config: ModalConfig): void {
    const finalConfig = {
      ...this.defaultConfig,
      ...config,
      classes: this.getClassesForType(config.type || "info", config.classes),
    };

    this.state.set({
      isOpen: true,
      config: finalConfig,
    });
    finalConfig.onOpen?.();
  }

  /**
   * Ferme la modal
   */
  close(): void {
    const config = this.state().config;
    this.state.set({
      isOpen: false,
      config: undefined,
    });
    config?.onClose?.();
  }

  /**
   * Confirme la modal
   */
  confirmModal(): void {
    const config = this.state().config;
    this.close();
    config?.onConfirm?.();
  }

  /**
   * Annule la modal
   */
  cancel(): void {
    const config = this.state().config;
    this.close();
    config?.onCancel?.();
  }

  public showConfirm(): void {
    this.confirm();
  }
}
