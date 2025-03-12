export * from "./storage.types";
export * from "./storage.service";

import { StorageService } from "./storage.service";
export const storage = StorageService;
export default storage;
