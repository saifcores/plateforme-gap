import { Component, inject, signal } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";

import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { EtudiantService } from "./etudiant.service";
import { Seance } from "../formations/formation.models";

@Component({
  selector: "app-emploi-du-temps",
  standalone: true,
  imports: [MatTableModule, MatIconModule, PageFeedbackComponent],
  templateUrl: "./emploi-du-temps.component.html",
  styleUrl: "./emploi-du-temps.component.scss",
})
export class EmploiDuTempsComponent {
  private readonly service = inject(EtudiantService);

  readonly seances = signal<Seance[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly columns = [
    "dateSeance",
    "heureDebut",
    "matiere",
    "type",
    "formateurNom",
    "salle",
  ];

  constructor() {
    this.service.getMonEmploiDuTemps().subscribe({
      next: (data) => {
        this.seances.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Impossible de charger votre emploi du temps.");
        this.loading.set(false);
      },
    });
  }
}
