export * from "./network.types";
export * from "./network.service";

import { inject } from "@angular/core";
import { NetworkService } from "./network.service";

// Fonction d'aide pour injecter le service
export function injectNetworkService(): NetworkService {
  return inject(NetworkService);
}

export default injectNetworkService;
