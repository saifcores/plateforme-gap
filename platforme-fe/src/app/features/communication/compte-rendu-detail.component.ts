import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { DocumentLinkComponent } from "../../shared/document-link.component";
import { CommunicationService } from "./communication.service";
import { CompteRendu } from "./communication.models";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-compte-rendu-detail",
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    PageFeedbackComponent,
    EmptyStateComponent,
    DocumentLinkComponent,
  ],
  templateUrl: "./compte-rendu-detail.component.html",
  styleUrl: "./compte-rendu-detail.component.scss",
})
export class CompteRenduDetailComponent {
  private readonly service = inject(CommunicationService);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  readonly item = signal<CompteRendu | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly canManage = this.auth.hasAnyRole([
    "ADMIN",
    "ADMINISTRATIF",
    "RESPONSABLE_FORMATION",
  ]);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.service.get(id).subscribe({
      next: (c) => {
        this.item.set(c);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Compte rendu introuvable ou accès refusé.");
        this.loading.set(false);
      },
    });
  }
}
