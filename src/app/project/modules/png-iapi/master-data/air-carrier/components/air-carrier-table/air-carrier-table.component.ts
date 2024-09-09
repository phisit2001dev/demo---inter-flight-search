import { PageEvent } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Permission } from '@app/common/models/permission';
import { Observable, takeUntil, filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { AbstractComponent } from '@app/abstracts/abstract-component';

@Component({
  selector: 'app-air-carrier-table',
  templateUrl: './air-carrier-table.component.html',
  styleUrls: ['./air-carrier-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirCarrierTableComponent extends AbstractComponent implements OnInit, OnDestroy {
  @Output() active = new EventEmitter();
  @Output() inactive = new EventEmitter();
  @Output() export = new EventEmitter();
  @Output() gotoEdit = new EventEmitter();
  @Input() selection = new SelectionModel<any>(true, []);
  @Input() permission: Permission;

  @Input() dataSource$: Observable<any>;
  @Input() headerSorts: any;
  @Input() linePerPage: string;
  @Input() pageIndex: number;

  @Output() sortChange = new EventEmitter();
  @Output() pageEvent = new EventEmitter();
  dataSource;
  dataLength = 0;
  pageSize;
  displayPageIndex = 0;

  displayedColumns: string[] = [
    'no',
    'checkbox',
    'edit',
    'activeStatus',
    'airlineCodeIata',
    'airlineCodeIcao',
    'airlineName',
    'carrierType',
    'countryName',
  ];

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    public spinner: SpinnerService,
    public cdf:  ChangeDetectorRef,
  ){
    super(snackbarService, dialog, spinner, null, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
    this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.displayPageIndex = (this.pageIndex+1);
      if (resp) {
        this.dataSource = resp.data;
        this.dataLength = this.dataSource?.totalResult;
        this.pageSize = this.linePerPage;
      } else {
        this.dataSource = null;
      }

      this.cdf.markForCheck();
    })
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  pageChange(e: PageEvent) {
		if (this.validatePaginator(e.pageIndex, this.linePerPage, this.dataLength)) {
		  // event from input
		  if (e.previousPageIndex === null) {
			if (e.pageIndex === 0) {
			  return false;
			}

			this.displayPageIndex = e.pageIndex;
			let objVal :PageEvent = e;
			objVal.pageIndex = e.pageIndex-1;
			this.pageEvent.emit(objVal);

		  // event from material
		  } else {
        this.displayPageIndex += (e.pageIndex - e.previousPageIndex);
        this.pageEvent.emit(e);
		  }
		}
  }

  btnExport() {
    this.export.emit('');
  }

  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.listResult.length;

    return numSelected === numRows;
  }
  
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear(); // unselect all.
    } else {
      this.dataSource?.listResult?.forEach(row => this.selection.select(row));  // select all.
    }
  }

  childToggle(element: any) {
    this.selection.toggle(element);

  }

  btnActive(){

    if(this.selection.selected.length <= 0){
      this.snackbarService.open(this.translate.instant('10001'), "W")
      return
    }
    this.active.emit(this.selection.selected)
  }

  btnInactive() {
    if(this.selection.selected.length <= 0){
      this.snackbarService.open(this.translate.instant('10001'), "W")
      return
    }
    this.inactive.emit(this.selection.selected);
  }
  btnGotoEdit(element: string) {
    this.gotoEdit.emit(element);
  }


}
