export * from "./platform.types";
export * from "./platform.service";

import { inject } from "@angular/core";
import { PlatformService } from "./platform.service";

// Fonction d'aide pour injecter le service
export function injectPlatformService(): PlatformService {
  return inject(PlatformService);
}

export default injectPlatformService;
