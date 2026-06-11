import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";

import { ClientListController } from "../../core/utils/client-list.util";
import { DocumentUploadComponent } from "../../shared/document-upload.component";
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { SearchFieldComponent } from "../../shared/search-field.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { AdministrationService } from "./administration.service";
import { formatLocalDate } from "../../shared/date.utils";
import {
  finishListLoad,
  showApiErrorSnack,
} from "../../core/http/http-error.utils";
import { NoteService, TYPES_NOTE } from "./administration.models";

@Component({
  selector: "app-note-service-tab",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatTooltipModule,
    DocumentUploadComponent,
    SearchFieldComponent,
    PageFeedbackComponent,
  ],
  template: `
    <mat-expansion-panel class="add-panel gap-form-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon>add</mat-icon>&nbsp;{{
            editId() ? "Modifier la note" : "Ajouter une note de service"
          }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <form [formGroup]="form" (ngSubmit)="save()" class="gap-inline-form">
        <mat-form-field>
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            @for (t of types; track t) {
              <mat-option [value]="t">{{ t }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Référence</mat-label>
          <input matInput formControlName="reference" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="dp" formControlName="dateNote" />
          <mat-datepicker-toggle matSuffix [for]="dp" />
          <mat-datepicker #dp />
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Objet</mat-label>
          <input matInput formControlName="objet" />
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Contenu</mat-label>
          <textarea matInput rows="2" formControlName="contenu"></textarea>
        </mat-form-field>
        <app-document-upload
          label="Joindre un document"
          module="administration"
          [value]="form.controls.documentUrl.value"
          (valueChange)="form.controls.documentUrl.setValue($event)"
        />
        <div class="form-actions">
          @if (editId()) {
            <button mat-button type="button" (click)="reset()">Annuler</button>
          }
          <button mat-flat-button color="primary" type="submit">
            Enregistrer
          </button>
        </div>
      </form>
    </mat-expansion-panel>

    <app-page-feedback [loading]="loading()" [error]="loadError()" />

    <app-search-field
      placeholder="Objet, référence, type…"
      [value]="list.filter()"
      [resultCount]="list.filter() ? list.total() : null"
      (search)="list.setFilter($event)"
    />

    <div class="table-wrapper">
      <table
        mat-table
        [dataSource]="list.paged()"
        matSort
        (matSortChange)="list.onSort($event)"
        class="full-width"
      >
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let n">{{ n.type }}</td>
        </ng-container>
        <ng-container matColumnDef="objet">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Objet</th>
          <td mat-cell *matCellDef="let n">{{ n.objet }}</td>
        </ng-container>
        <ng-container matColumnDef="reference">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Référence</th>
          <td mat-cell *matCellDef="let n">{{ n.reference || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let n">{{ n.dateNote }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-col"></th>
          <td mat-cell *matCellDef="let n" class="actions-col">
            <button
              mat-icon-button
              (click)="$event.stopPropagation(); voir(n)"
              matTooltip="Voir le détail"
              aria-label="Voir"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button (click)="$event.stopPropagation(); edit(n)">
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="$event.stopPropagation(); remove(n)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columns"></tr>
        <tr
          mat-row
          *matRowDef="let row; columns: columns"
          class="clickable-row"
          (click)="voir(row)"
        ></tr>
      </table>
    </div>
    @if (list.total() > 0) {
      <mat-paginator
        [length]="list.total()"
        [pageIndex]="list.pageIndex()"
        [pageSize]="list.pageSize()"
        [pageSizeOptions]="[5, 10, 25]"
        (page)="list.onPage($event)"
      />
    } @else {
      <div class="empty-state">
        <mat-icon>description</mat-icon>
        <p>Aucune note de service.</p>
      </div>
    }
  `,
  styleUrl: "./admin-tab.scss",
})
export class NoteServiceTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(AdministrationService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly types = TYPES_NOTE;
  readonly columns = ["type", "objet", "reference", "date", "actions"];
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly items = signal<NoteService[]>([]);
  readonly list = new ClientListController(
    this.items,
    (n) => `${n.type} ${n.objet} ${n.reference ?? ""} ${n.dateNote ?? ""}`,
    {
      type: (n) => n.type,
      objet: (n) => n.objet,
      reference: (n) => n.reference,
      date: (n) => n.dateNote,
    },
    "date",
    "desc",
  );
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    type: ["INTERNE", Validators.required],
    reference: [""],
    objet: ["", Validators.required],
    contenu: [""],
    documentUrl: [""],
    dateNote: [new Date() as Date | null, Validators.required],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.service.listNotes().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: (err) =>
        finishListLoad(
          err,
          this.loading,
          this.loadError,
          "Impossible de charger les notes de service.",
        ),
    });
  }

  voir(n: NoteService): void {
    this.router.navigate(["/administration/notes-service", n.id]);
  }

  edit(n: NoteService): void {
    this.editId.set(n.id);
    this.form.patchValue({
      type: n.type,
      reference: n.reference ?? "",
      objet: n.objet,
      contenu: n.contenu ?? "",
      documentUrl: n.documentUrl ?? "",
      dateNote: n.dateNote ? new Date(n.dateNote) : null,
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ type: "INTERNE", dateNote: new Date() });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      dateNote: formatLocalDate(raw.dateNote!)!,
    } as Partial<NoteService>;
    const req$ = this.editId()
      ? this.service.updateNote(this.editId()!, payload)
      : this.service.createNote(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Note enregistrée", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: (err) =>
        showApiErrorSnack(this.snack, err, "Enregistrement impossible"),
    });
  }

  remove(n: NoteService): void {
    this.confirm.confirmDelete("Supprimer cette note ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deleteNote(n.id).subscribe({
        next: () => {
          this.snack.open("Note supprimée", "OK", { duration: 3000 });
          this.load();
        },
        error: (err) =>
          showApiErrorSnack(this.snack, err, "Suppression impossible"),
      });
    });
  }
}
