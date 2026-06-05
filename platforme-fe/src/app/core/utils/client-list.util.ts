import { computed, Signal, signal } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Sort } from "@angular/material/sort";

import { onClientSortChange, sortItems, SortValue } from "./sort.util";

export class ClientListController<T> {
  readonly filter = signal("");
  readonly pageIndex = signal(0);
  readonly pageSize = signal(10);
  readonly sortActive = signal("");
  readonly sortDirection = signal<"asc" | "desc" | "">("asc");

  readonly filtered = computed(() => {
    const term = this.filter().toLowerCase().trim();
    const all = this.items();
    if (!term) {
      return all;
    }
    return all.filter((item) =>
      this.searchText(item).toLowerCase().includes(term),
    );
  });

  readonly sorted = computed(() =>
    sortItems(
      this.filtered(),
      this.sortActive(),
      this.sortDirection(),
      this.accessors,
      this.defaultActive,
      this.defaultDirection,
    ),
  );

  readonly paged = computed(() => {
    const data = this.sorted();
    const start = this.pageIndex() * this.pageSize();
    return data.slice(start, start + this.pageSize());
  });

  readonly total = computed(() => this.filtered().length);

  constructor(
    private readonly items: Signal<T[]>,
    private readonly searchText: (item: T) => string,
    private readonly accessors: Record<string, (item: T) => SortValue>,
    private readonly defaultActive: string,
    private readonly defaultDirection: "asc" | "desc" = "asc",
  ) {
    this.sortActive.set(defaultActive);
    this.sortDirection.set(defaultDirection);
  }

  setFilter(value: string): void {
    this.filter.set(value);
    this.pageIndex.set(0);
  }

  clearFilter(): void {
    this.setFilter("");
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
}
