export * from "./scroller.types";
export * from "./scroller.service";

import { ScrollerService } from "./scroller.service";
export const scroller = new ScrollerService();
export default scroller;
