import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateService } from '@app/project/core/services/date.service';
import { Permission } from '@app/common/models/permission';
import { CarrierEngagementAddEditViewCriteria } from '../../model/carrier-engagement-add-edit-view-criteria';
import { MatTableDataSource } from '@angular/material/table';
import { SITValidators } from '@app/project/core/validators/sit.validator';

@Component({
  selector: 'app-inter-air-carrier-engagement-add-edit-view',
  templateUrl: './inter-air-carrier-engagement-add-edit-view.component.html',
  styleUrls: ['./inter-air-carrier-engagement-add-edit-view.component.scss'],
  providers: [ManualDetectionService,
    {
      provide: DateAdapter,
      useClass: CustomNativeDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOMS_DATE_FORMATS,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterAirCarrierEngagementAddEditViewComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy{
  
  form: FormGroup;
  payload: any;
  permission: Permission;
  hiddenToken: string;
  criteria: CarrierEngagementAddEditViewCriteria;
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  page: string;
  disabledPage = false;

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private dateService: DateService
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();
    this.payload = this.route.snapshot.data.init;
    this.page = this.payload.page.charAt(0).toUpperCase();
    this.disabledPage = this.page == 'V';

    // Get permission
    this.permission = this.payload.initdata.permission;

    this.initData();
    this.initForm();
  }

  ngAfterViewInit() {
    /// Searched
    this.spinner.hide();
  }

  ngOnDestroy() {
    super.onDestroy();
    this.mds$.destroy()
  }

  initData() {
    this.dataSource = this.payload.initdata.listRemark;
    this.criteria = this.payload.initdata.criteria;
  }

  initForm() {
    this.form = this.formBuilder.group({
      carrierCodeCode: [this.criteria ? this.criteria.carrierCodeCode:'',{updateOn: 'blur', validators: SITValidators.isRequire}],
      carrierCodeValue: [this.criteria ? this.criteria.carrierCodeValue:'',{updateOn: 'blur', validators: SITValidators.isRequire}],
      dcsHost: [this.criteria ? this.criteria.dcsHost:'',{updateOn: 'blur', validators: SITValidators.isRequire}],
      certificationType: [this.criteria ? this.criteria.certificationType:'',{updateOn: 'blur', validators: SITValidators.isRequire}],
      status: [this.criteria ? this.criteria.status:'',{updateOn: 'blur'}],
      seriveForm: ['',{updateOn: 'blur'}],
      cutoverDate:  [this.criteria ? (this.criteria.cutoverDate ? this.dateService.toDate(this.criteria.cutoverDate) : new Date):'',{updateOn: 'blur', validators: SITValidators.isRequire}],
      version: ['',{updateOn: 'blur'}],
      certificationStartDate: [this.criteria ? this.dateService.toDate(this.criteria.certificationStartDate):'',{updateOn: 'blur', validators: SITValidators.isRequire}],
      serviceFormFileName : ['',{updateOn: 'blur'}],
      serviceFormFilePath : ['',{updateOn: 'blur'}],
      transMasId : ['',{updateOn: 'blur'}],

      linePerPage: [this.criteria?.linePerPage ?? ''],
      headerSorts: [this.criteria?.headerSorts ?? ''],
      pageIndex: [this.criteria?.pageIndex ?? ''],
    });
  }

  save() {
    if (this.form.invalid) {
      this.snackbarService.open(this.translate.instant('10004'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }
  }

  cancel(): void {
    // Do you want to exit add mode ?
    this.openConfirm( this.page == 'edit' ? '50010' : '50009')
    .afterClosed()
    .subscribe((v) => {
      if (v) {
        this.navigateToSearch();
      }
    });
  }

  close(){
    this.navigateToSearch();
  }

  private navigateToSearch(): void {
    this.router.navigate(['/iapi/csc/carrier-engagement/iapi/inter-air-engagement', 'search'], { relativeTo: this.route });
  }
}
