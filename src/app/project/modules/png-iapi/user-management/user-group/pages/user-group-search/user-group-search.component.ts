import { AfterViewInit, Component, ChangeDetectorRef, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { UserGroupService } from '../../services/user-group.service';
import { Subject, takeUntil } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { UserGroupSearchResult } from '../../models/user-group-search-result';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-group-search',
  templateUrl: './user-group-search.component.html',
  styleUrls: ['./user-group-search.component.scss'],
  providers: [ ManualDetectionService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserGroupSearchComponent 
  extends AbstractSearchComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  form: FormGroup;
  initData: any;
  dataSource$ = new Subject<any>();
  selection = new SelectionModel<UserGroupSearchResult>(true, []);
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
    private service: UserGroupService
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }
  
  ngAfterViewInit() {
    
    // reload table
    if (this.getCriteriaTemp()) {
      this.processSearch(this.criteria);
    } else {
      this.spinner.hide();
    }
  }

  ngOnInit() {
    super.onInitial();
    
    this.initData = this.route.snapshot.data.init.payload;
    this.defaultFormValue = this.initData.criteria;
    this.initialCriteria(this.initData);
    this.initForm();
  }

  initForm(){
    this.form = this.formBuilder.group({
      groupCode:  this.criteria?.groupCode ?? '',
      groupName:  this.criteria?.groupName ?? '',
      active:  this.criteria?.active ?? '',

      linePerPage: [this.criteria?.linePerPage ?? '',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      headerSorts: [this.criteria?.headerSorts ?? ''],
      pageIndex: [this.criteria?.pageIndex ?? ''],
      checkMaxExceed: [this.criteria?.checkMaxExceed ?? ''],  // Default = true from API
    });
  }
  
  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  search(){
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
      },
      relativeTo: this.route,
    });
  }

  gotoEdit(e: UserGroupSearchResult) {
    this.router.navigate(['../', 'edit'], {
      queryParams: {
        hiddenToken: e.hiddenToken, 
        page: 'edit'
      },
      relativeTo: this.route,
    });
  }

  gotoView(e: UserGroupSearchResult) {
    this.router.navigate(['../', 'view'], {
      queryParams: {
        hiddenToken: e.hiddenToken, 
        page: 'view'
      },
      relativeTo: this.route,
    });
  }

  getCriteriaTemp(){
    return this.route.snapshot.data.init.payload?.criteriaTemp;
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
    this.form.get('pageIndex').setValue(e.pageIndex);
    this.selection.clear(); /// Clear select
    this.criteria.pageIndex = this.form.get('pageIndex').value;
    this.processSearch(this.criteria);
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
}
