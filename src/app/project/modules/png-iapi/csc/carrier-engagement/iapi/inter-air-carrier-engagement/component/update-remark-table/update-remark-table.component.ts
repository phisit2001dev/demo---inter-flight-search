import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, Input, ViewChild } from '@angular/core';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { Permission } from '@app/common/models/permission';
import { AddRemarkDialogComponent } from '../add-remark-dialog/add-remark-dialog.component';
import { DateService } from '@app/project/core/services/date.service';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-update-remark-table',
  templateUrl: './update-remark-table.component.html',
  styleUrls: ['./update-remark-table.component.scss'],
  providers: [ManualDetectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateRemarkTableComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy{

  displayedColumns = [];
  selectRow = [];

  @Input() permission: Permission;
  @Input() dataSource = [];
  @Input() selection = new SelectionModel<any>(true, []);
  @Input() selectionFlag$: Subject<boolean>;
  @Input() disabledPage: boolean;

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private dateService: DateService,
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit() {
    super.onInitial();
    
    this.dataSource ? [...this.dataSource] : this.dataSource = [];

    if(this.disabledPage) {
      this.displayedColumns = ['no','updateDate','remark'];
    } else {
      this.displayedColumns = ['no','checkbox','updateDate','remark'];
    }
  }

  ngAfterViewInit() {
    /// Searched
    this.spinner.hide();
  }

  ngOnDestroy() {
    super.onDestroy();
  }

  addRemark() {
    // open remark dialog
    this.dialog.open(AddRemarkDialogComponent, {
      height: '500px',
      width: '600px',
      data: {
        'description': 'Add Remark'
      }
    }).afterClosed().subscribe(result => {
      if(result) {
        this.dataSource.push({"updateDate" : this.dateService.toString(result.get('updateDate').value),"remark" : result.get('remark').value});
        this.table.renderRows();
      }
    });
  }

  deleteRemark() {
    this.selectRow.sort().reverse().forEach((row,index) => {
      this.dataSource.splice(row,row+1)
    });
    this.table.renderRows();
    this.selection.clear();
    this.selectRow = [];
  }

  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectRow = [];
    } else {
      this.dataSource?.forEach((row: any,index) => {
        this.selection.select(row);
        this.selectRow.push(index);
      });
    }
  }

  childToggle(element: any,e: any) {
    if(e.checked) {
      this.selectRow.push(e.source.value);
    } else {
      this.selectRow.forEach((element,index)=>{
        if(element==e.source.value) this.selectRow.splice(index,1);
     });
    }
    this.selection.toggle(element);
  }
}
