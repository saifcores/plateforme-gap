# GAP Backend — UCHK

Backend de la plateforme GAP, organisé en **modules Maven** et déployable en
**monolithe** (développement) ou **microservices** (démonstration architecture distribuée).

## Prérequis

- **Java 21** (`java.version` dans le parent POM)
- Maven 3.8+
- PostgreSQL 16 (`docker compose up -d postgres` à la racine du dépôt)

## Démarrage rapide (monolithe)

```bash
cd platform-be
export JAVA_HOME=<chemin-jdk-21>
mvn spring-boot:run -pl gap-app
```

- API : http://localhost:8080/api
- Swagger : http://localhost:8080/swagger-ui.html
- Flyway + données de démo au premier lancement

## Comptes de démo

| Email              | Mot de passe | Rôle            |
| ------------------ | ------------ | --------------- |
| admin@uchk.sn      | admin123     | ADMIN           |
| *@uchk.sn (autres) | demo123      | Selon le compte |

Liste complète : [`docs/04-guide-demonstration.md`](../docs/04-guide-demonstration.md).

## Structure des modules

```
platform-be/
├── pom.xml                 # Parent Maven (gap-parent)
├── gap-common/             # Exceptions, pagination, utilitaires
├── gap-security/           # JWT, filtres, SecurityConfig
├── gap-utilisateur/        # Auth, rôles, utilisateurs
├── gap-pedagogie/          # Formations + étudiants
├── gap-communication/      # Notifications, comptes rendus
├── gap-administration/     # Courriers, budgets, personnel
├── gap-insertion/          # Insertion pro, stages, partenaires
├── gap-document/           # Stockage fichiers, journal d'accès
├── gap-config/             # OpenAPI, DemoDataInitializer
├── gap-app/                # Monolithe (dev, port 8080)
├── gap-ms-identite/        # MS identité (8081)
├── gap-ms-pedagogie/       # MS pédagogie (8082)
├── gap-ms-administration/  # MS admin + communication (8083)
├── gap-ms-insertion/       # MS insertion (8084)
├── gap-ms-document/        # MS documents (8085)
└── gap-gateway/            # API Gateway (8080)
```

## Modes de lancement

### Monolithe (recommandé en développement)

```bash
mvn spring-boot:run -pl gap-app
```

Un seul processus, toutes les routes `/api/**` sur le port 8080.

### Microservices

Démarrer chaque service (PostgreSQL requis) :

```bash
mvn spring-boot:run -pl gap-ms-identite           # 8081 — Flyway
mvn spring-boot:run -pl gap-ms-pedagogie          # 8082
mvn spring-boot:run -pl gap-ms-administration     # 8083
mvn spring-boot:run -pl gap-ms-insertion          # 8084
mvn spring-boot:run -pl gap-ms-document           # 8085
mvn spring-boot:run -pl gap-gateway               # 8080 — entrée
```

Ou via Docker :

```bash
docker compose -f docker-compose.microservices.yml up --build
```

Le frontend Angular pointe vers `http://localhost:8080` (gateway ou monolithe).

## Routage Gateway

| Chemin API                                                                                   | Service               | Port |
| -------------------------------------------------------------------------------------------- | --------------------- | ---- |
| `/api/auth/**`, `/api/utilisateurs/**`, `/api/roles/**`                                      | gap-ms-identite       | 8081 |
| `/api/formations/**`, `/api/formateurs/**`, `/api/etudiants/**`                              | gap-ms-pedagogie      | 8082 |
| `/api/courriers/**`, `/api/budgets/**`, `/api/notifications/**`, `/api/comptes-rendus/**`, … | gap-ms-administration | 8083 |
| `/api/insertions/**`, `/api/stages/**`, `/api/partenaires/**`, …                             | gap-ms-insertion      | 8084 |
| `/api/documents/**`, `/api/journal-acces-documents/**`                                       | gap-ms-document       | 8085 |

## API — points clés

| Endpoint                           | Accès           | Description           |
| ---------------------------------- | --------------- | --------------------- |
| `POST /api/auth/login`             | Public          | JWT                   |
| `POST /api/auth/register`          | ADMIN           | Création utilisateur  |
| `GET /api/roles`                   | ADMIN           | Liste des rôles       |
| `GET /api/etudiants/moi`           | ETUDIANT        | Dossier connecté      |
| `GET /api/insertions/moi`          | ETUDIANT        | Insertion connectée   |
| `GET /api/insertions/stats`        | Staff insertion | Statistiques          |
| `GET /api/journal-acces-documents` | ADMIN           | Traçabilité documents |

Liste complète : Swagger UI ou [`README.md`](../README.md) à la racine.

## Build & tests

```bash
mvn clean verify              # build complet
mvn compile -pl gap-app       # compile monolithe + dépendances
mvn test                      # 3 tests unitaires (JWT, insertion, partenaires)
```

## Évolution microservices (pistes)

1. **Database-per-service** : schémas PostgreSQL séparés par bounded context
2. **Communication inter-services** : OpenFeign pour remplacer les dépendances Maven
3. **JWT stateless** : rôles dans le token (éviter requête DB par MS)
4. **Découpler pédagogie** : références ID à la place des FK JPA cross-module
