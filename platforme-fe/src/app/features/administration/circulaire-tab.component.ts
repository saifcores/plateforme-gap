import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
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
  extractApiErrorMessage,
  finishListLoad,
  showApiErrorSnack,
} from "../../core/http/http-error.utils";
import { Circulaire } from "./administration.models";

@Component({
  selector: "app-circulaire-tab",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
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
            editId() ? "Modifier la circulaire" : "Ajouter une circulaire"
          }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <form [formGroup]="form" (ngSubmit)="save()" class="gap-inline-form">
        <mat-form-field>
          <mat-label>Référence</mat-label>
          <mat-icon matPrefix>tag</mat-icon>
          <input matInput formControlName="reference" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Niveau</mat-label>
          <mat-icon matPrefix>layers</mat-icon>
          <input matInput formControlName="niveau" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date</mat-label>
          <mat-icon matPrefix>event</mat-icon>
          <input
            matInput
            [matDatepicker]="dp"
            formControlName="dateCirculaire"
          />
          <mat-datepicker-toggle matSuffix [for]="dp" />
          <mat-datepicker #dp />
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Objet</mat-label>
          <mat-icon matPrefix>subject</mat-icon>
          <input matInput formControlName="objet" />
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Contenu</mat-label>
          <mat-icon matPrefix>notes</mat-icon>
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
            <mat-icon>save</mat-icon>
            Enregistrer
          </button>
        </div>
      </form>
    </mat-expansion-panel>

    <app-page-feedback [loading]="loading()" [error]="loadError()" />

    <app-search-field
      placeholder="Référence, objet…"
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
        <ng-container matColumnDef="objet">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Objet</th>
          <td mat-cell *matCellDef="let c">{{ c.objet }}</td>
        </ng-container>
        <ng-container matColumnDef="reference">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Référence</th>
          <td mat-cell *matCellDef="let c">{{ c.reference || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="niveau">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Niveau</th>
          <td mat-cell *matCellDef="let c">{{ c.niveau || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let c">{{ c.dateCirculaire }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-col"></th>
          <td mat-cell *matCellDef="let c" class="actions-col">
            <button
              mat-icon-button
              (click)="$event.stopPropagation(); voir(c)"
              matTooltip="Voir le détail"
              aria-label="Voir"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button (click)="$event.stopPropagation(); edit(c)">
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="$event.stopPropagation(); remove(c)"
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
        <mat-icon>campaign</mat-icon>
        <p>Aucune circulaire.</p>
      </div>
    }
  `,
  styleUrl: "./admin-tab.scss",
})
export class CirculaireTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(AdministrationService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly columns = ["objet", "reference", "niveau", "date", "actions"];
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly items = signal<Circulaire[]>([]);
  readonly list = new ClientListController(
    this.items,
    (c) =>
      `${c.objet} ${c.reference ?? ""} ${c.niveau ?? ""} ${c.dateCirculaire ?? ""}`,
    {
      objet: (c) => c.objet,
      reference: (c) => c.reference,
      niveau: (c) => c.niveau,
      date: (c) => c.dateCirculaire,
    },
    "date",
    "desc",
  );
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    reference: [""],
    niveau: ["CENTRAL"],
    objet: ["", Validators.required],
    contenu: [""],
    dateCirculaire: [new Date() as Date | null, Validators.required],
    documentUrl: [""],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.service.listCirculaires().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: (err) =>
        finishListLoad(
          err,
          this.loading,
          this.loadError,
          "Impossible de charger les circulaires.",
        ),
    });
  }

  voir(c: Circulaire): void {
    this.router.navigate(["/administration/circulaires", c.id]);
  }

  edit(c: Circulaire): void {
    this.editId.set(c.id);
    this.form.patchValue({
      reference: c.reference ?? "",
      niveau: c.niveau ?? "CENTRAL",
      objet: c.objet,
      contenu: c.contenu ?? "",
      dateCirculaire: c.dateCirculaire ? new Date(c.dateCirculaire) : null,
      documentUrl: c.documentUrl ?? "",
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ niveau: "CENTRAL", dateCirculaire: new Date() });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      dateCirculaire: formatLocalDate(raw.dateCirculaire!)!,
    } as Partial<Circulaire>;
    const req$ = this.editId()
      ? this.service.updateCirculaire(this.editId()!, payload)
      : this.service.createCirculaire(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Circulaire enregistrée", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: (err) =>
        this.snack.open(extractApiErrorMessage(err, "Erreur"), "OK", { duration: 4000 }),
    });
  }

  remove(c: Circulaire): void {
    this.confirm.confirmDelete("Supprimer cette circulaire ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deleteCirculaire(c.id).subscribe({
        next: () => {
          this.snack.open("Circulaire supprimée", "OK", { duration: 3000 });
          this.load();
        },
        error: (err) =>
          showApiErrorSnack(this.snack, err, "Suppression impossible"),
      });
    });
  }
}
