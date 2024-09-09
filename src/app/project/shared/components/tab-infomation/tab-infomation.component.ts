import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { AuthQuery } from '@app/project/core/state';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tab-infomation',
  templateUrl: './tab-infomation.component.html',
  styleUrls: ['./tab-infomation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitTabInfomationComponent extends AbstractComponent implements OnInit, OnDestroy {

  @Input() data;
  @Input() permission:any = {};
  @Output() openDialog = new EventEmitter();
  taskInfo = false;
  constructor(
    private router: Router,
    protected snackbarService: SnackbarService,
    protected dialog: MatDialog,
    protected translate: TranslateService,
    protected authQuery?: AuthQuery,
  ){
    super(snackbarService, dialog, translate, authQuery);
  }

  ngOnInit(): void {
    this.onInitial();
    if (this.router.url.indexOf('/audittask/taskinfo') !== -1) {
      this.taskInfo = true;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy()
  }

  openChangeTaskDialog(){
    this.openDialog.emit(this.data);
  }
}
