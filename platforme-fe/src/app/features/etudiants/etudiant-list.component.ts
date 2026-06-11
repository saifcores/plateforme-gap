import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBar } from "@angular/material/snack-bar";

import { buildSortParam, onSortChange } from "../../core/utils/sort.util";
import { EtudiantService } from "./etudiant.service";
import { Etudiant } from "./etudiant.models";
import { AuthService } from "../../core/auth/auth.service";
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { SearchFieldComponent } from "../../shared/search-field.component";
import {
  extractApiErrorMessage,
  finishListLoad,
  showApiErrorSnack,
} from "../../core/http/http-error.utils";

const SORT_FIELDS: Record<string, string> = {
  ine: "ine",
  nom: "nom",
  formation: "formation.intitule",
  promo: "promo",
};

@Component({
  selector: "app-etudiant-list",
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    SearchFieldComponent,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./etudiant-list.component.html",
  styleUrl: "./etudiant-list.component.scss",
})
export class EtudiantListComponent {
  private readonly service = inject(EtudiantService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly columns = ["ine", "nom", "formation", "promo", "actions"];
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly etudiants = signal<Etudiant[]>([]);
  readonly filter = signal("");
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly sortActive = signal("nom");
  readonly sortDirection = signal<"asc" | "desc" | "">("asc");

  readonly canManage = this.auth.hasAnyRole(["ADMIN", "ADMINISTRATIF"]);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
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
          this.etudiants.set(page.content);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: (err) =>
          finishListLoad(
            err,
            this.loading,
            this.loadError,
            "Impossible de charger les étudiants.",
          ),
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

  voir(e: Etudiant): void {
    this.router.navigate(["/etudiants", e.id]);
  }

  modifier(e: Etudiant): void {
    this.router.navigate(["/etudiants", e.id, "modifier"]);
  }

  supprimer(e: Etudiant): void {
    this.confirm
      .confirmDelete(`Supprimer l'étudiant ${e.prenom} ${e.nom} ?`)
      .then((ok) => {
        if (!ok) {
          return;
        }
        this.service.remove(e.id).subscribe({
          next: () => {
            this.snack.open("Étudiant supprimé", "OK", { duration: 3000 });
            this.load();
          },
          error: (err) =>
            showApiErrorSnack(this.snack, err, "Suppression impossible"),
        });
      });
  }
}
