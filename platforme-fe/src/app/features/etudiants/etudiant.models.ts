export interface Diplome {
  id?: number;
  intitule: string;
  type?: string;
  etablissement?: string;
  annee?: number;
}

export interface AutreFormation {
  id?: number;
  intitule: string;
  organisme?: string;
  annee?: number;
}

export interface Etudiant {
  id: number;
  ine: string;
  nom: string;
  prenom: string;
  dateNaissance?: string;
  genre?: string;
  email?: string;
  telephone?: string;
  formationId?: number;
  formationIntitule?: string;
  promo?: string;
  anneeDebut?: number;
  anneeSortie?: number;
  diplomes: Diplome[];
  autresFormations: AutreFormation[];
}

export interface EtudiantRequest {
  ine: string;
  nom: string;
  prenom: string;
  dateNaissance?: string | null;
  genre?: string | null;
  email?: string | null;
  telephone?: string | null;
  formationId?: number | null;
  promo?: string | null;
  anneeDebut?: number | null;
  anneeSortie?: number | null;
  diplomes: Diplome[];
  autresFormations: AutreFormation[];
}

export const GENRES = ["HOMME", "FEMME", "AUTRE"];
