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
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";

import { buildSortParam, onSortChange } from "../../core/utils/sort.util";
import { FormationService } from "./formation.service";
import { Formateur, TYPES_FORMATEUR } from "./formation.models";
import { AuthService } from "../../core/auth/auth.service";
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { SearchFieldComponent } from "../../shared/search-field.component";

const SORT_FIELDS: Record<string, string> = {
  nom: "nom",
  email: "email",
  type: "type",
  specialite: "specialite",
};

@Component({
  selector: "app-formateur-list",
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
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    SearchFieldComponent,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./formateur-list.component.html",
})
export class FormateurListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(FormationService);
  private readonly auth = inject(AuthService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly types = TYPES_FORMATEUR;
  readonly columns = ["nom", "email", "type", "specialite", "actions"];
  readonly loading = signal(true);
  readonly items = signal<Formateur[]>([]);
  readonly filter = signal("");
  readonly editId = signal<number | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly sortActive = signal("nom");
  readonly sortDirection = signal<"asc" | "desc" | "">("asc");

  readonly canManage = this.auth.hasAnyRole([
    "ADMIN",
    "ADMINISTRATIF",
    "RESPONSABLE_FORMATION",
  ]);

  readonly form = this.fb.group({
    nom: ["", Validators.required],
    prenom: ["", Validators.required],
    email: [""],
    type: ["ENSEIGNANT", Validators.required],
    specialite: [""],
    grade: [""],
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service
      .searchFormateurs({
        page: this.pageIndex(),
        size: this.pageSize(),
        q: this.filter() || undefined,
        sort: buildSortParam(
          this.sortActive(),
          this.sortDirection(),
          SORT_FIELDS,
          "nom,asc",
        ),
      })
      .subscribe({
        next: (page) => {
          this.items.set(page.content);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  onSearch(term: string): void {
    this.filter.set(term);
    this.pageIndex.set(0);
    this.load();
  }

  onSort(sort: Sort): void {
    onSortChange(
      sort,
      (v) => this.sortActive.set(v),
      (v) => this.sortDirection.set(v),
      () => this.pageIndex.set(0),
      () => this.load(),
    );
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.load();
  }

  voir(f: Formateur): void {
    this.router.navigate(["/formateurs", f.id]);
  }

  edit(f: Formateur): void {
    this.editId.set(f.id);
    this.form.patchValue({
      nom: f.nom,
      prenom: f.prenom,
      email: f.email ?? "",
      type: f.type,
      specialite: f.specialite ?? "",
      grade: f.grade ?? "",
    });
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ type: "ENSEIGNANT" });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue() as Omit<Formateur, "id">;
    const req$ = this.editId()
      ? this.service.updateFormateur(this.editId()!, payload)
      : this.service.createFormateur(payload);
    req$.subscribe({
      next: () => {
        this.snack.open("Formateur enregistré", "OK", { duration: 3000 });
        this.reset();
        this.load();
      },
      error: () => this.snack.open("Erreur", "OK", { duration: 4000 }),
    });
  }

  remove(f: Formateur): void {
    this.confirm
      .confirmDelete(`Supprimer ${f.prenom} ${f.nom} ?`)
      .then((ok) => {
        if (!ok) {
          return;
        }
        this.service.deleteFormateur(f.id).subscribe({
          next: () => this.load(),
          error: () =>
            this.snack.open("Suppression impossible", "OK", { duration: 4000 }),
        });
      });
  }
}
