export * from "./loader.types";
export * from "./loader.service";
export * from "./loader.component";

import { LoaderService } from "./loader.service";
export const loader = new LoaderService();
export default loader;
