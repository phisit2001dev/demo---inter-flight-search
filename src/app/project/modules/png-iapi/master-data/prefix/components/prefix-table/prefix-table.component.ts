import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, takeUntil } from 'rxjs';
import { CountrySearch } from '../../../country/models/country-search';

@Component({
  selector: 'app-prefix-table',
  templateUrl: './prefix-table.component.html',
  styleUrls: ['./prefix-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrefixTableComponent extends AbstractComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'no',
    'checkbox',
    'edit',
    'active',
    'prefixType',
    'prefixName',
    'abbreviation',
  ];

  @Output() gotoEdit = new EventEmitter();
  @Output() export = new EventEmitter();
  @Output() active = new EventEmitter();
  @Output() inactive = new EventEmitter();
  @Input() selection = new SelectionModel<CountrySearch>(true, []);
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

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    public spinner: SpinnerService,
    private cdf:  ChangeDetectorRef,
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

  /**
   * Event export (Use criteria form searched)
   */
  btnExport() {
    this.export.emit('');
  }

  btnActive() {
    if (this.selection.selected.length <= 0) {
      this.snackbarService.open(this.translate.instant('10001'), "W");
      return;
    }

    let selectedIds = [];
    this.selection.selected.forEach(obj => {selectedIds.push(obj.hiddenToken)});
    this.active.emit(selectedIds);
  }

  btnInactive() {
    if (this.selection.selected.length <= 0) {
      this.snackbarService.open(this.translate.instant('10001'), "W");
      return;
    }

    let selectedIds = [];
    this.selection.selected.forEach(obj => {selectedIds.push(obj.hiddenToken)});
    this.inactive.emit(selectedIds);
  }

  btnGotoEdit(id: string) {
    this.gotoEdit.emit(id);
  }

  /**
   * Check is checkbox select all.
   */
  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.listResult.length;

    return numSelected === numRows;
  }

  /**
   * Checkbox header column event.
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear(); // unselect all.

    } else {
      this.dataSource?.listResult?.forEach(row => this.selection.select(row));  // select all.
    }
  }

  /**
   * Checkbox in row event.
   * @param element
   */
  childToggle(element: any) {
    this.selection.toggle(element);
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
}
