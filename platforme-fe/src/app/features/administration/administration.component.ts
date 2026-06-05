import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";

import { CourrierTabComponent } from "./courrier-tab.component";
import { NoteServiceTabComponent } from "./note-service-tab.component";
import { NoteAdministrativeTabComponent } from "./note-administrative-tab.component";
import { CirculaireTabComponent } from "./circulaire-tab.component";
import { PersonnelTabComponent } from "./personnel-tab.component";
import { BudgetTabComponent } from "./budget-tab.component";

@Component({
  selector: "app-administration",
  standalone: true,
  imports: [
    MatTabsModule,
    MatIconModule,
    CourrierTabComponent,
    NoteServiceTabComponent,
    NoteAdministrativeTabComponent,
    CirculaireTabComponent,
    PersonnelTabComponent,
    BudgetTabComponent,
  ],
  template: `
    <div class="page-shell page-accent-administration gap-animate-in">
      <header class="page-header">
        <div>
          <h1>Administration</h1>
          <span class="page-subtitle">
            <mat-icon>folder_shared</mat-icon>
            Courriers, notes, circulaires, budget et personnel
          </span>
        </div>
      </header>

      <mat-tab-group
        class="module-tab-group gap-animate-in gap-stagger-1"
        [selectedIndex]="selectedTab()"
        (selectedIndexChange)="selectedTab.set($event)"
        animationDuration="0ms"
      >
        <mat-tab label="Courriers"><app-courrier-tab /></mat-tab>
        <mat-tab label="Notes de service"><app-note-service-tab /></mat-tab>
        <mat-tab label="Notes administratives"
          ><app-note-administrative-tab
        /></mat-tab>
        <mat-tab label="Circulaires"><app-circulaire-tab /></mat-tab>
        <mat-tab label="Budget"><app-budget-tab /></mat-tab>
        <mat-tab label="Personnel"><app-personnel-tab /></mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class AdministrationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  readonly selectedTab = signal(0);

  private readonly tabIndex: Record<string, number> = {
    courriers: 0,
    "notes-service": 1,
    "notes-administratives": 2,
    circulaires: 3,
    budget: 4,
    personnel: 5,
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get("tab");
      if (tab && tab in this.tabIndex) {
        this.selectedTab.set(this.tabIndex[tab]);
      }
    });
  }
}
