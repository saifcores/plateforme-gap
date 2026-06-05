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
import { AdministrationService } from "./administration.service";
import { Personnel, TYPES_PERSONNEL } from "./administration.models";

@Component({
  selector: "app-personnel-tab",
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
            editId() ? "Modifier le dossier" : "Ajouter un membre du personnel"
          }}
        </mat-panel-title>
      </mat-expansion-panel-header>
      <form [formGroup]="form" (ngSubmit)="save()" class="gap-inline-form">
        <mat-form-field>
          <mat-label>Prénom</mat-label>
          <input matInput formControlName="prenom" />
        </mat-form-field>
        <mat-form-field>
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
          <mat-label>Matricule</mat-label>
          <input matInput formControlName="matricule" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Fonction</mat-label>
          <input matInput formControlName="fonction" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Date d'embauche</mat-label>
          <input matInput [matDatepicker]="dp" formControlName="dateEmbauche" />
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
      placeholder="Nom, prénom, fonction…"
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
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nom complet</th>
          <td mat-cell *matCellDef="let p">{{ p.prenom }} {{ p.nom }}</td>
        </ng-container>
        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let p">{{ p.type }}</td>
        </ng-container>
        <ng-container matColumnDef="matricule">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Matricule</th>
          <td mat-cell *matCellDef="let p">{{ p.matricule || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="fonction">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Fonction</th>
          <td mat-cell *matCellDef="let p">{{ p.fonction || "—" }}</td>
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
        <mat-icon>badge</mat-icon>
        <p>Aucun personnel.</p>
      </div>
    }
  `,
  styleUrl: "./admin-tab.scss",
})
export class PersonnelTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(AdministrationService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly types = TYPES_PERSONNEL;
  readonly columns = ["nom", "type", "matricule", "fonction", "actions"];
  readonly loading = signal(true);
  readonly items = signal<Personnel[]>([]);
  readonly list = new ClientListController(
    this.items,
    (p) =>
      `${p.prenom} ${p.nom} ${p.type} ${p.matricule ?? ""} ${p.fonction ?? ""} ${p.email ?? ""}`,
    {
      nom: (p) => `${p.prenom} ${p.nom}`,
      type: (p) => p.type,
      matricule: (p) => p.matricule,
      fonction: (p) => p.fonction,
    },
    "nom",
    "asc",
  );
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    prenom: ["", Validators.required],
    nom: ["", Validators.required],
    type: ["ADMINISTRATIF", Validators.required],
    matricule: [""],
    fonction: [""],
    email: [""],
    dateEmbauche: [null as Date | null],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.listPersonnels().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  voir(p: Personnel): void {
    this.router.navigate(["/administration/personnel", p.id]);
  }

  edit(p: Personnel): void {
    this.editId.set(p.id);
    this.form.patchValue({
      prenom: p.prenom,
      nom: p.nom,
      type: p.type,
      matricule: p.matricule ?? "",
      fonction: p.fonction ?? "",
      email: p.email ?? "",
      dateEmbauche: p.dateEmbauche ? new Date(p.dateEmbauche) : null,
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ type: "ADMINISTRATIF" });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      dateEmbauche: raw.dateEmbauche
        ? new Date(raw.dateEmbauche).toISOString().substring(0, 10)
        : undefined,
    } as Partial<Personnel>;
    const req$ = this.editId()
      ? this.service.updatePersonnel(this.editId()!, payload)
      : this.service.createPersonnel(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Dossier enregistré", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: (err) =>
        this.snack.open(err?.error?.message ?? "Erreur", "OK", {
          duration: 4000,
        }),
    });
  }

  remove(p: Personnel): void {
    this.confirm.confirmDelete("Supprimer ce dossier ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deletePersonnel(p.id).subscribe(() => this.load());
    });
  }
}
