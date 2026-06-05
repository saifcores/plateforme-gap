import { Component, computed, inject, signal } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBar } from "@angular/material/snack-bar";

import { InsertionService } from "./insertion.service";
import { InsertionStats } from "./insertion.models";

@Component({
  selector: "app-stats-tab",
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressBarModule,
  ],
  template: `
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" class="tab-loading" />
    }

    @if (error()) {
      <div class="page-feedback-error" role="alert">
        <mat-icon>error_outline</mat-icon>
        <span>{{ error() }}</span>
      </div>
    }

    @if (stats(); as s) {
      <div class="export-actions">
        <button
          mat-stroked-button
          (click)="download('pdf')"
          [disabled]="exporting()"
        >
          <mat-icon>picture_as_pdf</mat-icon> Export PDF
        </button>
        <button
          mat-stroked-button
          (click)="download('excel')"
          [disabled]="exporting()"
        >
          <mat-icon>table_chart</mat-icon> Export Excel
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="label">Total insertions</div>
          <div class="value">{{ s.totalInsertions }}</div>
        </div>
        <div class="stat-card">
          <div class="label">Auto-emploi</div>
          <div class="value">{{ s.autoEmploi }}</div>
        </div>
        <div class="stat-card">
          <div class="label">Emploi salarié</div>
          <div class="value">{{ s.salarie }}</div>
        </div>
        <div class="stat-card">
          <div class="label">Stages</div>
          <div class="value">{{ s.totalStages }}</div>
        </div>
        <div class="stat-card">
          <div class="label">Contacts</div>
          <div class="value">{{ s.totalContacts }}</div>
        </div>
        <div class="stat-card">
          <div class="label">Partenaires</div>
          <div class="value">{{ s.totalPartenaires }}</div>
        </div>
      </div>

      @if (s.parSecteur.length) {
        <h3 class="section-title">
          <mat-icon>pie_chart</mat-icon>
          Répartition par secteur
        </h3>
        <div class="sector-chart">
          @for (row of s.parSecteur; track row.secteur) {
            <div class="sector-row">
              <span class="sector-label">{{ row.secteur }}</span>
              <div class="sector-bar-track">
                <div
                  class="sector-bar-fill"
                  [style.width.%]="(row.count / maxSecteur()) * 100"
                ></div>
              </div>
              <span class="sector-value">{{ row.count }}</span>
            </div>
          }
        </div>
      }
    }
  `,
  styleUrl: "./insertion-tab.scss",
})
export class StatsTabComponent {
  private readonly service = inject(InsertionService);
  private readonly snack = inject(MatSnackBar);

  readonly stats = signal<InsertionStats | null>(null);
  readonly loading = signal(true);
  readonly exporting = signal(false);
  readonly error = signal<string | null>(null);

  readonly maxSecteur = computed(() => {
    const rows = this.stats()?.parSecteur ?? [];
    return Math.max(1, ...rows.map((r) => r.count));
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.service.stats().subscribe({
      next: (s) => {
        this.stats.set(s);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Impossible de charger les statistiques.");
        this.loading.set(false);
      },
    });
  }

  download(format: "pdf" | "excel"): void {
    this.exporting.set(true);
    const req$ =
      format === "pdf" ? this.service.exportPdf() : this.service.exportExcel();
    req$.subscribe({
      next: (blob) => {
        this.exporting.set(false);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stats-insertion.${format === "pdf" ? "pdf" : "xlsx"}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => {
        this.exporting.set(false);
        this.snack.open("Export impossible", "OK", { duration: 4000 });
      },
    });
  }
}
