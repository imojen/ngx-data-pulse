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
        <div class="notification-content">
          @if (notification.icon) {
          <div class="icon-container">
            <span class="icon">{{ notification.icon }}</span>
          </div>
          }
          <div class="content" [innerHTML]="notification.content"></div>
        </div>
        @if (notification.closable) {
        <button class="close-button" (click)="remove(notification.id)">
          ×
        </button>
        }
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
        padding: 40px;
        gap: 12px;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
          Roboto, sans-serif;
        box-sizing: border-box;
        width: auto;
        max-width: 460px;
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
        position: relative;
        width: 100%;
        max-width: 380px;
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        pointer-events: all;
        animation: fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        overflow: hidden;
        color: white;
      }

      .notification-content {
        display: flex;
        align-items: center;
        padding: 16px 16px 16px 20px;
      }

      .notification.closable .notification-content {
        padding-right: 52px;
      }

      .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        margin-right: 16px;
        flex-shrink: 0;
      }

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.25);
        font-size: 16px;
        line-height: 1;
      }

      .content {
        flex: 1;
        font-size: 15px;
        font-weight: 500;
        line-height: 1.4;
      }

      .close-button {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        font-size: 18px;
        font-weight: bold;
        line-height: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .close-button:hover {
        background-color: rgba(0, 0, 0, 0.3);
        transform: translateY(-50%) scale(1.1);
      }

      .close-button:focus {
        outline: none;
      }

      /* Success notification */
      .notification.success {
        background: linear-gradient(to right, #4caf50, #43a047);
      }

      /* Error notification */
      .notification.error {
        background: linear-gradient(to right, #f44336, #e53935);
      }

      /* Warning notification */
      .notification.warning {
        background: linear-gradient(to right, #ff9800, #fb8c00);
      }

      /* Info notification */
      .notification.info {
        background: linear-gradient(to right, #2196f3, #1e88e5);
      }

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
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
  notifications: any;
  config: any;

  constructor(private notificationService: NotificationService) {
    this.notifications = this.notificationService.getNotifications();
    this.config = computed(() => this.notificationService.getConfig());
  }

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
