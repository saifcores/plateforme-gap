import { Component, computed, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
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
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBar } from "@angular/material/snack-bar";

import { EtudiantService } from "./etudiant.service";
import {
  extractApiErrorMessage,
  extractHttpErrorMessage,
  showApiErrorSnack,
} from "../../core/http/http-error.utils";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { formatLocalDate } from "../../shared/date.utils";
import { GENRES } from "./etudiant.models";
import { FormationService } from "../formations/formation.service";
import { Formation } from "../formations/formation.models";

@Component({
  selector: "app-etudiant-form",
  standalone: true,
  imports: [
    PageFeedbackComponent,
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
    MatTooltipModule,
  ],
  templateUrl: "./etudiant-form.component.html",
  styleUrl: "./etudiant-form.component.scss",
})
export class EtudiantFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(EtudiantService);
  private readonly formationService = inject(FormationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly genres = GENRES;
  readonly formations = signal<Formation[]>([]);
  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly saving = signal(false);
  readonly showValidationError = signal(false);
  readonly editId = signal<number | null>(null);
  readonly titre = computed(() =>
    this.editId() ? "Modifier un étudiant" : "Nouvel étudiant",
  );

  readonly form = this.fb.group({
    ine: ["", Validators.required],
    nom: ["", Validators.required],
    prenom: ["", Validators.required],
    dateNaissance: [null as Date | null],
    genre: [null as string | null],
    email: ["", Validators.email],
    telephone: [""],
    formationId: [null as number | null],
    promo: [""],
    anneeDebut: [null as number | null],
    anneeSortie: [null as number | null],
    diplomes: this.fb.array([] as FormGroup[]),
    autresFormations: this.fb.array([] as FormGroup[]),
  });

  get diplomes(): FormArray {
    return this.form.get("diplomes") as FormArray;
  }

  get autresFormations(): FormArray {
    return this.form.get("autresFormations") as FormArray;
  }

  constructor() {
    this.formationService.options().subscribe({
      next: (f) => this.formations.set(f),
      error: (err) =>
        showApiErrorSnack(
          this.snack,
          err,
          "Impossible de charger la liste des formations",
        ),
    });

    const idParam = this.route.snapshot.paramMap.get("id");
    if (idParam) {
      this.editId.set(Number(idParam));
      this.loadEtudiant(Number(idParam));
    }
  }

  private loadEtudiant(id: number): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.service.get(id).subscribe({
      next: (e) => {
        this.form.patchValue({
          ine: e.ine,
          nom: e.nom,
          prenom: e.prenom,
          dateNaissance: e.dateNaissance ? new Date(e.dateNaissance) : null,
          genre: e.genre ?? null,
          email: e.email ?? "",
          telephone: e.telephone ?? "",
          formationId: e.formationId ?? null,
          promo: e.promo ?? "",
          anneeDebut: e.anneeDebut ?? null,
          anneeSortie: e.anneeSortie ?? null,
        });
        e.diplomes.forEach((d) =>
          this.diplomes.push(
            this.diplomeGroup(d.intitule, d.type, d.etablissement, d.annee),
          ),
        );
        e.autresFormations.forEach((a) =>
          this.autresFormations.push(
            this.autreGroup(a.intitule, a.organisme, a.annee),
          ),
        );
        this.loading.set(false);
      },
      error: (err) => {
        this.loadError.set(
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

  private diplomeGroup(
    intitule = "",
    type = "",
    etablissement = "",
    annee: number | null = null,
  ): FormGroup {
    return this.fb.group({
      intitule: [intitule, Validators.required],
      type: [type],
      etablissement: [etablissement],
      annee: [annee],
    });
  }

  private autreGroup(
    intitule = "",
    organisme = "",
    annee: number | null = null,
  ): FormGroup {
    return this.fb.group({
      intitule: [intitule, Validators.required],
      organisme: [organisme],
      annee: [annee],
    });
  }

  ajouterDiplome(): void {
    this.diplomes.push(this.diplomeGroup());
  }

  retirerDiplome(i: number): void {
    this.diplomes.removeAt(i);
  }

  ajouterAutre(): void {
    this.autresFormations.push(this.autreGroup());
  }

  retirerAutre(i: number): void {
    this.autresFormations.removeAt(i);
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
      dateNaissance: raw.dateNaissance
        ? formatLocalDate(raw.dateNaissance)!
        : null,
      email: raw.email || null,
      telephone: raw.telephone || null,
      promo: raw.promo || null,
      diplomes: raw.diplomes,
      autresFormations: raw.autresFormations,
    };

    const request$ = this.editId()
      ? this.service.update(this.editId()!, payload as never)
      : this.service.create(payload as never);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open("Étudiant enregistré", "OK", { duration: 3000 });
        this.router.navigate(["/etudiants"]);
      },
      error: (err) => {
        this.saving.set(false);
        const msg = extractApiErrorMessage(err, "Échec de l'enregistrement");
        this.snack.open(msg, "OK", { duration: 4000 });
      },
    });
  }
}
