import { SelectionModel } from '@angular/cdk/collections';
import { P } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { InitAirportService } from '../../service/init-airport.service';
import { SITValidators } from './../../../../core/validators/sit.validator';

@Component({
  selector: 'app-demo-page-init-airport',
  templateUrl: './demo-page-init-airport.component.html',
  styleUrls: ['./demo-page-init-airport.component.scss'],
  providers: [ ManualDetectionService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DemoPageInitAirportComponent extends AbstractSearchComponent implements OnInit,OnDestroy,AfterViewInit {

  // for test
  pageParam = false;

  // param
  form:FormGroup;
  permission: Permission;
  dataSource$ = new Subject<any>;
  selection = new SelectionModel<any>(true, []);
  // combo
  listlinePerPage;
  listActiveStatus;

  constructor(
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private cdf: ChangeDetectorRef,
    private http:HttpClient,
    private service:InitAirportService,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
    // reload table
    if (this.getCriteriaTemp()) {
      this.spinner.show();
      this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);
      if(resp.displayStatus === 'S'){
        this.dataSource$.next(resp);
        this.spinner.hide();
      }
    });
    }else{
      //fixme
      // setTimeout(() => {
      //   // fix code for show table
      //   this.form.patchValue({
      //     airportName:'test',
      //     iata:'test',
      //     icao: 'test',
      //     countryNameKey:'test',
      //     countryNameVal:'test',
      //     UTC:'test',
      //   });
      //    this.search();
      // });
    }

  }

  ngOnInit(): void {
    super.onInitial();

    const payload = this.route.snapshot.data.init.payload;

    this.defaultFormValue = payload.criteria;
    this.listlinePerPage = payload.listLinePerPage;
    this.listActiveStatus = payload.listActiveStatus;
    this.permission = payload.permission;

    this.initialCriteria(payload);
    this.initForm();
  }

  initForm(){
    this.form = this.formBuilder.group({
      airportName: [this.criteria ? this.criteria.airportName:'',{updateOn: 'blur',validators: SITValidators.isRequire}],
      iata: [this.criteria ? this.criteria.iata:'',{updateOn: 'blur',validators: SITValidators.isRequire}],
      icao: [this.criteria ? this.criteria.icao:'',{updateOn: 'blur',validators: SITValidators.isRequire}],
      countryNameKey: [this.criteria ? this.criteria.countryNameKey:''],
      countryNameVal: [this.criteria ? this.criteria.countryNameVal:'',{updateOn: 'blur'}],
      UTC: [this.criteria ? this.criteria.UTC:'',{updateOn: 'blur'}],
      airportStatus:  [this.criteria ? this.criteria.airportStatus:''],
      ActivationStatus: [this.criteria ? this.criteria.ActivationStatus:''],

      linePerPage: [this.criteria ? this.criteria.linePerPage: ''],
      headerSorts: [this.criteria ? this.criteria.headerSorts: ''],
      pageIndex: [this.criteria ? this.criteria.pageIndex: ''],
      checkMaxExceed: [this.criteria ? this.criteria.checkMaxExceed: ''],
    });
  }


  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  search(){

    if (this.form.invalid) {
      this.snackbarService.open("Invalid Data","W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    if (!this.form.get('UTC').value) {
      this.mds$.setValidateManual([{element: 'UTC', msg: 'This field is required.'}]);
      this.snackbarService.open("Invalid Data","W");
      return;
    }else{
      this.mds$.setValidateManual([{element: 'UTC', msg: null}]);
    }

    // default pageIndex
    this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex);
    // default headerSorts
    this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts);
    // สำหรับการคืนค่า
    this.criteria = {...this.form.value};
    this.isSearched = true;
    this.selection.clear();
    // เปิด spinner
    this.spinner.show();
    this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      // กรณี displayStatus ไม่เท่ากับ S handleResponse จะปิด spinner ให้
      this.handleResponse(resp);
      if(resp.displayStatus === 'S'){
        this.dataSource$.next(resp);
        this.spinner.hide();
      }
    });
  }

  clear(){
    this.criteria = { ...this.defaultFormValue };
    this.isSearched = false;
    this.selection.clear();
    this.mds$.clearValidate();
    this.form.reset(this.criteria);
    this.dataSource$.next(null);
  }

  gotoAdd(){
    this.router.navigate(['/ex/add'], {
      relativeTo: this.route,
    });
  }
  clickEditView(page,hiddenToken){
    if (page === 'edit') {
      this.router.navigate(['/ex', page, hiddenToken], {
        relativeTo: this.route,
      });
    }else if(page === 'view'){
      this.router.navigate(['/ex', page, hiddenToken], {
        relativeTo: this.route,
      });
    }
  }

  getCriteriaTemp(){
    return this.route.snapshot.data.init.payload?.criteriaTemp;
  }

  // sort header
  sortChange(e: Sort){
    this.selection.clear();
    this.form.get('headerSorts').setValue([{columnName: e.active.toString() ,order: e.direction }]);
    this.criteria.headerSorts = this.form.get('headerSorts').value;
    // เปิด spinner
    this.spinner.show();
    this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);
      if(resp.displayStatus === 'S'){
        this.dataSource$.next(resp);
        this.spinner.hide();
      }
    });
  }

  // pageinator
  pageEvent(e: PageEvent){
    this.form.get('pageIndex').setValue(e.pageIndex);
    this.selection.clear();
    this.criteria.pageIndex = this.form.get('pageIndex').value;
    // เปิด spinner
    this.spinner.show();
    this.service.searchPage(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      this.handleResponse(resp);
      if(resp.displayStatus === 'S'){
        this.dataSource$.next(resp);
        this.spinner.hide();
      }
    });
  }

  searchMaxExceed(){
    this.snackbarService.getSnackbar().dismiss();
    if (this.form.invalid) {
      this.snackbarService.open("Invalid Data","W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    if (!this.form.get('UTC').value) {
      this.mds$.setValidateManual([{element: 'UTC', msg: 'This field is required.'}]);
      this.snackbarService.open("Invalid Data","W");
      return;
    }else{
      this.mds$.setValidateManual([{element: 'UTC', msg: null}]);
    }

    // default pageIndex
    this.form.get('pageIndex').setValue(this.defaultFormValue.pageIndex);
    // default headerSorts
    this.form.get('headerSorts').setValue(this.defaultFormValue.headerSorts);
     // default checkMaxExceed
    this.form.get('checkMaxExceed').setValue(this.defaultFormValue.checkMaxExceed);
    // สำหรับการคืนค่า
    this.criteria = {...this.form.value};
    this.isSearched = true;
    this.selection.clear();
    // เปิด spinner
    this.spinner.show();
    this.service.mockMaxExceed(this.criteria).pipe(takeUntil(this.destroy$)).subscribe((resp: any) =>{
      let handleResp = this.handleResponse(resp);
      if (handleResp instanceof MatDialogRef) {
        this.spinner.hide();
        handleResp.afterClosed().pipe(takeUntil(this.dataSource$)).subscribe((confirm) => {
          if (confirm) {
            this.form.get('checkMaxExceed').setValue(false);
            this.criteria = {...this.form.value};
            this.service.searchPage(this.criteria).pipe(takeUntil(this.dataSource$)).subscribe((res) => {
              this.dataSource$.next(res);
            })
          }
        })
      }else{
        // กรณี displayStatus ไม่เท่ากับ S handleResponse จะปิด spinner ให้
        if(resp.displayStatus === 'S'){
          this.dataSource$.next(resp);
          this.spinner.hide();
        }
      }
    });
  }


  enterSearch(e){
    this.search();
  }





  // ตัวอย่าง card validate
  // --------- code test ---------
  tog(e,key){
    switch (key) {
      case 'A':
        this.form.patchValue({
          airportName:'one',
          iata:'one',
          icao: 'one',
          countryNameKey:'one',
          countryNameVal:'one',
          UTC:'one',
        });
        break;
      case 'add':
        e.checked ? this.permission.add = true : this.permission.add = false;
        break;
      case 'edit':
        e.checked ? this.permission.edit = true : this.permission.edit = false;
        // this.cdf.markForCheck();
        break;
      case 'search':
        e.checked ? this.permission.search = true : this.permission.search = false;
        this.cdf.markForCheck();
        break;
      case 'active':
        e.checked ? this.permission.active = true : this.permission.active = false;
        break;
      case 'export':
        e.checked ? this.permission.export = true : this.permission.export = false;
        break;
      case 'status':
        e.checked ? this.pageParam = true : this.pageParam = false;
        this.cdf.markForCheck();
        break;
    }
  }
}
