import { NgModule } from '@angular/core';

import { UiKitAnchorDirective } from './anchor';

@NgModule({
  declarations: [
    UiKitAnchorDirective
  ],
  exports: [
    UiKitAnchorDirective
  ]
})
export class UiKitAnchorModule {}
