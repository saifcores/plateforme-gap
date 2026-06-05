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
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { SearchFieldComponent } from "../../shared/search-field.component";
import { InsertionService } from "./insertion.service";
import { Insertion, TYPES_INSERTION } from "./insertion.models";
import { EtudiantService } from "../etudiants/etudiant.service";
import { Etudiant } from "../etudiants/etudiant.models";

@Component({
  selector: "app-insertion-sortant-tab",
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
    SearchFieldComponent,
  ],
  template: `
    <mat-expansion-panel class="add-panel gap-form-panel">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <mat-icon>add</mat-icon>&nbsp;{{
            editId() ? "Modifier" : "Nouvelle insertion"
          }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <form [formGroup]="form" (ngSubmit)="save()" class="gap-inline-form">
        <mat-form-field class="wide">
          <mat-label>Étudiant</mat-label>
          <mat-select formControlName="etudiantId">
            @for (e of etudiants(); track e.id) {
              <mat-option [value]="e.id">{{ e.prenom }} {{ e.nom }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Type</mat-label>
          <mat-select formControlName="type">
            @for (t of types; track t) {
              <mat-option [value]="t">{{ t }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Entreprise</mat-label>
          <input matInput formControlName="entreprise" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Poste</mat-label>
          <input matInput formControlName="poste" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Secteur</mat-label>
          <input matInput formControlName="secteur" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date</mat-label>
          <input
            matInput
            [matDatepicker]="dp"
            formControlName="dateInsertion"
          />
          <mat-datepicker-toggle matSuffix [for]="dp" />
          <mat-datepicker #dp />
        </mat-form-field>
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

    @if (loading()) {
      <mat-progress-bar mode="indeterminate" class="tab-loading" />
    }

    <app-search-field
      placeholder="Étudiant, entreprise, poste, secteur…"
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
        <ng-container matColumnDef="etudiant">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Étudiant</th>
          <td mat-cell *matCellDef="let i">{{ i.etudiantNom }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let i">{{ i.type }}</td>
        </ng-container>
        <ng-container matColumnDef="entreprise">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Entreprise</th>
          <td mat-cell *matCellDef="let i">{{ i.entreprise || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="poste">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Poste</th>
          <td mat-cell *matCellDef="let i">{{ i.poste || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let i">{{ i.dateInsertion || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-col"></th>
          <td mat-cell *matCellDef="let i" class="actions-col">
            <button
              mat-icon-button
              (click)="$event.stopPropagation(); voir(i)"
              matTooltip="Voir le détail"
              aria-label="Voir"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button (click)="$event.stopPropagation(); edit(i)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="$event.stopPropagation(); remove(i)">
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
        <mat-icon>work</mat-icon>
        <p>Aucune insertion enregistrée.</p>
      </div>
    }
  `,
  styleUrl: "./insertion-tab.scss",
})
export class InsertionSortantTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(InsertionService);
  private readonly etudiantService = inject(EtudiantService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly types = TYPES_INSERTION;
  readonly columns = [
    "etudiant",
    "type",
    "entreprise",
    "poste",
    "date",
    "actions",
  ];
  readonly loading = signal(true);
  readonly items = signal<Insertion[]>([]);
  readonly list = new ClientListController(
    this.items,
    (i) =>
      `${i.etudiantNom ?? ""} ${i.type} ${i.entreprise ?? ""} ${i.poste ?? ""} ${i.secteur ?? ""}`,
    {
      etudiant: (i) => i.etudiantNom,
      type: (i) => i.type,
      entreprise: (i) => i.entreprise,
      poste: (i) => i.poste,
      date: (i) => i.dateInsertion,
    },
    "date",
    "desc",
  );
  readonly etudiants = signal<Etudiant[]>([]);
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    etudiantId: [null as number | null, Validators.required],
    type: ["SALARIE", Validators.required],
    entreprise: [""],
    poste: [""],
    secteur: [""],
    dateInsertion: [new Date() as Date | null],
  });

  constructor() {
    this.etudiantService.options().subscribe((d) => this.etudiants.set(d));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.listInsertions().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  voir(i: Insertion): void {
    this.router.navigate(["/insertion/sortants", i.id]);
  }

  edit(i: Insertion): void {
    this.editId.set(i.id);
    this.form.patchValue({
      etudiantId: i.etudiantId,
      type: i.type,
      entreprise: i.entreprise ?? "",
      poste: i.poste ?? "",
      secteur: i.secteur ?? "",
      dateInsertion: i.dateInsertion ? new Date(i.dateInsertion) : null,
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ type: "SALARIE", dateInsertion: new Date() });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Partial<Insertion> = {
      etudiantId: raw.etudiantId!,
      type: raw.type!,
      entreprise: raw.entreprise || undefined,
      poste: raw.poste || undefined,
      secteur: raw.secteur || undefined,
      dateInsertion: raw.dateInsertion
        ? new Date(raw.dateInsertion).toISOString().substring(0, 10)
        : undefined,
    };
    const req$ = this.editId()
      ? this.service.updateInsertion(this.editId()!, payload)
      : this.service.createInsertion(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Insertion enregistrée", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: () => this.snack.open("Erreur", "OK", { duration: 4000 }),
    });
  }

  remove(i: Insertion): void {
    this.confirm.confirmDelete("Supprimer cette insertion ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deleteInsertion(i.id).subscribe(() => this.load());
    });
  }
}
