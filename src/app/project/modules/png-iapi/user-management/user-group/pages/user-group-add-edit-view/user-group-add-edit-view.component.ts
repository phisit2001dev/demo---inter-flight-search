import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { UserGroupService } from '../../services/user-group.service';

@Component({
  selector: 'app-user-group-add-edit-view',
  templateUrl: './user-group-add-edit-view.component.html',
  styleUrls: ['./user-group-add-edit-view.component.scss'],
  providers: [
    ManualDetectionService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupAddEditViewComponent extends AbstractComponent
implements OnInit, OnDestroy, AfterViewInit {
  
  form: FormGroup;
  initData: any;
  pageType: string;
  view: boolean;
  isActiveTab: number = 0;

  dataSourceProgram: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceReport: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceAirport: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceUser: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  selectionProgram: SelectionModel<any> = new SelectionModel<any>(true, []);
  selectionReport: SelectionModel<any> = new SelectionModel<any>(true, []);
  selectionAirport: SelectionModel<any> = new SelectionModel<any>(true, []);
  selectionUser: SelectionModel<any> = new SelectionModel<any>(true, []);

  constructor(
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private service: UserGroupService,
    private cdf: ChangeDetectorRef
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();

    this.initData = this.route.snapshot.data.init.payload;
    this.pageType = this.route.snapshot.data.init.pagetype;
    this.view = this.pageType === 'V';

    if (this.initData.userGroup?.listProgram) {
      this.dataSourceProgram.data.push(...this.initData.userGroup?.listProgram);
    }

    if (this.initData.userGroup?.listReport) {
      this.dataSourceReport.data.push(...this.initData.userGroup?.listReport);
    }

    if (this.initData.userGroup?.listAirport) {
      this.dataSourceAirport.data.push(...this.initData.userGroup?.listAirport);
    }

    if (this.initData.userGroup?.listUser) {
      this.dataSourceUser.data.push(...this.initData.userGroup?.listUser);
    }

    let activeTemp = this.initData?.userGroup?.active==='Y';
    if (this.pageType === 'A') {
      activeTemp = true;
    }

    this.form = this.formBuilder.group({
      active: activeTemp,
      groupCode: [
        this.initData?.userGroup?.groupCode ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      groupName: [
        this.initData?.userGroup?.groupName ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      remark: this.initData?.userGroup?.remark ?? '',
      hiddenToken: this.initData?.userGroup?.hiddenToken ?? ''
    });
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
  }
  
  add() {
    if (this.form.invalid) {
      this.snackbarService.open(this.translate.instant('10002'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    if ((this.dataSourceProgram.data.length == 0)
      && (this.dataSourceReport.data.length == 0)
      && (this.dataSourceAirport.data.length == 0)
      && (this.dataSourceUser.data.length == 0)) {
        this.dialog
        .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50064') } })
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {

            this.confirmAndAdd();
            
          } else {
            this.isActiveTab = 0;
            this.cdf.markForCheck();
            return;
          }
        });
    } else {
      this.confirmAndAdd();
    }
  }

  changeTab(event) {
    this.isActiveTab = event;
  }

  confirmAndAdd() {
    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50003') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        let user = this.createObjectForAddEdit();

        this.spinner.show();
        this.service.add(user).pipe(takeUntil(this.destroy$)).subscribe((payload) => {
          this.handleResponse(payload);

          if (payload?.displayStatus === 'S') {
            // Reset form.
            this.form.reset({   
              active: true
            });
            this.dataSourceProgram.data.splice(0, this.dataSourceProgram.data.length);
            this.dataSourceReport.data.splice(0, this.dataSourceReport.data.length)
            this.dataSourceAirport.data.splice(0, this.dataSourceAirport.data.length)
            this.dataSourceUser.data.splice(0, this.dataSourceUser.data.length)
            this.dataSourceProgram._updateChangeSubscription();
            this.dataSourceReport._updateChangeSubscription();
            this.dataSourceAirport._updateChangeSubscription();
            this.dataSourceUser._updateChangeSubscription();
            this.mds$.clearValidate();
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        });
      }
    });
  }
  
  cancelAdd() {
    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50009') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        this.gotoSearchPage();
      }
    });
  }

  edit() {
    if (this.form.invalid) {
      this.snackbarService.open(this.translate.instant('10002'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    if ((this.dataSourceProgram.data.length == 0)
      && (this.dataSourceReport.data.length == 0)
      && (this.dataSourceAirport.data.length == 0)
      && (this.dataSourceUser.data.length == 0)) {
        this.dialog
        .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50064') } })
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          if (result) {

            this.confirmAndEdit();
            
          } else {
            this.isActiveTab = 0;
            this.cdf.markForCheck();
            return;
          }
        });
    } else {
      this.confirmAndEdit();
    }
  }

  confirmAndEdit() {
    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50004') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        let user = this.createObjectForAddEdit();

        this.spinner.show();
        this.service.edit(user).pipe(takeUntil(this.destroy$)).subscribe((payload) => {
          this.handleResponse(payload);
          if (payload?.displayStatus === 'S') {
            this.gotoSearchPage();
          } else {
            this.spinner.hide();
          }
        });
      }
    });
  }

  cancelEdit() {
    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50010') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        this.gotoSearchPage();
      }
    });
  }
  
  gotoSearchPage() {
    this.router.navigate(['../', 'search'], {
      relativeTo: this.route,
    });
  }
  
  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  createObjectForAddEdit() {
    let user = this.form.value;
    if (user.active) {
      user.active = 'Y'
    } else {
      user.active = 'N'
    }

    user.programIds = '';
    this.dataSourceProgram.data.forEach(element => {
      if (!user.programIds) {
        user.programIds = element.hiddenToken;
      } else {
        user.programIds += ",";
        user.programIds += element.hiddenToken;
      }
    });

    user.reportIds = '';
    this.dataSourceReport.data.forEach(element => {
      if (!user.reportIds) {
        user.reportIds = element.hiddenToken;
      } else {
        user.reportIds += ",";
        user.reportIds += element.hiddenToken;
      }
    });

    user.airportIds = '';
    this.dataSourceAirport.data.forEach(element => {
      if (!user.airportIds) {
        user.airportIds = element.hiddenToken;
      } else {
        user.airportIds += ",";
        user.airportIds += element.hiddenToken;
      }
    });

    user.userIds = '';
    this.dataSourceUser.data.forEach(element => {
      if (!user.userIds) {
        user.userIds = element.hiddenToken;
      } else {
        user.userIds += ",";
        user.userIds += element.hiddenToken;
      }
    });

    return user;
  }
}
