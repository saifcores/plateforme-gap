import { DatePipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import {
  Notification,
  NotificationService,
} from "../../core/notifications/notification.service";
import { EmptyStateComponent } from "../../shared/empty-state.component";
import { PageFeedbackComponent } from "../../shared/page-feedback.component";

@Component({
  selector: "app-notifications",
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    PageFeedbackComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./notifications.component.html",
  styleUrl: "./notifications.component.scss",
})
export class NotificationsComponent {
  private readonly service = inject(NotificationService);
  private readonly router = inject(Router);

  readonly notifications = signal<Notification[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.list().subscribe({
      next: (data) => {
        this.notifications.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Impossible de charger les notifications.");
        this.loading.set(false);
      },
    });
  }

  ouvrir(n: Notification): void {
    const done = () => {
      if (n.lien) {
        this.router.navigateByUrl(n.lien);
      } else {
        this.load();
      }
    };
    if (!n.lu) {
      this.service.markRead(n.id).subscribe({ next: done, error: done });
    } else {
      done();
    }
  }

  toutLire(): void {
    this.service.markAllRead().subscribe(() => this.load());
  }
}
