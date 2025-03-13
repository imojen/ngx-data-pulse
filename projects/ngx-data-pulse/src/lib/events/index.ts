export * from "./events.types";
export * from "./events.service";

import { inject } from "@angular/core";
import { EventsService } from "./events.service";

// Fonction d'aide pour injecter le service
export function injectEventsService(): EventsService {
  return inject(EventsService);
}

export default injectEventsService;
