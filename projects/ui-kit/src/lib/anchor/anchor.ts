import { ElementRef, Input, Component, AfterContentInit } from '@angular/core';

import { uiKitColors } from '../consts';

@Component({
  selector: 'ui-kit-anchor, [uiKitAnchor]',
  exportAs: 'uiKitAnchor',
  templateUrl: './anchor.html',
  styleUrls: ['./anchor.scss'],
  host: {
    '[attr.disabled]': 'disabled || null'
  },
  inputs: ['disabled', 'color']
})
export class UiKitAnchorDirective implements AfterContentInit {
  @Input('uiKitAnchor')
  private readonly uiKitAnchorColor: typeof uiKitColors[number];

  @Input()
  public readonly disabled: boolean;

  constructor(private readonly el: ElementRef<HTMLButtonElement | HTMLAnchorElement>) {}

  ngAfterContentInit() {
    this.el.nativeElement.classList.add('ui-kit-anchor');

    const attribute = this.el.nativeElement.attributes.getNamedItem('color');

    if (attribute) {
      if (uiKitColors.includes(attribute.value)) {
        this.el.nativeElement.classList.add('ui-kit-anchor-' + attribute.value);
      }
    } else {
      if (this.uiKitAnchorColor) {
        this.el.nativeElement.classList.add('ui-kit-anchor-' + this.uiKitAnchorColor);
      } else {
        this.el.nativeElement.classList.add('ui-kit-anchor-secondary');
      }
    }
  }
}
