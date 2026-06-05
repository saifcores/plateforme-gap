import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  warn?: boolean;
}

@Component({
  selector: "app-confirm-dialog",
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="confirm-icon" [class.warn]="data.warn">
        <mat-icon>{{ data.warn ? "warning" : "help_outline" }}</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-stroked-button (click)="close(false)">
          {{ data.cancelLabel ?? "Annuler" }}
        </button>
        <button
          mat-flat-button
          [color]="data.warn ? 'warn' : 'primary'"
          (click)="close(true)"
        >
          {{ data.confirmLabel ?? "Confirmer" }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [
    `
      .confirm-dialog {
        padding: 8px 0 0;
      }

      .confirm-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: var(--gap-primary-50);
        margin-bottom: 8px;

        mat-icon {
          color: var(--gap-primary-600);
        }

        &.warn {
          background: #fef2f2;

          mat-icon {
            color: var(--gap-error);
          }
        }
      }

      h2 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--gap-text-primary);
      }

      p {
        margin: 0;
        color: var(--gap-text-secondary);
        line-height: 1.6;
        font-size: 0.9rem;
      }

      mat-dialog-actions {
        padding-top: 16px;
        gap: 8px;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ConfirmDialogComponent, boolean>);

  close(result: boolean): void {
    this.ref.close(result);
  }
}
