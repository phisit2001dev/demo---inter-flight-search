import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-prefix-criteria',
  templateUrl: './prefix-criteria.component.html',
  styleUrls: ['./prefix-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrefixCriteriaComponent extends AbstractComponent implements OnInit, OnDestroy {
  @Input() initialData: any;
  @Input() form: FormGroup;

  activationSelectItem = [];
  prefixTypeSelectItem = [];
  llp = [];

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private cdf: ChangeDetectorRef,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
    this.mds$.doMarkForCheck(this.cdf);
  }

  ngOnInit(): void {
    super.onInitial();

    /// initial selectItem
    this.activationSelectItem = this.initialData?.listActiveStatus ?? [];
    this.prefixTypeSelectItem = this.initialData?.listPrefixType ?? [];
    this.llp = this.initialData?.listLinePerPage ?? [];
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
}
