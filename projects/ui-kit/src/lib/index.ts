import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';

import { UiKitButtonDirective } from './button/button';
import {
  UiKitCardDirective,
  UiKitCardHeaderDirective,
  UiKitCardTabDirective,
  UiKitCardSubheaderDirective
} from './card/card';
import { UiKitAnchorDirective } from './anchor/anchor';
import { UiKitFileUploaderComponent } from './file-uploader/file-uploader.component';
import { UiKitHeadingComponent } from './heading/heading';
import { UiKitInputComponent } from './input/input';
import { UiKitCaptionComponent } from './caption/caption';
import { UiKitLabelComponent } from './label/label';
import { UiKitKeyValueComponent } from './key-value/key-value';
import { UiKitBadge } from './badge/badge';
import { UiKitContextMenuComponent } from './context-menu/context-menu';

@NgModule({
  declarations: [
    UiKitButtonDirective,
    UiKitCardDirective,
    UiKitCardHeaderDirective,
    UiKitCardTabDirective,
    UiKitCardSubheaderDirective,
    UiKitAnchorDirective,
    UiKitFileUploaderComponent,
    UiKitHeadingComponent,
    UiKitInputComponent,
    UiKitLabelComponent,
    UiKitCaptionComponent,
    UiKitKeyValueComponent,
    UiKitBadge,
    UiKitContextMenuComponent
  ],
  imports: [CommonModule, MatIconModule],
  exports: [
    UiKitButtonDirective,
    UiKitCardDirective,
    UiKitCardHeaderDirective,
    UiKitCardTabDirective,
    UiKitCardSubheaderDirective,
    UiKitAnchorDirective,
    UiKitFileUploaderComponent,
    UiKitHeadingComponent,
    UiKitInputComponent,
    UiKitLabelComponent,
    UiKitCaptionComponent,
    UiKitKeyValueComponent,
    UiKitBadge,
    UiKitContextMenuComponent
  ]
})
export class UiKitModule {}
