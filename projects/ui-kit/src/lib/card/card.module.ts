import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  UiKitCardTabDirective,
  UiKitCardSubheaderDirective,
  UiKitCardHeaderDirective,
  UiKitCardDirective
} from './card';

@NgModule({
  declarations: [
    UiKitCardTabDirective,
    UiKitCardSubheaderDirective,
    UiKitCardHeaderDirective,
    UiKitCardDirective
  ],
  imports: [CommonModule],
  exports: [
    UiKitCardTabDirective,
    UiKitCardSubheaderDirective,
    UiKitCardHeaderDirective,
    UiKitCardDirective
  ]
})
export class UiKitCardModule {}
