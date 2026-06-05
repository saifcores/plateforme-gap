import { Component, input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: "app-page-feedback",
  standalone: true,
  imports: [MatProgressBarModule, MatIconModule],
  template: `
    @if (loading()) {
      <mat-progress-bar mode="indeterminate" class="page-feedback-bar" />
    }
    @if (!loading() && error()) {
      <div class="page-feedback-error" role="alert">
        <mat-icon>error_outline</mat-icon>
        <span>{{ error() }}</span>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .page-feedback-bar {
      margin-bottom: 16px;
    }
  `,
})
export class PageFeedbackComponent {
  readonly loading = input(false);
  readonly error = input<string | null>(null);
}
