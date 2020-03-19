import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  templateUrl: './alert.html',
  styleUrls: ['./alert.scss']
})
export class UiKitAlertComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public readonly data: any) {}
}
