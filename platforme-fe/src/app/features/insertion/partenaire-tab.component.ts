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
import {
  Partenaire,
  STATUTS_PARTENAIRE,
  TYPES_PARTENAIRE,
} from "./insertion.models";

@Component({
  selector: "app-partenaire-tab",
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
            editId() ? "Modifier le partenaire" : "Nouveau partenaire"
          }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <form [formGroup]="form" (ngSubmit)="save()" class="gap-inline-form">
        <mat-form-field class="wide">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="nom" />
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
          <mat-label>Secteur</mat-label>
          <input matInput formControlName="secteur" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Contact</mat-label>
          <input matInput formControlName="contactNom" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="contactEmail" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Téléphone</mat-label>
          <input matInput formControlName="telephone" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Statut</mat-label>
          <mat-select formControlName="statut">
            @for (s of statuts; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date partenariat</mat-label>
          <input
            matInput
            [matDatepicker]="dp"
            formControlName="datePartenariat"
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
      placeholder="Nom, secteur, contact…"
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
        <ng-container matColumnDef="nom">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom</th>
          <td mat-cell *matCellDef="let p">{{ p.nom }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let p">{{ p.type || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="secteur">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Secteur</th>
          <td mat-cell *matCellDef="let p">{{ p.secteur || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="contact">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Contact</th>
          <td mat-cell *matCellDef="let p">{{ p.contactNom || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="statut">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Statut</th>
          <td mat-cell *matCellDef="let p">{{ p.statut || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef class="actions-col"></th>
          <td mat-cell *matCellDef="let p" class="actions-col">
            <button
              mat-icon-button
              (click)="$event.stopPropagation(); voir(p)"
              matTooltip="Voir le détail"
              aria-label="Voir"
            >
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button (click)="$event.stopPropagation(); edit(p)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="$event.stopPropagation(); remove(p)">
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
        <mat-icon>handshake</mat-icon>
        <p>Aucun partenaire.</p>
      </div>
    }
  `,
  styleUrl: "./insertion-tab.scss",
})
export class PartenaireTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(InsertionService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly types = TYPES_PARTENAIRE;
  readonly statuts = STATUTS_PARTENAIRE;
  readonly columns = ["nom", "type", "secteur", "contact", "statut", "actions"];
  readonly loading = signal(true);
  readonly items = signal<Partenaire[]>([]);
  readonly list = new ClientListController(
    this.items,
    (p) =>
      `${p.nom} ${p.type ?? ""} ${p.secteur ?? ""} ${p.contactNom ?? ""} ${p.statut ?? ""}`,
    {
      nom: (p) => p.nom,
      type: (p) => p.type,
      secteur: (p) => p.secteur,
      contact: (p) => p.contactNom,
      statut: (p) => p.statut,
    },
    "nom",
    "asc",
  );
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    nom: ["", Validators.required],
    type: ["ENTREPRISE"],
    secteur: [""],
    contactNom: [""],
    contactEmail: [""],
    telephone: [""],
    adresse: [""],
    datePartenariat: [null as Date | null],
    statut: ["ACTIF"],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.listPartenaires().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  voir(p: Partenaire): void {
    this.router.navigate(["/insertion/partenaires", p.id]);
  }

  edit(p: Partenaire): void {
    this.editId.set(p.id);
    this.form.patchValue({
      nom: p.nom,
      type: p.type ?? "ENTREPRISE",
      secteur: p.secteur ?? "",
      contactNom: p.contactNom ?? "",
      contactEmail: p.contactEmail ?? "",
      telephone: p.telephone ?? "",
      adresse: p.adresse ?? "",
      datePartenariat: p.datePartenariat ? new Date(p.datePartenariat) : null,
      statut: p.statut ?? "ACTIF",
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ type: "ENTREPRISE", statut: "ACTIF" });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Partial<Partenaire> = {
      nom: raw.nom ?? undefined,
      type: raw.type ?? undefined,
      secteur: raw.secteur || undefined,
      contactNom: raw.contactNom || undefined,
      contactEmail: raw.contactEmail || undefined,
      telephone: raw.telephone || undefined,
      adresse: raw.adresse || undefined,
      statut: raw.statut ?? undefined,
      datePartenariat: raw.datePartenariat
        ? new Date(raw.datePartenariat).toISOString().substring(0, 10)
        : undefined,
    };
    const req$ = this.editId()
      ? this.service.updatePartenaire(this.editId()!, payload)
      : this.service.createPartenaire(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Partenaire enregistré", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: () => this.snack.open("Erreur", "OK", { duration: 4000 }),
    });
  }

  remove(p: Partenaire): void {
    this.confirm.confirmDelete("Supprimer ce partenaire ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deletePartenaire(p.id).subscribe(() => this.load());
    });
  }
}
