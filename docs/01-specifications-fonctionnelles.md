# Spécifications fonctionnelles

**Projet :** Application web de gestion administrative et pédagogique
**Établissement :** Université Cheikh Hamidou Kane (Ex-UVS)
**Master :** Ingénierie Logicielle P8 — Technologie d'Application Web
**Année :** 2025-2026
**Échéance de dépôt :** Jeudi 11 Juin 2026 à 00h

---

## 1. Objectif

Concevoir et développer une application web **modulaire et évolutive** pour la gestion
administrative et pédagogique de l'université, selon une architecture **3 couches** :

- **Frontend** : Angular + Angular Material (UI réactive, dashboards, formulaires dynamiques)
- **Middle / API REST** : API REST sécurisées, gestion des fichiers/images (logo, documents)
- **Backend** : Spring Boot (monolithe modulaire) + PostgreSQL

Chaque entité (rôle) dispose d'un **espace d'accueil dédié**.

---

## 2. Acteurs et rôles

| Rôle                     | Code                    | Description                                                  |
| ------------------------ | ----------------------- | ------------------------------------------------------------ |
| Administrateur           | `ADMIN`                 | Gestion globale : comptes, rôles, paramétrage, accès à tout. |
| Administratif            | `ADMINISTRATIF`         | Gestion documentaire, budgétaire et RH.                      |
| Enseignant               | `ENSEIGNANT`            | Formateur : cours, devoirs, examens, réunions pédagogiques.  |
| Enseignant associé       | `ENSEIGNANT_ASSOCIE`    | Variante d'enseignant (intervenant externe).                 |
| Responsable de formation | `RESPONSABLE_FORMATION` | Pilotage des formations et des formateurs.                   |
| Tuteur                   | `TUTEUR`                | Suivi du tutorat des étudiants.                              |
| Appui à l'insertion      | `APPUI_INSERTION`       | Suivi insertion pro, stages, partenaires.                    |
| Étudiant                 | `ETUDIANT`              | Consultation de son dossier, emploi du temps, documents.     |

> Un utilisateur peut porter un ou plusieurs rôles (relation many-to-many).

---

## 3. Exigences transversales

- **EX-T1** Authentification par identifiant/mot de passe (JWT).
- **EX-T2** Autorisation basée sur les rôles (RBAC) sur chaque endpoint.
- **EX-T3** Espace d'accueil (dashboard) personnalisé par rôle.
- **EX-T4** Gestion centralisée des documents et images (upload, stockage, accès par rôle).
- **EX-T5** Notifications automatiques (in-app) lors d'événements clés.
- **EX-T6** Exports PDF et Excel des rapports et statistiques.
- **EX-T7** Journalisation des accès aux documents (traçabilité).
- **EX-T8** Pagination, filtres et tri sur toutes les listes.

---

## 4. Modules fonctionnels

### 4.1 Module Communication

| Réf   | Exigence                                                                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| COM-1 | Créer / consulter / modifier / supprimer des comptes rendus (Réunion, Rencontre, Séminaire, Webinaire, Conseil d'Université). |
| COM-2 | Joindre des documents (PDF, images) à un compte rendu.                                                                        |
| COM-3 | Archiver les comptes rendus et y accéder selon le rôle utilisateur.                                                           |
| COM-4 | Restreindre l'accès à un compte rendu à une liste de rôles.                                                                   |
| COM-5 | Générer une notification automatique à chaque nouveau compte rendu ou circulaire.                                             |
| COM-6 | Rechercher / filtrer les comptes rendus par type, date, auteur.                                                               |

### 4.2 Module Administration

**Gestion documentaire**

| Réf   | Exigence                                                                                                    |
| ----- | ----------------------------------------------------------------------------------------------------------- |
| ADM-1 | Courrier arrivé / courrier départ (référence, objet, expéditeur, destinataire, date, pièce jointe, statut). |
| ADM-2 | Notes de service internes et externes.                                                                      |
| ADM-3 | Notes administratives.                                                                                      |
| ADM-4 | Circulaires du niveau central.                                                                              |

**Gestion budgétaire**

| Réf   | Exigence                                                      |
| ----- | ------------------------------------------------------------- |
| ADM-5 | Projet de budget + note d'orientation.                        |
| ADM-6 | Budget réalisé (suivi prévu vs réalisé par ligne budgétaire). |
| ADM-7 | Export du budget (PDF/Excel).                                 |

**Gestion des ressources humaines**

| Réf   | Exigence                                                  |
| ----- | --------------------------------------------------------- |
| ADM-8 | Dossier du personnel (administratif, enseignant, tuteur). |
| ADM-9 | Dossier des étudiants (lien vers le module Étudiant).     |

### 4.3 Module Appui à l'Insertion

| Réf   | Exigence                                                              |
| ----- | --------------------------------------------------------------------- |
| INS-1 | Registre de contact des étudiants (date, canal, objet, compte rendu). |
| INS-2 | Bilan de stages (étudiant, partenaire, sujet, période, évaluation).   |
| INS-3 | Statistiques des sortants vers l'auto-emploi.                         |
| INS-4 | Statistiques des sortants vers l'emploi salarié.                      |
| INS-5 | Base de données des partenariats (gestion des partenaires).           |
| INS-6 | Export des statistiques d'insertion (PDF/Excel).                      |

### 4.4 Module Formations

| Réf   | Exigence                                                                                |
| ----- | --------------------------------------------------------------------------------------- |
| FOR-1 | Informations détaillées : date début/fin, type, niveau, montant et type de financement. |
| FOR-2 | Nombre de formés par genre.                                                             |
| FOR-3 | Emplois du temps (séances : cours, devoir, examen).                                     |
| FOR-4 | Gestion des formateurs (Enseignants, Enseignants associés, Tuteurs).                    |
| FOR-5 | Réunions liées au suivi tutorat.                                                        |
| FOR-6 | Réunions liées à la préparation des cours.                                              |
| FOR-7 | Réunions liées à la préparation des évaluations.                                        |
| FOR-8 | Affectation des formateurs aux formations.                                              |

### 4.5 Module Étudiant

| Réf   | Exigence                                                                   |
| ----- | -------------------------------------------------------------------------- |
| ETU-1 | Fiche étudiant : Id étudiant / INE, nom, prénom, date de naissance, genre. |
| ETU-2 | Formation suivie, promo, année de début, année de sortie.                  |
| ETU-3 | Diplômes obtenus.                                                          |
| ETU-4 | Autres formations.                                                         |
| ETU-5 | Consultation par l'étudiant de son propre dossier et emploi du temps.      |

---

## 5. Programmation des activités pédagogiques

Côté administration / pédagogie, planification de :

- **Cours** (séance de type `COURS`)
- **Devoirs** (séance de type `DEVOIR`)
- **Examens** (séance de type `EXAMEN`)
- **Suivi tutorat** (réunions de tutorat liées à une formation)

---

## 6. Exigences non fonctionnelles

| Réf  | Exigence                                                              |
| ---- | --------------------------------------------------------------------- |
| NF-1 | Temps de réponse API < 500 ms pour les opérations courantes.          |
| NF-2 | Architecture modulaire permettant l'évolution vers des microservices. |
| NF-3 | Code versionné sous Git.                                              |
| NF-4 | Validation des entrées côté backend (Bean Validation) et frontend.    |
| NF-5 | Mots de passe stockés hachés (BCrypt).                                |
| NF-6 | Documentation API (OpenAPI / Swagger).                                |
| NF-7 | Interface responsive (desktop + tablette).                            |

---

## 7. Livrables (barème /20)

| Livrable                                                                           | Points |
| ---------------------------------------------------------------------------------- | ------ |
| Front end (Angular)                                                                | 5      |
| Middle (API REST)                                                                  | 5      |
| Back end (Spring Boot + fonctionnalités)                                           | 5      |
| Autres : specs fonctionnelles, schéma BD, dépôt Git, démo, documentation technique | 5      |

---

## 8. Couverture d'implémentation (état au 05/06/2026)

Synthèse de la livraison par rapport aux exigences ci-dessus. Détail technique : `docs/03-plan-de-realisation.md` §10.

| Domaine              | Couverture                                                                          |
| -------------------- | ----------------------------------------------------------------------------------- |
| EX-T1 à T7           | ✅ JWT, RBAC, dashboard par rôle, documents, notifications, exports, journal d'accès |
| EX-T8                | ⚠️ Pagination/tri/filtres en interface ; pagination serveur partielle                |
| COM-1, COM-4 à COM-6 | ✅ CRUD comptes rendus, visibilité rôles, notifications, filtres                     |
| COM-2, COM-3         | ⚠️ Upload simple / pas d'archivage dédié                                             |
| ADM-1 à ADM-9        | ✅ Courriers, notes, circulaires, budget, personnel                                  |
| INS-1 à INS-6        | ✅ Insertion complète + stats + exports                                              |
| FOR-1 à FOR-8        | ✅ Formations, séances, formateurs, réunions                                         |
| ETU-1 à ETU-5        | ✅ Fiche complète + portail étudiant (`/mon-dossier`, emploi du temps)               |
| NF-1 à NF-7          | ✅ Validation, BCrypt, Swagger, UI responsive Material                               |
