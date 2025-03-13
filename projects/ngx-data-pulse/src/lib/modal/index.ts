export * from "./modal.types";
export * from "./modal.service";
export * from "./modal.component";

import { inject, Injector, runInInjectionContext } from "@angular/core";
import { ModalService } from "./modal.service";
import { injector as globalInjector } from "../shared/injector";

// Fonction d'aide pour injecter le service
export function injectModalService(): ModalService {
  return inject(ModalService);
}

// Fonction sécurisée pour obtenir le service dans n'importe quel contexte
function getModalService(): ModalService {
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
    inject(ModalService)
  );
}

// Permet toujours l'utilisation via modal.open()
export const modal = {
  open: (config: any) => {
    const service = getModalService();
    return service.open(config);
  },
  alert: (content: string, config?: any) => {
    const service = getModalService();
    return service.alert(content, config);
  },
  info: (content: string, config?: any) => {
    const service = getModalService();
    return service.info(content, config);
  },
  error: (content: string, config?: any) => {
    const service = getModalService();
    return service.error(content, config);
  },
  showConfirm: (content: string, config?: any) => {
    const service = getModalService();
    return service.showConfirm(content, config);
  },
  close: () => {
    const service = getModalService();
    service.close();
  },
};

export default modal;
