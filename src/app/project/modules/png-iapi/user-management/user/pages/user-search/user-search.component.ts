import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  OnDestroy, OnInit
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Subject, takeUntil } from 'rxjs';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { UsersSearchResult } from '../../model/users-search-result';
import { Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { InputFilesService } from '@app/project/shared/service/input-files.service';



@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  providers: [ ManualDetectionService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserSearchComponent
  extends AbstractSearchComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  form: FormGroup;
  initData: any;
  dataSource$ = new Subject<any>();
  selection = new SelectionModel<UsersSearchResult>(true, []);
  userName: any; //เพิ่มตัวแปร

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
    private service: UserService,
    private fileService: InputFilesService,
    
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  
  }
 ngOnInit() {
    super.onInitial();
    this.initData = this.route.snapshot.data.init.payload;
    this.defaultFormValue = this.initData.criteria;
    this.userName = this.route.snapshot.data.init.userName 
    // let ff = this.route.snapshot.data.init.idid
    this.initialCriteria(this.initData);  
    this.initForm();
      
  }
  ngAfterViewInit() {
    if (this.getCriteriaTemp()) {
      this.processSearch(this.criteria);
    }
    
    else {
      this.spinner.hide();
    }
  }

 

  initForm(){
    this.form = this.formBuilder.group({
      employeeCode:[this.criteria?.employeeCode ?? ''],
      username: [this.criteria?.username ?? ''],
      forename: [this.criteria?.forename ?? ''],
      surname:  [this.criteria?.surname ?? ''],
      organizationId: [this.criteria?.organizationId ?? ''],
      doctypeRefUserNo:[this.criteria?.doctypeRefUserNo ?? ''],
      lockStatus: [this.criteria?.lockStatus ?? ''],
      active:  [this.criteria?.active ?? ''],
      groupId: [this.criteria?.groupId ?? ''],

      linePerPage: [this.criteria?.linePerPage ?? '',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      headerSorts: [this.criteria?.headerSorts ?? ''],
      pageIndex: [this.criteria?.pageIndex ?? ''],
      checkMaxExceed: [this.criteria?.checkMaxExceed],  // Default = true from API
    });
  }

  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  search() {
    /// Check validate
    if (this.form.invalid) {
      this.snackbarService.open(this.translate.instant('10002'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }
    
    this.clearBeforeSearch();

    // default pageIndex
    this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex);
    // default headerSorts
    this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts);
    // default checkMaxExceed
    this.form.get('checkMaxExceed').setValue(this.defaultFormValue.checkMaxExceed); 
    // เตรียม Criteria สำหรับการคืนค่า
    this.criteria = {...this.form.value};

    this.processSearch(this.criteria);
  }

  private processSearch(cirteria: any) {
    this.spinner.show();    // Show spinner.

    /// Call API.
    this.service.search(cirteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      if (resp?.componentType === 'C') {  // Check mex exceed
        this.spinner.hide();  // Hide spinner.
        this.openConfirm(resp.messageDesc).afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
          if (result) {
            this.form.get('checkMaxExceed').setValue(false);
            this.criteria = {...this.form.value}; // Set criteria.
            this.processSearch(this.criteria);
          }
        });

      } else {
        this.handleResponse(resp);  // Show snackbar.
        this.selection.clear();     // Clear checkbox in table.

        if (resp?.displayStatus === 'S') {  // Response status is success.
          this.dataSource$.next(resp);      // Set dataSource.
        }

        this.spinner.hide();  // Hide spinner.

        this.isSearched = true; // FIX ให้กลับมาโหลด Criteria เดิมได้
      }
    });
  }

  clearBeforeSearch() {
    this.isSearched = false;
    this.dataSource$.next(null);
    this.selection.clear();  
  }

  clear() {
    this.criteria = { ...this.defaultFormValue };
    this.isSearched = false;
    this.mds$.clearValidate();
    this.form.reset(this.initData.criteria);
    this.dataSource$.next(null);
    this.selection.clear();  
  }

  gotoAdd(){
    this.router.navigate(['../', 'add'], {
      queryParams: {
        page: 'add',
        element: this.userName
      },
      relativeTo: this.route,
    });
  }
//
  gotoEdit(e: UsersSearchResult) {
    this.router.navigate(['../', 'edit'], {
      queryParams: {
        hiddenToken: e.hiddenToken, 
        page: 'edit',
        element: this.userName
      },
      relativeTo: this.route,
    });
  }

  gotoView(e: UsersSearchResult) {
    this.router.navigate(['../', 'view'], {
      queryParams: {
        hiddenToken: e.hiddenToken, 
        page: 'view',
        element: this.userName
      },
      relativeTo: this.route,
    });
  }
  
  getCriteriaTemp(){
    return this.route.snapshot.data.init.payload?.criteriaTemp
  }

  /**
   * Sort change
   */
  sortChange(e: Sort){
    this.selection.clear(); /// Clear select

    /// Set header sort
    this.form.get('headerSorts').setValue([{columnName: e.active.toString(), order: e.direction }]);
    this.criteria.headerSorts = this.form.get('headerSorts').value;
    this.processSearch(this.criteria);
  }

  /**
   * Page event
   */
  pageEvent(e: PageEvent){
    this.selection.clear(); /// Clear select
    this.form.get('pageIndex').setValue(e.pageIndex);
    this.criteria.pageIndex = this.form.get('pageIndex').value;
    this.processSearch(this.criteria);
  }

  
  export() {
    this.spinner.show();

    /// Call API.
    this.service.export(this.criteria).pipe(takeUntil(this.destroy$)).subscribe( (resp) => {
      this.fileService.openFile(resp, this);  // Open file & Handle response.
      this.spinner.hide();
    });
  }

  updateActive() {
    if (this.selection.selected.length === 0) {
      // Alert:10001 [You must select at least one list.]
      this.snackbarService.open(this.translate.instant('10001'), 'W');
      return;
    }

    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50001') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        let hiddenTokens = this.createIds();

        this.spinner.show();
        this.service.updateActive(hiddenTokens).pipe(takeUntil(this.destroy$)).subscribe((payload) => {
          this.handleResponse(payload);
          if (!payload.error) {
            this.selection.clear();
            this.searchAgin();
          }
        });
      }
    });
  }

  updateInactive() {
     if (this.selection.selected.length === 0) {
      // Alert:10001 [You must select at least one list.]
      this.snackbarService.open(this.translate.instant('10001'), 'W');
      return;
    }

    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50002') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        let hiddenTokens = this.createIds();

        this.spinner.show();
        this.service.updateInactive(hiddenTokens).pipe(takeUntil(this.destroy$)).subscribe((payload) => {
          this.handleResponse(payload);
          if (!payload.error) {
            this.selection.clear();
            this.searchAgin();
          }
        });
      }
    });
  }

  updateReady() {
    if (this.selection.selected.length === 0) {
      // Alert:10001 [You must select at least one list.]
      this.snackbarService.open(this.translate.instant('10001'), 'W');
      return;
    }

    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50013') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        let hiddenTokens = this.createIds();

        this.spinner.show();
        this.service.updateReady(hiddenTokens).pipe(takeUntil(this.destroy$)).subscribe((payload) => {
          this.handleResponse(payload);
          if (!payload.error) {
            this.selection.clear();
            this.searchAgin();
          }
        });
      }
    });
  }

  updateLocked() {
    if (this.selection.selected.length === 0) {
      // Alert:10001 [You must select at least one list.]
      this.snackbarService.open(this.translate.instant('10001'), 'W');
      return;
    }
    
    this.dialog
    .open(ConfirmDialogComponent, { data: { description: this.translate.instant('50014') } })
    .afterClosed()
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      if (result) {
        let hiddenTokens = this.createIds();

        this.spinner.show();
        this.service.updateLocked(hiddenTokens).pipe(takeUntil(this.destroy$)).subscribe((payload) => {
          this.handleResponse(payload);
          if (!payload.error) {
            this.selection.clear();
            this.searchAgin();
          }
        });
      }
    });
  }

  searchAgin() {
    this.service.search(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);
      if(resp.displayStatus === 'S'){
        this.dataSource$.next(resp);
        this.spinner.hide();
      }
    });
  }

  createIds():string {
    let ids;
    this.selection.selected.forEach(element => {
      if (!ids) {
        ids = element.hiddenToken;
      } else {
        ids += ",";
        ids += element.hiddenToken;
      }
    });
    return ids
  }


  closeUser(){
    this.router.navigate(['/iapi/user-management/audit-log/search'],{relativeTo: this.route});
  }

  
}
