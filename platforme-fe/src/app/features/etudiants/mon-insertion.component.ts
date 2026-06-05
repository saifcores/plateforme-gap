import { Component, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";

import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { EtudiantService } from "./etudiant.service";
import { Insertion } from "../insertion/insertion.models";

@Component({
  selector: "app-mon-insertion",
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatListModule,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./mon-insertion.component.html",
  styleUrl: "./mon-insertion.component.scss",
})
export class MonInsertionComponent {
  private readonly service = inject(EtudiantService);

  readonly insertion = signal<Insertion | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.service.getMonInsertion().subscribe({
      next: (data) => {
        this.insertion.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          "Aucune insertion enregistrée pour votre dossier pour le moment.",
        );
        this.loading.set(false);
      },
    });
  }
}
