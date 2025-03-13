export * from "./loader.types";
export * from "./loader.service";
export * from "./loader.component";

import { inject, Injector, runInInjectionContext } from "@angular/core";
import { LoaderService } from "./loader.service";
import { injector as globalInjector } from "../shared/injector";

// Fonction d'aide pour injecter le service
export function injectLoaderService(): LoaderService {
  return inject(LoaderService);
}

// Fonction sécurisée pour obtenir le service dans n'importe quel contexte
function getLoaderService(): LoaderService {
  if (!globalInjector.get()) {
    try {
      // Essayer d'obtenir l'injecteur s'il n'est pas encore défini
      globalInjector.set(inject(Injector));
    } catch (error) {
      throw new Error(
        "L'injecteur n'est pas disponible. Assurez-vous d'appeler provideNgxDataPulse() dans votre application."
      );
    }
  }

  // Exécuter dans un contexte d'injection
  return runInInjectionContext(globalInjector.get()!, () =>
    inject(LoaderService)
  );
}

// Pour garder la compatibilité
export const loader = {
  show: (config?: any) => {
    const service = getLoaderService();
    return service.show(config);
  },
  hide: (id?: string) => {
    const service = getLoaderService();
    if (id) {
      service.hide(id);
    } else {
      service.hideAll();
    }
  },
  hideAll: () => {
    const service = getLoaderService();
    service.hideAll();
  },
};

export default loader;
