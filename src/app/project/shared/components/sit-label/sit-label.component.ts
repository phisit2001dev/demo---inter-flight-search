import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sit-label',
  templateUrl: './sit-label.component.html',
  styleUrls: ['./sit-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitLabelComponent implements OnInit {
  @Input() require = false;
  constructor() {}
  ngOnInit(): void {
  }
}
