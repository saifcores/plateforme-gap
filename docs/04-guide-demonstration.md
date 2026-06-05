# Guide de démonstration — GAP UCHK

Ce guide décrit un parcours de démonstration couvrant les 5 modules fonctionnels, le portail étudiant et les exigences transverses (auth JWT, RBAC, notifications, exports, journal d'accès).

## Prérequis

1. PostgreSQL : `docker compose up -d postgres` (à la racine du dépôt)
2. Backend :
   ```bash
   cd platform-be
   export JAVA_HOME=~/.sdkman/candidates/java/21.0.8-tem   # JDK 21 requis
   mvn spring-boot:run -pl gap-app
   ```
3. Frontend : `cd platforme-fe && npm install && npm start`
4. Ouvrir http://localhost:4200

> Au **premier démarrage**, Flyway crée le schéma et `DemoDataInitializer` charge automatiquement formations, étudiants, partenaires, insertions, courriers, etc.

## Comptes de test

| Email                    | Mot de passe | Rôle                  | Usage démo                                        |
| ------------------------ | ------------ | --------------------- | ------------------------------------------------- |
| `admin@uchk.sn`          | `admin123`   | ADMIN                 | Accès complet, utilisateurs, journal d'accès      |
| `administratif@uchk.sn`  | `demo123`    | ADMINISTRATIF         | Courriers, circulaires, budget, personnel         |
| `enseignant@uchk.sn`     | `demo123`    | ENSEIGNANT            | Consultation étudiants, formations, communication |
| `resp.formation@uchk.sn` | `demo123`    | RESPONSABLE_FORMATION | CRUD formations, comptes rendus                   |
| `tuteur@uchk.sn`         | `demo123`    | TUTEUR                | Consultation étudiants                            |
| `insertion@uchk.sn`      | `demo123`    | APPUI_INSERTION       | Module insertion, stats, exports                  |
| `etudiant@uchk.sn`       | `demo123`    | ETUDIANT              | Portail : dossier, emploi du temps, insertion     |

## Scénario 1 — Authentification & RBAC

1. Se connecter avec `admin@uchk.sn` / `admin123`
2. Vérifier le menu latéral : tous les modules staff visibles + **Utilisateurs** et **Journal d'accès**
3. Se déconnecter, se connecter avec `insertion@uchk.sn` / `demo123`
4. Constater : Dashboard, Communication, Circulaires, **Appui insertion** — pas d'accès Administration ni Utilisateurs
5. Tenter une URL interdite (ex. `/utilisateurs`) → redirection vers `/forbidden`

## Scénario 2 — Module Étudiant & Formations

**Compte :** `resp.formation@uchk.sn`

1. **Formations** → 2 formations seedées (Master IL, Certification Web)
2. Ouvrir le Master IL → consulter / ajouter une séance (emploi du temps)
3. **Étudiants** → 3 étudiants seedés (Ndiaye, Sarr, Ba) — recherche, tri, pagination
4. Créer ou modifier un étudiant (diplômes, autres formations) — réservé ADMIN / ADMINISTRATIF

## Scénario 3 — Portail étudiant

**Compte :** `etudiant@uchk.sn`

1. **Mon dossier** → fiche Fatou Ndiaye (INE, formation, diplômes)
2. **Emploi du temps** → séances de la formation liée
3. **Mon insertion** → statut d'insertion professionnelle (`GET /api/insertions/moi`)
4. **Circulaires** → lecture des communications officielles
5. Vérifier l'absence des menus staff (Étudiants, Administration, etc.)

## Scénario 4 — Communication & Notifications

**Compte :** `resp.formation@uchk.sn`

1. **Communication** → compte rendu « Réunion pédagogique » (seed)
2. Filtrer par type, auteur, dates
3. Créer un nouveau compte rendu → notification automatique (cloche en haut à droite)
4. **Notifications** → marquer comme lu / tout marquer comme lu

## Scénario 5 — Administration

**Compte :** `administratif@uchk.sn`

1. **Administration** → onglets Courriers, Notes de service, Notes administratives, Circulaires, Budget, Personnel
2. Courrier seed : « Convention de partenariat Orange »
3. Circulaire seed : « Calendrier des soutenances »
4. Créer un budget avec lignes budgétaires

## Scénario 6 — Appui à l'insertion & Reporting

**Compte :** `insertion@uchk.sn`

1. **Appui insertion** → onglet **Statistiques**
   - Auto-emploi : 1, Emploi salarié : 1, Stages : 1, Partenaires : 2
2. Exporter **PDF** et **Excel** des statistiques
3. Onglets **Insertions**, **Stages**, **Partenaires**, **Contacts** — données seed + recherche/tri

## Scénario 7 — Gestion des utilisateurs (ADMIN)

**Compte :** `admin@uchk.sn`

1. **Utilisateurs** → liste des comptes, création / modification (rôles via `GET /api/roles`)
2. Vérifier que `POST /api/auth/register` n'est accessible qu'avec un token ADMIN (Swagger)
3. **Journal d'accès** → traçabilité des téléchargements + export Excel

## Scénario 8 — API & Swagger

1. Ouvrir http://localhost:8080/swagger-ui.html
2. `POST /api/auth/login` avec les identifiants admin
3. Copier le JWT → **Authorize** (Bearer)
4. Tester `GET /api/insertions/stats`, `GET /api/etudiants/moi` (token étudiant), `GET /api/roles`

## Données seedées (résumé)

| Entité       | Exemples                                                      |
| ------------ | ------------------------------------------------------------- |
| Formations   | Master Ingénierie Logicielle, Certification Développement Web |
| Étudiants    | Fatou Ndiaye, Moussa Sarr, Aissatou Ba                        |
| Partenaires  | Orange Digital Center, Force-N                                |
| Insertions   | Sonatel (SALARIE), Freelance Web (AUTO_EMPLOI)                |
| Stage        | Plateforme e-learning UCHK (note 16.5)                        |
| Courrier     | Convention Orange                                             |
| Circulaire   | Calendrier soutenances                                        |
| Compte rendu | Réunion pédagogique S2                                        |

## Tests automatisés

```bash
# Backend
cd platform-be && mvn test

# Frontend
cd platforme-fe && npm test
```

Couverture actuelle : JWT (`JwtServiceTest`), statistiques et CRUD partenaires (`InsertionServiceTest`, `PartenaireServiceTest`), utilitaire de tri Angular (`sort.util.spec.ts`).

## Mode microservices (optionnel)

Pour une démo en architecture distribuée :

```bash
cd platform-be
docker compose -f docker-compose.microservices.yml up --build
```

Le frontend reste sur `http://localhost:4200` ; la gateway écoute sur le port 8080.
