import { Sort } from "@angular/material/sort";

export function buildSortParam(
  active: string,
  direction: "asc" | "desc" | "",
  fieldMap: Record<string, string>,
  fallback: string,
): string {
  if (!direction) {
    return fallback;
  }
  const field = fieldMap[active] ?? active;
  return `${field},${direction}`;
}

export function onSortChange(
  sort: Sort,
  setActive: (v: string) => void,
  setDirection: (v: "asc" | "desc" | "") => void,
  resetPage: () => void,
  reload: () => void,
): void {
  setActive(sort.active);
  setDirection(sort.direction);
  resetPage();
  reload();
}

export function onClientSortChange(
  sort: Sort,
  setActive: (v: string) => void,
  setDirection: (v: "asc" | "desc" | "") => void,
  resetPage: () => void,
): void {
  setActive(sort.active);
  setDirection(sort.direction);
  resetPage();
}

export type SortValue = string | number | boolean | null | undefined;

export function sortItems<T>(
  items: T[],
  active: string,
  direction: "asc" | "desc" | "",
  accessors: Record<string, (item: T) => SortValue>,
  fallbackActive: string,
  fallbackDirection: "asc" | "desc" = "asc",
): T[] {
  const field = direction ? active : fallbackActive;
  const dir = direction || fallbackDirection;
  const accessor = accessors[field] ?? accessors[fallbackActive];
  if (!accessor) {
    return [...items];
  }
  const mul = dir === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const va = accessor(a);
    const vb = accessor(b);
    if (va == null && vb == null) {
      return 0;
    }
    if (va == null) {
      return 1;
    }
    if (vb == null) {
      return -1;
    }
    if (typeof va === "number" && typeof vb === "number") {
      return (va - vb) * mul;
    }
    if (typeof va === "boolean" && typeof vb === "boolean") {
      return (Number(va) - Number(vb)) * mul;
    }
    return (
      String(va).localeCompare(String(vb), "fr", {
        sensitivity: "base",
      }) * mul
    );
  });
}
