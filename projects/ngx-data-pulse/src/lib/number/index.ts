export * from "./number.types";
export * from "./number.service";

import { inject } from "@angular/core";
import { NumberService } from "./number.service";

// Fonction d'aide pour injecter le service
export function injectNumberService(): NumberService {
  return inject(NumberService);
}

// Pour la compatibilité avec l'existant
export const num = NumberService;
