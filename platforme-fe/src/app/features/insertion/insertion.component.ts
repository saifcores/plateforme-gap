import { Component } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";

import { StatsTabComponent } from "./stats-tab.component";
import { InsertionSortantTabComponent } from "./insertion-sortant-tab.component";
import { StageTabComponent } from "./stage-tab.component";
import { ContactTabComponent } from "./contact-tab.component";
import { PartenaireTabComponent } from "./partenaire-tab.component";

@Component({
  selector: "app-insertion",
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    StatsTabComponent,
    InsertionSortantTabComponent,
    StageTabComponent,
    ContactTabComponent,
    PartenaireTabComponent,
  ],
  template: `
    <div class="page-shell page-accent-insertion gap-animate-in">
      <header class="page-header">
        <div>
          <h1>Appui à l'insertion</h1>
          <span class="page-subtitle">
            <mat-icon>work</mat-icon>
            Suivi des sortants, stages, contacts et partenariats
          </span>
        </div>
      </header>

      <mat-tab-group
        class="module-tab-group gap-animate-in gap-stagger-1"
        animationDuration="0ms"
      >
        <mat-tab label="Statistiques"><app-stats-tab /></mat-tab>
        <mat-tab label="Insertions"><app-insertion-sortant-tab /></mat-tab>
        <mat-tab label="Stages"><app-stage-tab /></mat-tab>
        <mat-tab label="Registre contacts"><app-contact-tab /></mat-tab>
        <mat-tab label="Partenaires"><app-partenaire-tab /></mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class InsertionComponent {}
