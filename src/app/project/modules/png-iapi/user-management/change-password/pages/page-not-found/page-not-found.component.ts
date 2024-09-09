import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  providers: [ManualDetectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy{
  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private router: Router
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();
  }

  ngAfterViewInit() {
    this.spinner.hide();
  }

  ngOnDestroy() {
    super.onDestroy();
    this.mds$.destroy();
  }

  gotoLogin() {
    this.router.navigate(['']);
  }
}
