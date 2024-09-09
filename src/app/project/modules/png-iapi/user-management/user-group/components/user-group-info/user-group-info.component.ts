import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { UserGroupService } from '../../services/user-group.service';

@Component({
  selector: 'app-user-group-info',
  templateUrl: './user-group-info.component.html',
  styleUrls: ['./user-group-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupInfoComponent extends AbstractComponent 
  implements OnInit, OnDestroy, AfterViewInit {

  @Input() form: FormGroup
  @Input() initData: any;
  @Input() view: boolean;

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private cdf: ChangeDetectorRef
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
    this.mds$.doMarkForCheck(this.cdf);
  }
  
  ngOnInit(): void {
    super.onInitial();
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  ngAfterViewInit() {
    if (this.view) {
      this.form.get('active').disable();
    }
  }
}
