import { inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { firstValueFrom } from "rxjs";

import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from "./confirm-dialog.component";

@Injectable({ providedIn: "root" })
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Promise<boolean> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        cancelLabel: "Annuler",
        confirmLabel: "Confirmer",
        warn: false,
        ...data,
      },
      width: "420px",
      autoFocus: false,
      panelClass: "gap-dialog",
    });
    return firstValueFrom(ref.afterClosed()).then((r) => !!r);
  }

  confirmDelete(
    message: string,
    title = "Confirmer la suppression",
  ): Promise<boolean> {
    return this.confirm({
      title,
      message,
      confirmLabel: "Supprimer",
      warn: true,
    });
  }
}
