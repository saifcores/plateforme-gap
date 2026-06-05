import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBar } from "@angular/material/snack-bar";

import { buildSortParam, onSortChange } from "../../core/utils/sort.util";
import { FormationService } from "./formation.service";
import { Formation } from "./formation.models";
import { AuthService } from "../../core/auth/auth.service";
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { SearchFieldComponent } from "../../shared/search-field.component";

const SORT_FIELDS: Record<string, string> = {
  intitule: "intitule",
  type: "type",
  niveau: "niveau",
  periode: "dateDebut",
};

@Component({
  selector: "app-formation-list",
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    SearchFieldComponent,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./formation-list.component.html",
  styleUrl: "./formation-list.component.scss",
})
export class FormationListComponent {
  private readonly service = inject(FormationService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly columns = ["intitule", "type", "niveau", "periode", "actions"];
  readonly loading = signal(true);
  readonly formations = signal<Formation[]>([]);
  readonly filter = signal("");
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly sortActive = signal("intitule");
  readonly sortDirection = signal<"asc" | "desc" | "">("asc");

  readonly canManage = this.auth.hasAnyRole([
    "ADMIN",
    "ADMINISTRATIF",
    "RESPONSABLE_FORMATION",
  ]);

  constructor() {
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
          "intitule,asc",
        ),
      })
      .subscribe({
        next: (page) => {
          this.formations.set(page.content);
          this.totalElements.set(page.totalElements);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.snack.open("Erreur de chargement des formations", "OK", {
            duration: 4000,
          });
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

  voir(f: Formation): void {
    this.router.navigate(["/formations", f.id]);
  }

  modifier(f: Formation): void {
    this.router.navigate(["/formations", f.id, "modifier"]);
  }

  supprimer(f: Formation): void {
    this.confirm
      .confirmDelete(`Supprimer la formation « ${f.intitule} » ?`)
      .then((ok) => {
        if (!ok) {
          return;
        }
        this.service.remove(f.id).subscribe({
          next: () => {
            this.snack.open("Formation supprimée", "OK", { duration: 3000 });
            this.load();
          },
          error: () =>
            this.snack.open("Suppression impossible", "OK", {
              duration: 4000,
            }),
        });
      });
  }
}
