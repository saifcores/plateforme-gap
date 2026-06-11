import { extractHttpErrorMessage } from "../../core/http/http-error.utils";
import { Component, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { EtudiantService } from "./etudiant.service";
import { Etudiant } from "./etudiant.models";

@Component({
  selector: "app-mon-dossier",
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatListModule, PageFeedbackComponent],
  templateUrl: "./mon-dossier.component.html",
  styleUrl: "./mon-dossier.component.scss",
})
export class MonDossierComponent {
  private readonly service = inject(EtudiantService);

  readonly etudiant = signal<Etudiant | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.service.getMonDossier().subscribe({
      next: (data) => {
        this.etudiant.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          extractHttpErrorMessage(err, {
            notFound: "Aucun dossier étudiant associé à votre compte.",
            forbidden: "Vous n'avez pas accès à ce dossier.",
            default: "Impossible de charger votre dossier étudiant.",
          }),
        );
        this.loading.set(false);
      },
    });
  }
}
