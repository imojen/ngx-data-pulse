import { Injectable, signal } from "@angular/core";
import { LoaderConfig, LoaderInstance, LoaderState } from "./loader.types";

@Injectable({ providedIn: "root" })
export class LoaderService {
  private defaultConfig: LoaderConfig = {
    type: "spinner",
    mode: "fullscreen",
    position: "center",
    delay: 200,
    minDuration: 0,
    overlay: true,
    overlayOpacity: 0.5,
    style: {
      colors: {
        primary: "#2196f3",
        secondary: "#bbdefb",
        background: "#ffffff",
        text: "#000000",
      },
      size: {
        width: "48px",
        height: "48px",
        thickness: "4px",
      },
    },
    animation: {
      name: "rotate",
      duration: 1000,
      timing: "linear",
      iterations: Infinity,
    },
  };

  private instances = new Map<string, LoaderInstance>();
  readonly state = signal<LoaderInstance[]>([]);

  /**
   * Configure le service
   */
  configure(config: LoaderConfig): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Affiche un loader
   */
  show(config: LoaderConfig = {}): string {
    const id = crypto.randomUUID();
    const finalConfig = this.mergeConfig(config);
    const instance: LoaderInstance = {
      id,
      state: {
        visible: true,
        config: finalConfig,
        startTime: Date.now(),
      },
    };

    // Gestion du délai d'affichage
    if (finalConfig.delay && finalConfig.delay > 0) {
      setTimeout(() => {
        this.updateInstance(instance);
      }, finalConfig.delay);
    } else {
      this.updateInstance(instance);
    }

    return id;
  }

  /**
   * Cache un loader
   */
  hide(id: string): void {
    const instance = this.instances.get(id);
    if (!instance) return;

    const { minDuration, startTime } = instance.state.config;
    const elapsed = Date.now() - (startTime || 0);

    if (minDuration && elapsed < minDuration) {
      setTimeout(() => {
        this.removeInstance(id);
      }, minDuration - elapsed);
    } else {
      this.removeInstance(id);
    }
  }

  /**
   * Cache tous les loaders
   */
  hideAll(): void {
    this.instances.forEach((_, id) => this.hide(id));
  }

  /**
   * Vérifie si un loader est visible
   */
  isVisible(id: string): boolean {
    return this.instances.get(id)?.state.visible || false;
  }

  /**
   * Récupère un loader par son ID
   */
  getInstance(id: string): LoaderInstance | undefined {
    return this.instances.get(id);
  }

  /**
   * Met à jour la configuration d'un loader
   */
  updateConfig(id: string, config: Partial<LoaderConfig>): void {
    const instance = this.instances.get(id);
    if (!instance) return;

    instance.state.config = this.mergeConfig(config, instance.state.config);
    this.updateInstance(instance);
  }

  /**
   * Fusionne les configurations
   */
  private mergeConfig(
    config: Partial<LoaderConfig>,
    baseConfig: LoaderConfig = this.defaultConfig
  ): LoaderConfig {
    const mergedConfig = {
      ...baseConfig,
      ...config,
      style: {
        ...baseConfig.style,
        ...config.style,
        colors: {
          ...baseConfig.style?.colors,
          ...config.style?.colors,
        },
        size: {
          ...baseConfig.style?.size,
          ...config.style?.size,
        },
        classes: {
          ...baseConfig.style?.classes,
          ...config.style?.classes,
        },
      },
      animation: config.animation || baseConfig.animation,
    };

    // S'assurer que l'animation a toutes les propriétés requises
    if (mergedConfig.animation) {
      mergedConfig.animation = {
        name: mergedConfig.animation.name || "rotate",
        duration: mergedConfig.animation.duration || 1000,
        timing: mergedConfig.animation.timing || "linear",
        delay: mergedConfig.animation.delay,
        iterations: mergedConfig.animation.iterations,
      };
    }

    return mergedConfig;
  }

  /**
   * Met à jour une instance
   */
  private updateInstance(instance: LoaderInstance): void {
    this.instances.set(instance.id, instance);
    this.updateState();
  }

  /**
   * Supprime une instance
   */
  private removeInstance(id: string): void {
    this.instances.delete(id);
    this.updateState();
  }

  /**
   * Met à jour l'état global
   */
  private updateState(): void {
    this.state.set(Array.from(this.instances.values()));
  }
}
