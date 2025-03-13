export * from "./notification.types";
export * from "./notification.service";
export * from "./notification.component";

import { NotificationService } from "./notification.service";
export const notif = new NotificationService();
export default notif;
