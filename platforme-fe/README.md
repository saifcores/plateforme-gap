# GAP Frontend — UCHK

Angular 19 application for the **Gestion Administrative et Pédagogique**
platform at Université Cheikh Hamidou Kane.

## Prerequisites

- Node.js 20+
- npm 10+
- Backend API at `http://localhost:8080` (see [`platform-be/README.md`](../platform-be/README.md))

## Install & run

```bash
npm install
npm start          # http://localhost:4200
```

The dev server proxies `/api` to `http://localhost:8080` via `proxy.conf.json`.

## Build & tests

```bash
npm run build      # output: dist/gap-frontend/
npm test           # Karma — sort.util.spec.ts
```

Production config : `src/environments/environment.prod.ts` (`apiUrl: '/api'`).

## Architecture

```
src/app/
├── core/
│   ├── auth/           # AuthService, guards, interceptors, route-roles
│   ├── documents/      # Journal d'accès
│   └── utils/          # Tri, pagination client (ClientListController)
├── layout/             # Shell (sidebar, topbar, notifications)
├── shared/             # Composants réutilisables
│   ├── search-field.component.ts
│   ├── page-feedback.component.ts
│   ├── empty-state.component.ts
│   ├── document-link.component.ts
│   └── confirm-dialog.service.ts
└── features/           # Lazy-loaded par module
    ├── auth/
    ├── dashboard/
    ├── etudiants/      # Liste, détail, portail (mon-dossier, emploi-du-temps)
    ├── formations/
    ├── communication/
    ├── administration/
    ├── insertion/
    ├── notifications/
    └── errors/         # Page /forbidden
```

### Patterns

- **Standalone components** + Angular **signals**
- **JWT** en `localStorage`, envoyé par `authInterceptor`
- Erreurs HTTP 401/403 gérées par `errorInterceptor`
- **RBAC** : `authGuard` + `roleGuard` + constantes dans `route-roles.ts`
- **UI** : design system SCSS (`src/styles/_tokens.scss`, `_layout.scss`, `_pages.scss`)

## Routes principales

| Path                                                 | Rôles autorisés                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `/dashboard`                                         | Tous (authentifié)                                                 |
| `/etudiants`                                         | Staff + APPUI_INSERTION (lecture)                                  |
| `/etudiants/nouveau`, `/:id/modifier`                | ADMIN, ADMINISTRATIF                                               |
| `/mon-dossier`, `/emploi-du-temps`, `/mon-insertion` | ETUDIANT                                                           |
| `/formations`, `/formateurs`                         | Staff formations (incl. ENSEIGNANT_ASSOCIE)                        |
| `/communication`                                     | Lecture : large ; écriture : ADMIN, ADMINISTRATIF, RESP. FORMATION |
| `/circulaires`                                       | Tous les rôles staff + ETUDIANT                                    |
| `/administration`                                    | ADMIN, ADMINISTRATIF                                               |
| `/insertion`                                         | ADMIN, ADMINISTRATIF, APPUI_INSERTION                              |
| `/utilisateurs`, `/journal-acces`                    | ADMIN                                                              |
| `/notifications`                                     | Tous (authentifié)                                                 |
| `/forbidden`                                         | Page accès refusé                                                  |

## Comptes de démo

| Email                  | Password | Rôle                  |
| ---------------------- | -------- | --------------------- |
| admin@uchk.sn          | admin123 | ADMIN                 |
| administratif@uchk.sn  | demo123  | ADMINISTRATIF         |
| enseignant@uchk.sn     | demo123  | ENSEIGNANT            |
| resp.formation@uchk.sn | demo123  | RESPONSABLE_FORMATION |
| tuteur@uchk.sn         | demo123  | TUTEUR                |
| insertion@uchk.sn      | demo123  | APPUI_INSERTION       |
| etudiant@uchk.sn       | demo123  | ETUDIANT              |

Parcours complet : [`docs/04-guide-demonstration.md`](../docs/04-guide-demonstration.md).
