import { Routes } from "@angular/router";

import { authGuard } from "./core/auth/auth.guard";
import { roleGuard } from "./core/auth/role.guard";
import { RoleCode } from "./core/auth/auth.models";
import {
  LECTURE_CIRCULAIRES,
  PORTAIL_ETUDIANT,
  STAFF_ADMINISTRATION,
  STAFF_COMMUNICATION,
  STAFF_COMMUNICATION_MANAGE,
  STAFF_ETUDIANTS,
  STAFF_ETUDIANTS_MANAGE,
  STAFF_FORMATIONS,
  STAFF_INSERTION,
  STAFF_UTILISATEURS,
} from "./core/auth/route-roles";
import { EntityDetailType } from "./shared/entity-detail.registry";

const entityDetailRoute = (
  entityType: EntityDetailType,
  roles: RoleCode[],
  extra?: Record<string, unknown>,
) => ({
  canActivate: [roleGuard],
  data: { roles, entityType, ...extra },
  loadComponent: () =>
    import("./shared/entity-detail.component").then(
      (m) => m.EntityDetailComponent,
    ),
});

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./features/auth/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./layout/shell.component").then((m) => m.ShellComponent),
    children: [
      { path: "", pathMatch: "full", redirectTo: "dashboard" },
      {
        path: "dashboard",
        loadComponent: () =>
          import("./features/dashboard/dashboard.component").then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: "forbidden",
        loadComponent: () =>
          import("./features/errors/forbidden.component").then(
            (m) => m.ForbiddenComponent,
          ),
      },
      {
        path: "mon-dossier",
        canActivate: [roleGuard],
        data: { roles: PORTAIL_ETUDIANT },
        loadComponent: () =>
          import("./features/etudiants/mon-dossier.component").then(
            (m) => m.MonDossierComponent,
          ),
      },
      {
        path: "emploi-du-temps",
        canActivate: [roleGuard],
        data: { roles: PORTAIL_ETUDIANT },
        loadComponent: () =>
          import("./features/etudiants/emploi-du-temps.component").then(
            (m) => m.EmploiDuTempsComponent,
          ),
      },
      {
        path: "etudiants",
        canActivate: [roleGuard],
        data: { roles: STAFF_ETUDIANTS },
        loadComponent: () =>
          import("./features/etudiants/etudiant-list.component").then(
            (m) => m.EtudiantListComponent,
          ),
      },
      {
        path: "mon-insertion",
        canActivate: [roleGuard],
        data: { roles: PORTAIL_ETUDIANT },
        loadComponent: () =>
          import("./features/etudiants/mon-insertion.component").then(
            (m) => m.MonInsertionComponent,
          ),
      },
      {
        path: "etudiants/nouveau",
        canActivate: [roleGuard],
        data: { roles: STAFF_ETUDIANTS_MANAGE },
        loadComponent: () =>
          import("./features/etudiants/etudiant-form.component").then(
            (m) => m.EtudiantFormComponent,
          ),
      },
      {
        path: "etudiants/:id",
        canActivate: [roleGuard],
        data: { roles: STAFF_ETUDIANTS },
        loadComponent: () =>
          import("./features/etudiants/etudiant-detail.component").then(
            (m) => m.EtudiantDetailComponent,
          ),
      },
      {
        path: "etudiants/:id/modifier",
        canActivate: [roleGuard],
        data: { roles: STAFF_ETUDIANTS_MANAGE },
        loadComponent: () =>
          import("./features/etudiants/etudiant-form.component").then(
            (m) => m.EtudiantFormComponent,
          ),
      },
      {
        path: "formations",
        canActivate: [roleGuard],
        data: { roles: STAFF_FORMATIONS },
        loadComponent: () =>
          import("./features/formations/formation-list.component").then(
            (m) => m.FormationListComponent,
          ),
      },
      {
        path: "formations/nouveau",
        canActivate: [roleGuard],
        data: { roles: STAFF_FORMATIONS },
        loadComponent: () =>
          import("./features/formations/formation-form.component").then(
            (m) => m.FormationFormComponent,
          ),
      },
      {
        path: "formations/:id",
        canActivate: [roleGuard],
        data: { roles: STAFF_FORMATIONS },
        loadComponent: () =>
          import("./features/formations/formation-detail.component").then(
            (m) => m.FormationDetailComponent,
          ),
      },
      {
        path: "formations/:id/modifier",
        canActivate: [roleGuard],
        data: { roles: STAFF_FORMATIONS },
        loadComponent: () =>
          import("./features/formations/formation-form.component").then(
            (m) => m.FormationFormComponent,
          ),
      },
      {
        path: "formateurs",
        canActivate: [roleGuard],
        data: { roles: STAFF_FORMATIONS },
        loadComponent: () =>
          import("./features/formations/formateur-list.component").then(
            (m) => m.FormateurListComponent,
          ),
      },
      {
        path: "formateurs/:id",
        ...entityDetailRoute("formateur", STAFF_FORMATIONS),
      },
      {
        path: "circulaires",
        canActivate: [roleGuard],
        data: { roles: LECTURE_CIRCULAIRES },
        loadComponent: () =>
          import("./features/communication/circulaires.component").then(
            (m) => m.CirculairesComponent,
          ),
      },
      {
        path: "circulaires/:id",
        ...entityDetailRoute("circulaire", LECTURE_CIRCULAIRES),
      },
      {
        path: "utilisateurs",
        canActivate: [roleGuard],
        data: { roles: STAFF_UTILISATEURS },
        loadComponent: () =>
          import("./features/administration/utilisateur-list.component").then(
            (m) => m.UtilisateurListComponent,
          ),
      },
      {
        path: "utilisateurs/:id",
        ...entityDetailRoute("utilisateur", STAFF_UTILISATEURS),
      },
      {
        path: "journal-acces",
        canActivate: [roleGuard],
        data: { roles: STAFF_UTILISATEURS },
        loadComponent: () =>
          import("./features/administration/journal-acces.component").then(
            (m) => m.JournalAccesComponent,
          ),
      },
      {
        path: "notifications",
        loadComponent: () =>
          import("./features/notifications/notifications.component").then(
            (m) => m.NotificationsComponent,
          ),
      },
      {
        path: "communication",
        canActivate: [roleGuard],
        data: { roles: STAFF_COMMUNICATION },
        loadComponent: () =>
          import("./features/communication/compte-rendu-list.component").then(
            (m) => m.CompteRenduListComponent,
          ),
      },
      {
        path: "communication/nouveau",
        canActivate: [roleGuard],
        data: { roles: STAFF_COMMUNICATION_MANAGE },
        loadComponent: () =>
          import("./features/communication/compte-rendu-form.component").then(
            (m) => m.CompteRenduFormComponent,
          ),
      },
      {
        path: "communication/:id",
        canActivate: [roleGuard],
        data: { roles: STAFF_COMMUNICATION },
        loadComponent: () =>
          import("./features/communication/compte-rendu-detail.component").then(
            (m) => m.CompteRenduDetailComponent,
          ),
      },
      {
        path: "communication/:id/modifier",
        canActivate: [roleGuard],
        data: { roles: STAFF_COMMUNICATION_MANAGE },
        loadComponent: () =>
          import("./features/communication/compte-rendu-form.component").then(
            (m) => m.CompteRenduFormComponent,
          ),
      },
      {
        path: "administration",
        canActivate: [roleGuard],
        data: { roles: STAFF_ADMINISTRATION },
        loadComponent: () =>
          import("./features/administration/administration.component").then(
            (m) => m.AdministrationComponent,
          ),
      },
      {
        path: "administration/courriers/:id",
        ...entityDetailRoute("courrier", STAFF_ADMINISTRATION),
      },
      {
        path: "administration/notes-service/:id",
        ...entityDetailRoute("note-service", STAFF_ADMINISTRATION),
      },
      {
        path: "administration/notes-administratives/:id",
        ...entityDetailRoute("note-administrative", STAFF_ADMINISTRATION),
      },
      {
        path: "administration/circulaires/:id",
        ...entityDetailRoute("circulaire", STAFF_ADMINISTRATION, {
          backLink: "/administration",
          backTab: "circulaires",
        }),
      },
      {
        path: "administration/budgets/:id",
        ...entityDetailRoute("budget", STAFF_ADMINISTRATION),
      },
      {
        path: "administration/personnel/:id",
        ...entityDetailRoute("personnel", STAFF_ADMINISTRATION),
      },
      {
        path: "insertion",
        canActivate: [roleGuard],
        data: { roles: STAFF_INSERTION },
        loadComponent: () =>
          import("./features/insertion/insertion.component").then(
            (m) => m.InsertionComponent,
          ),
      },
      {
        path: "insertion/sortants/:id",
        ...entityDetailRoute("insertion", STAFF_INSERTION),
      },
      {
        path: "insertion/stages/:id",
        ...entityDetailRoute("stage", STAFF_INSERTION),
      },
      {
        path: "insertion/contacts/:id",
        ...entityDetailRoute("contact", STAFF_INSERTION),
      },
      {
        path: "insertion/partenaires/:id",
        ...entityDetailRoute("partenaire", STAFF_INSERTION),
      },
    ],
  },
  { path: "**", redirectTo: "" },
];
