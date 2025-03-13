export * from "./platform.types";
export * from "./platform.service";

import { PlatformService } from "./platform.service";
export const platform = new PlatformService();
export default platform;
