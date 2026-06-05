# UCHK — Gestion administrative et pédagogique

Application web modulaire de gestion administrative et pédagogique de l'**Université
Cheikh Hamidou Kane** (Master Ingénierie Logicielle P8 — Technologie d'Application Web).

Architecture **3 couches** :

| Couche          | Technologie                   | Dossier              |
| --------------- | ----------------------------- | -------------------- |
| Frontend        | Angular 19 + Angular Material | `platforme-fe/`      |
| API REST        | Spring Boot 3.3, JWT, OpenAPI | `platform-be/`       |
| Base de données | PostgreSQL 16 + Flyway        | `docker-compose.yml` |

Le backend est un **monolithe modulaire Maven** (`gap-app`, port 8080), déployable aussi en **microservices** via `gap-gateway` et `docker-compose.microservices.yml`.

## Documentation

| Fichier                                                                                | Contenu                                   |
| -------------------------------------------------------------------------------------- | ----------------------------------------- |
| [`docs/01-specifications-fonctionnelles.md`](docs/01-specifications-fonctionnelles.md) | Exigences fonctionnelles et couverture    |
| [`docs/02-schema-base-de-donnees.md`](docs/02-schema-base-de-donnees.md)               | Schéma BD (ERD + DDL)                     |
| [`docs/03-plan-de-realisation.md`](docs/03-plan-de-realisation.md)                     | Architecture, stack, feuille de route     |
| [`docs/04-guide-demonstration.md`](docs/04-guide-demonstration.md)                     | Parcours de démo et comptes de test       |
| [`platform-be/README.md`](platform-be/README.md)                                       | Modules Maven, monolithe / microservices  |
| [`platforme-fe/README.md`](platforme-fe/README.md)                                     | Routes Angular, auth, composants partagés |

## Prérequis

- **Java 21** (ex. via SDKMAN : `sdk use java 21.0.8-tem`)
- Maven 3.8+
- Node.js 20+ et npm
- Docker (PostgreSQL)

## Démarrage rapide

### 1. Base de données

```bash
docker compose up -d postgres
```

Base : `gap_universite` — utilisateur `gap` / mot de passe `gap` — port `5432`.

### 2. Backend (monolithe — recommandé)

```bash
cd platform-be
export JAVA_HOME=~/.sdkman/candidates/java/21.0.8-tem   # adapter si besoin
mvn spring-boot:run -pl gap-app
```

- API : http://localhost:8080/api
- Swagger UI : http://localhost:8080/swagger-ui.html

Au premier démarrage, Flyway crée le schéma, le compte **admin** et un **jeu de données de démo**.

### 3. Frontend

```bash
cd platforme-fe
npm install
npm start            # http://localhost:4200
```

Le serveur de dev proxifie `/api` vers `http://localhost:8080` (`proxy.conf.json`).

## Comptes de démonstration

| Email                    | Mot de passe | Rôle                  |
| ------------------------ | ------------ | --------------------- |
| `admin@uchk.sn`          | `admin123`   | ADMIN                 |
| `administratif@uchk.sn`  | `demo123`    | ADMINISTRATIF         |
| `enseignant@uchk.sn`     | `demo123`    | ENSEIGNANT            |
| `resp.formation@uchk.sn` | `demo123`    | RESPONSABLE_FORMATION |
| `tuteur@uchk.sn`         | `demo123`    | TUTEUR                |
| `insertion@uchk.sn`      | `demo123`    | APPUI_INSERTION       |
| `etudiant@uchk.sn`       | `demo123`    | ETUDIANT              |

Parcours complet : [`docs/04-guide-demonstration.md`](docs/04-guide-demonstration.md).

## Authentification

| Méthode | Endpoint             | Description                 | Accès       |
| ------- | -------------------- | --------------------------- | ----------- |
| POST    | `/api/auth/login`    | Connexion (retourne un JWT) | Public      |
| POST    | `/api/auth/register` | Création d'un utilisateur   | **ADMIN**   |
| GET     | `/api/auth/me`       | Profil connecté             | Authentifié |
| GET     | `/api/utilisateurs`  | Liste des utilisateurs      | ADMIN       |
| GET     | `/api/roles`         | Liste des rôles disponibles | ADMIN       |

## Endpoints métier (aperçu)

### Pédagogie

| Méthode        | Endpoint                             | Description                                    |
| -------------- | ------------------------------------ | ---------------------------------------------- |
| GET/POST       | `/api/etudiants`                     | Liste / création (diplômes, autres formations) |
| GET/PUT/DELETE | `/api/etudiants/{id}`                | Détail / modification / suppression            |
| GET            | `/api/etudiants/moi`                 | Dossier de l'étudiant connecté                 |
| GET            | `/api/etudiants/moi/emploi-du-temps` | Emploi du temps étudiant                       |
| GET/POST       | `/api/formations`                    | Formations                                     |
| GET/POST       | `/api/formations/{id}/seances`       | Emploi du temps (cours, devoir, examen)        |
| GET/POST       | `/api/formateurs`                    | Formateurs                                     |

### Communication & administration

| Méthode  | Endpoint                                                   | Description                             |
| -------- | ---------------------------------------------------------- | --------------------------------------- |
| GET/POST | `/api/comptes-rendus`                                      | Comptes rendus (visibilité par rôle)    |
| GET      | `/api/notifications`                                       | Notifications in-app                    |
| GET/POST | `/api/courriers`, `/api/notes-service`, `/api/circulaires` | Gestion documentaire                    |
| GET/POST | `/api/budgets`, `/api/personnels`                          | Budget et RH                            |
| POST     | `/api/documents`                                           | Upload de fichiers                      |
| GET      | `/api/journal-acces-documents`                             | Journal des accès aux documents (EX-T7) |

### Insertion professionnelle

| Méthode  | Endpoint                                                    | Description                      |
| -------- | ----------------------------------------------------------- | -------------------------------- |
| GET/POST | `/api/partenaires`, `/api/stages`, `/api/registre-contacts` | Partenaires, stages, contacts    |
| GET/POST | `/api/insertions`                                           | Sortants (auto-emploi / salarié) |
| GET      | `/api/insertions/moi`                                       | Insertion de l'étudiant connecté |
| GET      | `/api/insertions/stats`                                     | Statistiques d'insertion         |
| GET      | `/api/insertions/export/pdf`, `.../excel`                   | Exports                          |

Chaque ressource CRUD expose aussi `GET/PUT/DELETE /{id}` sauf mention contraire.

## Rôles

`ADMIN`, `ADMINISTRATIF`, `ENSEIGNANT`, `ENSEIGNANT_ASSOCIE`,
`RESPONSABLE_FORMATION`, `TUTEUR`, `APPUI_INSERTION`, `ETUDIANT`.

## Tests

```bash
# Backend (3 tests unitaires : JWT, insertion, partenaires)
cd platform-be && mvn test

# Frontend (tri client)
cd platforme-fe && npm test
```

## État d'avancement

| Phase  | Contenu                                                           | Statut |
| ------ | ----------------------------------------------------------------- | ------ |
| **P0** | Spécifications, schéma BD, plan                                   | ✅      |
| **P1** | Socle Spring Boot + Angular, PostgreSQL/Flyway, JWT + RBAC        | ✅      |
| **P2** | Modules Étudiant & Formations (CRUD, emploi du temps, formateurs) | ✅      |
| **P3** | Communication & Administration + notifications temps réel         | ✅      |
| **P4** | Appui insertion + statistiques + exports PDF/Excel                | ✅      |
| **P5** | Données de démo, tests, guide de démo, polish UI                  | ✅      |

**Écarts connus** (hors périmètre démo) : archivage comptes rendus (COM-3), pièces jointes multiples (COM-2), pagination serveur sur toutes les listes (EX-T8 — pagination/tri côté client implémenté).
