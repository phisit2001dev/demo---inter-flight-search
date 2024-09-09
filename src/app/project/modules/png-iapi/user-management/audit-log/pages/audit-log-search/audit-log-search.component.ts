import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { Permission } from '@app/common/models/permission';
import { DateService } from '@app/project/core/services/date.service';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AuditLogService } from '../../services/audit-log.service';
import { CommonResponse } from '@app/common/models/common-response';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { TimezoneService } from '@app/project/core/services/timezone.service';
import { AuditLogSearch } from '../../models/audit-log-search';


@Component({
  selector: 'app-audit-log-search',
  templateUrl: './audit-log-search.component.html',
  styleUrls: ['./audit-log-search.component.scss'],
  providers:[ManualDetectionService,{
    provide: DateAdapter,
    useClass: CustomNativeDateAdapter,
  },
  {
    provide: MAT_DATE_FORMATS,
    useValue: CUSTOMS_DATE_FORMATS,
    }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogSearchComponent extends AbstractSearchComponent implements OnInit,OnDestroy,AfterViewInit{
  form:FormGroup
  initialData: any
  permission:Permission
  dataSource$ = new Subject<any>()
  timeZone = null
  funSelecter:[]
  constructor(private spinner:SpinnerService,
    private formBuilder: FormBuilder, 
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$ :ManualDetectionService,
    private dateService: DateService,
    private route: ActivatedRoute,
    private service:AuditLogService,
    private timeZoneService: TimezoneService,){
    
    super(snackbarService, dialog, spinner, mds$, translate, authQuery)
  }
ngOnInit(): void {
  super.onInitial();
  this.inittimeZone();
  this.initialData = this.route.snapshot.data.init.payload;
  this.defaultFormValue = this.initialData?.criteria
  this.initialCriteria(this.initialData);
  this.permission = this.initialData?.permission;
  this.defaultFormValue.dateStart = this.dateService.toDate(this.defaultFormValue.dateStart)
  this.defaultFormValue.dateEnd =  this.dateService.toDate(this.defaultFormValue.dateEnd)
  this.initialForm();

  if(!this.funSelecter){
    this.form.get('function').disable()
  }
  // this.selectChang({value:this.initialData?.listSystem[0].key})
  // this.form.get('system').setValue(this.initialData?.listSystem[0].key)

}

ngAfterViewInit(): void {
  const criteriaTemp = this.route.snapshot.data.init.payload.criteriaTemp;
  if (criteriaTemp) {
    this.selectChange({value:this.form.get('system').value})
    this.form.get('function').setValue(criteriaTemp.function);
    this.processSearch(this.criteria);
  } else {
    this.spinner.hide();
  }
}

ngOnDestroy(): void {
  super.onDestroy
  this.mds$.destroy()
}

inittimeZone(){
  this.timeZoneService.change().pipe(takeUntil(this.destroy$)).subscribe((change => {
    this.timeZone = change;
  }))
}


initialForm(){
  this.form = this.formBuilder.group({
    dateStart: [this.criteria?.dateStart ? this.dateService.toDate(this.criteria?.dateStart):'',
    { updateOn: 'blur', validators: [SITValidators.is_DatePicker(),SITValidators.isRequire]}],
    
    dateEnd: [this.criteria?.dateEnd ? this.dateService.toDate(this.criteria?.dateEnd):'',
    { updateOn: 'blur', validators: [SITValidators.is_DatePicker(),SITValidators.isRequire]}],

    timeStart: [this.criteria?.timeStart??'',
    { updateOn: 'blur', validators: [SITValidators.isTime()] }],
    
    timeEnd: [this.criteria?.timeEnd??'',
    { updateOn: 'blur', validators: [SITValidators.isTime()] }],

    dayRange:[this.criteria?.dayRange??'', 
    { updateOn: 'blur', validators: SITValidators.isMaxDays(31)}],

    system:[this.criteria?.system??''],
    function:[this.criteria?.function??''],
    username:[this.criteria?.username??''],
    employeeCode:[this.criteria?.employeeCode??''],
    name:[this.criteria?.name??''],
    surname:[this.criteria?.surname??''],
    linePerPage:[this.criteria?.linePerPage],

    headerSorts: [this.criteria?.headerSorts ?? ''],
    pageIndex: [this.criteria?.pageIndex ?? ''],
    checkMaxExceed: [this.criteria?.checkMaxExceed],
    
  })
   
}

search(){
  this.dataSource$.next(null);

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    // เรียกใช้ getNext() เพื่อทำการตรวจสอบการเปลี่ยนแปลง component ลูก ให้ทำการวาด component ใหม่
    this.mds$.getNext();
    this.snackbarService.open(this.translate.instant('10002'), "W")
    return
  }
  
  this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex)
  this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts)

  this.criteria = this.form.value
  
  //ใช้ในการลบ property ที่มีอยู่ใน object.
  // delete this.criteria.dayRange;

  this.criteria.dateStart = this.dateService.toString(this.form.get('dateStart').value)
  this.criteria.dateEnd = this.dateService.toString(this.form.get('dateEnd').value)
  this.processSearch(this.criteria)
  
}

processSearch(criteria:AuditLogSearch){
  this.spinner.show()
  this.service.search(criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: CommonResponse) => {
    if(resp?.componentType === 'C'){
      this.spinner.hide()
      this.openConfirm(resp.messageDesc).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(res => {
        if(res){
          this.criteria.checkMaxExceed = false
          this.processSearch(this.criteria)
      }
      
    })
  } else {
    this.handleResponse(resp)
    if (resp.displayStatus === 'S') {
      
      this.dataSource$.next(resp)
      this.isSearched = true;
    }
    this.spinner.hide()
  }

})
}

clear(){
    this.form.get('function').disable()
    this.isSearched = false;      // Set flag search criteria temp.
    this.form.reset(this.defaultFormValue);
    this.dataSource$.next(null);  // Clear dataSource.
    this.mds$.clearValidate();
  
}

sortChange(e: Sort) {
  this.form.get('headerSorts').setValue([{columnName: e.active.toString(), order: e.direction }])/// Set header sort in form
  this.criteria.headerSorts = this.form.get('headerSorts').value                                /// Set header sort in criteria
  this.processSearch(this.criteria)
}

pageEvent(e: PageEvent) {
  this.form.get('pageIndex').setValue(e.pageIndex)          /// Set page index in form
  this.criteria.pageIndex = this.form.get('pageIndex').value /// Set page index in criteria
  this.processSearch(this.criteria)
}

selectChange(event:any){
  if(event.value){
    this.form.get('function').setValue('')
    this.spinner.show()
    this.service.functionSelect(event.value).pipe(takeUntil(this.destroy$)).subscribe(res =>{
      this.handleResponse(res)
      if(res && !res.error){
        this.form.get('function').enable()
        this.funSelecter = res.data
      }
      this.spinner.hide()
      // if(this.funSelecter[0].value === 'Search User'){
      //   this.form.get('function').setValue(this.funSelecter[0].key)
      // }
    })
  }
  else {
    this.form.get('function').disable()
    this.form.get('function').setValue('')
  }
}
}