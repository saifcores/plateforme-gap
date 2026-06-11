import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { ClientListController } from "../../core/utils/client-list.util";
import { DocumentUploadComponent } from "../../shared/document-upload.component";
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { SearchFieldComponent } from "../../shared/search-field.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { AdministrationService } from "./administration.service";
import {
  finishListLoad,
  showApiErrorSnack,
  showBlobErrorSnack,
  triggerFileDownload,
} from "../../core/http/http-error.utils";
import { Budget, TYPES_BUDGET } from "./administration.models";

@Component({
  selector: "app-budget-tab",
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
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    DocumentUploadComponent,
    SearchFieldComponent,
    PageFeedbackComponent,
  ],
  template: `
    <mat-expansion-panel class="add-panel gap-form-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon>add</mat-icon>&nbsp;{{
            editId() ? "Modifier le budget" : "Ajouter un budget"
          }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <form [formGroup]="form" (ngSubmit)="save()">
        <div class="gap-inline-form">
          <mat-form-field>
            <mat-label>Année</mat-label>
            <mat-icon matPrefix>calendar_today</mat-icon>
            <input matInput type="number" formControlName="annee" />
          </mat-form-field>
          <mat-form-field>
            <mat-label>Type</mat-label>
            <mat-icon matPrefix>account_balance_wallet</mat-icon>
            <mat-select formControlName="type">
              @for (t of types; track t) {
                <mat-option [value]="t">{{ t }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field class="wide">
            <mat-label>Note d'orientation</mat-label>
            <input matInput formControlName="noteOrientation" />
          </mat-form-field>
        </div>

        <div class="lignes" formArrayName="lignes">
          <div class="ligne-head">
            <span>Lignes budgétaires</span>
            <button mat-stroked-button type="button" (click)="addLigne()">
              <mat-icon>add</mat-icon> Ligne
            </button>
          </div>
          @for (l of lignes.controls; track $index) {
            <div class="ligne-row" [formGroupName]="$index">
              <mat-form-field class="wide">
                <mat-label>Intitulé</mat-label>
                <input matInput formControlName="intitule" />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Prévu</mat-label>
                <input matInput type="number" formControlName="montantPrevu" />
              </mat-form-field>
              <mat-form-field>
                <mat-label>Réalisé</mat-label>
                <input
                  matInput
                  type="number"
                  formControlName="montantRealise"
                />
              </mat-form-field>
              <button
                mat-icon-button
                color="warn"
                type="button"
                (click)="removeLigne($index)"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
        </div>

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
      placeholder="Année, intitulé, libellé…"
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
        <ng-container matColumnDef="annee">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Année</th>
          <td mat-cell *matCellDef="let b">{{ b.annee }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let b">{{ b.type }}</td>
        </ng-container>
        <ng-container matColumnDef="prevu">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Total prévu</th>
          <td mat-cell *matCellDef="let b">{{ b.totalPrevu || 0 }}</td>
        </ng-container>
        <ng-container matColumnDef="realise">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            Total réalisé
          </th>
          <td mat-cell *matCellDef="let b">{{ b.totalRealise || 0 }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-col"></th>
          <td mat-cell *matCellDef="let b" class="actions-col">
            <button
              mat-icon-button
              (click)="$event.stopPropagation(); voir(b)"
              matTooltip="Voir le détail"
              aria-label="Voir"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="Export PDF"
              [disabled]="exporting()"
              (click)="$event.stopPropagation(); exportBudget(b.id, 'pdf')"
            >
              <mat-icon>picture_as_pdf</mat-icon>
            </button>
            <button
              mat-icon-button
              matTooltip="Export Excel"
              [disabled]="exporting()"
              (click)="$event.stopPropagation(); exportBudget(b.id, 'excel')"
            >
              <mat-icon>table_chart</mat-icon>
            </button>
            <button mat-icon-button (click)="$event.stopPropagation(); edit(b)">
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              (click)="$event.stopPropagation(); remove(b)"
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
        <mat-icon>account_balance</mat-icon>
        <p>Aucun budget.</p>
      </div>
    }
  `,
  styleUrl: "./admin-tab.scss",
})
export class BudgetTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(AdministrationService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly types = TYPES_BUDGET;
  readonly columns = ["annee", "type", "prevu", "realise", "actions"];
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly exporting = signal(false);
  readonly items = signal<Budget[]>([]);
  readonly list = new ClientListController(
    this.items,
    (b) => `${b.annee} ${b.type} ${b.noteOrientation ?? ""}`,
    {
      annee: (b) => b.annee,
      type: (b) => b.type,
      prevu: (b) => b.totalPrevu,
      realise: (b) => b.totalRealise,
    },
    "annee",
    "desc",
  );
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    annee: [new Date().getFullYear(), Validators.required],
    type: ["PROJET", Validators.required],
    noteOrientation: [""],
    documentUrl: [""],
    lignes: this.fb.array<ReturnType<BudgetTabComponent["newLigne"]>>([]),
  });

  get lignes(): FormArray {
    return this.form.get("lignes") as FormArray;
  }

  private newLigne(
    intitule = "",
    prevu: number | null = null,
    realise: number | null = null,
  ) {
    return this.fb.group({
      intitule: [intitule, Validators.required],
      montantPrevu: [prevu],
      montantRealise: [realise],
    });
  }

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.service.listBudgets().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: (err) =>
        finishListLoad(
          err,
          this.loading,
          this.loadError,
          "Impossible de charger les budgets.",
        ),
    });
  }

  addLigne(): void {
    this.lignes.push(this.newLigne());
  }

  removeLigne(i: number): void {
    this.lignes.removeAt(i);
  }

  voir(b: Budget): void {
    this.router.navigate(["/administration/budgets", b.id]);
  }

  edit(b: Budget): void {
    this.service.getBudget(b.id).subscribe({
      next: (full) => {
        this.editId.set(full.id);
        this.lignes.clear();
        (full.lignes ?? []).forEach((l) =>
          this.lignes.push(
            this.newLigne(
              l.intitule,
              l.montantPrevu ?? null,
              l.montantRealise ?? null,
            ),
          ),
        );
        this.form.patchValue({
          annee: full.annee,
          type: full.type,
          noteOrientation: full.noteOrientation ?? "",
          documentUrl: full.documentUrl ?? "",
        });
      },
      error: (err) =>
        showApiErrorSnack(this.snack, err, "Impossible de charger le budget"),
    });
  }

  reset(): void {
    this.editId.set(null);
    this.lignes.clear();
    this.form.reset({ annee: new Date().getFullYear(), type: "PROJET" });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Partial<Budget>;
    const req$ = this.editId()
      ? this.service.updateBudget(this.editId()!, payload)
      : this.service.createBudget(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Budget enregistré", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: (err) =>
        showApiErrorSnack(this.snack, err, "Enregistrement impossible"),
    });
  }

  remove(b: Budget): void {
    this.confirm.confirmDelete("Supprimer ce budget ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deleteBudget(b.id).subscribe({
        next: () => {
          this.snack.open("Budget supprimé", "OK", { duration: 3000 });
          this.load();
        },
        error: (err) =>
          showApiErrorSnack(this.snack, err, "Suppression impossible"),
      });
    });
  }

  exportBudget(id: number, format: "pdf" | "excel"): void {
    if (this.exporting()) {
      return;
    }
    this.exporting.set(true);
    const req$ =
      format === "pdf"
        ? this.service.exportBudgetPdf(id)
        : this.service.exportBudgetExcel(id);
    req$.subscribe({
      next: (blob) => {
        triggerFileDownload(
          blob,
          `budget-${id}.${format === "pdf" ? "pdf" : "xlsx"}`,
        );
        this.exporting.set(false);
      },
      error: async (err) => {
        this.exporting.set(false);
        await showBlobErrorSnack(this.snack, err, "Export impossible");
      },
    });
  }
}
