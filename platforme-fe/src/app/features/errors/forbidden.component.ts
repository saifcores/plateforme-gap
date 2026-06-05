import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-forbidden",
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="page-shell gap-animate-in">
      <section class="forbidden">
        <mat-icon>lock</mat-icon>
        <h1>Accès refusé</h1>
        <p>
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
          Contactez un administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>
        <a mat-flat-button color="primary" routerLink="/dashboard">
          <mat-icon>dashboard</mat-icon>
          Retour au tableau de bord
        </a>
      </section>
    </div>
  `,
  styles: `
    .forbidden {
      max-width: 480px;
      margin: 80px auto;
      text-align: center;
      padding: 40px 24px;
      border-radius: var(--gap-radius-xl);
      background: var(--gap-surface);
      border: 1px solid var(--gap-border);
      box-shadow: var(--gap-shadow-md);
    }

    mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: var(--gap-accent-500);
      margin-bottom: 16px;
    }

    h1 {
      margin: 0 0 12px;
      font-family: var(--gap-font-display);
      font-size: 1.75rem;
    }

    p {
      margin: 0 0 24px;
      color: var(--gap-text-secondary);
      line-height: 1.6;
    }

    a mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      margin: 0 8px 0 0;
      color: inherit;
    }
  `,
})
export class ForbiddenComponent {}
