import { DatePipe } from "@angular/common";
import { extractHttpErrorMessage } from "../../core/http/http-error.utils";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";

import { RoleCode } from "../../core/auth/auth.models";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { DocumentLinkComponent } from "../../shared/document-link.component";
import { CommunicationService } from "./communication.service";
import {
  CompteRendu,
  LABELS_ROLE,
  LABELS_TYPE_COMPTE_RENDU,
} from "./communication.models";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-compte-rendu-detail",
  standalone: true,
  imports: [
    DatePipe,
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
      error: (err) => {
        this.error.set(
          extractHttpErrorMessage(err, {
            notFound: "Compte rendu introuvable ou accès refusé.",
            forbidden: "Vous n'avez pas accès à ce compte rendu.",
            default: "Impossible de charger le compte rendu.",
          }),
        );
        this.loading.set(false);
      },
    });
  }

  typeLabel(type: string): string {
    return LABELS_TYPE_COMPTE_RENDU[type] ?? type;
  }

  roleLabel(role: RoleCode): string {
    return LABELS_ROLE[role] ?? role;
  }
}
