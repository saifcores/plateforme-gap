import { Component, computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule, Sort } from "@angular/material/sort";
import { onClientSortChange, sortItems } from "../../core/utils/sort.util";
import { DocumentLinkComponent } from "../../shared/document-link.component";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import {
  extractApiErrorMessage,
  finishListLoad,
} from "../../core/http/http-error.utils";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { SearchFieldComponent } from "../../shared/search-field.component";
import { AdministrationService } from "../administration/administration.service";
import { Circulaire } from "../administration/administration.models";

const SORT_ACCESSORS = {
  reference: (c: Circulaire) => c.reference ?? "",
  objet: (c: Circulaire) => c.objet,
  date: (c: Circulaire) => c.dateCirculaire ?? "",
};

@Component({
  selector: "app-circulaires",
  standalone: true,
  imports: [
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatTooltipModule,
    SearchFieldComponent,
    MatPaginatorModule,
    MatSortModule,
    DocumentLinkComponent,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./circulaires.component.html",
  styleUrl: "./circulaires.component.scss",
})
export class CirculairesComponent {
  private readonly router = inject(Router);
  private readonly service = inject(AdministrationService);

  readonly columns = ["reference", "objet", "date", "document", "actions"];
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly items = signal<Circulaire[]>([]);
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
    return this.items().filter((c) =>
      `${c.reference ?? ""} ${c.objet} ${c.niveau ?? ""}`
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
    this.service.listCirculaires().subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: (err) =>
        finishListLoad(
          err,
          this.loading,
          this.loadError,
          "Impossible de charger les circulaires.",
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

  voir(c: Circulaire): void {
    this.router.navigate(["/circulaires", c.id]);
  }
}
