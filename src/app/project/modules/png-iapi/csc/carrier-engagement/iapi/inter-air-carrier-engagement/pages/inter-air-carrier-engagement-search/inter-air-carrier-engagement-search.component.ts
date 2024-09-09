import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Permission } from '@app/common/models/permission';
import { Subject,takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { InterAirCarrierEngagementService } from '../../service/inter-air-carrier-engagement.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-inter-air-carrier-engagement-search',
  templateUrl: './inter-air-carrier-engagement-search.component.html',
  styleUrls: ['./inter-air-carrier-engagement-search.component.scss'],
  providers: [ManualDetectionService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InterAirCarrierEngagementSearchComponent
  extends AbstractSearchComponent
  implements OnInit, AfterViewInit, OnDestroy
{

  form: FormGroup;
  payload: any;
  permission: Permission;
  defaultFormValue: any;
  criteria: any = {};
  dataSource$: Subject<any> = new Subject();

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: InterAirCarrierEngagementService,
    private cdf: ChangeDetectorRef,
    private router: Router
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();
    this.initialData();
    this.initForm();
  }

  ngAfterViewInit() {
    this.spinner.hide();

    // reload table
    if (this.getCriteriaTemp()) {
      this.spinner.show();
      this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
        this.handleResponse(resp);
        if(resp.displayStatus === 'S'){
          this.dataSource$.next(resp);
          this.spinner.hide();
        }
      });
    }
  }

  ngOnDestroy() {
    super.onDestroy();
    this.mds$.destroy();
  }

  initForm() {
    this.form = this.formBuilder.group({
      carrierCodeCode: [this.criteria ? this.criteria.carrierCodeCode:'',{updateOn: 'blur'}],
      carrierCodeValue: [this.criteria ? this.criteria.carrierCodeValue:'',{updateOn: 'blur'}],
      dcsHost: [this.criteria ? this.criteria.dcsHost:'',{updateOn: 'blur'}],
      certtificationType: [this.criteria ? this.criteria.certtificationType:'',{updateOn: 'blur'}],
      status: [this.criteria ? this.criteria.status:'',{updateOn: 'blur'}],

      linePerPage: [this.criteria?.linePerPage ?? ''],
      headerSorts: [this.criteria?.headerSorts ?? ''],
      pageIndex: [this.criteria?.pageIndex ?? ''],});
  }

  private initialData() {
    this.payload = this.route.snapshot.data.init.payload;
    this.permission = this.payload.permission;
    this.initialCriteria(this.payload);
    this.defaultFormValue =  {...this.payload.criteria};
  }

  private prepareCriteria(action: string) {
    switch(action) {
      case 'SEARCH':
        this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex);
        this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts);
        
        this.criteria = { ...this.form.value };
        break;
      case 'CLEAR':
        this.criteria = { ...this.defaultFormValue };
        break;
    }
  }

  search(): void {
    if (this.form.invalid) {
      this.snackbarService.open(this.translate.instant('10004'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    this.prepareCriteria('SEARCH');
    this.isSearched = true;
    /// Set form
    // const formData: InterAirCarrierEngagementCriteria = this.prepareFormData();
    this.spinner.show();
    this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);                    // Handle response
      if(resp.displayStatus === 'S'){
        this.dataSource$.next(resp);               // Set data table
        this.spinner.hide();                       // Hide spinner
      }
    });
  }

  clear(): void {
    this.mds$.clearValidate();
    this.dataSource$.next(null);
    this.isSearched = false;
    this.prepareCriteria('CLEAR');
    this.form.reset(this.defaultFormValue);
  }

  gotoAdd(): void {
    this.isSearched = true;
    this.router.navigate(['/iapi/csc/carrier-engagement/iapi/inter-air-engagement/add']);
  }

  gotoEdit(element: any): void {
    this.isSearched = true;
    this.router.navigate(['/iapi/csc/carrier-engagement/iapi/inter-air-engagement/edit', element.hiddenToken]);
  }

  gotoView(element: any): void {
    this.isSearched = true;
    this.router.navigate(['/iapi/csc/carrier-engagement/iapi/inter-air-engagement/view', element.hiddenToken],{relativeTo: this.route});
  }

  sortChange(e: Sort): void {
    /// Set header sort
    this.form.get('headerSorts').setValue([{columnName: e.active.toString(), order: e.direction }]);
    this.criteria.headerSorts = this.form.get('headerSorts').value;

    this.spinner.show();    /// Show spinner

    /// Call API
    this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);

      if (resp.displayStatus === 'S') {
        this.dataSource$.next(resp);
        this.spinner.hide();
      }
    });
  }

  pageEvent(e: PageEvent): void {
    this.form.get('pageIndex').setValue(e.pageIndex);
    this.criteria.pageIndex = this.form.get('pageIndex').value;
    // เปิด spinner
    this.spinner.show();
    this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);
      if (resp.displayStatus === 'S') {
        this.dataSource$.next(resp);
        this.spinner.hide();
      }
    });
  }

  getCriteriaTemp(){
    return this.route.snapshot.data.init.payload?.criteriaTemp;
  }
}
