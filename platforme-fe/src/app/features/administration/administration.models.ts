export interface Courrier {
  id: number;
  type: string;
  reference?: string;
  objet: string;
  expediteur?: string;
  destinataire?: string;
  dateCourrier: string;
  documentUrl?: string;
  statut?: string;
}

export interface NoteAdministrative {
  id: number;
  objet: string;
  contenu?: string;
  documentUrl?: string;
  dateNote: string;
}

export interface NoteService {
  id: number;
  type: string;
  reference?: string;
  objet: string;
  contenu?: string;
  documentUrl?: string;
  dateNote: string;
}

export interface Circulaire {
  id: number;
  reference?: string;
  objet: string;
  contenu?: string;
  documentUrl?: string;
  dateCirculaire: string;
  niveau?: string;
}

export interface Personnel {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  matricule?: string;
  type: string;
  fonction?: string;
  dateEmbauche?: string;
}

export interface LigneBudget {
  id?: number;
  intitule: string;
  montantPrevu?: number;
  montantRealise?: number;
}

export interface Budget {
  id: number;
  annee: number;
  type: string;
  noteOrientation?: string;
  documentUrl?: string;
  totalPrevu?: number;
  totalRealise?: number;
  lignes: LigneBudget[];
}

export const TYPES_COURRIER = ["ARRIVE", "DEPART"];
export const STATUTS_COURRIER = ["RECU", "TRAITE", "ARCHIVE"];
export const TYPES_NOTE = ["INTERNE", "EXTERNE"];
export const TYPES_PERSONNEL = ["ADMINISTRATIF", "ENSEIGNANT", "TUTEUR"];
export const TYPES_BUDGET = ["PROJET", "REALISE"];
