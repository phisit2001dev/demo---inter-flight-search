import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'sit-title',
  templateUrl: './sit-title.component.html',
  styleUrls: ['./sit-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitTitleComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
