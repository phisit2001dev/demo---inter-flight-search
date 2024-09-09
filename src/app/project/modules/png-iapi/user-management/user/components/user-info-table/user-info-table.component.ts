import { Component, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output, Input, OnInit, OnDestroy, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { Observable, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'app-user-info-table',
  templateUrl: './user-info-table.component.html',
  styleUrls: ['./user-info-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserInfoTableComponent extends AbstractComponent implements OnInit, OnDestroy {
  
  displayedColumns: string[] = ['no', 'checkbox', 'edit', 'view', 
  'active', 'lockStatus', 'employeeCode', 'username', 'fullname', 
  'organizationName', 'doctypeRefUserNo', 'phoneNo', 'groupNameUser'];

  @Input() selection:SelectionModel<any>;
  @Input() dataSource$: Observable<any>;
  @Input() headerSorts: any;
  
  @Input() linePerPage: string;
  @Input() pageIndex: number;

  @Input() permission: Permission;

  @Output() sortChange = new EventEmitter();
  @Output() pageEvent = new EventEmitter();
  
  @Output() gotoEdit = new EventEmitter();
  @Output() gotoView = new EventEmitter();
  @Output() export = new EventEmitter();

  @Output() updateActive = new EventEmitter();
  @Output() updateInactive = new EventEmitter();
  @Output() updateReady = new EventEmitter();
  @Output() updateLocked = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(MatSortHeader) sortH:QueryList<MatSortHeader>;
  dataSource;

  // paginator
  dataLength = 0;
  pageSize;
  displayPageIndex = 0;

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    public spinner: SpinnerService,
    private cdf: ChangeDetectorRef

  ){
    super(snackbarService, dialog, spinner, null, translate, authQuery);
  }
  
  ngOnInit(): void {
    super.onInitial();
    this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.displayPageIndex = this.pageIndex+1
      if (resp) {
        this.dataSource = resp.data;
        this.dataLength = this.dataSource?.totalResult;
        this.pageSize = this.linePerPage;
      }else {
        this.dataSource = null;
      }
      this.cdf.markForCheck();
    });
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
  
  btnGotoEdit(e: any){
    this.gotoEdit.emit(e);
  }

  btnGotoView(e: any){
    this.gotoView.emit(e);
  }

  btnExport() {
    this.export.emit();
  }

  btnUpdateActive() {
    this.updateActive.emit();
  }

  btnUpdateInactive() {
    this.updateInactive.emit();
  }

  btnUpdateReady() {
    this.updateReady.emit();
  }

  btnUpdateLocked() {
    this.updateLocked.emit();
  }

  /**
   * Page change
   */
  pageChange(e: PageEvent) {
    if (this.validatePaginator(e.pageIndex, this.linePerPage, this.dataLength)) {
      if (e.previousPageIndex === null) {
        // event from input
        if (e.pageIndex === 0) {
          return false;
        }

        this.displayPageIndex = e.pageIndex;
        let objVal :PageEvent = e;
        objVal.pageIndex = e.pageIndex-1;
        this.pageEvent.emit(objVal);

      } else {
        // event from material
        this.displayPageIndex += (e.pageIndex - e.previousPageIndex);
        this.pageEvent.emit(e);
      }
    }
  }

  /**
   * Checkbox master toggle
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();

    } else {
      this.dataSource?.listResult?.forEach(row => this.selection.select(row));
    }
  }

  /**
   * Check is checkbox select all
   */
  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.listResult.length;

    return numSelected === numRows;
  }

  /**
   * Checkbox child toggle
   */
  childToggle(element: any) {
    this.selection.toggle(element);
  }
}
