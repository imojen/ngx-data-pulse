import { Injectable, signal } from "@angular/core";
import {
  BrowserType,
  DeviceInfo,
  DeviceType,
  OSType,
  PlatformConfig,
} from "./platform.types";

@Injectable({ providedIn: "root" })
export class PlatformService {
  private config: PlatformConfig = {
    mobile: 768,
    tablet: 1024,
    autoUpdate: true,
    debounceDelay: 250,
  };

  private resizeTimer?: number;
  readonly info = signal<DeviceInfo>(this.detectDevice());

  constructor() {
    if (typeof window !== "undefined") {
      if (this.config.autoUpdate) {
        window.addEventListener("resize", () => this.onResize());
        window.addEventListener("orientationchange", () => this.update());
      }
    }
  }

  /**
   * Configure le service
   */
  configure(config: PlatformConfig): void {
    this.config = { ...this.config, ...config };
    this.update();
  }

  /**
   * Met à jour les informations
   */
  update(): void {
    this.info.set(this.detectDevice());
  }

  /**
   * Vérifie si l'appareil est mobile
   */
  isMobile(): boolean {
    return this.info().type === "mobile";
  }

  /**
   * Vérifie si l'appareil est une tablette
   */
  isTablet(): boolean {
    return this.info().type === "tablet";
  }

  /**
   * Vérifie si l'appareil est un desktop
   */
  isDesktop(): boolean {
    return this.info().type === "desktop";
  }

  /**
   * Vérifie si l'appareil est iOS
   */
  isIOS(): boolean {
    return this.info().os === "ios";
  }

  /**
   * Vérifie si l'appareil est Android
   */
  isAndroid(): boolean {
    return this.info().os === "android";
  }

  /**
   * Vérifie si l'appareil supporte le touch
   */
  isTouchEnabled(): boolean {
    return this.info().touchEnabled;
  }

  /**
   * Vérifie si l'écran est en mode portrait
   */
  isPortrait(): boolean {
    return this.info().orientation === "portrait";
  }

  /**
   * Vérifie si l'écran est en mode paysage
   */
  isLandscape(): boolean {
    return this.info().orientation === "landscape";
  }

  /**
   * Gestion du resize avec debounce
   */
  private onResize(): void {
    if (this.resizeTimer) {
      window.clearTimeout(this.resizeTimer);
    }

    this.resizeTimer = window.setTimeout(
      () => this.update(),
      this.config.debounceDelay
    );
  }

  /**
   * Détecte les informations de l'appareil
   */
  private detectDevice(): DeviceInfo {
    if (typeof window === "undefined") {
      return this.getDefaultInfo();
    }

    const ua = navigator.userAgent;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    return {
      type: this.getDeviceType(screenWidth),
      os: this.getOS(ua),
      browser: this.getBrowser(ua),
      browserVersion: this.getBrowserVersion(ua),
      screenWidth,
      screenHeight,
      orientation: screenWidth > screenHeight ? "landscape" : "portrait",
      touchEnabled: this.isTouchDevice(),
      pixelRatio: window.devicePixelRatio || 1,
      userAgent: ua,
    };
  }

  /**
   * Détecte le type d'appareil
   */
  private getDeviceType(width: number): DeviceType {
    if (width < this.config.mobile!) return "mobile";
    if (width < this.config.tablet!) return "tablet";
    return "desktop";
  }

  /**
   * Détecte le système d'exploitation
   */
  private getOS(ua: string): OSType {
    if (/iPhone|iPad|iPod/.test(ua)) return "ios";
    if (/Android/.test(ua)) return "android";
    if (/Win/.test(ua)) return "windows";
    if (/Mac/.test(ua)) return "macos";
    if (/Linux/.test(ua)) return "linux";
    return "other";
  }

  /**
   * Détecte le navigateur
   */
  private getBrowser(ua: string): BrowserType {
    if (/Edge|Edg/.test(ua)) return "edge";
    if (/Chrome/.test(ua)) return "chrome";
    if (/Firefox/.test(ua)) return "firefox";
    if (/Safari/.test(ua)) return "safari";
    if (/Opera|OPR/.test(ua)) return "opera";
    return "other";
  }

  /**
   * Détecte la version du navigateur
   */
  private getBrowserVersion(ua: string): string {
    const browser = this.getBrowser(ua);
    const matches: Record<BrowserType, RegExp> = {
      chrome: /Chrome\/([0-9.]+)/,
      firefox: /Firefox\/([0-9.]+)/,
      safari: /Version\/([0-9.]+)/,
      edge: /Edge?\/([0-9.]+)/,
      opera: /OPR\/([0-9.]+)/,
      other: /./,
    };

    const match = matches[browser];
    const version = ua.match(match);
    return version ? version[1] || "" : "";
  }

  /**
   * Vérifie si le device supporte le touch
   */
  private isTouchDevice(): boolean {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Retourne les informations par défaut
   */
  private getDefaultInfo(): DeviceInfo {
    return {
      type: "desktop",
      os: "other",
      browser: "other",
      browserVersion: "",
      screenWidth: 1920,
      screenHeight: 1080,
      orientation: "landscape",
      touchEnabled: false,
      pixelRatio: 1,
      userAgent: "",
    };
  }
}
