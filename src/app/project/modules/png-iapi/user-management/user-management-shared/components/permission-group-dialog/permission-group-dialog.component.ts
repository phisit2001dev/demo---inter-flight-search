import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementSharedService } from '../../services/user-management-shared.service';
import { takeUntil } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { PermissionGroupSearch } from '../../model/permission-group-search';

@Component({
  selector: 'app-permission-group-dialog',
  templateUrl: './permission-group-dialog.component.html',
  styleUrls: ['./permission-group-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder, ManualDetectionService, MAT_SELECT_SCROLL_STRATEGY_PROVIDER]
})
export class PermissionGroupDialogComponent 
extends AbstractComponent
implements OnInit, OnDestroy {

  displayedColumns: string[] = ['no', 'checkbox', 'active',
  'groupCode', 'groupName'];

  form: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<PermissionGroupSearch>([]);
  selection = new SelectionModel<any>(true, []);
  totalResult: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate: SitValidatorInputService,
    protected service: UserManagementSharedService,
    public spinner: SpinnerService,
    protected mds$: ManualDetectionService,
    private dialogRef: MatDialogRef<PermissionGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
      super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();

    this.form = this.formBuilder.group({
      groupCode: '',
      groupName: '',
      active: '',
      ids: this.dialogData.ids
    });
     
  }

  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  search() {
    // เปิด spinner ก่อนเรียก API เสมอ ถ้าได้รับ Response แล้วหรือจบงานให้ปิดด้วย
    this.spinner.show();
    this.service
      .searchGroup(this.form.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        this.handleResponse(resp);
        if (resp?.displayStatus === 'S') {
          this.totalResult = resp.data.totalResult;
          this.dataSource.data = resp.data.listResult;
          this.dataSource.data.length = resp.data.listResult.length;
          this.selection.clear();
        } else {
          this.dataSource.data.splice(0,this.dataSource.data.length);
        }
        // ปิด
        this.spinner.hide();
    });
  }

  clear() {
    this.form.reset();
    this.dataSource.data.splice(0,this.dataSource.data.length);
    this.dataSource._updateChangeSubscription();
    this.form.get('ids').setValue(this.dialogData.ids);
    this.selection.clear(); 
  }

  close() {
    this.dialogRef.close();
  }

  choose() {
    if (this.selection.selected.length === 0) {
      // Alert:10001 [You must select at least one list.]
      this.snackbarService.open(this.translate.instant('10001'), 'W');
      return;
    }
    
    let nodes: PermissionGroupSearch[] = [];
    this.selection.selected.forEach((item) => {
      nodes[nodes.length] = item;
    });
    this.dialogRef.close(nodes);
  }

  /**
   * Checkbox master toggle
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();

    } else {
      this.dataSource?.data?.forEach((row) => {
        if (row.active==="Active") {
          this.selection.select(row);
        }
      });
    }
  }

  /**
   * Check is checkbox select all
   */
  isAllSelected() {
    const numSelected = this.selection.selected?.length;
    const numRows = this.dataSource?.data?.filter(row => row.active === 'Active').length;

    return numSelected === numRows;
  }

  /**
   * Checkbox child toggle
   */
  childToggle(element: any) {
    this.selection.toggle(element);
  }
}
