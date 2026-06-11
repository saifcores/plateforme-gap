import { Component, inject, input } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBar } from "@angular/material/snack-bar";

import { showBlobErrorSnack } from "../core/http/http-error.utils";
import { DocumentService } from "../core/documents/document.service";

@Component({
  selector: "app-document-link",
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    @if (url()) {
      <button mat-stroked-button type="button" (click)="download()">
        <mat-icon>attachment</mat-icon>
        {{ label() }}
      </button>
    }
  `,
})
export class DocumentLinkComponent {
  private readonly documents = inject(DocumentService);
  private readonly snack = inject(MatSnackBar);

  readonly url = input<string | null | undefined>(null);
  readonly label = input("Document joint");
  readonly filename = input<string | undefined>(undefined);

  download(): void {
    const href = this.url();
    if (!href) {
      return;
    }
    if (this.documents.isManagedDocument(href)) {
      this.documents.download(href, this.filename()).subscribe({
        error: async (err) =>
          await showBlobErrorSnack(
            this.snack,
            err,
            "Téléchargement impossible",
          ),
      });
      return;
    }
    window.open(href, "_blank", "noopener");
  }
}
