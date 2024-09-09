import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-airport-table',
  templateUrl: './airport-table.component.html',
  styleUrls: ['./airport-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirportTableComponent extends AbstractComponent implements OnInit {

  displayedColumns: string[] = ['position','checkbox', 'edit', 'view', 'active', 'iata','icao', 'airportname','location','timezone','utc','Countryname','airportsta'];
  @Input() selection:SelectionModel<any>;
  @Input() dataSource$: Observable<any>;
  @Input() headerSorts: any;
  @Input() paginator: any;

  @Input() linePerPage: string;
  @Input() pageIndex: number;

  @Input() permission: Permission;

  // output
  @Output() sortChange = new EventEmitter();
  @Output() pageEvent = new EventEmitter();
  @Output() clickEdit = new EventEmitter();
  @Output() clickView = new EventEmitter();

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
    protected spinner: SpinnerService,
    private cdf:  ChangeDetectorRef,
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
    })
  }

  export(){
    alert('click export');
  }

  pageChange(e: PageEvent){
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
      }else {
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


  /**
   * Checkbox child toggle
   */
  setActive(active: any) {
    if (this.selection.isEmpty()) {
      this.snackbarService.open(this.translate.instant('10001'),'W');
      return;
    }
    this.snackbarService.getSnackbar().dismiss();
  }

}
