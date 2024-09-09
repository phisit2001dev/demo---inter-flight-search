import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { FormGroup } from '@angular/forms';
import { Permission } from '@app/common/models/permission';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { Router } from '@angular/router';
import { takeUntil, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-carrier-engagement-table',
  templateUrl: './carrier-engagement-table.component.html',
  styleUrls: ['./carrier-engagement-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarrierEngagementTableComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy{

  displayedColumns = [
    'no',
    'edit',
    'view',
    'carrierCodeIATA',
    'carrierCodeICAO',
    'carrierName',
    'certificationType',
    'dcsHost',
    'version',
    'certificationStartDate',
    'updateDate',
    'status',
    'cutoverDate'
  ];

  dataSource;

  // paginator
  dataLength = 0;
  pageSize;
  displayPageIndex = 0;

  @Input() form: FormGroup;
  @Input() permission: Permission;

  @Input() dataSource$: Observable<any>;
  @Input() headerSorts: any;
  @Input() linePerPage: string;
  @Input() pageIndex: number;
  @Input() paginator: any;

  @Output() btnEdit = new EventEmitter();
  @Output() btnView = new EventEmitter();
  @Output() sortChange = new EventEmitter();
  @Output() pageEvent = new EventEmitter();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChildren(MatSortHeader) sortH:QueryList<MatSortHeader>;
  
  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private cdf: ChangeDetectorRef,
    private router: Router
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();
    this.initialDataSource();
  }

  ngAfterViewInit() {
    this.spinner.hide();
  }

  ngOnDestroy() {
    super.onDestroy();
  }

  private initialDataSource(): void {
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

}
