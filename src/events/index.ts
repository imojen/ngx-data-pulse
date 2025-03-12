export * from "./events.types";
export * from "./events.service";

import { EventsService } from "./events.service";
export const events = new EventsService();
export default events;
