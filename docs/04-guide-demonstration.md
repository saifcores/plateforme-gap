# Guide de démonstration — GAP UCHK

Ce guide décrit un parcours de démonstration couvrant les 5 modules fonctionnels et les exigences transverses (auth JWT, RBAC, notifications, exports).

## Prérequis

1. PostgreSQL démarré : `docker compose up -d postgres`
2. Backend : `cd platform-be && mvn spring-boot:run`
3. Frontend : `cd platforme-fe && npm start`
4. Ouvrir http://localhost:4200

> Au **premier démarrage**, Flyway crée le schéma et le backend charge automatiquement un jeu de données de démonstration (formations, étudiants, partenaires, insertions, courriers, etc.).

## Comptes de test

| Email | Mot de passe | Rôle | Usage démo |
|-------|--------------|------|------------|
| `admin@uchk.sn` | `admin123` | ADMIN | Accès complet, gestion utilisateurs |
| `administratif@uchk.sn` | `demo123` | ADMINISTRATIF | Courriers, circulaires, budget, personnel |
| `enseignant@uchk.sn` | `demo123` | ENSEIGNANT | Consultation étudiants, formations |
| `resp.formation@uchk.sn` | `demo123` | RESPONSABLE_FORMATION | CRUD formations, comptes rendus |
| `tuteur@uchk.sn` | `demo123` | TUTEUR | Consultation étudiants |
| `insertion@uchk.sn` | `demo123` | APPUI_INSERTION | Module insertion, stats, exports |
| `etudiant@uchk.sn` | `demo123` | ETUDIANT | Vue limitée (communication) |

## Scénario 1 — Authentification & RBAC

1. Se connecter avec `admin@uchk.sn` / `admin123`
2. Vérifier le menu latéral : tous les modules visibles
3. Se déconnecter, se connecter avec `insertion@uchk.sn` / `demo123`
4. Constater que seuls Dashboard, Communication et **Appui insertion** sont accessibles

## Scénario 2 — Module Étudiant & Formations

**Compte :** `resp.formation@uchk.sn`

1. **Formations** → 2 formations seedées (Master IL, Certification Web)
2. Ouvrir le Master IL → consulter / ajouter une séance
3. **Étudiants** → 3 étudiants seedés (Ndiaye, Sarr, Ba)
4. Créer ou modifier un étudiant avec diplômes et autres formations

## Scénario 3 — Communication & Notifications

**Compte :** `resp.formation@uchk.sn`

1. **Communication** → compte rendu « Réunion pédagogique » (seed)
2. Créer un nouveau compte rendu → notification automatique (cloche)
3. Cliquer la cloche → marquer comme lu

## Scénario 4 — Administration

**Compte :** `administratif@uchk.sn`

1. **Administration** → onglets Courriers, Notes, Circulaires, Budget, Personnel
2. Courrier seed : « Convention de partenariat Orange »
3. Circulaire seed : « Calendrier des soutenances »
4. Créer un budget avec lignes budgétaires

## Scénario 5 — Appui à l'insertion & Reporting

**Compte :** `insertion@uchk.sn`

1. **Appui insertion** → onglet **Statistiques**
   - Auto-emploi : 1, Emploi salarié : 1, Stages : 1, Partenaires : 2
2. Exporter **PDF** et **Excel** des statistiques
3. Onglet **Insertions** → 2 sortants seedés (Sonatel, Freelance)
4. Onglet **Stages** → stage Orange Digital Center
5. Onglet **Partenaires** → Orange Digital Center, Force-N

## Scénario 6 — API & Swagger

1. Ouvrir http://localhost:8080/swagger-ui.html
2. `POST /api/auth/login` avec les identifiants admin
3. Copier le JWT → Authorize (Bearer)
4. Tester `GET /api/insertions/stats` et `GET /api/etudiants`

## Données seedées (résumé)

| Entité | Exemples |
|--------|----------|
| Formations | Master Ingénierie Logicielle, Certification Développement Web |
| Étudiants | Fatou Ndiaye, Moussa Sarr, Aissatou Ba |
| Partenaires | Orange Digital Center, Force-N |
| Insertions | Sonatel (SALARIE), Freelance Web (AUTO_EMPLOI) |
| Stage | Plateforme e-learning UCHK (note 16.5) |
| Courrier | Convention Orange |
| Circulaire | Calendrier soutenances |
| Compte rendu | Réunion pédagogique S2 |

## Tests automatisés

```bash
cd platform-be
mvn test
```

Tests couverts : JWT, statistiques d'insertion, CRUD partenaires.
