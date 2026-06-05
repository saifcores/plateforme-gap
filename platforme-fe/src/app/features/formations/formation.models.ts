export interface Formation {
  id: number;
  intitule: string;
  type: string;
  niveau?: string;
  dateDebut?: string;
  dateFin?: string;
  typeFinancement?: string;
  montantFinancement?: number;
  description?: string;
}

export type FormationRequest = Omit<Formation, "id">;

export interface Formateur {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  type: string;
  specialite?: string;
  grade?: string;
}

export type FormateurRequest = Omit<Formateur, "id">;

export interface Seance {
  id: number;
  formationId: number;
  formateurId?: number;
  formateurNom?: string;
  matiere: string;
  type: string;
  dateSeance: string;
  heureDebut: string;
  heureFin: string;
  salle?: string;
}

export interface SeanceRequest {
  formateurId?: number | null;
  matiere: string;
  type: string;
  dateSeance: string;
  heureDebut: string;
  heureFin: string;
  salle?: string;
}

export const TYPES_FORMATION = [
  "DIPLOMANTE",
  "CERTIFIANTE",
  "PRIVEE",
  "CONTINUE",
];

export const TYPES_FINANCEMENT = ["ETAT", "PRIVE", "PARTENAIRE", "AUTOFINANCE"];

export const TYPES_FORMATEUR = [
  "ENSEIGNANT",
  "ENSEIGNANT_ASSOCIE",
  "RESPONSABLE_FORMATION",
  "TUTEUR",
];

export const TYPES_SEANCE = ["COURS", "DEVOIR", "EXAMEN"];

export interface FormationFormateurLink {
  formationId: number;
  formateurId: number;
  formateurNom?: string;
  roleDansFormation?: string;
}

export interface StatGenre {
  genre: string;
  nombre: number;
}

export interface AssignFormateurRequest {
  formateurId: number;
  roleDansFormation?: string;
}

export interface Reunion {
  id: number;
  formationId?: number;
  type: string;
  objet: string;
  dateReunion: string;
  lieu?: string;
  compteRendu?: string;
}

export interface ReunionRequest {
  type: string;
  objet: string;
  dateReunion: string;
  lieu?: string;
  compteRendu?: string;
}

export const TYPES_REUNION = [
  "TUTORAT",
  "PREPARATION_COURS",
  "PREPARATION_EVALUATION",
] as const;

export const LABELS_REUNION: Record<string, string> = {
  TUTORAT: "Suivi tutorat",
  PREPARATION_COURS: "Préparation des cours",
  PREPARATION_EVALUATION: "Préparation des évaluations",
};
