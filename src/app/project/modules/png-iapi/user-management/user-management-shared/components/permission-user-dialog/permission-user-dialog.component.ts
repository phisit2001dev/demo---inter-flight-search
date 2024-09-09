import { SelectionModel } from '@angular/cdk/collections';
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
import { takeUntil } from 'rxjs';
import { PermissionUserSearch } from '../../model/permission-user-search';
import { UserManagementSharedService } from '../../services/user-management-shared.service';

@Component({
  selector: 'app-permission-user-dialog',
  templateUrl: './permission-user-dialog.component.html',
  styleUrls: ['./permission-user-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder, ManualDetectionService, MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class PermissionUserDialogComponent 
extends AbstractComponent
implements OnInit, OnDestroy {

  displayedColumns: string[] = ['no', 'checkbox', 'lockStatus', 'active',
  'employeeCode', 'username', 'fullname', 
  'organization', 'position', 'email'];

  form: FormGroup;
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
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
    private dialogRef: MatDialogRef<PermissionUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
      super(snackbarService, dialog, spinner, mds$, translate, authQuery);

  }

  ngOnInit(): void {
    super.onInitial();

    this.form = this.formBuilder.group({
      employeeCode: '',
      username: '',
      forname: '',
      surname: '',
      organization: '',
      referenceDocumentNo: '',
      lockStatus: '',
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
      .searchUser(this.form.value)
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
    
    let nodes: PermissionUserSearch[] = [];
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
    const numRows = this.dataSource?.data.length;

    return numSelected === numRows;
  }

  /**
   * Checkbox child toggle
   */
  childToggle(element: any) {
    this.selection.toggle(element);
  }
}
