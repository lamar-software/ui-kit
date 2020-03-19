import { Component, AfterViewInit, ElementRef, Output, EventEmitter, Input, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'ui-kit-card',
  styleUrls: ['./card.scss'],
  template: `
    <div [ngClass]="ngClass" [ngStyle]="ngStyle" class="ui-kit-card box has-background-white">
      <div class="card-body">
        <div class="content">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class UiKitCardDirective {
  @Input() public readonly ngClass;
  @Input() public readonly ngStyle;

  constructor(private readonly el: ElementRef<HTMLElement>) {}
}

@Component({
  selector: 'ui-kit-card-header',
  template: `
    <h3 class="ui-kit-card-header"><ng-content></ng-content></h3>
  `
})
export class UiKitCardHeaderDirective {
  constructor() {}
}

@Component({
  selector: 'ui-kit-card-subheader',
  template: `
    <h5 class="ui-kit-card-subheader"><ng-content></ng-content></h5>
  `
})
export class UiKitCardSubheaderDirective {
  constructor() {}
}

@Component({
  selector: 'ui-kit-card-tab',
  template: `
    <div [class.open]="open" class="ui-kit-card-tab-wrapper">
      <div class="row">
        <div class="col d-flex justify-content-start align-items-end">
          <div (click)="handleTabClick()" class="ui-kit-card-tab-base secondary">
            <p class="px-3 tab-text mt-1 mb-2">
              <i [ngClass]="{ 'i-arrow-up': open, 'i-arrow-down': !open }" class="arrow"> </i>
              <ng-content></ng-content>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./card.scss']
})
export class UiKitCardTabDirective implements OnInit, OnChanges {
  @Output('toggle')
  public readonly handleTabToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('open')
  public _open: boolean;

  public open: boolean = true;

  constructor() {}

  ngOnInit() {
    this.open = this._open;
  }

  ngOnChanges() {
    this.open = this._open;
  }

  handleTabClick(): void {
    this.handleTabToggle.emit(this.open);
    this.open = !this.open;
  }
}
