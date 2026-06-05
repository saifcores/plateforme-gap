import { Component, input } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-empty-state",
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterLink],
  template: `
    <div class="empty-state" [class.compact]="compact()">
      <mat-icon>{{ icon() }}</mat-icon>
      <p>{{ message() }}</p>
      @if (description()) {
        <span class="empty-desc">{{ description() }}</span>
      }
      @if (actionLabel() && actionLink()) {
        <a mat-stroked-button [routerLink]="actionLink()">
          {{ actionLabel() }}
        </a>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .empty-desc {
      display: block;
      margin: -8px 0 16px;
      font-size: 0.85rem;
      color: var(--gap-text-muted);
      max-width: 360px;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.5;
    }

    a[mat-stroked-button] {
      margin-top: 8px;
    }
  `,
})
export class EmptyStateComponent {
  readonly icon = input("inbox");
  readonly message = input("Aucun élément.");
  readonly description = input("");
  readonly compact = input(false);
  readonly actionLabel = input("");
  readonly actionLink = input("");
}
