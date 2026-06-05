import { Component, inject, input, output, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { DocumentService } from "../core/documents/document.service";

@Component({
  selector: "app-document-upload",
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="document-upload">
      <input
        #fileInput
        type="file"
        hidden
        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt"
        (change)="onFileSelected($event)"
      />

      @if (value()) {
        <div class="gap-upload-file">
          <mat-icon>description</mat-icon>
          <span class="filename">{{ fileLabel() }}</span>
          <button
            mat-icon-button
            type="button"
            (click)="clear()"
            aria-label="Retirer le fichier"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      } @else {
        <button
          type="button"
          class="gap-upload-zone"
          (click)="fileInput.click()"
          [disabled]="uploading()"
        >
          @if (uploading()) {
            <mat-spinner diameter="28" />
            <p class="upload-title">Envoi en cours…</p>
          } @else {
            <mat-icon>cloud_upload</mat-icon>
            <p class="upload-title">{{ label() }}</p>
            <p class="upload-hint">PDF, Word, Excel, images — max. 10 Mo</p>
          }
        </button>
      }

      @if (error()) {
        <p class="upload-error">{{ error() }}</p>
      }
    </div>
  `,
  styles: `
    .document-upload {
      display: flex;
      flex-direction: column;
      gap: 8px;
      grid-column: 1 / -1;
    }

    .gap-upload-zone {
      width: 100%;
      border: none;
      font: inherit;
      cursor: pointer;
    }

    .gap-upload-zone:disabled {
      opacity: 0.7;
      cursor: wait;
    }

    .upload-error {
      margin: 0;
      font-size: 0.82rem;
      color: var(--gap-error);
      padding: 8px 12px;
      border-radius: var(--gap-radius-sm);
      background: #fef2f2;
      border: 1px solid #fecaca;
    }
  `,
})
export class DocumentUploadComponent {
  private readonly documents = inject(DocumentService);

  readonly label = input("Glisser ou cliquer pour joindre un document");
  readonly module = input<string | undefined>(undefined);
  readonly value = input<string | null>(null);
  readonly valueChange = output<string | null>();

  readonly uploading = signal(false);
  readonly error = signal<string | null>(null);

  fileLabel(): string {
    const url = this.value();
    if (!url) {
      return "";
    }
    return decodeURIComponent(url.split("/").pop() ?? "Document joint");
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) {
      return;
    }

    this.uploading.set(true);
    this.error.set(null);
    this.documents.upload(file, this.module()).subscribe({
      next: (doc) => {
        this.uploading.set(false);
        this.valueChange.emit(this.documents.resolveUrl(doc.url));
      },
      error: () => {
        this.uploading.set(false);
        this.error.set("Échec de l'envoi du fichier.");
      },
    });
  }

  clear(): void {
    this.valueChange.emit(null);
    this.error.set(null);
  }
}
