import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-kit-key-value',
  templateUrl: './key-value.html',
  styleUrls: ['./key-value.scss']
})
export class UiKitKeyValueComponent {
  @Input() public readonly key: string;
  @Input() public readonly value: string;
}
