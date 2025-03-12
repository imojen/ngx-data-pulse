import { Injectable, signal } from "@angular/core";
import {
  ScrollAnimation,
  ScrollConfig,
  ScrollDirection,
  ScrollPosition,
  ScrollState,
  ScrollToOptions,
} from "./scroller.types";

@Injectable({ providedIn: "root" })
export class ScrollerService {
  private config: ScrollConfig = {
    topThreshold: 100,
    bottomThreshold: 100,
    behavior: "smooth",
    debounceDelay: 100,
    offset: { top: 0, left: 0 },
  };

  private lastScrollY = 0;
  private scrollTimer?: number;
  private animatedElements = new Map<Element, ScrollAnimation>();
  private observer?: IntersectionObserver;

  readonly state = signal<ScrollState>({
    position: "top",
    direction: "none",
    y: 0,
    x: 0,
    maxY: 0,
    maxX: 0,
    progress: 0,
    locked: false,
  });

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => this.onScroll());
      window.addEventListener("resize", () => this.updateDimensions());
      this.setupObserver();
      this.updateDimensions();
    }
  }

  /**
   * Configure le service
   */
  configure(config: ScrollConfig): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Scroll vers un élément
   */
  scrollTo(target: string | Element | number, options?: ScrollToOptions): void {
    if (this.state().locked) return;

    if (typeof target === "number") {
      window.scrollTo({
        top: target,
        behavior: options?.behavior || this.config.behavior,
      });
      return;
    }

    const element =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;

    const offsetTop = options?.offsetTop ?? this.config.offset?.top ?? 0;
    const offsetLeft = options?.offsetLeft ?? this.config.offset?.left ?? 0;

    element.scrollIntoView({
      behavior: options?.behavior || this.config.behavior,
      block: options?.block || "start",
      inline: options?.inline || "nearest",
    });

    if (offsetTop || offsetLeft) {
      window.scrollBy({
        top: offsetTop,
        left: offsetLeft,
        behavior: options?.behavior || this.config.behavior,
      });
    }
  }

  /**
   * Verrouille le scroll
   */
  lock(): void {
    if (this.state().locked) return;
    document.body.style.overflow = "hidden";
    this.state.update((state) => ({ ...state, locked: true }));
  }

  /**
   * Déverrouille le scroll
   */
  unlock(): void {
    if (!this.state().locked) return;
    document.body.style.overflow = "";
    this.state.update((state) => ({ ...state, locked: false }));
  }

  /**
   * Ajoute une animation au scroll
   */
  animate(element: Element, animation: ScrollAnimation): void {
    this.animatedElements.set(element, {
      effect: animation.effect,
      threshold: animation.threshold || 0.5,
      delay: animation.delay || 0,
      duration: animation.duration || 500,
      timing: animation.timing || "ease",
      once: animation.once ?? true,
    });

    // Ajout des classes initiales
    element.classList.add("scroll-animated", `scroll-${animation.effect}`);
    this.observer?.observe(element);
  }

  /**
   * Supprime une animation
   */
  removeAnimation(element: Element): void {
    const animation = this.animatedElements.get(element);
    if (!animation) return;

    element.classList.remove(
      "scroll-animated",
      `scroll-${animation.effect}`,
      "scroll-visible"
    );
    this.animatedElements.delete(element);
    this.observer?.unobserve(element);
  }

  /**
   * Gestion du scroll
   */
  private onScroll(): void {
    if (this.scrollTimer) {
      window.clearTimeout(this.scrollTimer);
    }

    this.scrollTimer = window.setTimeout(() => {
      const y = window.scrollY;
      const x = window.scrollX;
      const direction =
        y > this.lastScrollY ? "down" : y < this.lastScrollY ? "up" : "none";
      const maxY =
        Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        ) - window.innerHeight;
      const maxX =
        Math.max(
          document.body.scrollWidth,
          document.body.offsetWidth,
          document.documentElement.clientWidth,
          document.documentElement.scrollWidth,
          document.documentElement.offsetWidth
        ) - window.innerWidth;

      let position: ScrollPosition = "middle";
      if (y <= this.config.topThreshold!) {
        position = "top";
      } else if (y >= maxY - this.config.bottomThreshold!) {
        position = "bottom";
      }

      this.state.set({
        position,
        direction,
        y,
        x,
        maxY,
        maxX,
        progress: Math.round((y / maxY) * 100),
        locked: this.state().locked,
      });

      this.lastScrollY = y;
    }, this.config.debounceDelay);
  }

  /**
   * Met à jour les dimensions
   */
  private updateDimensions(): void {
    this.onScroll();
  }

  /**
   * Configure l'observateur d'intersection
   */
  private setupObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const animation = this.animatedElements.get(entry.target);
          if (!animation) return;

          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.animation = `scroll-${animation.effect} ${animation.duration}ms ${animation.timing} ${animation.delay}ms forwards`;
            element.classList.add("scroll-visible");

            if (animation.once) {
              this.observer?.unobserve(entry.target);
            }
          } else if (!animation.once) {
            entry.target.classList.remove("scroll-visible");
          }
        });
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );
  }
}
