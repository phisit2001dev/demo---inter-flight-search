import { filter } from 'rxjs';
import { ContentChildren, Directive } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
// import { SitValidatorInputService } from '@app/project/shared/services/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from './../project/core/state/auth.query';
import { AbstractComponent } from './abstract-component';

@Directive()
export abstract class AbstractSearchComponent extends AbstractComponent {

  isSearched = false;
  criteria: any = {};
  defaultFormValue: any;

  constructor(
    protected snackbarService: SnackbarService,
    protected dialog: MatDialog,
    protected abstractSpinner: SpinnerService,
    protected mds$?: ManualDetectionService,
    protected translate?: TranslateService,
    protected authQuery?: AuthQuery,
  ) {
    super(snackbarService, dialog, abstractSpinner, mds$, translate, authQuery);
  }

  /** การ initialCriteria จะตรวจสอบ criteriaTemp  */
  /**
   *
   * @param payload
   */
  initialCriteria(payload: any) {
    if (!payload.hasCriteriaKey) {
      this.criteria =  { ...payload.criteria };
    }else{
      this.isSearched = true;
      this.criteria = { ...payload.criteriaTemp };
    }
  }
}
