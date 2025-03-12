export * from "./network.types";
export * from "./network.service";

import { NetworkService } from "./network.service";
export const network = new NetworkService();
