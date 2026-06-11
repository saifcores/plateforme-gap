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
  extractApiErrorMessage,
  finishListLoad,
  showApiErrorSnack,
} from "../../core/http/http-error.utils";
import {
  Courrier,
  STATUTS_COURRIER,
  TYPES_COURRIER,
} from "./administration.models";

@Component({
  selector: "app-courrier-tab",
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
    <mat-expansion-panel class="add-panel gap-form-panel mb-2">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon>add</mat-icon>&nbsp;{{
            editId() ? "Modifier le courrier" : "Ajouter un courrier"
          }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <form [formGroup]="form" (ngSubmit)="save()" class="gap-inline-form">
        <mat-form-field>
          <mat-label>Type</mat-label>
          <mat-icon matPrefix>category</mat-icon>
          <mat-select formControlName="type">
            @for (t of types; track t) {
              <mat-option [value]="t">{{ t }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Référence</mat-label>
          <mat-icon matPrefix>tag</mat-icon>
          <input matInput formControlName="reference" />
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Objet</mat-label>
          <mat-icon matPrefix>subject</mat-icon>
          <input matInput formControlName="objet" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Expéditeur</mat-label>
          <mat-icon matPrefix>outbound</mat-icon>
          <input matInput formControlName="expediteur" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Destinataire</mat-label>
          <mat-icon matPrefix>person</mat-icon>
          <input matInput formControlName="destinataire" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date</mat-label>
          <mat-icon matPrefix>event</mat-icon>
          <input matInput [matDatepicker]="dp" formControlName="dateCourrier" />
          <mat-datepicker-toggle matSuffix [for]="dp" />
          <mat-datepicker #dp />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Statut</mat-label>
          <mat-icon matPrefix>flag</mat-icon>
          <mat-select formControlName="statut">
            @for (s of statuts; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
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
      placeholder="Objet, expéditeur, destinataire, référence…"
      [value]="list.filter()"
      [resultCount]="list.filter() ? list.total() : null"
      (search)="list.setFilter($event)"
      class="mb-2"
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
          <td mat-cell *matCellDef="let c">{{ c.type }}</td>
        </ng-container>
        <ng-container matColumnDef="objet">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Objet</th>
          <td mat-cell *matCellDef="let c">{{ c.objet }}</td>
        </ng-container>
        <ng-container matColumnDef="contact">
          <th mat-header-cell *matHeaderCellDef>Exp. / Dest.</th>
          <td mat-cell *matCellDef="let c">
            {{ c.expediteur || "—" }} → {{ c.destinataire || "—" }}
          </td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let c">{{ c.dateCourrier }}</td>
        </ng-container>
        <ng-container matColumnDef="statut">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
          <td mat-cell *matCellDef="let c">{{ c.statut }}</td>
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
        <mat-icon>mail</mat-icon>
        <p>Aucun courrier.</p>
      </div>
    }
  `,
  styleUrl: "./admin-tab.scss",
})
export class CourrierTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(AdministrationService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly types = TYPES_COURRIER;
  readonly statuts = STATUTS_COURRIER;
  readonly columns = ["type", "objet", "contact", "date", "statut", "actions"];
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly items = signal<Courrier[]>([]);
  readonly list = new ClientListController(
    this.items,
    (c) =>
      `${c.type} ${c.objet} ${c.expediteur ?? ""} ${c.destinataire ?? ""} ${c.statut ?? ""}`,
    {
      type: (c) => c.type,
      objet: (c) => c.objet,
      date: (c) => c.dateCourrier,
      statut: (c) => c.statut,
    },
    "date",
    "desc",
  );
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    type: ["ARRIVE", Validators.required],
    reference: [""],
    objet: ["", Validators.required],
    expediteur: [""],
    destinataire: [""],
    dateCourrier: [new Date() as Date | null, Validators.required],
    statut: ["RECU"],
    documentUrl: [""],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.service.listCourriers().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: (err) =>
        finishListLoad(
          err,
          this.loading,
          this.loadError,
          "Impossible de charger les courriers.",
        ),
    });
  }

  voir(c: Courrier): void {
    this.router.navigate(["/administration/courriers", c.id]);
  }

  edit(c: Courrier): void {
    this.editId.set(c.id);
    this.form.patchValue({
      type: c.type,
      reference: c.reference ?? "",
      objet: c.objet,
      expediteur: c.expediteur ?? "",
      destinataire: c.destinataire ?? "",
      dateCourrier: c.dateCourrier ? new Date(c.dateCourrier) : null,
      statut: c.statut ?? "RECU",
      documentUrl: c.documentUrl ?? "",
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({
      type: "ARRIVE",
      statut: "RECU",
      dateCourrier: new Date(),
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      dateCourrier: formatLocalDate(raw.dateCourrier!)!,
    } as Partial<Courrier>;
    const req$ = this.editId()
      ? this.service.updateCourrier(this.editId()!, payload)
      : this.service.createCourrier(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Courrier enregistré", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: (err) =>
        this.snack.open(extractApiErrorMessage(err, "Erreur"), "OK", {
          duration: 4000,
        }),
    });
  }

  remove(c: Courrier): void {
    this.confirm.confirmDelete("Supprimer ce courrier ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deleteCourrier(c.id).subscribe({
        next: () => {
          this.snack.open("Courrier supprimé", "OK", { duration: 3000 });
          this.load();
        },
        error: (err) =>
          showApiErrorSnack(this.snack, err, "Suppression impossible"),
      });
    });
  }
}
