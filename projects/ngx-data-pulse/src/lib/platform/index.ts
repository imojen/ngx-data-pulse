export * from "./platform.types";
export * from "./platform.service";

import { inject, Injector, runInInjectionContext } from "@angular/core";
import { PlatformService } from "./platform.service";
import { injector as globalInjector } from "../shared/injector";

// Fonction d'aide pour injecter le service
export function injectPlatformService(): PlatformService {
  return inject(PlatformService);
}

// Fonction sécurisée pour obtenir le service dans n'importe quel contexte
function getPlatformService(): PlatformService {
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
    inject(PlatformService)
  );
}

// Export du service comme singleton pour importation directe
export const platform = {
  configure: (config: any) => {
    const service = getPlatformService();
    service.configure(config);
  },
  update: () => {
    const service = getPlatformService();
    service.update();
  },
  info: () => {
    const service = getPlatformService();
    return service.info;
  },
  isMobile: () => {
    const service = getPlatformService();
    return service.isMobile();
  },
  isTablet: () => {
    const service = getPlatformService();
    return service.isTablet();
  },
  isDesktop: () => {
    const service = getPlatformService();
    return service.isDesktop();
  },
  isIOS: () => {
    const service = getPlatformService();
    return service.isIOS();
  },
  isAndroid: () => {
    const service = getPlatformService();
    return service.isAndroid();
  },
  isTouchEnabled: () => {
    const service = getPlatformService();
    return service.isTouchEnabled();
  },
};

export default platform;
