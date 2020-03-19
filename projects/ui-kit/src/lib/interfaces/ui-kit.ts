export interface ImageSelectEvent {
  base64Data: string | ArrayBuffer;
  fileName: string;
  fileSize: number;
  fileType: string;
}
