import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { TranslateService } from '@ngx-translate/core';
import { Observable, takeUntil } from 'rxjs';
import { DialogViewComponent } from '../dialog-view/dialog-view.component';
import { AuditLogService } from '../../services/audit-log.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-audit-log-table',
  templateUrl: './audit-log-table.component.html',
  styleUrls: ['./audit-log-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogTableComponent  extends AbstractComponent implements OnInit, OnDestroy{
  @Input() permission: Permission
  @Input() dataSource$: Observable<any>
  @Input() headerSorts: any
  @Input() linePerPage: string
  @Input() pageIndex: number
  @Input() timezone:any
  @Output() sortChange = new EventEmitter()
  @Output() pageEvent = new EventEmitter()
  dataSource
  dataLength = 0
  pageSize
  displayPageIndex = 0
  displayedColumns: string[] = ['no','view','eventDatetime','system','function','username','fullname','employeeCode','organization']
  dataView:any

  constructor(protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected spinner: SpinnerService,
    private cdf:  ChangeDetectorRef,
    private service:AuditLogService,
    private router: Router,
    private route : ActivatedRoute,
    ){
      super(snackbarService, dialog, spinner, null, translate, authQuery)
  }

  ngOnInit(): void {
    super.onInitial()
    this.dataSource$.pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.displayPageIndex = (this.pageIndex+1)
      if (resp) {
        this.dataSource = resp.data
        this.dataLength = this.dataSource?.totalResult
        this.pageSize = this.linePerPage
      } else {
        this.dataSource = null
      }

      this.cdf.markForCheck()
    })
    
  }

  ngOnDestroy(): void {
    super.onDestroy()
  }

  pageChange(e: PageEvent) {
		if (this.validatePaginator(e.pageIndex, this.linePerPage, this.dataLength)) {
		  // event from input
		  if (e.previousPageIndex === null) {
			if (e.pageIndex === 0) {
			  return false
			}

			this.displayPageIndex = e.pageIndex
			let objVal :PageEvent = e
			objVal.pageIndex = e.pageIndex-1
			this.pageEvent.emit(objVal)
		  // event from material
		  } else {
        this.displayPageIndex += (e.pageIndex - e.previousPageIndex)
        this.pageEvent.emit(e)
		  }
		}
  }
  openDialog(token: any) {
    this.spinner.show()
    this.service.gotoViewAuditLog(token).pipe(takeUntil(this.destroy$)).subscribe((res)=>{
      this.handleResponse(res)
      if(res && !res.error){
        this.dataView = res.data.logDisplay
        const dialogRef = this.dialog.open(DialogViewComponent,{
              width:'50%',
              height:'50%',
              data: this.dataView
            })
            dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(result => {
              if (result) {
                console.log('Dialog result:', result);
                // ทำงานกับค่าที่ได้รับกลับจาก Dialog
              }
            });
            this.spinner.hide()
      }
    })
    
  }

  goToUser(element:string) {

    this.router.navigate(['/iapi/user-management/user/search'],
    { queryParams:{element:element}, relativeTo: this.route })
   
  }

}
