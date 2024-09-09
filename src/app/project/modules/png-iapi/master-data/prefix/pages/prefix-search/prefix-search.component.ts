import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { CommonSelectItem } from '@app/common/models/common-select-item';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { InputFilesService } from '@app/project/shared/service/input-files.service';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { filter, Subject, takeUntil, tap } from 'rxjs';
import { PrefixSearch } from '../../models/prefix-search';
import { PrefixService } from '../../services/prefix.service';

@Component({
  selector: 'app-prefix-search',
  templateUrl: './prefix-search.component.html',
  styleUrls: ['./prefix-search.component.scss'],
  providers: [ ManualDetectionService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrefixSearchComponent extends AbstractSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  initialData: any;
  form: FormGroup;
  dataSource$ = new Subject<any>;
  permission: Permission;
  selection = new SelectionModel<PrefixSearch>(true, []);

  constructor(
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private service: PrefixService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: InputFilesService
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();
    this.initialData = this.route.snapshot.data.init.payload; /// Get data inital from resolver
    this.defaultFormValue = this.initialData.criteria;        /// Default form value
    this.initialCriteria(this.initialData);                   /// Get criteria temp
    this.permission = this.initialData?.permission;           /// Get permission
    this.initialForm();
  }

  ngAfterViewInit() {
    if (this.route.snapshot.data.init.payload?.criteriaTemp) { /// Have temp
      this.processSearch(this.criteria);  // Search with criteria temp.

    } else {
      this.spinner.hide();  // Hide spinner.
    }
  }

  ngOnDestroy() {
    super.onDestroy();
    this.mds$.destroy();
  }

  initialForm() {
    this.form = this.formBuilder.group({
      prefixName: [this.criteria?.prefixName ?? ''],              /// Text input
      prefixType: [this.criteria?.prefixType ?? ''],              /// Combo
      prefixTypeLabel: [this.criteria?.prefixTypeLabel ?? ''],    /// Label for event log
      activeStatus: [this.criteria?.activeStatus ?? ''],          /// Combo
      linePerPage: [this.criteria?.linePerPage ?? ''],
      headerSorts: [this.criteria?.headerSorts ?? ''],
      pageIndex: [this.criteria?.pageIndex ?? ''],
      checkMaxExceed: [this.criteria?.checkMaxExceed ?? ''],  // Default = true from API
    });
  }

  search() {
    if (this.form.invalid) {  /// Form is invalid ?
      this.form.markAllAsTouched();
      this.mds$.getNext();
      this.snackbarService.open(this.translate.instant('10002'), "W");  // Show snackbar.
      return;
    }

    this.clearBeforeSearch(); // Clear ssearch result.
    this.criteria = {...this.form.value}; // Set criteria.
    this.form.get('checkMaxExceed').setValue(this.defaultFormValue.checkMaxExceed); /// default checkMaxExceed
    this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts); /// default headerSorts
    this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex);     /// default pageIndex
    this.processSearch(this.prepareFormData()); // Search with current form.
  }

  private prepareFormData() {
    // If selected prefix type
    if (this.form.get("prefixType").value != "") {
      // Find value in selectItem.
      this.initialData?.listPrefixType.filter((prefix: CommonSelectItem) => {
        // Check match with key selected.
        if (prefix.key == this.form.get("prefixType").value) {
          // Set in from for show in log event
          this.form.get("prefixTypeLabel").setValue(prefix.value);
        }
      });
    }

    let {...formData} :any = { ...this.form.value };
    return formData;
  }

  clearBeforeSearch() {
    this.isSearched = false;
    this.dataSource$.next(null);
    this.selection.clear();
  }

  clear() {
    this.criteria = { ...this.defaultFormValue }; // Set default criteria.
    this.isSearched = false;      // Set flag search criteria temp.
    this.mds$.clearValidate();    // Clear validate.
    this.form.reset({
      linePerPage: this.defaultFormValue.linePerPage,           // Reset combo
      airportStatus: this.defaultFormValue.airportStatus,       // Reset combo
      activationStatus: this.defaultFormValue.activationStatus, // Reset combo
    });
    this.dataSource$.next(null);  // Clear dataSource.
    this.selection.clear();       // Clear select checkbox in table.
  }

  gotoAdd() {
    this.router.navigate(['/iapi/master-data/prefix/add'],
    { queryParams: { page: 'add' }, relativeTo: this.route });
  }

  gotoEdit(obj: PrefixSearch) {
    this.router.navigate(['/iapi/master-data/prefix/edit'],
    { queryParams: { hiddenToken: obj.hiddenToken, page: 'edit' }, relativeTo: this.route });
  }

  export() {
    this.spinner.show();

    /// Call API.
    this.service.export(this.criteria).pipe().subscribe( (resp) => {
      this.fileService.openFile(resp, this);  // Open file & Handle response.
      this.spinner.hide();
    });
  }

  active(ids: []) {
    /// Open confirm dialog.
    this.openConfirm('50001').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) {
        this.spinner.show();    // Show spinner.

        /// Call API.
        this.service.setActive(ids).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
          this.handleResponse(resp);  // Show snackbar.

          this.processSearch(this.criteria);  // Search with criteria temp.
          this.selection.clear(); // Clear select checkbox in table.
          this.spinner.hide();    // Hide spinner.
        });
      }
    });
  }

  inactive(ids: []) {
    /// Open confirm dialog.
    this.openConfirm('50002').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) {
        this.spinner.show();    // Show spinner.

        /// Call API.
        this.service.setInactive(ids).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
          this.handleResponse(resp);  // Show snackbar.

          this.processSearch(this.criteria);  // Search with criteria temp.
          this.selection.clear(); // Clear select checkbox in table.
          this.spinner.hide();    // Hide spinner.
        });
      }
    });
  }

  sortChange(e: Sort) {
    this.selection.clear(); // Clear select checkbox in table.
    this.form.get('headerSorts').setValue([{columnName: e.active.toString(), order: e.direction }]);/// Set header sort in form
    this.criteria.headerSorts = this.form.get('headerSorts').value;                                 /// Set header sort in criteria
    this.processSearch(this.criteria);  // Search with criteria from searched.
  }

  pageEvent(e: PageEvent) {
    this.selection.clear(); // Clear select checkbox in table.
    this.form.get('pageIndex').setValue(e.pageIndex);           /// Set page index in form
    this.criteria.pageIndex = this.form.get('pageIndex').value; /// Set page index in criteria
    this.processSearch(this.criteria);  // Search with criteria from searched.
  }

  /**
   * Search
   * - Show spinner
   * - Show snackbar
   * - Clear selection
   * - Hide spinner
   * @param cirteria
   */
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
        this.isSearched = true; // Flag for search with criteria temp.
      }
    });
  }
}
