export type RoleCode =
  | "ADMIN"
  | "ADMINISTRATIF"
  | "ENSEIGNANT"
  | "ENSEIGNANT_ASSOCIE"
  | "RESPONSABLE_FORMATION"
  | "TUTEUR"
  | "APPUI_INSERTION"
  | "ETUDIANT";

export interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  photoUrl?: string;
  actif: boolean;
  roles: RoleCode[];
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  utilisateur: Utilisateur;
}
