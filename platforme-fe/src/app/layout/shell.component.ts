import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { BreakpointObserver } from "@angular/cdk/layout";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { MatBadgeModule } from "@angular/material/badge";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Subject, takeUntil } from "rxjs";

import { AuthService } from "../core/auth/auth.service";
import { RoleCode } from "../core/auth/auth.models";
import { NotificationService } from "../core/notifications/notification.service";
import { BreadcrumbService } from "../core/navigation/breadcrumb.service";

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles: RoleCode[];
}

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.scss",
})
export class ShellComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly breadcrumbsService = inject(BreadcrumbService);
  private readonly breakpoint = inject(BreakpointObserver);
  private readonly destroy$ = new Subject<void>();

  readonly user = this.auth.user;
  readonly opened = signal(true);
  readonly isMobile = signal(false);
  readonly unread = this.notifications.unreadCount;
  readonly breadcrumbs = this.breadcrumbsService.items;

  constructor() {
    this.notifications.refreshUnread();
    if (this.auth.token) {
      this.auth.refreshMe().subscribe({
        error: () => this.auth.logout(),
      });
    }
  }

  ngOnInit(): void {
    this.breakpoint
      .observe("(max-width: 768px)")
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        const mobile = state.matches;
        this.isMobile.set(mobile);
        if (mobile) {
          this.opened.set(false);
        } else {
          this.opened.set(true);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private readonly allItems: NavItem[] = [
    {
      label: "Tableau de bord",
      icon: "dashboard",
      route: "/dashboard",
      roles: [],
    },
    {
      label: "Communication",
      icon: "campaign",
      route: "/communication",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
        "TUTEUR",
        "APPUI_INSERTION",
        "ETUDIANT",
      ],
    },
    {
      label: "Administration",
      icon: "folder_shared",
      route: "/administration",
      roles: ["ADMIN", "ADMINISTRATIF"],
    },
    {
      label: "Formations",
      icon: "menu_book",
      route: "/formations",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
      ],
    },
    {
      label: "Formateurs",
      icon: "person",
      route: "/formateurs",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
      ],
    },
    {
      label: "Circulaires",
      icon: "description",
      route: "/circulaires",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "ENSEIGNANT_ASSOCIE",
        "TUTEUR",
        "APPUI_INSERTION",
        "ETUDIANT",
      ],
    },
    {
      label: "Étudiants",
      icon: "groups",
      route: "/etudiants",
      roles: [
        "ADMIN",
        "ADMINISTRATIF",
        "RESPONSABLE_FORMATION",
        "ENSEIGNANT",
        "TUTEUR",
        "APPUI_INSERTION",
      ],
    },
    {
      label: "Appui insertion",
      icon: "work",
      route: "/insertion",
      roles: ["ADMIN", "ADMINISTRATIF", "APPUI_INSERTION"],
    },
    {
      label: "Utilisateurs",
      icon: "manage_accounts",
      route: "/utilisateurs",
      roles: ["ADMIN"],
    },
    {
      label: "Journal accès",
      icon: "history",
      route: "/journal-acces",
      roles: ["ADMIN"],
    },
    {
      label: "Mon dossier",
      icon: "badge",
      route: "/mon-dossier",
      roles: ["ETUDIANT"],
    },
    {
      label: "Emploi du temps",
      icon: "calendar_month",
      route: "/emploi-du-temps",
      roles: ["ETUDIANT"],
    },
    {
      label: "Mon insertion",
      icon: "work",
      route: "/mon-insertion",
      roles: ["ETUDIANT"],
    },
  ];

  readonly navItems = computed(() =>
    this.allItems.filter(
      (item) => item.roles.length === 0 || this.auth.hasAnyRole(item.roles),
    ),
  );

  readonly initiales = computed(() => {
    const u = this.user();
    return u ? `${u.prenom.charAt(0)}${u.nom.charAt(0)}`.toUpperCase() : "";
  });

  toggle(): void {
    this.opened.set(!this.opened());
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.opened.set(false);
    }
  }

  onNavClick(): void {
    this.closeSidebar();
  }

  logout(): void {
    this.auth.logout();
  }
}
