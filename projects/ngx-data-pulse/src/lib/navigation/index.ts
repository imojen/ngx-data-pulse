export * from "./navigation.types";
export * from "./navigation.service";

import { inject } from "@angular/core";
import { NavigationService } from "./navigation.service";

// Fonction d'aide pour injecter le service dans des contextes non-injectables
export function injectNavigationService(): NavigationService {
  return inject(NavigationService);
}

export default injectNavigationService;
