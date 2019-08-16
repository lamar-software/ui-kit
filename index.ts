import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UiKitButtonDirective } from './button/button';
import {
  UiKitCardDirective,
  UiKitCardHeaderDirective,
  UiKitCardTabDirective,
  UiKitCardSubheaderDirective
} from './card/card';

@NgModule({
  declarations: [
    UiKitButtonDirective,
    UiKitCardDirective,
    UiKitCardHeaderDirective,
    UiKitCardTabDirective,
    UiKitCardSubheaderDirective
  ],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [
    UiKitButtonDirective,
    UiKitCardDirective,
    UiKitCardHeaderDirective,
    UiKitCardTabDirective,
    UiKitCardSubheaderDirective
  ]
})
export class UiKitModule {}
