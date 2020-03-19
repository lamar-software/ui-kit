import { AriaDescriber } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
  Renderer2,
  SimpleChanges,
  isDevMode
} from '@angular/core';
import { CanDisable, CanDisableCtor, mixinDisabled, ThemePalette } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

let nextId = 0;

class UiKitBadgeBase {}

const _UiKitBadgeMixinBase: CanDisableCtor & typeof UiKitBadgeBase = mixinDisabled(UiKitBadgeBase);

export type UiKitBadgePosition =
  | 'above after'
  | 'above before'
  | 'below before'
  | 'below after'
  | 'before'
  | 'after'
  | 'above'
  | 'below';

export type UiKitBadgeSize = 'small' | 'medium' | 'large';

@Directive({
  selector: '[uiKitBadge]',
  inputs: ['disabled: uiKitBadgeDisabled'],
  host: {
    class: 'ui-kit-badge'
  }
})
export class UiKitBadge extends _UiKitBadgeMixinBase implements OnDestroy, OnChanges, CanDisable {
  _hasContent = false;

  @Input('uiKitBadgeColor')
  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._setColor(value);
    this._color = value;
  }

  @Input('uiKitBadgePosition') position: UiKitBadgePosition = 'above after';

  @Input('uiKitBadge') content: string;

  @Input('uiKitBadgeOverlap')
  get overlap(): boolean {
    return this._overlap;
  }
  set overlap(val: boolean) {
    this._overlap = coerceBooleanProperty(val);
  }

  private _color: string = '';
  private _overlap: boolean = true;

  // Message used to describe the decorated element via aria-describedby
  @Input('uiKitBadgeDescription')
  get description(): string {
    return this._description;
  }
  set description(newDescription: string) {
    if (newDescription !== this._description) {
      const badgeElement = this._badgeElement;
      this._updateHostAriaDescription(newDescription, this._description);
      this._description = newDescription;

      if (badgeElement) {
        newDescription
          ? badgeElement.setAttribute('aria-label', newDescription)
          : badgeElement.removeAttribute('aria-label');
      }
    }
  }

  private _description: string;

  @Input('uiKitBadgeSize') size: UiKitBadgeSize = 'medium';

  _id: number = nextId++;

  private _badgeElement: HTMLElement | undefined;

  constructor(
    private _ngZone: NgZone,
    private _elementRef: ElementRef<HTMLElement>,
    private _ariaDescriber: AriaDescriber,
    private _renderer: Renderer2,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) private _animationMode?: string
  ) {
    super();

    if (isDevMode()) {
      const nativeElement = _elementRef.nativeElement;
      if (nativeElement.nodeType !== nativeElement.ELEMENT_NODE) {
        throw Error('matBadge must be attached to an element node.');
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const contentChange = changes['content'];

    if (contentChange) {
      const value = contentChange.currentValue;
      this._hasContent = value != null && `${value}`.trim().length > 0;
      this._updateTextContent();
    }
  }

  ngOnDestroy() {
    const badgeElement = this._badgeElement;

    if (badgeElement) {
      if (this.description) {
        this._ariaDescriber.removeDescription(badgeElement, this.description);
      }

      // When creating a badge through the Renderer, Angular will keep it in an index.
      if (this._renderer.destroyNode) {
        this._renderer.destroyNode(badgeElement);
      }
    }
  }

  /**
   * Gets the element into which the badge's content is being rendered.
   * Undefined if the element hasn't been created (e.g. if the badge doesn't have content).
   */
  getBadgeElement(): HTMLElement | undefined {
    return this._badgeElement;
  }

  // Injects a span element into the DOM with the content.
  private _updateTextContent(): HTMLSpanElement {
    if (!this._badgeElement) {
      this._badgeElement = this._createBadgeElement();
    } else {
      this._badgeElement.textContent = this.content;
    }

    return this._badgeElement;
  }

  private _createBadgeElement(): HTMLElement {
    const badgeElement = this._renderer.createElement('span');
    const activeClass = 'ui-kit-badge-active';
    const contentClass = 'ui-kit-badge-content';

    // Clear any existing badges which may have persisted from a server-side render.
    this._clearExistingBadges(contentClass);
    badgeElement.setAttribute('id', `ui-kit-badge-content-${this._id}`);
    badgeElement.classList.add(contentClass);
    badgeElement.textContent = this.content;

    if (this._animationMode === 'NoopAnimations') {
      badgeElement.classList.add('ui-kit-animation-noopable');
    }

    if (this.description) {
      badgeElement.setAttribute('aria-label', this.description);
    }

    this._elementRef.nativeElement.appendChild(badgeElement);

    // Animate in after insertion
    if (typeof requestAnimationFrame === 'function' && this._animationMode !== 'NoopAnimations') {
      this._ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
          badgeElement.classList.add(activeClass);
        });
      });
    } else {
      badgeElement.classList.add(activeClass);
    }

    return badgeElement;
  }

  private _updateHostAriaDescription(newDescription: string, oldDescription: string): void {
    // Ensure content available before setting label
    const content = this._updateTextContent();

    if (oldDescription) {
      this._ariaDescriber.removeDescription(content, oldDescription);
    }

    if (newDescription) {
      this._ariaDescriber.describe(content, newDescription);
    }
  }

  private _setColor(colorPalette: string) {
    if (colorPalette !== this._color) {
      if (this._color) {
        this._elementRef.nativeElement.classList.remove(`ui-kit-badge-${this._color}`);
      } else {
        this._elementRef.nativeElement.classList.add(`ui-kit-badge`);
      }
    }
  }

  private _clearExistingBadges(cssClass: string) {
    const element = this._elementRef.nativeElement;
    let childCount = element.children.length;

    // Use a reverse while, because we'll be removing elements from the list as we're iterating.
    while (childCount--) {
      const currentChild = element.children[childCount];

      if (currentChild.classList.contains(cssClass)) {
        element.removeChild(currentChild);
      }
    }
  }

  static ngAcceptInputType_disabled: boolean | string | null | undefined = null;
  static ngAcceptInputType_hidden: boolean | string | null | undefined = null;
  static ngAcceptInputType_overlap: boolean | string | null | undefined = null;
}
