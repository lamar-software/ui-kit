import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'ui-kit-caption',
  templateUrl: './caption.html',
  styleUrls: ['./caption.scss']
})
export class UiKitCaptionComponent implements AfterViewInit {
  constructor(private readonly el: ElementRef<HTMLHeadingElement>) {}

  ngAfterViewInit() {}
}
