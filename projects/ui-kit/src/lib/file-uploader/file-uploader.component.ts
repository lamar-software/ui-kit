import { Component, Output, EventEmitter, Input } from '@angular/core';

import { ImageSelectEvent } from '../interfaces/ui-kit';

import { getBase64FromFile } from '../utils';

@Component({
  selector: 'ui-kit-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class UiKitFileUploaderComponent {
  public filename: string;

  @Input()
  public readonly loading: boolean;

  @Output('imageSelect')
  private readonly handleImageChangeEvent: EventEmitter<ImageSelectEvent> = new EventEmitter<
    ImageSelectEvent
  >();

  constructor() {}

  async handleImageChange(element: HTMLInputElement): Promise<ImageSelectEvent> {
    const fileCount: number = element.files.length;

    if (fileCount) {
      const file: File = element.files.item(0);
      const base64Data = await getBase64FromFile(file);

      const payload: ImageSelectEvent = {
        base64Data,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      };

      this.filename = file.name;

      this.handleImageChangeEvent.emit(payload);

      return payload;
    } else {
      console.warn('No files available');
    }
  }
}
