export * from "./seo.types";
export * from "./seo.service";

import { Injectable, inject } from "@angular/core";
import { SeoService } from "./seo.service";

// Fonction d'aide pour injecter le service dans des contextes non-injectables
export function injectSeoService(): SeoService {
  return inject(SeoService);
}
