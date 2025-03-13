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
        background: rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(4px);
      }

      .modal-content {
        position: relative;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        transform: scale(0.95);
        opacity: 0;
        animation: modalFadeIn 0.3s ease forwards;
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0;
      }

      .modal-header h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #2d3748;
        margin: 0;
      }

      .modal-close {
        background: transparent;
        border: none;
        color: #718096;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        transition: color 0.2s;
        opacity: 1;
      }

      .modal-close:hover {
        color: #2d3748;
      }

      .modal-body {
        padding: 1rem 0;
        color: #4a5568;
        line-height: 1.6;
      }

      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem 0 0 0;
        border: none;
      }

      .modal-button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .modal-button.confirm {
        background: #4f46e5;
        color: white;
      }

      .modal-button.confirm:hover {
        background: #4338ca;
      }

      .modal-button.cancel {
        background: #ef4444;
        color: white;
      }

      .modal-button.cancel:hover {
        background: #dc2626;
      }

      @keyframes modalFadeIn {
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ModalComponent {
  protected isOpen: any;
  protected config: any;

  constructor(private modalService: ModalService) {
    this.isOpen = computed(() => this.modalService.state().isOpen);
    this.config = computed(() => this.modalService.state().config);
  }

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
