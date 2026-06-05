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
import { Partenaire, Stage } from "./insertion.models";
import { EtudiantService } from "../etudiants/etudiant.service";
import { Etudiant } from "../etudiants/etudiant.models";

@Component({
  selector: "app-stage-tab",
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
            editId() ? "Modifier le stage" : "Nouveau stage"
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
        <mat-form-field class="wide">
          <mat-label>Partenaire</mat-label>
          <mat-select formControlName="partenaireId">
            <mat-option [value]="null">— Aucun —</mat-option>
            @for (p of partenaires(); track p.id) {
              <mat-option [value]="p.id">{{ p.nom }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Sujet</mat-label>
          <input matInput formControlName="sujet" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date début</mat-label>
          <input matInput [matDatepicker]="d1" formControlName="dateDebut" />
          <mat-datepicker-toggle matSuffix [for]="d1" />
          <mat-datepicker #d1 />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date fin</mat-label>
          <input matInput [matDatepicker]="d2" formControlName="dateFin" />
          <mat-datepicker-toggle matSuffix [for]="d2" />
          <mat-datepicker #d2 />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Note /20</mat-label>
          <input matInput type="number" formControlName="note" />
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Bilan</mat-label>
          <textarea matInput rows="2" formControlName="bilan"></textarea>
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
      placeholder="Étudiant, sujet, partenaire…"
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
          <td mat-cell *matCellDef="let s">{{ s.etudiantNom }}</td>
        </ng-container>
        <ng-container matColumnDef="partenaire">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Partenaire</th>
          <td mat-cell *matCellDef="let s">{{ s.partenaireNom || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="sujet">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Sujet</th>
          <td mat-cell *matCellDef="let s">{{ s.sujet || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="periode">
          <th mat-header-cell *matHeaderCellDef>Période</th>
          <td mat-cell *matCellDef="let s">
            {{ s.dateDebut || "?" }} → {{ s.dateFin || "?" }}
          </td>
        </ng-container>
        <ng-container matColumnDef="note">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Note</th>
          <td mat-cell *matCellDef="let s">{{ s.note ?? "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-col"></th>
          <td mat-cell *matCellDef="let s" class="actions-col">
            <button
              mat-icon-button
              (click)="$event.stopPropagation(); voir(s)"
              matTooltip="Voir le détail"
              aria-label="Voir"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button (click)="$event.stopPropagation(); edit(s)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="$event.stopPropagation(); remove(s)">
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
        <mat-icon>business_center</mat-icon>
        <p>Aucun stage.</p>
      </div>
    }
  `,
  styleUrl: "./insertion-tab.scss",
})
export class StageTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(InsertionService);
  private readonly etudiantService = inject(EtudiantService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly columns = [
    "etudiant",
    "partenaire",
    "sujet",
    "periode",
    "note",
    "actions",
  ];
  readonly loading = signal(true);
  readonly items = signal<Stage[]>([]);
  readonly list = new ClientListController(
    this.items,
    (s) =>
      `${s.etudiantNom ?? ""} ${s.partenaireNom ?? ""} ${s.sujet ?? ""}`,
    {
      etudiant: (s) => s.etudiantNom,
      partenaire: (s) => s.partenaireNom,
      sujet: (s) => s.sujet,
      note: (s) => s.note,
    },
    "etudiant",
    "asc",
  );
  readonly etudiants = signal<Etudiant[]>([]);
  readonly partenaires = signal<Partenaire[]>([]);
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    etudiantId: [null as number | null, Validators.required],
    partenaireId: [null as number | null],
    sujet: [""],
    dateDebut: [null as Date | null],
    dateFin: [null as Date | null],
    note: [null as number | null],
    bilan: [""],
  });

  constructor() {
    this.etudiantService.options().subscribe((d) => this.etudiants.set(d));
    this.service.listPartenaires().subscribe((d) => this.partenaires.set(d));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.listStages().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  voir(s: Stage): void {
    this.router.navigate(["/insertion/stages", s.id]);
  }

  edit(s: Stage): void {
    this.editId.set(s.id);
    this.form.patchValue({
      etudiantId: s.etudiantId,
      partenaireId: s.partenaireId ?? null,
      sujet: s.sujet ?? "",
      dateDebut: s.dateDebut ? new Date(s.dateDebut) : null,
      dateFin: s.dateFin ? new Date(s.dateFin) : null,
      note: s.note ?? null,
      bilan: s.bilan ?? "",
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Partial<Stage> = {
      etudiantId: raw.etudiantId!,
      partenaireId: raw.partenaireId ?? undefined,
      sujet: raw.sujet || undefined,
      dateDebut: raw.dateDebut
        ? new Date(raw.dateDebut).toISOString().substring(0, 10)
        : undefined,
      dateFin: raw.dateFin
        ? new Date(raw.dateFin).toISOString().substring(0, 10)
        : undefined,
      note: raw.note ?? undefined,
      bilan: raw.bilan || undefined,
    };
    const req$ = this.editId()
      ? this.service.updateStage(this.editId()!, payload)
      : this.service.createStage(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Stage enregistré", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: () => this.snack.open("Erreur", "OK", { duration: 4000 }),
    });
  }

  remove(s: Stage): void {
    this.confirm.confirmDelete("Supprimer ce stage ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deleteStage(s.id).subscribe(() => this.load());
    });
  }
}
