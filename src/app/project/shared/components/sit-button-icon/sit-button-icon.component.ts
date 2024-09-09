import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sit-button-icon',
  templateUrl: './sit-button-icon.component.html',
  styleUrls: ['./sit-button-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitButtonIconComponent {
  @Input() type: string = null
  @Input() permission: boolean;
  @Input() tooltip: string;
  @Input() btnStyle: any = null;
  @Input() btnClass: any = null;
  @Input() iconStyle: any = null;
  @Input() iconClass: any = null;

  @Output() btnClick: EventEmitter<any> = new EventEmitter();

  click(): void {
    if (!this.permission) {
      return null;
    }

    this.btnClick.emit();
  }
}
