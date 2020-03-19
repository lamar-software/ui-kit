import { Component, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'ui-kit-heading',
  templateUrl: './heading.html',
  styleUrls: ['./heading.scss']
})
export class UiKitHeadingComponent implements AfterViewInit {
  constructor(private readonly el: ElementRef<HTMLHeadingElement>) {}

  ngAfterViewInit() {}
}
