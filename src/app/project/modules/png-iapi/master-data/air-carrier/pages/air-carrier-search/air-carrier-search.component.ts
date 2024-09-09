import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';

import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AirCarrierService } from '../../service/air-carrier.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { InputFilesService } from '@app/project/shared/service/input-files.service';


@Component({
  selector: 'app-air-carrier-search',
  templateUrl: './air-carrier-search.component.html',
  styleUrls: ['./air-carrier-search.component.scss'],
  providers:[ManualDetectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirCarrierSearchComponent extends AbstractSearchComponent implements OnInit,AfterViewInit,OnDestroy{
initialData:any
 form:FormGroup
  dataSource$ = new Subject<any>;
  permission: Permission;
  selection = new SelectionModel<any>(true, []);
  
  constructor(private formBuilder: FormBuilder, protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$ :ManualDetectionService,
    private spinner:SpinnerService,
    private route : ActivatedRoute,
    private service: AirCarrierService,
    private fileService:InputFilesService,
    private router: Router,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
    this.initialData = this.route.snapshot.data.init.payload
    this.defaultFormValue = this.initialData?.criteria;
    this.initialCriteria(this.initialData);                   
    this.permission = this.initialData?.permission;           
    this.initialForm();
  }

  
  ngAfterViewInit() {
    if (this.route.snapshot.data.init.payload.criteriaTemp) {
      this.processSearch(this.criteria);

    } else {
      this.spinner.hide();
    }
    
  }
    
  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }


  initialForm(){
    this.form = this.formBuilder.group({
      carrierCodeIata:[this.criteria?.carrierCodeIata??''],
      carrierCodeIcao:[this.criteria?.carrierCodeIcao??''],
      carrierName:[this.criteria?.carrierName??''],
      carrierType:[this.criteria?.carrierType??''],
      activeStatus:[this.criteria?.activeStatus??''],
      countryName:[this.criteria?.countryName??''],
      countryCode:[this.criteria?.countryCode??''],
      linePerPage: [this.criteria?.linePerPage ?? ''],
      headerSorts: [this.criteria?.headerSorts ?? ''],
      pageIndex: [this.criteria?.pageIndex ?? ''],
      checkMaxExceed: [this.criteria?.checkMaxExceed],
    })

  }

  search() {
    this.clearBeforeSearch(); // Clear ssearch result.
    // this.form.get('checkMaxExceed').setValue(this.defaultFormValue.checkMaxExceed);
    this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts); /// default headerSorts
    this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex);
    this.criteria = {...this.form.value}; // Set criteria.
    this.processSearch(this.criteria); // Search with current form.
    
  }
  
 
 private processSearch(cirteria: any) {
   this.spinner.show();    // Show spinner.

   /// Call API.
   this.service.search(cirteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{

    const Isconfirm = this.handleResponse(resp)

     if (Isconfirm instanceof MatDialogRef) {

       this.spinner.hide();  // Hide spinner.
        Isconfirm.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
         if (result) {
          this.criteria.checkMaxExceed = false
           this.processSearch(this.criteria);
         }
         else {
          this.form.reset(this.defaultFormValue)
          this.form.get('checkMaxExceed').setValue(false)
         }

       });

     } else {
       this.selection.clear();   
       if (resp?.displayStatus === 'S') {  // Response status is success.
         this.dataSource$.next(resp);      // Set dataSource. to Table
       }

       this.spinner.hide();  // Hide spinner.
       this.isSearched = true; // Flag for search with criteria temp.
     }
   });
 }

  clear() {
    this.criteria = { ...this.defaultFormValue }; // Set default criteria.
    this.isSearched = false;      // Set flag search criteria temp.
    this.form.reset(this.defaultFormValue);
    this.dataSource$.next(null);  // Clear dataSource.
    this.selection.clear();       // Clear select checkbox in table.
  } 

  clearBeforeSearch() {
    this.isSearched = false;
    this.dataSource$.next(null);
    this.selection.clear();
    
  }

  sortChange(e: Sort) {
    this.selection.clear(); // Clear select checkbox in table.
    this.form.get('headerSorts').setValue([{columnName: e.active.toString(), order: e.direction }]);/// Set header sort in form
    this.criteria.headerSorts = this.form.get('headerSorts').value;                                 /// Set header sort in criteria
    this.processSearch(this.criteria);  // Search with criteria from searched.
  }

  pageEvent(e: PageEvent) {
    this.selection.clear(); // Clear select checkbox in table.
    this.form.get('pageIndex').setValue(e.pageIndex);           /// Set page index in form
    this.criteria.pageIndex = this.form.get('pageIndex').value; /// Set page index in criteria
    this.processSearch(this.criteria);  // Search with criteria from searched.
  }

  export() {
    this.spinner.show();
    /// Call API.
    this.service.export(this.criteria).pipe().subscribe((resp) => {
      this.fileService.openFile(resp);
      this.spinner.hide();
    });
  }

  active(ids:[]){
    this.openConfirm('50001').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) {
        this.spinner.show(); // Show spinner.

        /// Call API.
        this.service.active(ids).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
          this.handleResponse(resp);  // Show snackbar.
          this.processSearch(this.criteria);
        });
      }
    });
  }

  inactive(ids: []){
    this.openConfirm('50002').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((result) => {
      if (result) {
        this.spinner.show();    // Show spinner.

        /// Call API.
        this.service.inactive(ids).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
          this.handleResponse(resp);  // Show snackbar.
          this.processSearch(this.criteria);
        });
      }
    });
  }

  gotoAdd() {
    this.router.navigate(['/iapi/master-data/airCarrier/add'],
      { queryParams: { page: 'add' },relativeTo: this.route });
  }

  gotoEdit(obj:any) {
    this.router.navigate(['/iapi/master-data/airCarrier/edit'],
    { queryParams: { hiddenToken:obj, page: 'edit' }, relativeTo: this.route });
  }

}


