import { Injector } from "@angular/core";

/**
 * Singleton pour stocker l'injecteur Angular global
 * Utilisé pour permettre l'utilisation des services en dehors des contextes d'injection
 */
class GlobalInjector {
  private _injector: Injector | null = null;

  set(injector: Injector): void {
    this._injector = injector;
  }

  get(): Injector | null {
    return this._injector;
  }
}

export const injector = new GlobalInjector();
