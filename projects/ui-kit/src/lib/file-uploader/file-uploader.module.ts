import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiKitFileUploaderComponent } from './file-uploader.component';

@NgModule({
  declarations: [
    UiKitFileUploaderComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UiKitFileUploaderComponent
  ]
})
export class UiKitFileUploaderModule {}
