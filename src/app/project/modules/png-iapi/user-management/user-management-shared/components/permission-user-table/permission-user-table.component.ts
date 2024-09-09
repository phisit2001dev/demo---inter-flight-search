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
import { takeUntil } from 'rxjs';
import { UserManagementSharedService } from '../../services/user-management-shared.service';
import { PermissionUserDialogComponent } from '../permission-user-dialog/permission-user-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-permission-user-table',
  templateUrl: './permission-user-table.component.html',
  styleUrls: ['./permission-user-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionUserTableComponent extends AbstractComponent
implements OnInit, OnDestroy {

  displayedColumns: string[];
  @Input() dataSource: MatTableDataSource<any>;
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
      this.displayedColumns = ['no', 'lockStatus', 'active', 'employeeCode', 'username', 'fullname', 'organization', 'position'];
    } else {
      this.displayedColumns = ['no', 'checkbox', 'lockStatus', 'active', 'employeeCode', 'username', 'fullname', 'organization', 'position'];
    }
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }
  
  gotoAdd(): void {
    this.spinner.show();
    this.service
    .initUser()
    .pipe(takeUntil(this.destroy$)).subscribe((resp) => {
      this.spinner.hide()
      if(resp.displayStatus === "S") {
          const dialogRef = this.dialog
            .open(PermissionUserDialogComponent, {
              width: '80%',
              height: "780px",
              data: {
                "data": resp.data, 
                "label": {
                  "title": this.translate.instant('sec.popup_user'),
                  "employee_code": this.translate.instant('sec.employee_code'),
                  "username": this.translate.instant('sec.username'),
                  "name": this.translate.instant('sec.name'),
                  "surname": this.translate.instant('sec.surname'),
                  "organization": this.translate.instant('sec.organization'),
                  "reference_document_no": this.translate.instant('sec.reference_document_no'),
                  "password_status": this.translate.instant('sec.password_status'),
                  "activation_status": this.translate.instant('sec.activation_status'),
                  "prosition": this.translate.instant('sec.prosition'),
                  "email": this.translate.instant('sec.email'),
                  "fullname": this.translate.instant('sec.fullname'),
                  "english": this.translate.instant('sec.english')
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
