import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { UserManagementSharedService } from '../../services/user-management-shared.service';
import { takeUntil } from 'rxjs';
import { PermissionGroupDialogComponent } from '../permission-group-dialog/permission-group-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { PermissionGroupSearch } from '../../model/permission-group-search';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-permission-group-table',
  templateUrl: './permission-group-table.component.html',
  styleUrls: ['./permission-group-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionGroupTableComponent extends AbstractComponent
implements OnInit, OnDestroy {

  displayedColumns: string[];
  @Input() dataSource: MatTableDataSource<PermissionGroupSearch>;
  @Input() permission: Permission;
  @Input() view: boolean;
  @Input() selection: SelectionModel<any>;
  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    protected service: UserManagementSharedService,
    public spinner: SpinnerService,
    private cdf: ChangeDetectorRef
  ){
    super(snackbarService, dialog, spinner, null, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
    if (this.view) {
      this.displayedColumns = ['no', 'active', 'groupCode', 'groupName'];
    } else {
      this.displayedColumns = ['no', 'checkbox', 'active', 'groupCode', 'groupName'];
    }
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  gotoAdd(): void {
    this.spinner.show();
    this.service
    .initGroup()
    .pipe(takeUntil(this.destroy$)).subscribe((resp) => {
      this.spinner.hide()
      if(resp.displayStatus === "S") {
        const dialogRef = this.dialog
            .open(PermissionGroupDialogComponent, {
              width: '70%',
              height: "700px",
              data: {
                "data": resp.data,
                "label": {
                  "title": this.translate.instant('sec.popup_user_group'),
                  "group_code": this.translate.instant('sec.group_code'),
                  "group_name": this.translate.instant('sec.group_name'),
                  "activation_status": this.translate.instant('sec.activation_status')
                },
                ids: this.createIds()
              }
            });

            dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(results => {
              if (results) {
                this.dataSource.data.push(...results);
                this.dataSource._updateChangeSubscription();
              }
            });
      } else {
        this.handleResponse(resp);
      }
    });
  }

  deleteRow() : void {
    if (this.selection.selected.length === 0) {
      // Alert:10001 [You must select at least one list.]
      this.snackbarService.open(this.translate.instant('10001'), 'W');
      return;
    }

    //confirm delete
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'save-cancel',
      data: {
          header: this.translate.instant('confirm_message'),
          description: this.translate.instant('50005'),
      },
      minWidth: '400px',
      minHeight: '170px',
    });

    dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if(value !== undefined){
        if (value) {
          this.selection.selected.forEach((item) => {
            const index: number = this.dataSource.data.findIndex((data) => data.hiddenToken === item.hiddenToken);
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
          });

          this.selection.clear();
          this.dataSource._updateChangeSubscription();
          this.cdf.markForCheck();
        }
      }
    });
  }

   /**
   * Checkbox master toggle
   */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();

    } else {
      this.dataSource?.data?.forEach(row => this.selection.select(row));
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

  createIds():string {
    let ids;
    this.dataSource.data.forEach(element => {
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
