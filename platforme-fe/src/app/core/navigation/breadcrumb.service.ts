import { inject, Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, startWith } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";

export interface Breadcrumb {
  label: string;
  route: string;
}

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Tableau de bord",
  etudiants: "Étudiants",
  formations: "Formations",
  communication: "Communication",
  notifications: "Notifications",
  administration: "Administration",
  insertion: "Appui insertion",
  "mon-dossier": "Mon dossier",
  "emploi-du-temps": "Emploi du temps",
  formateurs: "Formateurs",
  circulaires: "Circulaires",
  utilisateurs: "Utilisateurs",
  "journal-acces": "Journal d'accès",
  nouveau: "Nouveau",
  modifier: "Modifier",
};

@Injectable({ providedIn: "root" })
export class BreadcrumbService {
  private readonly router = inject(Router);

  readonly items = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.build()),
      startWith(this.build()),
    ),
    { initialValue: [] as Breadcrumb[] },
  );

  private build(): Breadcrumb[] {
    const url = this.router.url.split("?")[0];
    const segments = url.split("/").filter(Boolean);
    if (!segments.length) {
      return [{ label: "Tableau de bord", route: "/dashboard" }];
    }

    const crumbs: Breadcrumb[] = [];
    let path = "";

    segments.forEach((segment, index) => {
      path += `/${segment}`;
      const isId = /^\d+$/.test(segment);
      const hasModifier = segments[index + 1] === "modifier";

      if (isId) {
        crumbs.push({
          label: hasModifier ? "Modifier" : "Détail",
          route: path,
        });
        return;
      }

      crumbs.push({
        label: SEGMENT_LABELS[segment] ?? segment,
        route: path,
      });
    });

    return crumbs;
  }
}
