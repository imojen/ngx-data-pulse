export * from "./date.types";
export * from "./date.service";

import { inject } from "@angular/core";
import { DateService } from "./date.service";

// Fonction d'aide pour injecter le service
export function injectDateService(): DateService {
  return inject(DateService);
}

// Pour la compatibilité avec l'existant
export const date = DateService;
