import { NgModule } from '@angular/core';

import { UiKitButtonDirective } from './button';

@NgModule({
  declarations: [
    UiKitButtonDirective
  ],
  exports: [
    UiKitButtonDirective
  ]
})
export class UiKitButtonModule {}
