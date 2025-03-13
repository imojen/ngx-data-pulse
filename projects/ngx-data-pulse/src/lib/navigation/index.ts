export * from "./navigation.types";
export * from "./navigation.service";

import { NavigationService } from "./navigation.service";
export const navigation = new NavigationService();
export default navigation;
