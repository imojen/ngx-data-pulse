export * from "./idle.types";
export * from "./idle.service";

import { inject } from "@angular/core";
import { IdleService } from "./idle.service";

// Fonction d'aide pour injecter le service
export function injectIdleService(): IdleService {
  return inject(IdleService);
}

export default injectIdleService;
