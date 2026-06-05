export interface Partenaire {
  id: number;
  nom: string;
  type?: string;
  secteur?: string;
  contactNom?: string;
  contactEmail?: string;
  telephone?: string;
  adresse?: string;
  datePartenariat?: string;
  statut?: string;
}

export interface Stage {
  id: number;
  etudiantId: number;
  etudiantNom?: string;
  partenaireId?: number;
  partenaireNom?: string;
  sujet?: string;
  dateDebut?: string;
  dateFin?: string;
  bilan?: string;
  note?: number;
}

export interface RegistreContact {
  id: number;
  etudiantId: number;
  etudiantNom?: string;
  dateContact: string;
  canal?: string;
  objet?: string;
  compteRendu?: string;
}

export interface Insertion {
  id: number;
  etudiantId: number;
  etudiantNom?: string;
  type: string;
  entreprise?: string;
  poste?: string;
  secteur?: string;
  dateInsertion?: string;
}

export interface InsertionStats {
  totalInsertions: number;
  autoEmploi: number;
  salarie: number;
  totalStages: number;
  totalContacts: number;
  totalPartenaires: number;
  parSecteur: { secteur: string; count: number }[];
}

export const TYPES_INSERTION = ["AUTO_EMPLOI", "SALARIE"];
export const CANAUX_CONTACT = [
  "TELEPHONE",
  "EMAIL",
  "ENTRETIEN",
  "SMS",
  "VISITE",
];
export const TYPES_PARTENAIRE = ["ENTREPRISE", "ONG", "INSTITUTION", "STARTUP"];
export const STATUTS_PARTENAIRE = ["ACTIF", "INACTIF"];
