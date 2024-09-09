import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SitlabelModule } from '../../module/sit-label.module';
import { ManualDetectionService } from '../../service/manual-detection.service';
import { SitValidatorInputService } from '../../service/validator-input.service';
import { Transaction } from '../../models/transaction';
import { TimezoneService } from '@app/project/core/services/timezone.service';

@Component({
  selector: 'app-sit-transaction',
  standalone: true,
  imports: [CommonModule, SitlabelModule, TranslateModule],
  templateUrl: './sit-transaction.component.html',
  styleUrls: ['./sit-transaction.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SitTransactionComponent extends AbstractComponent implements OnInit, OnDestroy {
  /**
   * Get transaction data.
   *
   * @type {Transaction}
   * @memberof SitTransactionComponent
   */
  @Input() transaction: Transaction;
  timezone: string;

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected validatorInput:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    public spinner: SpinnerService,
    public timeZoneService: TimezoneService,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();

    // Get time zone from local storage.
    this.timezone = "(" + this.timeZoneService.getTimeZone() + ")";
  }

  ngOnDestroy(): void {
    super.onDestroy()
  }
}
