import { RoleCode } from "../../core/auth/auth.models";

export interface CompteRendu {
  id: number;
  titre: string;
  type: string;
  dateEvent: string;
  contenu?: string;
  documentUrl?: string;
  auteur?: string;
  rolesAutorises: RoleCode[];
}

export interface CompteRenduRequest {
  titre: string;
  type: string;
  dateEvent: string;
  contenu?: string | null;
  documentUrl?: string | null;
  rolesAutorises: RoleCode[];
}

export const TYPES_COMPTE_RENDU = [
  "REUNION",
  "RENCONTRE",
  "SEMINAIRE",
  "WEBINAIRE",
  "CONSEIL_UNIVERSITE",
];

export const ROLES: RoleCode[] = [
  "ADMIN",
  "ADMINISTRATIF",
  "ENSEIGNANT",
  "ENSEIGNANT_ASSOCIE",
  "RESPONSABLE_FORMATION",
  "TUTEUR",
  "APPUI_INSERTION",
  "ETUDIANT",
];
