import { Component, computed, inject, signal } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatSnackBar } from "@angular/material/snack-bar";

import {
  JournalAccesService,
  JournalEntry,
} from "../../core/documents/journal-acces.service";
import { onClientSortChange, sortItems } from "../../core/utils/sort.util";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import {
  extractApiErrorMessage,
  finishListLoad,
  showBlobErrorSnack,
  triggerFileDownload,
} from "../../core/http/http-error.utils";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { SearchFieldComponent } from "../../shared/search-field.component";

const SORT_ACCESSORS = {
  date: (e: JournalEntry) => e.accedeLe,
  document: (e: JournalEntry) => e.documentNom,
  utilisateur: (e: JournalEntry) =>
    e.utilisateurNom || e.utilisateurEmail || "",
  action: (e: JournalEntry) => e.action,
};

@Component({
  selector: "app-journal-acces",
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    SearchFieldComponent,
    MatPaginatorModule,
    MatSortModule,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./journal-acces.component.html",
})
export class JournalAccesComponent {
  private readonly service = inject(JournalAccesService);
  private readonly snack = inject(MatSnackBar);

  readonly columns = ["date", "document", "utilisateur", "action"];
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly exporting = signal(false);
  readonly items = signal<JournalEntry[]>([]);
  readonly filter = signal("");
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly sortActive = signal("date");
  readonly sortDirection = signal<"asc" | "desc" | "">("desc");

  readonly filtered = computed(() => {
    const term = this.filter().toLowerCase().trim();
    if (!term) {
      return this.items();
    }
    return this.items().filter((e) =>
      `${e.documentNom} ${e.utilisateurNom ?? ""} ${e.utilisateurEmail ?? ""} ${e.action}`
        .toLowerCase()
        .includes(term),
    );
  });

  readonly sorted = computed(() =>
    sortItems(
      this.filtered(),
      this.sortActive(),
      this.sortDirection(),
      SORT_ACCESSORS,
      "date",
      "desc",
    ),
  );

  readonly paged = computed(() => {
    const data = this.sorted();
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.service.list().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) =>
        finishListLoad(
          err,
          this.loading,
          this.loadError,
          "Impossible de charger le journal.",
        ),
    });
  }

  onSearch(term: string): void {
    this.filter.set(term);
    this.pageIndex.set(0);
  }

  onSort(sort: Sort): void {
    onClientSortChange(
      sort,
      (v) => this.sortActive.set(v),
      (v) => this.sortDirection.set(v),
      () => this.pageIndex.set(0),
    );
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  exportExcel(): void {
    this.exporting.set(true);
    this.service.exportExcel().subscribe({
      next: (blob) => {
        triggerFileDownload(blob, "journal-acces-documents.xlsx");
        this.exporting.set(false);
      },
      error: async (err) => {
        this.exporting.set(false);
        await showBlobErrorSnack(this.snack, err, "Export impossible");
      },
    });
  }
}
