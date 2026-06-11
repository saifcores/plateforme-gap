import { Component, computed, inject, signal } from "@angular/core";
import { extractHttpErrorMessage } from "../core/http/http-error.utils";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";

import { UtilisateurService } from "../core/utilisateurs/utilisateur.service";
import { AdministrationService } from "../features/administration/administration.service";
import { FormationService } from "../features/formations/formation.service";
import { InsertionService } from "../features/insertion/insertion.service";
import { DocumentLinkComponent } from "./document-link.component";
import { EmptyStateComponent } from "./empty-state.component";
import { PageFeedbackComponent } from "./page-feedback.component";
import {
  buildEntityDetailView,
  entityDetailShell,
  EntityDetailType,
  loadEntity,
} from "./entity-detail.registry";

@Component({
  selector: "app-entity-detail",
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    PageFeedbackComponent,
    EmptyStateComponent,
    DocumentLinkComponent,
  ],
  templateUrl: "./entity-detail.component.html",
})
export class EntityDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly utilisateurService = inject(UtilisateurService);
  private readonly formationService = inject(FormationService);
  private readonly administrationService = inject(AdministrationService);
  private readonly insertionService = inject(InsertionService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly view = signal<ReturnType<typeof buildEntityDetailView> | null>(null);

  readonly budgetColumns = ["intitule", "prevu", "realise"];

  readonly backQueryParams = computed(() => {
    const tab = this.view()?.backTab;
    return tab ? { tab } : undefined;
  });

  constructor() {
    const type = this.route.snapshot.data["entityType"] as EntityDetailType;
    const id = Number(this.route.snapshot.paramMap.get("id"));

    loadEntity(type, id, {
      utilisateurService: this.utilisateurService,
      formationService: this.formationService,
      administrationService: this.administrationService,
      insertionService: this.insertionService,
    }).subscribe({
      next: (item) => {
        const built = buildEntityDetailView(type, item);
        const backLink = this.route.snapshot.data["backLink"] as
          | string
          | undefined;
        const backTab = this.route.snapshot.data["backTab"] as
          | string
          | undefined;
        this.view.set({
          ...built,
          ...(backLink ? { backLink } : {}),
          ...(backTab ? { backTab } : {}),
        });
        this.loading.set(false);
      },
      error: (err) => {
        const shell = entityDetailShell(type);
        const backLink = this.route.snapshot.data["backLink"] as
          | string
          | undefined;
        const backTab = this.route.snapshot.data["backTab"] as
          | string
          | undefined;
        this.view.set({
          ...shell,
          ...(backLink ? { backLink } : {}),
          ...(backTab ? { backTab } : {}),
        });
        this.error.set(
          extractHttpErrorMessage(err, {
            notFound: "Élément introuvable ou accès refusé.",
            forbidden: "Accès refusé.",
            default: "Élément introuvable ou accès refusé.",
          }),
        );
        this.loading.set(false);
      },
    });
  }
}
