import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';

/**
 * Clamped card description with a "Show more / Show less" toggle, shared by the
 * application-, workspace- and workspace-owner cards.
 *
 * The description is clamped to three lines; when it overflows, a toggle is
 * overlaid at the end of the snippet to reveal / re-hide the full text.
 */
@Component({
  selector: 'app-card-description',
  templateUrl: './card-description.component.html',
  styleUrls: ['./card-description.component.scss'],
  standalone: false
})
export class CardDescriptionComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() html: string | null = null;

  @ViewChild('descriptionEl') descriptionEl?: ElementRef<HTMLElement>;

  isExpanded = false;
  isOverflowing = false;

  // Unique id so the toggle's aria-controls can point at this instance's text.
  private static uid = 0;
  readonly descriptionId = `card-description-${CardDescriptionComponent.uid++}`;

  private zone = inject(NgZone);
  private observer?: ResizeObserver;
  private overflowTimer?: ReturnType<typeof setTimeout>;
  private destroyed = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Re-measure when the bound text changes on a reused instance.
    if (changes['html'] && !changes['html'].firstChange) {
      this.isExpanded = false;
      this.scheduleOverflowCheck();
    }
  }

  ngAfterViewInit(): void {
    const el = this.descriptionEl?.nativeElement;
    if (!el) {
      return;
    }
    // Observe outside Angular so a resize doesn't trigger change detection;
    // updateOverflow() re-enters the zone only when the flag actually flips.
    this.zone.runOutsideAngular(() => {
      this.observer = new ResizeObserver(() => this.updateOverflow());
      this.observer.observe(el);
    });
    // ---- Re-measure once fonts are ready (metrics shift when the webfont swaps in).
    document.fonts?.ready.then(() => {
      if (!this.destroyed) {
        this.updateOverflow();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    clearTimeout(this.overflowTimer);
    this.observer?.disconnect();
  }

  toggle(event: Event): void {
    // Stop the click from bubbling to a clickable host card (e.g. workspace-owner).
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
    if (!this.isExpanded) {
      this.scheduleOverflowCheck();
    }
  }

  private scheduleOverflowCheck(): void {
    clearTimeout(this.overflowTimer);
    this.overflowTimer = setTimeout(() => this.updateOverflow());
  }

  private updateOverflow(): void {
    if (this.destroyed || this.isExpanded) {
      return;
    }
    const el = this.descriptionEl?.nativeElement;
    if (!el) {
      return;
    }
    // Allow 1px of slack: without this it could show a pointless "Show more" toggle.
    const overflowing = el.scrollHeight - el.clientHeight > 1;
    if (overflowing === this.isOverflowing) {
      return;
    }
    this.zone.run(() => (this.isOverflowing = overflowing));
  }
}
