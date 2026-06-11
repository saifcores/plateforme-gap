import { DatePipe } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBar } from "@angular/material/snack-bar";

import { FormationService } from "./formation.service";
import {
  Formateur,
  Formation,
  FormationFormateurLink,
  LABELS_REUNION,
  Reunion,
  Seance,
  StatGenre,
  TYPES_REUNION,
  TYPES_SEANCE,
} from "./formation.models";
import { AuthService } from "../../core/auth/auth.service";
import { ConfirmDialogService } from "../../shared/confirm-dialog.service";
import { formatLocalDate, formatLocalDateTime } from "../../shared/date.utils";
import {
  extractApiErrorMessage,
  extractHttpErrorMessage,
  showApiErrorSnack,
} from "../../core/http/http-error.utils";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";

@Component({
  selector: "app-formation-detail",
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./formation-detail.component.html",
  styleUrl: "./formation-detail.component.scss",
})
export class FormationDetailComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(FormationService);
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly snack = inject(MatSnackBar);
  private readonly confirm = inject(ConfirmDialogService);

  readonly typesSeance = TYPES_SEANCE;
  readonly typesReunion = TYPES_REUNION;
  readonly labelsReunion = LABELS_REUNION;
  readonly seanceColumns = [
    "date",
    "horaire",
    "matiere",
    "type",
    "formateur",
    "salle",
    "actions",
  ];
  readonly formateurColumns = ["nom", "role", "actions"];
  readonly reunionColumns = ["type", "objet", "date", "lieu", "actions"];

  readonly formation = signal<Formation | null>(null);
  readonly seances = signal<Seance[]>([]);
  readonly reunions = signal<Reunion[]>([]);
  readonly formateurs = signal<Formateur[]>([]);
  readonly formateursAffectes = signal<FormationFormateurLink[]>([]);
  readonly statsGenre = signal<StatGenre[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly addingSeance = signal(false);
  readonly editingSeanceId = signal<number | null>(null);
  readonly savingReunion = signal(false);
  readonly editingReunionId = signal<number | null>(null);

  readonly canManage = this.auth.hasAnyRole([
    "ADMIN",
    "ADMINISTRATIF",
    "RESPONSABLE_FORMATION",
    "ENSEIGNANT",
  ]);

  readonly canAssignFormateurs = this.auth.hasAnyRole([
    "ADMIN",
    "ADMINISTRATIF",
    "RESPONSABLE_FORMATION",
  ]);

  readonly maxGenre = computed(() =>
    Math.max(1, ...this.statsGenre().map((s) => s.nombre)),
  );

  private formationId!: number;

  readonly seanceForm = this.fb.group({
    matiere: ["", Validators.required],
    type: ["COURS", Validators.required],
    dateSeance: [null as Date | null, Validators.required],
    heureDebut: ["08:00", Validators.required],
    heureFin: ["10:00", Validators.required],
    salle: [""],
    formateurId: [null as number | null],
  });

  readonly assignForm = this.fb.group({
    formateurId: [null as number | null, Validators.required],
    roleDansFormation: ["INTERVENANT"],
  });

  readonly reunionForm = this.fb.group({
    type: ["TUTORAT", Validators.required],
    objet: ["", Validators.required],
    dateReunion: [null as Date | null, Validators.required],
    heureReunion: ["10:00", Validators.required],
    lieu: [""],
    compteRendu: [""],
  });

  constructor() {
    this.formationId = Number(this.route.snapshot.paramMap.get("id"));
    this.service.get(this.formationId).subscribe({
      next: (f) => {
        this.formation.set(f);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(
          extractHttpErrorMessage(err, {
            notFound: "Formation introuvable ou accès refusé.",
            forbidden: "Vous n'avez pas accès à cette formation.",
            default: "Impossible de charger la formation.",
          }),
        );
        this.loading.set(false);
      },
    });
    this.service.formateursOptions().subscribe({
      next: (list) => this.formateurs.set(list),
      error: (err) =>
        showApiErrorSnack(
          this.snack,
          err,
          "Impossible de charger la liste des formateurs",
        ),
    });
    this.loadSeances();
    this.loadReunions();
    this.loadFormateursAffectes();
    this.loadStatsGenre();
  }

  loadSeances(): void {
    this.service.seances(this.formationId).subscribe({
      next: (s) => this.seances.set(s),
      error: () => this.seances.set([]),
    });
  }

  loadFormateursAffectes(): void {
    this.service.formateursAffectes(this.formationId).subscribe({
      next: (list) => this.formateursAffectes.set(list),
      error: () => this.formateursAffectes.set([]),
    });
  }

  loadStatsGenre(): void {
    this.service.statsGenre(this.formationId).subscribe({
      next: (stats) => this.statsGenre.set(stats),
      error: () => this.statsGenre.set([]),
    });
  }

  loadReunions(): void {
    this.service.reunions(this.formationId).subscribe({
      next: (list) => this.reunions.set(list),
      error: () => this.reunions.set([]),
    });
  }

  sauvegarderSeance(): void {
    if (this.seanceForm.invalid) {
      this.seanceForm.markAllAsTouched();
      return;
    }
    this.addingSeance.set(true);
    const raw = this.seanceForm.getRawValue();
    const payload = {
      matiere: raw.matiere!,
      type: raw.type!,
      dateSeance: formatLocalDate(raw.dateSeance!)!,
      heureDebut: this.normalizeTime(raw.heureDebut!),
      heureFin: this.normalizeTime(raw.heureFin!),
      salle: raw.salle || undefined,
      formateurId: raw.formateurId ?? null,
    };
    const editId = this.editingSeanceId();
    const req$ = editId
      ? this.service.updateSeance(this.formationId, editId, payload)
      : this.service.createSeance(this.formationId, payload);
    req$.subscribe({
      next: () => {
        this.addingSeance.set(false);
        this.snack.open(
          editId ? "Séance mise à jour" : "Séance ajoutée",
          "OK",
          { duration: 3000 },
        );
        this.resetSeanceForm();
        this.loadSeances();
      },
      error: (err) => {
        this.addingSeance.set(false);
        this.snack.open(extractApiErrorMessage(err, "Échec"), "OK", {
          duration: 4000,
        });
      },
    });
  }

  editerSeance(s: Seance): void {
    this.editingSeanceId.set(s.id);
    this.seanceForm.patchValue({
      matiere: s.matiere,
      type: s.type,
      dateSeance: new Date(s.dateSeance),
      heureDebut: s.heureDebut?.substring(0, 5) ?? "08:00",
      heureFin: s.heureFin?.substring(0, 5) ?? "10:00",
      salle: s.salle ?? "",
      formateurId: s.formateurId ?? null,
    });
  }

  resetSeanceForm(): void {
    this.editingSeanceId.set(null);
    this.seanceForm.reset({
      type: "COURS",
      heureDebut: "08:00",
      heureFin: "10:00",
    });
  }

  supprimerSeance(s: Seance): void {
    this.confirm.confirmDelete("Supprimer cette séance ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.removeSeance(this.formationId, s.id).subscribe({
        next: () => {
          this.snack.open("Séance supprimée", "OK", { duration: 3000 });
          this.loadSeances();
        },
        error: (err) =>
          showApiErrorSnack(this.snack, err, "Suppression impossible"),
      });
    });
  }

  affecterFormateur(): void {
    if (this.assignForm.invalid) {
      this.assignForm.markAllAsTouched();
      return;
    }
    const raw = this.assignForm.getRawValue();
    this.service
      .affecterFormateur(this.formationId, {
        formateurId: raw.formateurId!,
        roleDansFormation: raw.roleDansFormation ?? undefined,
      })
      .subscribe({
        next: () => {
          this.snack.open("Formateur affecté", "OK", { duration: 3000 });
          this.assignForm.reset({ roleDansFormation: "INTERVENANT" });
          this.loadFormateursAffectes();
        },
        error: (err) =>
          this.snack.open(extractApiErrorMessage(err, "Échec"), "OK", {
            duration: 4000,
          }),
      });
  }

  sauvegarderReunion(): void {
    if (this.reunionForm.invalid) {
      this.reunionForm.markAllAsTouched();
      return;
    }
    this.savingReunion.set(true);
    const raw = this.reunionForm.getRawValue();
    const payload = {
      type: raw.type!,
      objet: raw.objet!,
      dateReunion: this.toIsoDateTime(raw.dateReunion!, raw.heureReunion!),
      lieu: raw.lieu || undefined,
      compteRendu: raw.compteRendu || undefined,
    };
    const editId = this.editingReunionId();
    const req$ = editId
      ? this.service.updateReunion(this.formationId, editId, payload)
      : this.service.createReunion(this.formationId, payload);
    req$.subscribe({
      next: () => {
        this.savingReunion.set(false);
        this.snack.open(
          editId ? "Réunion mise à jour" : "Réunion ajoutée",
          "OK",
          { duration: 3000 },
        );
        this.resetReunionForm();
        this.loadReunions();
      },
      error: (err) => {
        this.savingReunion.set(false);
        this.snack.open(extractApiErrorMessage(err, "Échec"), "OK", {
          duration: 4000,
        });
      },
    });
  }

  editerReunion(r: Reunion): void {
    this.editingReunionId.set(r.id);
    const dt = new Date(r.dateReunion);
    this.reunionForm.patchValue({
      type: r.type,
      objet: r.objet,
      dateReunion: dt,
      heureReunion: `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`,
      lieu: r.lieu ?? "",
      compteRendu: r.compteRendu ?? "",
    });
  }

  resetReunionForm(): void {
    this.editingReunionId.set(null);
    this.reunionForm.reset({
      type: "TUTORAT",
      heureReunion: "10:00",
    });
  }

  supprimerReunion(r: Reunion): void {
    this.confirm.confirmDelete("Supprimer cette réunion ?").then((ok) => {
      if (!ok) {
        return;
      }
      this.service.removeReunion(this.formationId, r.id).subscribe({
        next: () => {
          this.snack.open("Réunion supprimée", "OK", { duration: 3000 });
          this.loadReunions();
        },
        error: (err) =>
          showApiErrorSnack(this.snack, err, "Suppression impossible"),
      });
    });
  }

  retirerFormateur(link: FormationFormateurLink): void {
    this.confirm
      .confirmDelete(`Retirer ${link.formateurNom ?? "ce formateur"} ?`)
      .then((ok) => {
        if (!ok) {
          return;
        }
        this.service
          .retirerFormateur(this.formationId, link.formateurId)
          .subscribe({
            next: () => this.loadFormateursAffectes(),
            error: (err) =>
              showApiErrorSnack(this.snack, err, "Retrait impossible"),
          });
      });
  }

  private normalizeTime(value: string): string {
    return value.length === 5 ? `${value}:00` : value;
  }

  private toIsoDateTime(date: Date, time: string): string {
    return formatLocalDateTime(date, this.normalizeTime(time));
  }
}
