export * from "./logs.types";
export * from "./logs.service";

import { inject } from "@angular/core";
import { LogsService } from "./logs.service";

// Fonction d'aide pour injecter le service
export function injectLogsService(): LogsService {
  return inject(LogsService);
}

// Pour garder la compatibilité
export const logs = {
  debug: (message: string, ...args: any[]) => {
    const service = injectLogsService();
    service.debug(message, ...args);
  },
  info: (message: string, ...args: any[]) => {
    const service = injectLogsService();
    service.info(message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    const service = injectLogsService();
    service.warn(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    const service = injectLogsService();
    service.error(message, ...args);
  },
};

export default logs;
