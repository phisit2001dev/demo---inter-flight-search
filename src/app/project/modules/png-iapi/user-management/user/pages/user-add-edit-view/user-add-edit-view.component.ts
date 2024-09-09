import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { DateService } from '@app/project/core/services/date.service';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-add-edit-view',
  templateUrl: './user-add-edit-view.component.html',
  styleUrls: ['./user-add-edit-view.component.scss'],
  providers: [
    ManualDetectionService,
    {
      provide: DateAdapter,
      useClass: CustomNativeDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOMS_DATE_FORMATS,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAddEditViewComponent extends AbstractComponent
implements OnInit, OnDestroy, AfterViewInit {
  
  form: FormGroup;
  initData: any;
  pageType: string;
  view: boolean;
  disabledUsername: boolean;
  isActiveTab: number = 0;
  uSername:any //เพิ่มตำแปร
  dataSourceProgram: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceReport: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  dataSourceGroupuser: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  selectionProgram: SelectionModel<any> = new SelectionModel<any>(true, []);
  selectionReport: SelectionModel<any> = new SelectionModel<any>(true, []);
  selectionGroupuser: SelectionModel<any> = new SelectionModel<any>(true, []);
  
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
    private dateService: DateService,
    private service: UserService,
    private cdf: ChangeDetectorRef
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();

    this.initData = this.route.snapshot.data.init.payload;
    this.pageType = this.route.snapshot.data.init.pagetype;
    this.uSername = this.route.snapshot.data.init.username;
  
    this.view = this.pageType === 'V';
    this.disabledUsername = this.pageType !== 'A';

    if (this.initData.user?.listProgram) {
      this.dataSourceProgram.data.push(...this.initData.user?.listProgram);
    }
    
    if (this.initData.user?.listReport) {
      this.dataSourceReport.data.push(...this.initData.user?.listReport);
    }

    if (this.initData.user?.listGroupuser) {
      this.dataSourceGroupuser.data.push(...this.initData.user?.listGroupuser);
    }
    
    let activeTemp = this.initData?.user?.active==='Y';
    let lockStatusTemp = this.initData?.user?.lockStatus==='1';
    if (this.pageType === 'A') {
      activeTemp = true;
      lockStatusTemp = true;
    }

    this.form = this.formBuilder.group({
      doctypeRefUser: this.initData?.user?.doctypeRefUser ?? '',
      doctypeRefUserNo: this.initData?.user?.doctypeRefUserNo ?? '',
      employeeCode: [
        this.initData?.user?.employeeCode ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      prefixId: [ 
        this.initData?.user?.prefixId ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      prefixName: [ 
        this.initData?.user?.prefixName ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      forename: [ 
        this.initData?.user?.forename ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      surname: [ 
        this.initData?.user?.surname ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      positionName: this.initData?.user?.positionName ?? '',
      email: [
        this.initData?.user?.email ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire, SITValidators.isSingleEmail] },
      ],
      organizationId: [ 
        this.initData?.user?.organizationId ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      cellPhone1: [
        this.initData?.user?.cellPhone1 ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] }
      ],
      cellPhone2: this.initData?.user?.cellPhone2 ?? '',
      cellPhone3: this.initData?.user?.cellPhone3 ?? '',
      startDate: [
        this.initData?.user?.startDate
          ? this.dateService.toDate(this.initData?.user?.startDate)
          : '',
        { updateOn: 'blur', validators: [SITValidators.is_DatePicker()] },
      ],
      endDate: [
        this.initData?.user?.endDate
          ? this.dateService.toDate(this.initData?.user?.endDate)
          : '',
        { updateOn: 'blur', validators: [SITValidators.is_DatePicker()] },
      ],
      active: activeTemp,
      lockStatus: lockStatusTemp,
      remark: this.initData?.user?.remark ?? '',
      username: [
        this.initData?.user?.username ?? '',
        { updateOn: 'blur', validators: [SITValidators.isRequire] },
      ],
      hiddenToken: this.initData?.user?.hiddenToken ?? ''
    });
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
  }
  
  validateReferenceDocument() {
    const elNamedoctypeRefUser = 'doctypeRefUser';
    const elNameDoctypeRefUserNo = 'doctypeRefUserNo';
    this.form.get(elNamedoctypeRefUser).setValidators([]);
    this.form.get(elNamedoctypeRefUser).setErrors({});
    this.form.get(elNamedoctypeRefUser).updateValueAndValidity({ emitEvent : false });
    this.form.get(elNamedoctypeRefUser).markAsUntouched();
    this.form.get(elNameDoctypeRefUserNo).setValidators([]);
    this.form.get(elNameDoctypeRefUserNo).setErrors({});
    this.form.get(elNameDoctypeRefUserNo).updateValueAndValidity({ emitEvent : false });
    this.form.get(elNameDoctypeRefUserNo).markAsUntouched();

    let doctypeRefUser = this.form.get(elNamedoctypeRefUser).value;
    let doctypeRefUserNo = this.form.get(elNameDoctypeRefUserNo).value;
    if (doctypeRefUser && !doctypeRefUserNo) {
      this.form.get(elNameDoctypeRefUserNo).setValidators([SITValidators.isRequire]);
      this.form.get(elNameDoctypeRefUserNo).updateValueAndValidity({ emitEvent : false });
      this.form.get(elNameDoctypeRefUserNo).markAsUntouched();
    } else if (!doctypeRefUser && doctypeRefUserNo) {
      this.form.get(elNamedoctypeRefUser).setValidators([SITValidators.isRequire]);
      this.form.get(elNamedoctypeRefUser).updateValueAndValidity({ emitEvent : false });
      this.form.get(elNamedoctypeRefUser).markAsUntouched();
    }
  }

  add() {
    this.validateReferenceDocument();
    if (this.form.invalid) {     
      this.snackbarService.open(this.translate.instant('10002'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    if ((this.dataSourceProgram.data.length == 0)
      && (this.dataSourceReport.data.length == 0)
      && (this.dataSourceGroupuser.data.length == 0)) {
        this.dialog
        .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50065') } })
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
              active: true,
              lockStatus: true
            });
            this.dataSourceProgram.data.splice(0, this.dataSourceProgram.data.length);
            this.dataSourceReport.data.splice(0, this.dataSourceReport.data.length)
            this.dataSourceGroupuser.data.splice(0, this.dataSourceGroupuser.data.length); 
            this.dataSourceProgram._updateChangeSubscription();
            this.dataSourceReport._updateChangeSubscription();
            this.dataSourceGroupuser._updateChangeSubscription();
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
    this.validateReferenceDocument();
    if (this.form.invalid) {
      this.snackbarService.open(this.translate.instant('10002'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    if ((this.dataSourceProgram.data.length == 0)
      && (this.dataSourceReport.data.length == 0)
      && (this.dataSourceGroupuser.data.length == 0)) {
        this.dialog
        .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50065') } })
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
      queryParams: {element:this.uSername},
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

    if (user.lockStatus) {
      user.lockStatus = '1'
    } else {
      user.lockStatus = '2'
    }

    user.username = user.username.toUpperCase();
    user.startDate = this.dateService.toString(user.startDate);
    user.endDate = this.dateService.toString(user.endDate);
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

    user.groupIds = '';
    this.dataSourceGroupuser.data.forEach(element => {
      if (!user.groupIds) {
        user.groupIds = element.hiddenToken;
      } else {
        user.groupIds += ",";
        user.groupIds += element.hiddenToken;
      }
    });

    return user;
  }
}
