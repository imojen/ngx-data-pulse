export * from "./modal.types";
export * from "./modal.service";
export * from "./modal.component";

import { ModalService } from "./modal.service";
export const modal = new ModalService();
export default modal;
