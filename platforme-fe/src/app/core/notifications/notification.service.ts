import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";

import { environment } from "../../../environments/environment";

export interface Notification {
  id: number;
  titre: string;
  message?: string;
  type?: string;
  lien?: string;
  lu: boolean;
  createdAt: string;
}

@Injectable({ providedIn: "root" })
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/notifications`;

  readonly unreadCount = signal(0);

  list(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.base);
  }

  refreshUnread(): void {
    this.http.get<{ count: number }>(`${this.base}/unread-count`).subscribe({
      next: (res) => this.unreadCount.set(res.count),
      error: () => this.unreadCount.set(0),
    });
  }

  markRead(id: number): Observable<void> {
    return this.http
      .post<void>(`${this.base}/${id}/lue`, {})
      .pipe(tap(() => this.refreshUnread()));
  }

  markAllRead(): Observable<void> {
    return this.http
      .post<void>(`${this.base}/toutes-lues`, {})
      .pipe(tap(() => this.unreadCount.set(0)));
  }
}
