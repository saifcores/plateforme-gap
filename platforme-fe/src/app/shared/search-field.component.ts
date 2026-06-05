import {
  Component,
  effect,
  ElementRef,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-search-field",
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  host: {
    class: "gap-search-host",
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }
  `,
  template: `
    <div class="gap-search-toolbar {{ class() }}" [class.is-active]="display().length > 0">
      <mat-form-field class="gap-search-field" subscriptSizing="dynamic">
        <mat-icon matPrefix>search</mat-icon>
        <input
          #inputEl
          matInput
          type="search"
          enterkeyhint="search"
          autocomplete="off"
          [placeholder]="placeholder() || label()"
          [value]="display()"
          (input)="onInput($event)"
          (keydown.escape)="clear($event)"
          [attr.aria-label]="ariaLabel() || label()"
        />
        @if (display()) {
          <button
            mat-icon-button
            matSuffix
            type="button"
            class="gap-search-clear"
            (click)="clear()"
            aria-label="Effacer la recherche"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
        @if (hint() && !display()) {
          <mat-hint>{{ hint() }}</mat-hint>
        }
        @if (display() && resultCount() !== null) {
          <mat-hint align="end">
            {{ resultCount() }} résultat{{ resultCount() === 1 ? "" : "s" }}
          </mat-hint>
        }
      </mat-form-field>
    </div>
  `,
})
export class SearchFieldComponent implements OnDestroy {
  readonly label = input("Rechercher");
  readonly placeholder = input("");
  readonly hint = input("");
  readonly ariaLabel = input("");
  readonly debounceMs = input(350);
  readonly value = input("");
  readonly resultCount = input<number | null>(null);
  readonly class = input<string | null>(null);

  readonly search = output<string>();

  readonly display = signal("");

  private readonly inputRef =
    viewChild<ElementRef<HTMLInputElement>>("inputEl");
  private debounceTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      this.display.set(this.value());
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.debounceTimer);
  }

  onInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.display.set(term);
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(
      () => this.search.emit(term),
      this.debounceMs(),
    );
  }

  clear(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    clearTimeout(this.debounceTimer);
    this.display.set("");
    const input = this.inputRef()?.nativeElement;
    if (input) {
      input.value = "";
    }
    this.search.emit("");
  }
}
