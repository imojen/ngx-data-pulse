import { Component, computed, inject } from "@angular/core";
import { ModalService } from "./modal.service";

@Component({
  selector: "ngx-modal",
  standalone: true,
  template: `
    @if (isOpen()) {
    <div
      class="modal-container"
      [class]="config()?.classes?.container || ''"
      [class.default-styles]="config()?.defaultStyles"
    >
      <div
        class="modal-overlay"
        [class]="config()?.classes?.overlay || ''"
        (click)="onOverlayClick()"
      ></div>

      <div class="modal-content" [class]="config()?.classes?.modal || ''">
        <!-- Header -->
        <div class="modal-header" [class]="config()?.classes?.header || ''">
          @if (config()?.title) {
          <h2>{{ config()?.title }}</h2>
          } @if (config()?.showClose) {
          <button
            class="modal-close"
            [class]="config()?.classes?.closeButton || ''"
            (click)="close()"
          >
            ×
          </button>
          }
        </div>

        <!-- Body -->
        <div
          class="modal-body"
          [class]="config()?.classes?.body || ''"
          [innerHTML]="config()?.content"
        ></div>

        <!-- Footer -->
        <div class="modal-footer" [class]="config()?.classes?.footer || ''">
          @if (config()?.type === 'confirm') {
          <button
            class="modal-button cancel"
            [class]="config()?.classes?.actionButton || ''"
            (click)="cancel()"
          >
            {{ config()?.buttons?.cancel || "Annuler" }}
          </button>
          <button
            class="modal-button confirm"
            [class]="config()?.classes?.actionButton || ''"
            (click)="confirm()"
          >
            {{ config()?.buttons?.confirm || "Confirmer" }}
          </button>
          } @else {
          <button
            class="modal-button"
            [class]="config()?.classes?.actionButton || ''"
            (click)="close()"
          >
            {{ config()?.buttons?.close || "Fermer" }}
          </button>
          }
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      :host {
        display: contents;
      }

      .modal-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }

      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      }

      .modal-content {
        position: relative;
        width: 100%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        animation: fade-in 0.3s ease-in-out;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid #eee;
      }

      .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        margin: -0.5rem;
        opacity: 0.5;
        transition: opacity 0.2s;
      }

      .modal-close:hover {
        opacity: 1;
      }

      .modal-body {
        padding: 1rem;
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 1rem;
        border-top: 1px solid #eee;
      }

      .modal-button {
        padding: 0.5rem 1rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        transition: all 0.2s;
      }

      .modal-button:hover {
        background: #f5f5f5;
      }

      .modal-button.confirm {
        background: #4caf50;
        border-color: #4caf50;
        color: #fff;
      }

      .modal-button.confirm:hover {
        background: #43a047;
      }

      .modal-button.cancel {
        background: #f44336;
        border-color: #f44336;
        color: #fff;
      }

      .modal-button.cancel:hover {
        background: #e53935;
      }

      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-20px);
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
          transform: translateY(-20px);
        }
      }
    `,
  ],
})
export class ModalComponent {
  private modalService = inject(ModalService);

  protected isOpen = computed(() => this.modalService.state().isOpen);
  protected config = computed(() => this.modalService.state().config);

  protected onOverlayClick(): void {
    if (this.config()?.closeOnOverlay) {
      this.close();
    }
  }

  protected close(): void {
    this.modalService.close();
  }

  protected confirm(): void {
    this.modalService.confirmModal();
  }

  protected cancel(): void {
    this.modalService.cancel();
  }
}
