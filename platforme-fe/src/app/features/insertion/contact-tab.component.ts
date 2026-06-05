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
import { CANAUX_CONTACT, RegistreContact } from "./insertion.models";
import { EtudiantService } from "../etudiants/etudiant.service";
import { Etudiant } from "../etudiants/etudiant.models";

@Component({
  selector: "app-contact-tab",
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
            editId() ? "Modifier le contact" : "Nouveau contact"
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
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="dp" formControlName="dateContact" />
          <mat-datepicker-toggle matSuffix [for]="dp" />
          <mat-datepicker #dp />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Canal</mat-label>
          <mat-select formControlName="canal">
            @for (c of canaux; track c) {
              <mat-option [value]="c">{{ c }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Objet</mat-label>
          <input matInput formControlName="objet" />
        </mat-form-field>
        <mat-form-field class="wide">
          <mat-label>Compte rendu</mat-label>
          <textarea matInput rows="2" formControlName="compteRendu"></textarea>
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
      placeholder="Étudiant, objet, canal…"
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
          <td mat-cell *matCellDef="let c">{{ c.etudiantNom }}</td>
        </ng-container>
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let c">{{ c.dateContact }}</td>
        </ng-container>
        <ng-container matColumnDef="canal">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Canal</th>
          <td mat-cell *matCellDef="let c">{{ c.canal || "—" }}</td>
        </ng-container>
        <ng-container matColumnDef="objet">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Objet</th>
          <td mat-cell *matCellDef="let c">{{ c.objet || "—" }}</td>
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
            <button mat-icon-button color="warn" (click)="$event.stopPropagation(); remove(c)">
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
        <mat-icon>contact_phone</mat-icon>
        <p>Aucun contact enregistré.</p>
      </div>
    }
  `,
  styleUrl: "./insertion-tab.scss",
})
export class ContactTabComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(InsertionService);
  private readonly etudiantService = inject(EtudiantService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly canaux = CANAUX_CONTACT;
  readonly columns = ["etudiant", "date", "canal", "objet", "actions"];
  readonly loading = signal(true);
  readonly items = signal<RegistreContact[]>([]);
  readonly list = new ClientListController(
    this.items,
    (c) =>
      `${c.etudiantNom ?? ""} ${c.canal ?? ""} ${c.objet ?? ""} ${c.compteRendu ?? ""}`,
    {
      etudiant: (c) => c.etudiantNom,
      date: (c) => c.dateContact,
      canal: (c) => c.canal,
      objet: (c) => c.objet,
    },
    "date",
    "desc",
  );
  readonly etudiants = signal<Etudiant[]>([]);
  readonly editId = signal<number | null>(null);

  readonly form = this.fb.group({
    etudiantId: [null as number | null, Validators.required],
    dateContact: [new Date() as Date | null, Validators.required],
    canal: ["TELEPHONE"],
    objet: [""],
    compteRendu: [""],
  });

  constructor() {
    this.etudiantService.options().subscribe((d) => this.etudiants.set(d));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.listContacts().subscribe({
      next: (d) => {
        this.items.set(d);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  voir(c: RegistreContact): void {
    this.router.navigate(["/insertion/contacts", c.id]);
  }

  edit(c: RegistreContact): void {
    this.editId.set(c.id);
    this.form.patchValue({
      etudiantId: c.etudiantId,
      dateContact: c.dateContact ? new Date(c.dateContact) : null,
      canal: c.canal ?? "TELEPHONE",
      objet: c.objet ?? "",
      compteRendu: c.compteRendu ?? "",
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ canal: "TELEPHONE", dateContact: new Date() });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload: Partial<RegistreContact> = {
      etudiantId: raw.etudiantId!,
      dateContact: new Date(raw.dateContact!).toISOString().substring(0, 10),
      canal: raw.canal || undefined,
      objet: raw.objet || undefined,
      compteRendu: raw.compteRendu || undefined,
    };
    const req$ = this.editId()
      ? this.service.updateContact(this.editId()!, payload)
      : this.service.createContact(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Contact enregistré", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: () => this.snack.open("Erreur", "OK", { duration: 4000 }),
    });
  }

  remove(c: RegistreContact): void {
    this.confirm.confirmDelete("Supprimer ce contact ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.deleteContact(c.id).subscribe(() => this.load());
    });
  }
}
