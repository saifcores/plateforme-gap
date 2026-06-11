import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { catchError, of } from "rxjs";
import { extractHttpErrorMessage } from "../../core/http/http-error.utils";

import { AuthService } from "../../core/auth/auth.service";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";
import { RoleCode } from "../../core/auth/auth.models";
import { DashboardKpi, DashboardService } from "./dashboard.service";

interface ModuleCard {
  titre: string;
  description: string;
  icon: string;
  route: string;
  couleur: string;
  roles: RoleCode[];
}

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [MatCardModule, MatIconModule, PageFeedbackComponent, RouterLink],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);

  readonly user = this.auth.user;
  readonly currentYear = new Date().getFullYear();
  readonly kpis = signal<DashboardKpi[]>([]);
  readonly kpisLoading = signal(true);
  readonly kpisError = signal<string | null>(null);

  readonly bienvenue = computed(() => {
    const u = this.user();
    return u ? `Bienvenue, ${u.prenom}` : "Bienvenue";
  });

  readonly sousTitre = computed(() => {
    if (this.auth.hasRole("ETUDIANT")) {
      return "Consultez votre dossier, votre emploi du temps et votre insertion.";
    }
    if (this.auth.hasRole("APPUI_INSERTION")) {
      return "Suivez les stages, partenaires et statistiques d'insertion.";
    }
    if (this.auth.hasRole("ADMIN")) {
      return "Pilotez l'ensemble des modules et des utilisateurs.";
    }
    if (this.auth.hasRole("ADMINISTRATIF")) {
      return "Gérez l'administration, les courriers et le budget.";
    }
    if (this.auth.hasRole("RESPONSABLE_FORMATION")) {
      return "Organisez les formations, formateurs et emplois du temps.";
    }
    if (
      this.auth.hasRole("ENSEIGNANT") ||
      this.auth.hasRole("ENSEIGNANT_ASSOCIE") ||
      this.auth.hasRole("TUTEUR")
    ) {
      return "Accédez aux étudiants, formations et communications.";
    }
    return "Plateforme de gestion administrative et pédagogique de l'UCHK.";
  });

  private readonly allModules: ModuleCard[] = [
    {
      titre: "Communication",
      description: "Comptes rendus, circulaires et notifications",
      icon: "campaign",
      route: "/communication",
      couleur: "linear-gradient(135deg, #2d6b52, #1a4d3a)",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
        "TUTEUR",
        "APPUI_INSERTION",
        "ETUDIANT",
      ],
    },
    {
      titre: "Administration",
      description: "Courriers, notes de service, budget et RH",
      icon: "folder_shared",
      route: "/administration",
      couleur: "linear-gradient(135deg, #1e4a6e, #123828)",
      roles: ["ADMIN", "ADMINISTRATIF"],
    },
    {
      titre: "Formations",
      description: "Cours, emplois du temps et formateurs",
      icon: "menu_book",
      route: "/formations",
      couleur: "linear-gradient(135deg, #6b4423, #4a2f18)",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
      ],
    },
    {
      titre: "Étudiants",
      description: "Dossiers étudiants, inscriptions et diplômes",
      icon: "groups",
      route: "/etudiants",
      couleur: "linear-gradient(135deg, #c9a227, #8b6914)",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "TUTEUR",
        "APPUI_INSERTION",
      ],
    },
    {
      titre: "Appui insertion",
      description: "Stages, partenaires et statistiques d'insertion",
      icon: "work",
      route: "/insertion",
      couleur: "linear-gradient(135deg, #3d5a80, #2a3f5c)",
      roles: ["ADMIN", "ADMINISTRATIF", "APPUI_INSERTION"],
    },
    {
      titre: "Mon dossier",
      description: "Votre fiche étudiant et parcours académique",
      icon: "badge",
      route: "/mon-dossier",
      couleur: "linear-gradient(135deg, #c9a227, #8b6914)",
      roles: ["ETUDIANT"],
    },
    {
      titre: "Emploi du temps",
      description: "Séances et cours de votre formation",
      icon: "calendar_month",
      route: "/emploi-du-temps",
      couleur: "linear-gradient(135deg, #2d6b52, #1a4d3a)",
      roles: ["ETUDIANT"],
    },
    {
      titre: "Mon insertion",
      description: "Votre statut d'insertion professionnelle",
      icon: "work",
      route: "/mon-insertion",
      couleur: "linear-gradient(135deg, #3d5a80, #2a3f5c)",
      roles: ["ETUDIANT"],
    },
    {
      titre: "Circulaires",
      description: "Communications officielles de l'université",
      icon: "description",
      route: "/circulaires",
      couleur: "linear-gradient(135deg, #1e4a6e, #123828)",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
        "TUTEUR",
        "APPUI_INSERTION",
        "ETUDIANT",
      ],
    },
    {
      titre: "Formateurs",
      description: "Répertoire des enseignants et intervenants",
      icon: "person",
      route: "/formateurs",
      couleur: "linear-gradient(135deg, #6b4423, #4a2f18)",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
      ],
    },
    {
      titre: "Utilisateurs",
      description: "Comptes et rôles de la plateforme",
      icon: "manage_accounts",
      route: "/utilisateurs",
      couleur: "linear-gradient(135deg, #3d5a80, #2a3f5c)",
      roles: ["ADMIN"],
    },
    {
      titre: "Journal d'accès",
      description: "Traçabilité des téléchargements de documents",
      icon: "history",
      route: "/journal-acces",
      couleur: "linear-gradient(135deg, #1e4a6e, #123828)",
      roles: ["ADMIN"],
    },
  ];

  readonly modules = computed(() =>
    this.allModules.filter(
      (m) => m.roles.length === 0 || this.auth.hasAnyRole(m.roles),
    ),
  );

  readonly roleLabel = computed(() => {
    const roles = this.user()?.roles;
    return roles?.length ? roles.join(" · ") : "";
  });

  ngOnInit(): void {
    this.loadKpis();
  }

  private loadKpis(): void {
    this.kpisLoading.set(true);
    this.kpisError.set(null);
    this.dashboardService
      .loadKpis()
      .pipe(
        catchError((err) => {
          this.kpisError.set(
            extractHttpErrorMessage(err, {
              default: "Impossible de charger les indicateurs en temps réel.",
            }),
          );
          return of([
            {
              icon: "cloud_done",
              value: "—",
              label: "Indicateurs indisponibles",
            },
          ]);
        }),
      )
      .subscribe({
        next: (data) => {
          this.kpis.set(data);
          this.kpisLoading.set(false);
        },
        error: () => this.kpisLoading.set(false),
      });
  }
}
