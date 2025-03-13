export * from "./scroller.types";
export * from "./scroller.service";

import { inject } from "@angular/core";
import { ScrollerService } from "./scroller.service";

// Fonction d'aide pour injecter le service
export function injectScrollerService(): ScrollerService {
  return inject(ScrollerService);
}

export default injectScrollerService;
