import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBar } from "@angular/material/snack-bar";

import { FormationService } from "./formation.service";
import { TYPES_FINANCEMENT, TYPES_FORMATION } from "./formation.models";

@Component({
  selector: "app-formation-form",
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./formation-form.component.html",
  styleUrl: "./formation-form.component.scss",
})
export class FormationFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(FormationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly typesFormation = TYPES_FORMATION;
  readonly typesFinancement = TYPES_FINANCEMENT;
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly showValidationError = signal(false);
  readonly editId = signal<number | null>(null);
  readonly titre = computed(() =>
    this.editId() ? "Modifier la formation" : "Nouvelle formation",
  );

  readonly form = this.fb.group({
    intitule: ["", Validators.required],
    type: ["DIPLOMANTE", Validators.required],
    niveau: [""],
    dateDebut: [null as Date | null],
    dateFin: [null as Date | null],
    typeFinancement: [null as string | null],
    montantFinancement: [null as number | null],
    description: [""],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.editId.set(Number(idParam));
      this.load(Number(idParam));
    }
  }

  private load(id: number): void {
    this.loading.set(true);
    this.service.get(id).subscribe({
      next: (f) => {
        this.form.patchValue({
          intitule: f.intitule,
          type: f.type,
          niveau: f.niveau ?? "",
          dateDebut: f.dateDebut ? new Date(f.dateDebut) : null,
          dateFin: f.dateFin ? new Date(f.dateFin) : null,
          typeFinancement: f.typeFinancement ?? null,
          montantFinancement: f.montantFinancement ?? null,
          description: f.description ?? "",
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snack.open("Formation introuvable", "OK", { duration: 4000 });
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showValidationError.set(true);
      return;
    }
    this.showValidationError.set(false);
    this.saving.set(true);
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      niveau: raw.niveau || undefined,
      description: raw.description || undefined,
      dateDebut: raw.dateDebut
        ? new Date(raw.dateDebut).toISOString().substring(0, 10)
        : undefined,
      dateFin: raw.dateFin
        ? new Date(raw.dateFin).toISOString().substring(0, 10)
        : undefined,
      typeFinancement: raw.typeFinancement || undefined,
      montantFinancement: raw.montantFinancement ?? undefined,
    };

    const request$ = this.editId()
      ? this.service.update(this.editId()!, payload as never)
      : this.service.create(payload as never);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open("Formation enregistrée", "OK", { duration: 3000 });
        this.router.navigate(["/formations"]);
      },
      error: (err) => {
        this.saving.set(false);
        this.snack.open(
          err?.error?.message ?? "Échec de l'enregistrement",
          "OK",
          {
            duration: 4000,
          },
        );
      },
    });
  }
}
