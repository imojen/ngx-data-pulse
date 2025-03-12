export type DeviceType = "mobile" | "tablet" | "desktop";
export type OSType =
  | "ios"
  | "android"
  | "windows"
  | "macos"
  | "linux"
  | "other";
export type BrowserType =
  | "chrome"
  | "firefox"
  | "safari"
  | "edge"
  | "opera"
  | "other";

export interface DeviceInfo {
  /**
   * Type d'appareil
   */
  type: DeviceType;

  /**
   * Système d'exploitation
   */
  os: OSType;

  /**
   * Navigateur
   */
  browser: BrowserType;

  /**
   * Version du navigateur
   */
  browserVersion: string;

  /**
   * Largeur de l'écran
   */
  screenWidth: number;

  /**
   * Hauteur de l'écran
   */
  screenHeight: number;

  /**
   * Orientation de l'écran
   */
  orientation: "portrait" | "landscape";

  /**
   * Support du touch
   */
  touchEnabled: boolean;

  /**
   * Densité de pixels
   */
  pixelRatio: number;

  /**
   * User Agent
   */
  userAgent: string;
}

export interface BreakpointConfig {
  /**
   * Breakpoint mobile
   * @default 768
   */
  mobile?: number;

  /**
   * Breakpoint tablette
   * @default 1024
   */
  tablet?: number;
}

export interface PlatformConfig extends BreakpointConfig {
  /**
   * Mettre à jour automatiquement sur le resize
   * @default true
   */
  autoUpdate?: boolean;

  /**
   * Délai de debounce pour le resize (ms)
   * @default 250
   */
  debounceDelay?: number;
}
