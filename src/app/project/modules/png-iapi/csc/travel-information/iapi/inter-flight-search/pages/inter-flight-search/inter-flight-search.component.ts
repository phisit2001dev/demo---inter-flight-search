import { SnackbarService } from './../../../../../../../../core/services/snackbar.service';
import { Permission } from './../../../../../../../../../common/models/permission';
import { SpinnerService } from './../../../../../../../../core/services/spinner.service';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { ActivatedRoute } from '@angular/router';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';
import { DateService } from '@app/project/core/services/date.service';
import { Subject, takeUntil } from 'rxjs';
import { InterFlightSearchTableComponent } from '../../components/inter-flight-search-table/inter-flight-search-table.component';
import { PageEvent } from '@angular/material/paginator';
import { InterFlightSearchService } from '../../service/inter-flight-search.service';
import { SelectionModel } from '@angular/cdk/collections';
import { InterFlightSearchExportRequest } from '../../model/inter-flight-search-export-request';
import { InputFilesService } from '@app/project/shared/service/input-files.service';
import { CommonSelectItem } from '@app/common/models/common-select-item';
import { CommonResponse } from '@app/common/models/common-response';
import { Sort } from '@angular/material/sort';
@Component({
  selector: 'app-inter-flight-search',
  templateUrl: './inter-flight-search.component.html',
  styleUrls: ['./inter-flight-search.component.scss'],
  providers: [ ManualDetectionService,
    {
      provide: DateAdapter,
      useClass: CustomNativeDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOMS_DATE_FORMATS,
    },
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
 
})
export class InterFlightSearchComponent extends AbstractSearchComponent implements OnInit, AfterViewInit,OnDestroy,OnChanges  {
 

  form:FormGroup;
  initialData: any;
  permission:Permission;
  dataSource$ = new Subject<any>();
  dateDefault;
  selection = new SelectionModel<any>(true, []);

  @ViewChild (InterFlightSearchTableComponent) tableComponent: InterFlightSearchTableComponent
  constructor(private formBuilder: FormBuilder, protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate: SitValidatorInputService,
    protected mds$ :ManualDetectionService,
    protected spinner:SpinnerService,
    private dateService: DateService,
    private route: ActivatedRoute,
    private service:InterFlightSearchService,
    private fileService:InputFilesService,
  ) {
     super(snackbarService, dialog, spinner, mds$, translate, authQuery)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['spinnerDep']) {
     console.log("555")
    }
  }

  ngOnInit() :void {
    super.onInitial()
    this.initialData = this.route.snapshot.data.init.payload;
    //set ค่าเริ่มต้น
    this.defaultFormValue = this.initialData.criteria
    //ค่าเริ่มต้น AbstractSearchComponent
    this.initialCriteria(this.initialData);
    //จัดการสิทธิการเข้าถึง
    this.permission = this.initialData?.permission
    console.log(this.initialData)
    this.initialForm();

  }

 
  ngAfterViewInit() {
   this.spinner.hide();

    if (this.getCriteriaTemp()) {

      this.spinner.show();
      this.service.search(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
        this.handleResponse(resp);
        if(resp.displayStatus === 'S'){
          this.dataSource$.next(resp);
          
        }
      });
      this.spinner.hide();
    }
      
  }

  ngOnDestroy() {
    super.onDestroy();
    this.mds$.destroy();
  }

  
  initialForm(){
    this.form = this.formBuilder.group({
      departureDateFrom: [
        this.criteria?.departureDateFrom
          ? this.dateService.toDate(this.criteria.departureDateFrom): '',
        { updateOn: 'blur', validators: [SITValidators.is_DatePicker()] },
      ],
      depTimeFrom: [
        this.criteria?.depTimeFrom ?? '',
        { updateOn: 'blur', validators: [SITValidators.isTime()] },
      ],
      departureDateTo: [
        this.criteria?.departureDateTo
          ? this.dateService.toDate(this.criteria.departureDateTo): '',
        { updateOn: 'blur', validators: [SITValidators.is_DatePicker()] },
      ],
      depTimeTo: [
        this.criteria?.depTimeTo ?? '',
        { updateOn: 'blur', validators: [SITValidators.isTime()] },
      ],
      arrivalDateFrom: [
        this.criteria?.arrivalDateFrom ?? '',
        { updateOn: 'blur', validators: [SITValidators.is_DatePicker()] },
      ],
      arrTimeFrom: [
        this.criteria?.arrTimeFrom ?? '',
        { updateOn: 'blur', validators: [SITValidators.isTime()] },
      ],
      arrivalDateTo: [
        this.criteria?.arrivalDateTo ?? '',
        { updateOn: 'blur', validators: [SITValidators.is_DatePicker()] },
      ],
      arrTimeTo: [
        this.criteria?.arrTimeTo ?? '',
        { updateOn: 'blur', validators: [SITValidators.isTime()] },
      ],

      spinnerDep:[this.criteria?.spinnerDep??'', { updateOn: 'blur', validators: SITValidators.isMaxDays(99)}],
      spinnerArr: [this.criteria?.spinnerArr??'', { updateOn: 'blur', validators: SITValidators.isMaxDays(99)}],

      carrierNameKey: [this.criteria?.carrierNameKey?? ''], 
      carrierNameVal: [this.criteria?.carrierNameVal??''],

      flightKey: [this.criteria?.flightKey?? ''],
      flightVal: [this.criteria?.flightVal??''],

      departurePortKey: [this.criteria?.departurePortKey??''],
      departurePortVal: [this.criteria?.departurePortVal??''],

      arrivalPortKey: [this.criteria?.arrivalPortKey??''],
      arrivalPortVal: [this.criteria?.arrivalPortVal??''],

      scheduleType: [this.criteria?.scheduleType??''],
      scheduleTypeVal: [this.criteria?.scheduleTypeVal??''],
      flightDirection: [this.criteria?.flightDirection?? ''],
      flightDirectionVal: [this.criteria?.flightDirectionVal??''],


      linePerPage: [this.criteria?.linePerPage ?? '',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      headerSorts: [this.criteria?.headerSorts ?? ''],
      checkMaxExceed: [this.criteria?.checkMaxExceed],
      pageIndex: [this.criteria?.pageIndex ?? '']

    })
   this.dateDefault = this.criteria?.departureDateFrom? this.criteria.departureDateFrom : '';
  }

  
  getCriteriaTemp(){
    return this.route.snapshot.data.init.payload?.criteriaTemp;
  }

  pageEvent(e: PageEvent){
    this.form.get('pageIndex').setValue(e.pageIndex);
    this.selection.clear(); /// Clear select
    this.criteria.pageIndex = this.form.get('pageIndex').value;
    // เปิด spinner
    this.spinner.show();
    this.service.search(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);
      if (resp.displayStatus === 'S') {
        this.dataSource$.next(resp);
      }
    });
    this.spinner.hide();
  }

  clearBeforeSearch(){
    this.dataSource$.next(null)
    this.selection.clear();
  }

  checkValidateSearch(){
    
    let departureDateFrom = this.form.get('departureDateFrom').value;
    let departureDateTo = this.form.get('departureDateTo').value;
    let arrivalDateFrom = this.form.get('arrivalDateFrom').value;
    let arrivalDateTo = this.form.get('arrivalDateTo').value;
    

      this.mds$.clearValidate();
      if(!departureDateFrom &&  departureDateTo){
          this.mds$.setValidateManual([
            { element: 'atLeastOne', msg: ''},{element : "departureDateFrom" ,msg:'This field is required.'}
          ]);
          return true;

      }else if(departureDateFrom &&  !departureDateTo){
        this.mds$.setValidateManual([
          { element: 'atLeastOne', msg: ''},{element : "departureDateTo" ,msg: 'This field is required.'}
        ]);
        return true;
      }else if(!departureDateFrom &&  !departureDateTo){
        if(!arrivalDateFrom &&  arrivalDateTo){
          this.mds$.setValidateManual([
            { element: 'atLeastOne', msg: ''},{element : "arrivalDateFrom" ,msg: 'This field is required.'}
          ]);
          return true;

        }else if(arrivalDateFrom &&  !arrivalDateTo){
          this.mds$.setValidateManual([
            { element: 'atLeastOne', msg: ''},{element : "arrivalDateTo" ,msg: 'This field is required.'}
          ]);
          return true;
        }else if(!arrivalDateFrom && !arrivalDateTo){
          this.mds$.setValidateManual([
            { element: 'atLeastOne', msg: ''}
          ]);
          return true;
        }

      }
  }
  
  
  
  search(){
  this.clearBeforeSearch();
  if (this.form.invalid ) {
    this.snackbarService.open(this.translate.instant('10004'), "W");
    this.form.markAllAsTouched();
    this.mds$.getNext();
    return;
  }
  if (this.checkValidateSearch()) {
    this.snackbarService.open(this.translate.instant('10002'), 'W');
    this.form.markAllAsTouched();
    this.mds$.getNext();
    return;
  }

    this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex);
    this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts);
    this.form.get('checkMaxExceed').setValue(this.defaultFormValue.checkMaxExceed);

    this.criteria = {...this.form.value};

    this.criteria.departureDateFrom = this.dateService.toString(this.form.get('departureDateFrom').value);
    this.criteria.departureDateTo = this.dateService.toString(this.form.get('departureDateTo').value);
    this.criteria.arrivalDateFrom = this.dateService.toString(this.form.get('arrivalDateFrom').value);
    this.criteria.arrivalDateTo = this.dateService.toString(this.form.get('arrivalDateTo').value);

    this.criteria.flightDirectionVal = this.initialData.directionSelectItem.find((item: CommonSelectItem) => !!item.key && item.key === this.criteria.flightDirection)?.value??this.translate.instant('all');
    this.criteria.scheduleTypeVal = this.initialData.scheduleTypeSelectItem.find((item: CommonSelectItem) => !!item.key && item.key === this.criteria.scheduleType)?.value??this.translate.instant('all');

    this.spinner.show();
    this.service.search(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: CommonResponse) => {
      const isDialog = this.handleResponse(resp);
      if(isDialog instanceof MatDialogRef){
        isDialog.afterClosed().pipe(takeUntil(this.destroy$)).subscribe(res => {
          if(res){
            this.spinner.show();
            this.criteria.checkMaxExceed = false;
            this.service.search(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((res: CommonResponse) => {
              this.handleResponse(res);
              if (!res.error) {
                this.dataSource$.next(res);
                this.spinner.hide();
                
              }
          });
        }
      });
    } else {
      if (resp.displayStatus === 'S') {
        this.handleResponse(resp);
        this.dataSource$.next(resp);
  
      }
      
    }

    this.spinner.hide();
    this.isSearched = true;
  });
  
}


export() {
  if(this.selection.selected.length ===0){
    this.snackbarService.open(this.translate.instant('10001'), 'W')
    return
  }
  const request:InterFlightSearchExportRequest ={
    hiddenToken:this.selection.selected.map(v=>v.hiddenToken).join(","),
    criteria:this.criteria
  }
 this.spinner.show()
 this.service.export(request).subscribe(payload =>{
  this.spinner.hide()
  this.fileService.openFile(payload)
  this.selection.clear()
  this.tableComponent.cdf.markForCheck();
 })
}

clear(){
  this.criteria = { ...this.defaultFormValue };
  this.isSearched = false;
  this.mds$.clearValidate();
  this.form.reset(this.initialData.criteria);
  this.dataSource$.next(null);

  this.form.get("departureDateFrom").setValue(this.dateService.toDate(this.dateDefault));
  this.form.get("departureDateTo").setValue(this.dateService.toDate(this.dateDefault));
  this.form.get("spinnerDep").setValue(0);
}


sortChange(e: Sort){
  this.selection.clear(); 
  this.form.get('headerSorts').setValue([{columnName: e.active.toString(), order: e.direction }]);
  this.criteria.headerSorts = this.form.get('headerSorts').value;
  this.spinner.show();    
  this.service.search(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
    this.handleResponse(resp);
    if (resp.displayStatus === 'S') {
      this.dataSource$.next(resp);
      this.spinner.hide();
    }
  });
}

}