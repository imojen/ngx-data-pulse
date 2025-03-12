import { Component, computed, effect, inject } from "@angular/core";
import { NotificationService } from "./notification.service";
import { NotificationItem } from "./notification.types";

@Component({
  selector: "ngx-notifications",
  standalone: true,
  template: `
    <div
      class="notifications-container"
      [style.maxWidth]="config().maxWidth"
      [style.gap]="config().gap"
      [class]="config().position"
    >
      @for (notification of notifications(); track notification.id) {
      <div
        class="notification"
        [class]="notification.type"
        [class.closable]="notification.closable"
        [style]="getStyles(notification)"
        (click)="notification.closable && remove(notification.id)"
      >
        @if (notification.icon) {
        <span class="icon">{{ notification.icon }}</span>
        }
        <div class="content" [innerHTML]="notification.content"></div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .notifications-container {
        position: fixed;
        display: flex;
        flex-direction: column;
        z-index: 9999;
        pointer-events: none;
        padding: 1rem;
      }

      .top-left {
        top: 0;
        left: 0;
      }

      .top-center {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .top-right {
        top: 0;
        right: 0;
      }

      .bottom-left {
        bottom: 0;
        left: 0;
      }

      .bottom-center {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }

      .bottom-right {
        bottom: 0;
        right: 0;
      }

      .notification {
        display: flex;
        align-items: flex-start;
        padding: 1rem;
        border-radius: 4px;
        pointer-events: all;
        animation: fade-in 0.3s ease-in-out;
      }

      .notification.closable {
        cursor: pointer;
      }

      .notification .icon {
        margin-right: 0.5rem;
        font-size: 1.2em;
      }

      .notification .content {
        flex: 1;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fade-out {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-10px);
        }
      }
    `,
  ],
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);

  notifications = this.notificationService.getNotifications();
  config = computed(() => this.notificationService.getConfig());

  getStyles(notification: NotificationItem): Record<string, string> {
    return {
      background: notification.style?.background || "",
      color: notification.style?.color || "",
      boxShadow: notification.style?.boxShadow || "",
      border: notification.style?.border || "",
    };
  }

  remove(id: string): void {
    this.notificationService.remove(id);
  }
}
