import { Injectable, inject, signal } from "@angular/core";
import { Location } from "@angular/common";
import { Router, Event, NavigationEnd } from "@angular/router";
import { modal } from "../modal";
import {
  NavigationConfig,
  NavigationGuard,
  NavigationOptions,
  NavigationState,
} from "./navigation.types";

@Injectable({ providedIn: "root" })
export class NavigationService {
  private config: NavigationConfig = {
    afterLoginUrl: "/dashboard",
    afterLogoutUrl: "/login",
    maxHistorySize: 50,
    guards: [],
  };

  private router = inject(Router);
  private location = inject(Location);

  readonly state = signal<NavigationState>({
    currentUrl: "/",
    history: [],
  });

  constructor() {
    // Écoute des changements de route
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        const previousUrl = this.state().currentUrl;

        if (currentUrl !== previousUrl) {
          this.updateState(currentUrl, previousUrl);
        }
      }
    });
  }

  /**
   * Configure le service
   */
  configure(config: NavigationConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Navigue vers une URL
   */
  async navigate(
    url: string,
    options: NavigationOptions = {}
  ): Promise<boolean> {
    // Vérification des gardes
    if (!options.force) {
      const guards = [...(this.config.guards || []), ...(options.guards || [])];
      const canNavigate = await this.checkGuards(guards);
      if (!canNavigate) return false;
    }

    // Navigation
    if (options.replace) {
      return this.router.navigateByUrl(url, { replaceUrl: true });
    }
    return this.router.navigateByUrl(url);
  }

  /**
   * Retourne à l'URL précédente
   */
  async back(options: NavigationOptions = {}): Promise<void> {
    const previousUrl = this.state().previousUrl;
    if (previousUrl) {
      await this.navigate(previousUrl, options);
    } else {
      this.location.back();
    }
  }

  /**
   * Avance dans l'historique
   */
  forward(): void {
    this.location.forward();
  }

  /**
   * Enregistre l'URL de redirection pour après le login
   */
  saveRedirectUrl(url?: string): void {
    this.state.update((state) => ({
      ...state,
      redirectUrl: url || state.currentUrl,
    }));
  }

  /**
   * Redirige après le login
   */
  async redirectAfterLogin(options: NavigationOptions = {}): Promise<boolean> {
    const redirectUrl = this.state().redirectUrl || this.config.afterLoginUrl;
    this.state.update((state) => ({ ...state, redirectUrl: undefined }));
    return this.navigate(redirectUrl!, options);
  }

  /**
   * Redirige après le logout
   */
  async redirectAfterLogout(options: NavigationOptions = {}): Promise<boolean> {
    return this.navigate(this.config.afterLogoutUrl!, {
      ...options,
      replace: true,
    });
  }

  /**
   * Ajoute un garde de navigation global
   */
  addGuard(guard: NavigationGuard): void {
    this.config.guards = [...(this.config.guards || []), guard];
  }

  /**
   * Supprime un garde de navigation global
   */
  removeGuard(guard: NavigationGuard): void {
    this.config.guards = this.config.guards?.filter((g) => g !== guard);
  }

  /**
   * Met à jour l'état
   */
  private updateState(currentUrl: string, previousUrl: string): void {
    this.state.update((state) => {
      const history = [...state.history, currentUrl].slice(
        -this.config.maxHistorySize!
      );

      return {
        ...state,
        currentUrl,
        previousUrl,
        history,
      };
    });
  }

  /**
   * Vérifie les gardes de navigation
   */
  private async checkGuards(guards: NavigationGuard[]): Promise<boolean> {
    for (const guard of guards) {
      const canNavigate = await Promise.resolve(guard.canNavigate());
      if (!canNavigate) {
        if (guard.message) {
          await new Promise<void>((resolve) => {
            modal.open({
              type: "confirm",
              title: "Navigation bloquée",
              content: guard.message!,
              onConfirm: () => resolve(),
              onCancel: () => resolve(),
            });
          });
        }
        return false;
      }
    }
    return true;
  }
}
