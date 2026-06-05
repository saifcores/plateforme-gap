import { Injectable, inject } from "@angular/core";
import { catchError, forkJoin, map, Observable, of } from "rxjs";

import { AuthService } from "../../core/auth/auth.service";
import {
  STAFF_ADMINISTRATION,
  STAFF_ETUDIANTS,
  STAFF_FORMATIONS,
  STAFF_INSERTION,
  STAFF_UTILISATEURS,
} from "../../core/auth/route-roles";
import { NotificationService } from "../../core/notifications/notification.service";
import { AdministrationService } from "../administration/administration.service";
import { CommunicationService } from "../communication/communication.service";
import { EtudiantService } from "../etudiants/etudiant.service";
import { FormationService } from "../formations/formation.service";
import { InsertionService } from "../insertion/insertion.service";
import { UtilisateurService } from "../../core/utilisateurs/utilisateur.service";

export interface DashboardKpi {
  icon: string;
  value: string;
  label: string;
}

@Injectable({ providedIn: "root" })
export class DashboardService {
  private readonly auth = inject(AuthService);
  private readonly etudiants = inject(EtudiantService);
  private readonly formations = inject(FormationService);
  private readonly communication = inject(CommunicationService);
  private readonly administration = inject(AdministrationService);
  private readonly insertion = inject(InsertionService);
  private readonly utilisateurs = inject(UtilisateurService);
  private readonly notifications = inject(NotificationService);

  loadKpis(): Observable<DashboardKpi[]> {
    if (this.auth.hasRole("ETUDIANT")) {
      return this.etudiants.getMonInsertion().pipe(
        map((insertion) => [
          {
            icon: "work",
            value: insertion.type === "SALARIE" ? "Salarié" : "Auto-emploi",
            label: "Statut insertion",
          },
          {
            icon: "business",
            value: insertion.entreprise || "—",
            label: "Entreprise",
          },
          {
            icon: "notifications",
            value: String(this.notifications.unreadCount()),
            label: "Notifications non lues",
          },
        ]),
        catchError(() =>
          of([
            {
              icon: "work",
              value: "En attente",
              label: "Statut insertion",
            },
            {
              icon: "badge",
              value: "Dossier",
              label: "Fiche personnelle",
            },
            {
              icon: "notifications",
              value: String(this.notifications.unreadCount()),
              label: "Notifications non lues",
            },
          ]),
        ),
      );
    }

    const requests: Observable<Partial<Record<string, number>>>[] = [];

    if (this.auth.hasAnyRole(STAFF_ETUDIANTS)) {
      requests.push(
        this.etudiants
          .search({ page: 0, size: 1 })
          .pipe(map((p) => ({ etudiants: p.totalElements }))),
      );
    }

    if (this.auth.hasAnyRole(STAFF_FORMATIONS)) {
      requests.push(
        this.formations
          .search({ page: 0, size: 1 })
          .pipe(map((p) => ({ formations: p.totalElements }))),
      );
    }

    if (this.auth.hasAnyRole(STAFF_ADMINISTRATION)) {
      requests.push(
        this.administration
          .listCourriers()
          .pipe(map((items) => ({ courriers: items.length }))),
      );
    }

    if (this.auth.hasAnyRole(STAFF_INSERTION)) {
      requests.push(
        this.insertion.stats().pipe(
          map((s) => ({
            insertions: s.totalInsertions,
            stages: s.totalStages,
            partenaires: s.totalPartenaires,
          })),
        ),
      );
    }

    if (this.auth.hasAnyRole(STAFF_UTILISATEURS)) {
      requests.push(
        this.utilisateurs
          .search({ page: 0, size: 1 })
          .pipe(map((p) => ({ utilisateurs: p.totalElements }))),
      );
    }

    if (
      this.auth.hasAnyRole(["ADMIN", "ADMINISTRATIF", "RESPONSABLE_FORMATION"])
    ) {
      requests.push(
        this.communication
          .search({ page: 0, size: 1 })
          .pipe(map((p) => ({ comptesRendus: p.totalElements }))),
      );
    }

    if (!requests.length) {
      return of([
        {
          icon: "apps",
          value: "—",
          label: "Modules accessibles",
        },
      ]);
    }

    return forkJoin(requests).pipe(
      map((chunks) => {
        const data = Object.assign({}, ...chunks);
        const kpis: DashboardKpi[] = [];

        if (data["etudiants"] != null) {
          kpis.push({
            icon: "groups",
            value: String(data["etudiants"]),
            label: "Étudiants",
          });
        }
        if (data["formations"] != null) {
          kpis.push({
            icon: "menu_book",
            value: String(data["formations"]),
            label: "Formations",
          });
        }
        if (data["courriers"] != null) {
          kpis.push({
            icon: "mail",
            value: String(data["courriers"]),
            label: "Courriers",
          });
        }
        if (data["insertions"] != null) {
          kpis.push({
            icon: "work",
            value: String(data["insertions"]),
            label: "Insertions",
          });
        }
        if (data["stages"] != null) {
          kpis.push({
            icon: "business_center",
            value: String(data["stages"]),
            label: "Stages",
          });
        }
        if (data["partenaires"] != null) {
          kpis.push({
            icon: "handshake",
            value: String(data["partenaires"]),
            label: "Partenaires",
          });
        }
        if (data["utilisateurs"] != null) {
          kpis.push({
            icon: "manage_accounts",
            value: String(data["utilisateurs"]),
            label: "Utilisateurs",
          });
        }
        if (data["comptesRendus"] != null) {
          kpis.push({
            icon: "campaign",
            value: String(data["comptesRendus"]),
            label: "Comptes rendus",
          });
        }

        if (this.notifications.unreadCount() > 0) {
          kpis.push({
            icon: "notifications",
            value: String(this.notifications.unreadCount()),
            label: "Notifications non lues",
          });
        }

        return kpis.length
          ? kpis
          : [
              {
                icon: "cloud_done",
                value: "OK",
                label: "Données synchronisées",
              },
            ];
      }),
    );
  }
}
