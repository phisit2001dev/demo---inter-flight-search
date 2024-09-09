import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, ChangeDetectorRef } from '@angular/core';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';

@Component({
  selector: 'app-user-group-criteria',
  templateUrl: './user-group-criteria.component.html',
  styleUrls: ['./user-group-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupCriteriaComponent extends AbstractComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() initData: any;

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private cdf: ChangeDetectorRef
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
    this.mds$.doMarkForCheck(this.cdf);
  }

  ngOnInit() {
    super.onInitial();
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
