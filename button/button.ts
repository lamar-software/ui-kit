import { AfterContentInit, ElementRef, Input, OnChanges, Component } from '@angular/core';

import { uiKitColors } from '../consts';

@Component({
  selector: '[ui-kit-button], [uiKitButton]',
  exportAs: 'uiKitButton',
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
  host: {
    '[attr.disabled]': 'disabled || null'
  },
  inputs: ['disabled', 'color']
})
export class UiKitButtonDirective implements OnChanges, AfterContentInit {
  @Input('uiKitButton')
  private readonly uiKitButtonColor: typeof uiKitColors[number];

  @Input()
  public readonly loading: boolean;

  @Input()
  public readonly disabled: boolean;

  public constructor(private readonly el: ElementRef<HTMLButtonElement | HTMLAnchorElement>) {}

  ngOnChanges() {
    if (this.loading || this.disabled) {
      this.el.nativeElement.classList.add('ui-kit-button-disabled');

      if (this.el.nativeElement instanceof HTMLButtonElement) {
        (this.el.nativeElement as HTMLButtonElement).disabled = true;
      }
    } else {
      this.el.nativeElement.classList.remove('ui-kit-button-disabled');

      if (this.el.nativeElement instanceof HTMLButtonElement) {
        (this.el.nativeElement as HTMLButtonElement).disabled = false;
      }
    }
  }

  ngAfterContentInit() {
    this.el.nativeElement.classList.add('ui-kit-button');

    const attribute = this.el.nativeElement.attributes.getNamedItem('color');

    if (attribute) {
      if (uiKitColors.includes(attribute.value)) {
        this.el.nativeElement.classList.add('ui-kit-button-' + attribute.value);
      }
    } else {
      if (this.uiKitButtonColor) {
        this.el.nativeElement.classList.add('ui-kit-button-' + this.uiKitButtonColor);
      } else {
        this.el.nativeElement.classList.add('ui-kit-button-secondary');
      }
    }
  }
}
