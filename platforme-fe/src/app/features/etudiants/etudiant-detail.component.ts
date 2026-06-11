import { extractHttpErrorMessage } from "../../core/http/http-error.utils";
import { Component, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { EtudiantService } from "./etudiant.service";
import { Etudiant } from "./etudiant.models";
import { AuthService } from "../../core/auth/auth.service";

@Component({
  selector: "app-etudiant-detail",
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./etudiant-detail.component.html",
  styleUrl: "./etudiant-detail.component.scss",
})
export class EtudiantDetailComponent {
  private readonly service = inject(EtudiantService);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);

  readonly etudiant = signal<Etudiant | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly canManage = this.auth.hasAnyRole(["ADMIN", "ADMINISTRATIF"]);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.service.get(id).subscribe({
      next: (e) => {
        this.etudiant.set(e);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          extractHttpErrorMessage(err, {
            notFound: "Étudiant introuvable ou accès refusé.",
            forbidden: "Vous n'avez pas accès à cet étudiant.",
            default: "Impossible de charger l'étudiant.",
          }),
        );
        this.loading.set(false);
      },
    });
  }
}
