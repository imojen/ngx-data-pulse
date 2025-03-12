export * from "./seo.types";
export * from "./seo.service";

import { SeoService } from "./seo.service";
export const seo = new SeoService();
