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

import { DocumentUploadComponent } from "../../shared/document-upload.component";
import { CommunicationService } from "./communication.service";
import { ROLES, TYPES_COMPTE_RENDU } from "./communication.models";
import { RoleCode } from "../../core/auth/auth.models";

@Component({
  selector: "app-compte-rendu-form",
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
    DocumentUploadComponent,
  ],
  templateUrl: "./compte-rendu-form.component.html",
  styleUrl: "./compte-rendu-form.component.scss",
})
export class CompteRenduFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(CommunicationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);

  readonly types = TYPES_COMPTE_RENDU;
  readonly roles = ROLES;
  readonly saving = signal(false);
  readonly loading = signal(false);
  readonly showValidationError = signal(false);
  readonly editId = signal<number | null>(null);
  readonly titre = computed(() =>
    this.editId() ? "Modifier le compte rendu" : "Nouveau compte rendu",
  );

  readonly form = this.fb.group({
    titre: ["", Validators.required],
    type: ["REUNION", Validators.required],
    dateEvent: [new Date() as Date | null, Validators.required],
    contenu: [""],
    documentUrl: [""],
    rolesAutorises: [[] as RoleCode[]],
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
      next: (c) => {
        this.form.patchValue({
          titre: c.titre,
          type: c.type,
          dateEvent: c.dateEvent ? new Date(c.dateEvent) : null,
          contenu: c.contenu ?? "",
          documentUrl: c.documentUrl ?? "",
          rolesAutorises: c.rolesAutorises ?? [],
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.snack.open("Compte rendu introuvable", "OK", { duration: 4000 });
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
      titre: raw.titre!,
      type: raw.type!,
      dateEvent: new Date(raw.dateEvent!).toISOString().substring(0, 10),
      contenu: raw.contenu || null,
      documentUrl: raw.documentUrl || null,
      rolesAutorises: raw.rolesAutorises ?? [],
    };
    const request$ = this.editId()
      ? this.service.update(this.editId()!, payload)
      : this.service.create(payload);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open("Compte rendu enregistré", "OK", { duration: 3000 });
        this.router.navigate(["/communication"]);
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
