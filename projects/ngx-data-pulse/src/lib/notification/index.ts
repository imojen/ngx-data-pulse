export * from "./notification.types";
export * from "./notification.service";
export * from "./notification.component";

import { inject, Injector, runInInjectionContext } from "@angular/core";
import { NotificationService } from "./notification.service";
import { injector as globalInjector } from "../shared/injector";

// Fonction d'aide pour injecter le service
export function injectNotificationService(): NotificationService {
  return inject(NotificationService);
}

// Fonction sécurisée pour obtenir le service dans n'importe quel contexte
function getNotificationService(): NotificationService {
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
    inject(NotificationService)
  );
}

// Pour garder la compatibilité
export const notif = {
  success: (content: string, config?: any) => {
    const service = getNotificationService();
    return service.success(content, config);
  },
  info: (content: string, config?: any) => {
    const service = getNotificationService();
    return service.info(content, config);
  },
  warning: (content: string, config?: any) => {
    const service = getNotificationService();
    return service.warning(content, config);
  },
  error: (content: string, config?: any) => {
    const service = getNotificationService();
    return service.error(content, config);
  },
  show: (config: any) => {
    const service = getNotificationService();
    return service.show(config);
  },
  remove: (id: string) => {
    const service = getNotificationService();
    service.remove(id);
  },
  clear: () => {
    const service = getNotificationService();
    service.clear();
  },
};

export default notif;
