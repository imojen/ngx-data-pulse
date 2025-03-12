export * from "./logs.types";
export * from "./logs.service";

import { LogsService } from "./logs.service";
export const logs = new LogsService();
export default logs;
