import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { AuthQuery } from '@app/project/core/state';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-audit-log-criteria',
  templateUrl: './audit-log-criteria.component.html',
  styleUrls: ['./audit-log-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogCriteriaComponent extends AbstractComponent implements OnInit,OnDestroy {
  @Input() form:FormGroup
  @Input() initialData: any
  @Input() timezone:any
  permission:Permission
  systemSelect:[]
  linePerpage:[]
  
  @Input() funSelecter:[]
  @Output() evenChang = new EventEmitter();

  constructor(protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    protected cdf: ChangeDetectorRef,){
    super(snackbarService, dialog, null, mds$, translate, authQuery)
    mds$.doMarkForCheck(cdf)
  }

  ngOnInit(): void {
    super.onInitial()
    this.selectItem()
    
  }

  ngOnDestroy(): void {
    super.onDestroy
  }


  selectItem(){
     this.linePerpage  = this.initialData?.listLinePerPage??[]
     this.systemSelect = this.initialData?.listSystem??[]

  }

  selectChang(event:any){
   this.evenChang.emit(event)
  
 }
}