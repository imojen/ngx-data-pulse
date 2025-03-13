import { Component, computed, inject } from "@angular/core";
import { LoaderService } from "./loader.service";
import { LoaderInstance, LoaderType } from "./loader.types";

@Component({
  selector: "ngx-loader",
  standalone: true,
  template: `
    @for (loader of loaders(); track loader.id) {
    <div
      class="loader-container"
      [class]="getContainerClasses(loader)"
      [style]="getContainerStyles(loader)"
    >
      @if (loader.state.config.overlay) {
      <div
        class="loader-overlay"
        [class]="loader.state.config.style?.classes?.overlay || ''"
        [style.background]="loader.state.config.style?.colors?.background"
        [style.opacity]="loader.state.config.overlayOpacity"
      ></div>
      }

      <div
        class="loader-content"
        [class]="loader.state.config.style?.classes?.loader || ''"
      >
        @switch (loader.state.config.type) { @case ("spinner") {
        <div
          class="spinner"
          [style.width]="loader.state.config.style?.size?.width"
          [style.height]="loader.state.config.style?.size?.height"
          [style.border-width]="loader.state.config.style?.size?.thickness"
          [style.border-color]="loader.state.config.style?.colors?.secondary"
          [style.border-top-color]="loader.state.config.style?.colors?.primary"
          [style.animation]="getAnimation(loader)"
        ></div>
        } @case ("progress") {
        <div
          class="progress"
          [style.width]="loader.state.config.style?.size?.width"
          [style.height]="loader.state.config.style?.size?.thickness"
          [style.background]="loader.state.config.style?.colors?.secondary"
        >
          <div
            class="progress-bar"
            [style.background]="loader.state.config.style?.colors?.primary"
            [style.animation]="getAnimation(loader)"
          ></div>
        </div>
        } @case ("dots") {
        <div class="dots">
          @for (dot of [1, 2, 3]; track dot) {
          <div
            class="dot"
            [style.width]="loader.state.config.style?.size?.thickness"
            [style.height]="loader.state.config.style?.size?.thickness"
            [style.background]="loader.state.config.style?.colors?.primary"
            [style.animation]="getAnimation(loader, dot)"
          ></div>
          }
        </div>
        } @case ("pulse") {
        <div
          class="pulse"
          [style.width]="loader.state.config.style?.size?.width"
          [style.height]="loader.state.config.style?.size?.height"
          [style.background]="loader.state.config.style?.colors?.primary"
          [style.animation]="getAnimation(loader)"
        ></div>
        } @case ("custom") {
        <div [innerHTML]="loader.state.config.template"></div>
        } }
      </div>

      @if (loader.state.config.text) {
      <div
        class="loader-text"
        [class]="loader.state.config.style?.classes?.text || ''"
        [style.color]="loader.state.config.style?.colors?.text"
      >
        {{ loader.state.config.text }}
      </div>
      }
    </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .loader-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }

      .loader-container.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
      }

      .loader-container.block {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .loader-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .loader-content {
        position: relative;
        z-index: 1;
      }

      /* Spinner */
      .spinner {
        border-style: solid;
        border-radius: 50%;
      }

      /* Progress */
      .progress {
        width: 100%;
        overflow: hidden;
        border-radius: 4px;
      }

      .progress-bar {
        width: 100%;
        height: 100%;
        transform-origin: left;
      }

      /* Dots */
      .dots {
        display: flex;
        gap: 0.5rem;
      }

      .dot {
        border-radius: 50%;
      }

      /* Pulse */
      .pulse {
        border-radius: 50%;
      }

      /* Animations */
      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes progress {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      @keyframes bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
      }
    `,
  ],
})
export class LoaderComponent {
  private loaderService = inject(LoaderService);
  protected loaders = this.loaderService.state;

  protected getContainerClasses(loader: LoaderInstance): string {
    const classes: string[] = [];

    if (loader.state.config.mode) {
      classes.push(loader.state.config.mode);
    }

    if (loader.state.config.style?.classes?.container) {
      classes.push(loader.state.config.style.classes.container);
    }

    return classes.join(" ");
  }

  protected getContainerStyles(loader: LoaderInstance): Record<string, string> {
    const { position } = loader.state.config;
    const styles: Record<string, string> = {};

    if (loader.state.config.mode === "inline") {
      styles.display = "inline-flex";
    }

    switch (position) {
      case "top":
        styles.alignItems = "flex-start";
        break;
      case "bottom":
        styles.alignItems = "flex-end";
        break;
      case "left":
        styles.justifyContent = "flex-start";
        break;
      case "right":
        styles.justifyContent = "flex-end";
        break;
    }

    return styles;
  }

  protected getAnimation(
    loader: LoaderInstance,
    index: number = 0
  ): string | null {
    const { animation } = loader.state.config;
    if (!animation) return null;

    const delay = index * ((animation.duration || 1000) / 5);
    return `${animation.name} ${animation.duration}ms ${
      animation.timing
    } ${delay}ms ${
      animation.iterations === Infinity ? "infinite" : animation.iterations
    }`;
  }
}
