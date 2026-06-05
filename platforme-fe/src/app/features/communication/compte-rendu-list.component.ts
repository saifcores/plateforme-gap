import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBar } from "@angular/material/snack-bar";

import { buildSortParam, onSortChange } from "../../core/utils/sort.util";
import { CommunicationService } from "./communication.service";
import { CompteRendu, TYPES_COMPTE_RENDU } from "./communication.models";
import { AuthService } from "../../core/auth/auth.service";
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { SearchFieldComponent } from "../../shared/search-field.component";

const SORT_FIELDS: Record<string, string> = {
  titre: "titre",
  type: "type",
  date: "dateEvent",
  auteur: "auteur",
};

@Component({
  selector: "app-compte-rendu-list",
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    SearchFieldComponent,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./compte-rendu-list.component.html",
})
export class CompteRenduListComponent {
  private readonly service = inject(CommunicationService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  private auteurTimer?: ReturnType<typeof setTimeout>;

  readonly types = TYPES_COMPTE_RENDU;
  readonly columns = ["titre", "type", "date", "auteur", "actions"];
  readonly loading = signal(true);
  readonly items = signal<CompteRendu[]>([]);
  readonly filter = signal("");
  readonly typeFilter = signal("");
  readonly auteurFilter = signal("");
  readonly dateFrom = signal("");
  readonly dateTo = signal("");
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly sortActive = signal("date");
  readonly sortDirection = signal<"asc" | "desc" | "">("desc");

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
        type: this.typeFilter() || undefined,
        auteur: this.auteurFilter() || undefined,
        dateFrom: this.dateFrom() || undefined,
        dateTo: this.dateTo() || undefined,
        sort: buildSortParam(
          this.sortActive(),
          this.sortDirection(),
          SORT_FIELDS,
          "dateEvent,desc",
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
          this.snack.open("Erreur de chargement", "OK", { duration: 4000 });
        },
      });
  }

  onSearch(term: string): void {
    this.filter.set(term);
    this.pageIndex.set(0);
    this.load();
  }

  onTypeFilter(value: string): void {
    this.typeFilter.set(value);
    this.pageIndex.set(0);
    this.load();
  }

  onAuteurFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    clearTimeout(this.auteurTimer);
    this.auteurTimer = setTimeout(() => {
      this.auteurFilter.set(value);
      this.pageIndex.set(0);
      this.load();
    }, 350);
  }

  onDateFrom(event: Event): void {
    this.dateFrom.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(0);
    this.load();
  }

  onDateTo(event: Event): void {
    this.dateTo.set((event.target as HTMLInputElement).value);
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

  voir(c: CompteRendu): void {
    this.router.navigate(["/communication", c.id]);
  }

  modifier(c: CompteRendu): void {
    this.router.navigate(["/communication", c.id, "modifier"]);
  }

  supprimer(c: CompteRendu): void {
    this.confirm.confirmDelete(`Supprimer « ${c.titre} » ?`).then((ok) => {
      if (!ok) {
        return;
      }
      this.service.remove(c.id).subscribe({
        next: () => {
          this.snack.open("Compte rendu supprimé", "OK", { duration: 3000 });
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
