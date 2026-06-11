import { Observable } from "rxjs";

import { Utilisateur } from "../core/auth/auth.models";
import { UtilisateurService } from "../core/utilisateurs/utilisateur.service";
import {
  Budget,
  Circulaire,
  Courrier,
  LigneBudget,
  NoteAdministrative,
  NoteService,
  Personnel,
} from "../features/administration/administration.models";
import { AdministrationService } from "../features/administration/administration.service";
import { Formateur } from "../features/formations/formation.models";
import { FormationService } from "../features/formations/formation.service";
import {
  Insertion,
  Partenaire,
  RegistreContact,
  Stage,
} from "../features/insertion/insertion.models";
import { InsertionService } from "../features/insertion/insertion.service";

export type EntityDetailType =
  | "utilisateur"
  | "formateur"
  | "circulaire"
  | "courrier"
  | "note-service"
  | "note-administrative"
  | "personnel"
  | "budget"
  | "stage"
  | "partenaire"
  | "contact"
  | "insertion";

export interface DetailField {
  label: string;
  value?: string | number | null;
}

export interface EntityDetailView {
  accentClass: string;
  icon: string;
  backLink: string;
  backTab?: string;
  backLabel: string;
  emptyIcon: string;
  emptyMessage: string;
  title: string;
  subtitle: string;
  fields: DetailField[];
  documentUrl?: string;
  content?: string;
  budgetLines?: LigneBudget[];
  etudiantLink?: { id: number; label: string };
}

type EntityRecord = Record<string, unknown>;

export interface EntityDetailDeps {
  utilisateurService: UtilisateurService;
  formationService: FormationService;
  administrationService: AdministrationService;
  insertionService: InsertionService;
}

function fmt(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  return String(value);
}

function joinName(prenom?: string, nom?: string): string {
  return [prenom, nom].filter(Boolean).join(" ").trim() || "—";
}

export function loadEntity(
  type: EntityDetailType,
  id: number,
  deps: EntityDetailDeps,
): Observable<unknown> {
  switch (type) {
    case "utilisateur":
      return deps.utilisateurService.get(id);
    case "formateur":
      return deps.formationService.getFormateur(id);
    case "circulaire":
      return deps.administrationService.getCirculaire(id);
    case "courrier":
      return deps.administrationService.getCourrier(id);
    case "note-service":
      return deps.administrationService.getNote(id);
    case "note-administrative":
      return deps.administrationService.getNoteAdministrative(id);
    case "personnel":
      return deps.administrationService.getPersonnel(id);
    case "budget":
      return deps.administrationService.getBudget(id);
    case "stage":
      return deps.insertionService.getStage(id);
    case "partenaire":
      return deps.insertionService.getPartenaire(id);
    case "contact":
      return deps.insertionService.getContact(id);
    case "insertion":
      return deps.insertionService.getInsertion(id);
  }
}

export function buildEntityDetailView(
  type: EntityDetailType,
  item: unknown,
): EntityDetailView {
  const r = item as EntityRecord;

  switch (type) {
    case "utilisateur": {
      const u = item as Utilisateur;
      return {
        accentClass: "page-accent-administration",
        icon: "manage_accounts",
        backLink: "/utilisateurs",
        backLabel: "Retour",
        emptyIcon: "manage_accounts",
        emptyMessage: "Utilisateur introuvable.",
        title: joinName(u.prenom, u.nom),
        subtitle: u.email,
        fields: [
          { label: "Email", value: u.email },
          { label: "Téléphone", value: fmt(u.telephone) },
          { label: "Statut", value: u.actif ? "Actif" : "Inactif" },
          { label: "Rôles", value: u.roles?.join(", ") ?? "—" },
        ],
      };
    }
    case "formateur": {
      const f = item as Formateur;
      return {
        accentClass: "page-accent-formations",
        icon: "school",
        backLink: "/formateurs",
        backLabel: "Retour",
        emptyIcon: "school",
        emptyMessage: "Formateur introuvable.",
        title: joinName(f.prenom, f.nom),
        subtitle: f.type,
        fields: [
          { label: "Email", value: fmt(f.email) },
          { label: "Type", value: f.type },
          { label: "Spécialité", value: fmt(f.specialite) },
          { label: "Grade", value: fmt(f.grade) },
        ],
      };
    }
    case "circulaire": {
      const c = item as Circulaire;
      return {
        accentClass: "page-accent-communication",
        icon: "description",
        backLink: "/circulaires",
        backLabel: "Retour",
        emptyIcon: "description",
        emptyMessage: "Circulaire introuvable.",
        title: c.objet,
        subtitle: [c.reference, c.dateCirculaire].filter(Boolean).join(" · "),
        fields: [
          { label: "Référence", value: fmt(c.reference) },
          { label: "Niveau", value: fmt(c.niveau) },
          { label: "Date", value: c.dateCirculaire },
        ],
        documentUrl: c.documentUrl,
        content: c.contenu,
      };
    }
    case "courrier": {
      const c = item as Courrier;
      return {
        accentClass: "page-accent-administration",
        icon: "mail",
        backLink: "/administration",
        backTab: "courriers",
        backLabel: "Retour",
        emptyIcon: "mail",
        emptyMessage: "Courrier introuvable.",
        title: c.objet,
        subtitle: `${c.type} · ${c.dateCourrier}`,
        fields: [
          { label: "Type", value: c.type },
          { label: "Référence", value: fmt(c.reference) },
          { label: "Expéditeur", value: fmt(c.expediteur) },
          { label: "Destinataire", value: fmt(c.destinataire) },
          { label: "Date", value: c.dateCourrier },
          { label: "Statut", value: fmt(c.statut) },
        ],
        documentUrl: c.documentUrl,
      };
    }
    case "note-service": {
      const n = item as NoteService;
      return {
        accentClass: "page-accent-administration",
        icon: "sticky_note_2",
        backLink: "/administration",
        backTab: "notes-service",
        backLabel: "Retour",
        emptyIcon: "sticky_note_2",
        emptyMessage: "Note de service introuvable.",
        title: n.objet,
        subtitle: `${n.type} · ${n.dateNote}`,
        fields: [
          { label: "Type", value: n.type },
          { label: "Référence", value: fmt(n.reference) },
          { label: "Date", value: n.dateNote },
        ],
        documentUrl: n.documentUrl,
        content: n.contenu,
      };
    }
    case "note-administrative": {
      const n = item as NoteAdministrative;
      return {
        accentClass: "page-accent-administration",
        icon: "note_alt",
        backLink: "/administration",
        backTab: "notes-administratives",
        backLabel: "Retour",
        emptyIcon: "note_alt",
        emptyMessage: "Note administrative introuvable.",
        title: n.objet,
        subtitle: n.dateNote,
        fields: [{ label: "Date", value: n.dateNote }],
        documentUrl: n.documentUrl,
        content: n.contenu,
      };
    }
    case "personnel": {
      const p = item as Personnel;
      return {
        accentClass: "page-accent-administration",
        icon: "badge",
        backLink: "/administration",
        backTab: "personnel",
        backLabel: "Retour",
        emptyIcon: "badge",
        emptyMessage: "Personnel introuvable.",
        title: joinName(p.prenom, p.nom),
        subtitle: p.type,
        fields: [
          { label: "Matricule", value: fmt(p.matricule) },
          { label: "Fonction", value: fmt(p.fonction) },
          { label: "Email", value: fmt(p.email) },
          { label: "Date d'embauche", value: fmt(p.dateEmbauche) },
        ],
      };
    }
    case "budget": {
      const b = item as Budget;
      return {
        accentClass: "page-accent-administration",
        icon: "account_balance",
        backLink: "/administration",
        backTab: "budget",
        backLabel: "Retour",
        emptyIcon: "account_balance",
        emptyMessage: "Budget introuvable.",
        title: `Budget ${b.annee}`,
        subtitle: `${b.type} · Prévu ${b.totalPrevu ?? 0} · Réalisé ${b.totalRealise ?? 0}`,
        fields: [
          { label: "Année", value: b.annee },
          { label: "Type", value: b.type },
          { label: "Total prévu", value: b.totalPrevu },
          { label: "Total réalisé", value: b.totalRealise },
        ],
        documentUrl: b.documentUrl,
        content: b.noteOrientation,
        budgetLines: b.lignes ?? [],
      };
    }
    case "stage": {
      const s = item as Stage;
      return {
        accentClass: "page-accent-insertion",
        icon: "work",
        backLink: "/insertion",
        backTab: "stages",
        backLabel: "Retour",
        emptyIcon: "work",
        emptyMessage: "Stage introuvable.",
        title: s.sujet || "Stage",
        subtitle: fmt(s.etudiantNom) ?? "—",
        fields: [
          { label: "Étudiant", value: fmt(s.etudiantNom) },
          { label: "Partenaire", value: fmt(s.partenaireNom) },
          { label: "Début", value: fmt(s.dateDebut) },
          { label: "Fin", value: fmt(s.dateFin) },
          { label: "Note /20", value: s.note },
        ],
        content: s.bilan,
        etudiantLink: s.etudiantId
          ? { id: s.etudiantId, label: s.etudiantNom ?? "Voir l'étudiant" }
          : undefined,
      };
    }
    case "partenaire": {
      const p = item as Partenaire;
      return {
        accentClass: "page-accent-insertion",
        icon: "business",
        backLink: "/insertion",
        backTab: "partenaires",
        backLabel: "Retour",
        emptyIcon: "business",
        emptyMessage: "Partenaire introuvable.",
        title: p.nom,
        subtitle: [p.type, p.secteur].filter(Boolean).join(" · "),
        fields: [
          { label: "Contact", value: fmt(p.contactNom) },
          { label: "Email", value: fmt(p.contactEmail) },
          { label: "Téléphone", value: fmt(p.telephone) },
          { label: "Adresse", value: fmt(p.adresse) },
          { label: "Date partenariat", value: fmt(p.datePartenariat) },
          { label: "Statut", value: fmt(p.statut) },
        ],
      };
    }
    case "contact": {
      const c = item as RegistreContact;
      return {
        accentClass: "page-accent-insertion",
        icon: "contact_phone",
        backLink: "/insertion",
        backTab: "contacts",
        backLabel: "Retour",
        emptyIcon: "contact_phone",
        emptyMessage: "Contact introuvable.",
        title: c.objet || "Contact",
        subtitle: fmt(c.etudiantNom) ?? "—",
        fields: [
          { label: "Étudiant", value: fmt(c.etudiantNom) },
          { label: "Date", value: c.dateContact },
          { label: "Canal", value: fmt(c.canal) },
        ],
        content: c.compteRendu,
        etudiantLink: c.etudiantId
          ? { id: c.etudiantId, label: c.etudiantNom ?? "Voir l'étudiant" }
          : undefined,
      };
    }
    case "insertion": {
      const i = item as Insertion;
      return {
        accentClass: "page-accent-insertion",
        icon: "trending_up",
        backLink: "/insertion",
        backTab: "insertions",
        backLabel: "Retour",
        emptyIcon: "trending_up",
        emptyMessage: "Insertion introuvable.",
        title: i.entreprise || i.poste || "Insertion",
        subtitle: fmt(i.etudiantNom) ?? "—",
        fields: [
          { label: "Étudiant", value: fmt(i.etudiantNom) },
          { label: "Type", value: i.type },
          { label: "Entreprise", value: fmt(i.entreprise) },
          { label: "Poste", value: fmt(i.poste) },
          { label: "Secteur", value: fmt(i.secteur) },
          { label: "Date", value: fmt(i.dateInsertion) },
        ],
        etudiantLink: i.etudiantId
          ? { id: i.etudiantId, label: i.etudiantNom ?? "Voir l'étudiant" }
          : undefined,
      };
    }
  }
}

function emptyEntityStub(type: EntityDetailType): unknown {
  switch (type) {
    case "utilisateur":
      return { email: "", prenom: "", nom: "", actif: false, roles: [] };
    case "formateur":
      return { nom: "", prenom: "" };
    case "circulaire":
      return { objet: "", dateCirculaire: "" };
    case "courrier":
      return { objet: "", type: "", dateCourrier: "" };
    case "note-service":
      return { objet: "", type: "", dateNote: "" };
    case "note-administrative":
      return { objet: "", dateNote: "" };
    case "personnel":
      return { prenom: "", nom: "", type: "" };
    case "budget":
      return { annee: 0, type: "", lignes: [] };
    case "stage":
      return { sujet: "" };
    case "partenaire":
      return { nom: "" };
    case "contact":
      return { objet: "" };
    case "insertion":
      return { type: "" };
  }
}

/** Navigation shell used when the entity fails to load (404, 403, etc.). */
export function entityDetailShell(type: EntityDetailType): EntityDetailView {
  return buildEntityDetailView(type, emptyEntityStub(type));
}
