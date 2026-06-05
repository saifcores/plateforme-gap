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
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTooltipModule } from "@angular/material/tooltip";

import { RoleCode, Utilisateur } from "../../core/auth/auth.models";
import { buildSortParam, onSortChange } from "../../core/utils/sort.util";
import { RoleService } from "../../core/utilisateurs/role.service";
import { UtilisateurService } from "../../core/utilisateurs/utilisateur.service";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { SearchFieldComponent } from "../../shared/search-field.component";

const FALLBACK_ROLES: RoleCode[] = [
  "ADMIN",
  "ADMINISTRATIF",
  "ENSEIGNANT",
  "ENSEIGNANT_ASSOCIE",
  "RESPONSABLE_FORMATION",
  "TUTEUR",
  "APPUI_INSERTION",
  "ETUDIANT",
];

const SORT_FIELDS: Record<string, string> = {
  nom: "nom",
  email: "email",
  statut: "actif",
};

@Component({
  selector: "app-utilisateur-list",
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
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    SearchFieldComponent,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./utilisateur-list.component.html",
})
export class UtilisateurListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly service = inject(UtilisateurService);
  private readonly roleService = inject(RoleService);
  private readonly snack = inject(MatSnackBar);

  readonly allRoles = signal<RoleCode[]>(FALLBACK_ROLES);
  readonly columns = ["nom", "email", "roles", "statut", "actions"];
  readonly loading = signal(true);
  readonly items = signal<Utilisateur[]>([]);
  readonly filter = signal("");
  readonly editId = signal<number | null>(null);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly sortActive = signal("nom");
  readonly sortDirection = signal<"asc" | "desc" | "">("asc");

  readonly form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    motDePasse: ["", Validators.minLength(6)],
    nom: ["", Validators.required],
    prenom: ["", Validators.required],
    telephone: [""],
    actif: [true],
    roles: [[] as RoleCode[], Validators.required],
  });

  constructor() {
    this.roleService.list().subscribe({
      next: (roles) => this.allRoles.set(roles.map((role) => role.code)),
      error: () => this.allRoles.set(FALLBACK_ROLES),
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service
      .search({
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
        error: () => {
          this.loading.set(false);
          this.snack.open("Accès refusé ou erreur", "OK", { duration: 4000 });
        },
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

  voir(u: Utilisateur): void {
    this.router.navigate(["/utilisateurs", u.id]);
  }

  edit(u: Utilisateur): void {
    this.editId.set(u.id);
    this.form.patchValue({
      email: u.email,
      motDePasse: "",
      nom: u.nom,
      prenom: u.prenom,
      telephone: u.telephone ?? "",
      actif: u.actif,
      roles: [...u.roles],
    });
    this.form.controls.email.disable();
  }

  reset(): void {
    this.editId.set(null);
    this.form.reset({ actif: true, roles: [] });
    this.form.controls.email.enable();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const roles = raw.roles ?? [];
    if (roles.length === 0) {
      this.snack.open("Sélectionnez au moins un rôle", "OK", {
        duration: 4000,
      });
      return;
    }

    if (this.editId()) {
      this.service
        .update(this.editId()!, {
          nom: raw.nom!,
          prenom: raw.prenom!,
          telephone: raw.telephone || undefined,
          actif: raw.actif ?? true,
          roles,
          motDePasse: raw.motDePasse || undefined,
        })
        .subscribe({
          next: () => {
            this.snack.open("Utilisateur mis à jour", "OK", { duration: 3000 });
            this.reset();
            this.load();
          },
          error: (err) =>
            this.snack.open(err?.error?.message ?? "Erreur", "OK", {
              duration: 4000,
            }),
        });
      return;
    }

    if (!raw.motDePasse || raw.motDePasse.length < 6) {
      this.snack.open("Mot de passe requis (6 car. min.)", "OK", {
        duration: 4000,
      });
      return;
    }

    this.service
      .create({
        email: raw.email!,
        motDePasse: raw.motDePasse,
        nom: raw.nom!,
        prenom: raw.prenom!,
        telephone: raw.telephone || undefined,
        roles,
      })
      .subscribe({
        next: () => {
          this.snack.open("Utilisateur créé", "OK", { duration: 3000 });
          this.reset();
          this.load();
        },
        error: (err) =>
          this.snack.open(err?.error?.message ?? "Erreur", "OK", {
            duration: 4000,
          }),
      });
  }
}
