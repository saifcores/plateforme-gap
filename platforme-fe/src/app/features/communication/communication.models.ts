import { RoleCode } from "../../core/auth/auth.models";

export interface CompteRendu {
  id: number;
  titre: string;
  type: string;
  dateEvent: string;
  contenu?: string;
  documentUrl?: string;
  auteur?: string;
  rolesAutorises?: RoleCode[];
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
] as const;

export const LABELS_TYPE_COMPTE_RENDU: Record<string, string> = {
  REUNION: "Réunion",
  RENCONTRE: "Rencontre",
  SEMINAIRE: "Séminaire",
  WEBINAIRE: "Webinaire",
  CONSEIL_UNIVERSITE: "Conseil université",
};

export const LABELS_ROLE: Record<RoleCode, string> = {
  ADMIN: "Administrateur",
  ADMINISTRATIF: "Administratif",
  ENSEIGNANT: "Enseignant",
  ENSEIGNANT_ASSOCIE: "Enseignant associé",
  RESPONSABLE_FORMATION: "Responsable formation",
  TUTEUR: "Tuteur",
  APPUI_INSERTION: "Appui insertion",
  ETUDIANT: "Étudiant",
};

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
