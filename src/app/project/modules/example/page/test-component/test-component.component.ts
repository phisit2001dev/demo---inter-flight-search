import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { AlertDialogComponent } from '@app/project/shared/components/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialog } from '@app/project/shared/components/confirm-dialog/models/confirm-dialog';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, delay, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs';
import { InitAirportService } from '../../service/init-airport.service';
import { environment } from '@evn/environment';
import { TimezoneService } from '@app/project/core/services/timezone.service';

@Component({
  selector: 'test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: CustomNativeDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOMS_DATE_FORMATS,
    },
    ManualDetectionService
  ],
})
export class TestComponentComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy {

  form: FormGroup;
  formParent: FormGroup;
  // autoc
  autocomplete1 = new BehaviorSubject(null);
  suggestion = new BehaviorSubject(null);
  chipAutocomplete = new BehaviorSubject(null);
  chipSuggestion = new BehaviorSubject(null);
  chipautocomplete1 = new BehaviorSubject(null);
  listAuto = [];
  disable=[false,]
  @ViewChild('rowText',{read: true}) rowText: ElementRef;
  // radioForm = new FormControl([null,SITValidators.isRequire]);

  constructor(
    private formBuilder: FormBuilder,
    public spinner: SpinnerService,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    protected serviceInitAirport:  InitAirportService,
    private http: HttpClient,
    private cdf: ChangeDetectorRef,
    public navService: MainNavService,
    public mds$: ManualDetectionService,
    public timeZoneService: TimezoneService,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
    navService.currentSys = 'ex / extes / 001'
  }

  ngAfterViewInit(): void {
    // console.log(this.rowText);
    this.spinner.hide();
    //FIXME custom validate
    setTimeout(() => {
      this.setErrorForm([{element: 'ele3', msg: 'custom validate'}]);
    });


    this.form.get('chip1data').setValue([{key: '1' , value: 'one'}]);
    for (let index = 0; index < 10; index++) {
      this.form.get('chip1data').value.push({key: '1' , value: 'one'});
    }
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      // ele1: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      ele1: ['',{updateOn: 'blur', validators: [SITValidators.isRequire, SITValidators.is_DatePicker()]}],
      ele2: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      ele3: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      ele4value: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      ele4key: ['',{updateOn: 'blur'}],
      ele5value: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      ele5key: ['',{updateOn: 'blur'}],
      ele6value: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      ele6key: ['',{updateOn: 'blur'}],
      ele7value: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      ele7key: ['',{updateOn: 'blur'}],
      eleSearchChipCA: ['',{ updateOn: 'blur' }],
      eleDataChipCA: [[],{ updateOn: 'blur' }],
      testdisable: ['test Disable'],
      radioForm: [null,SITValidators.isRequire],
      checkbox1: [''],
      checkbox2: [''],
      checkbox3: ['',SITValidators.isRequireCheckbox],
      checkbox4: ['',SITValidators.isRequireCheckbox],


      chip1control: [''],
      chip1data: [[]],

      htext:[2],
    })
    this.initAutocomplete();


    // test parent - Child
    this.formParent = this.formBuilder.group({
      radio: [null,SITValidators.isRequire],
      check1: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      check2: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      check3: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      input1: ['',{updateOn: 'blur', validators: [SITValidators.isRequire]}],
      });
  }
  check(e){
    e.checked ? this.form.get('radioForm').disable(): this.form.get('radioForm').enable();
  }

  changetimezone(){
    this.timeZoneService.setTimeZone('UTC+55');
  }

  initAutocomplete(){
    let temp = null;
    let temp2 = null;
    let tempChip1 = null;
    // -------------------------------------
    this.autocomplete1.pipe(
    tap((v) => {
      temp = v;
      if (temp) {
        this.listAuto[0] = [];
        this.cdf.markForCheck();
      }
    }),
    takeUntil(this.destroy$),
    distinctUntilChanged(),
    switchMap((term: string) => {
      // FIX fillAtLeast = 1
      if (term && term.length >= 1) {
        return this.http.get<any>('assets/mockjson/mockTestAutoComplete.json').pipe(delay(150)
          );
      }
      this.listAuto[0] = [];
      this.cdf.markForCheck();
      return [];
    })
    ).subscribe((value) => {
      this.listAuto[0] = value.filter(word => word.key?.toLowerCase().includes(temp?.toLowerCase()));
      this.cdf.markForCheck();
    });
    // -------------------------------------------------
    this.suggestion.pipe(
    tap((v) => {
      temp2 = v;
      if (temp2) {
        this.listAuto[1] = [];
        this.cdf.markForCheck();
      }
    }),
    takeUntil(this.destroy$),
    distinctUntilChanged(),
    switchMap((term: string) => {
      // FIX fillAtLeast = 1
      if (term && term.length >= 1) {
        return this.http.get<any>('assets/mockjson/mockTestAutoComplete.json').pipe(delay(150)
          );
      }
      this.listAuto[1] = [];
      this.cdf.markForCheck();
      return [];
    })
    ).subscribe((value) => {
      this.listAuto[1] = value.filter(word => word.key?.toLowerCase().includes(temp2?.toLowerCase()));
      this.cdf.markForCheck();
    });
    // ------------------------------------------------
    this.chipautocomplete1.pipe(
    takeUntil(this.destroy$),
    distinctUntilChanged(),
    switchMap((term: string) => {
      // FIX fillAtLeast = 1
      if (term && term.length >= 1) {
        return this.http.get<any>('assets/mockjson/mockTestAutoComplete.json').pipe(delay(150)
          );
      }
      this.listAuto[2] = [];
      this.cdf.markForCheck();
      return [];
    })
    ).subscribe((value) => {
      // console.log(value);
      this.listAuto[2] = value;
      this.cdf.markForCheck();
      // const lst = value.filter(word => word.key?.toLowerCase().includes(this.form.get('eleSearchChipCA').value?.toLowerCase()));
      // if (lst.length > 0) {
      //   lst.forEach((obj) => {
      //     if (!(this.form.get('eleDataChipCA').value).find(v => v.key === obj.key)) {
      //       if (!this.listAuto[2]) {
      //         this.listAuto[2] = [];
      //       }
      //       this.listAuto[2].push(obj);
      //     }
      //   });
      // }else {
      //   this.listAuto[2] = [];
      // }

    });

  }

  getrow(){
    // console.log(this.rowText.nativeElement.value);

    return  this.rowText?.nativeElement.value ? this.rowText.nativeElement.value : '2'
  }

  showSpiner(){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
  }

    // ------------------------------------------- chips ---------------------------------------
    pushSelectValue(e,formName){
      this.listAuto[formName === "chip1Data" ? 2 : 3] = [];
      // console.log(e);
      // console.log(formName);
      // console.log(this.listAuto[formName === "eleDataChipCA" ? 2 : 3]);
      // console.log(this.form.get('eleSearchChipCA').value);
      // console.log(this.form.get('eleDataChipCA').value);

      console.log(e, formName);
      this.form.get(formName).value.push(e);
      // console.log(this.form.get(formName).value);



    }
    removeSelectValue(e,formName){
      // console.log(e);
      const index = e.index;
      if (index >= 0) {
        const templist = this.form.get(formName).value;
        templist.splice(index, 1);
        this.form.get(formName).setValue(templist);
      }

      this.listAuto[formName === "chip1Data" ? 2 : 3] = [];
    }

  showSnackbar(type: 'W' | 'E' | 'S'){
    this.snackbarService.open('This is a danger alert—check it out!',type?.toUpperCase());
  }

  showDialog(type: 'alert'|'confirm'){
    let opt: ConfirmDialog;
    opt = {
      description: `There's still missing information in some tab(s) are you sure you want to save this record ?`
      // description: `There's still missing information in some tab(s) are you sure you want to save this record ? \n There's still missing information in some tab(s) \n are you sure you want to save this record ?`
      // description: `There's still missing information in some tab(s) are you sure you want to save this record ? There's still missing information in some tab(s) are you sure you want to save this record ?`
      // description: `There's still missing INFORMATION?`
    }
    if (type === 'confirm') {
      this.dialog.open(ConfirmDialogComponent, {
        data: opt
      });
    }else {
      this.dialog.open(AlertDialogComponent, {
        data: opt
      });
    }
  }

    testApi(){
    this.http.post(`${environment.serverUrl}user-management/profile/init`,null).subscribe(resp => {
     this.snackbarService.open('OK','S');
    })
  }

  testNewTab(){
    window.open(`${environment.contextPath}home`,'_blank');
  }

  submitValidate(number){
    switch (number) {
      case 0:
        // alert(number);
        this.http.get('assets/mockjson/project-list-notfound.json').subscribe((reps:any) => {
          this.handleResponse(reps);
          // console.log(reps);
        })
        break;
      case 1:
        alert(number);
        break;
      case 2:
        alert(number);
        break;
    }
  }

  realAPisearch(context){
    // fixmocktg
  let mock = {
      "depDateUTCFr": "01/06/2023",
      "depTimeUTCFr": "00:00",
      "depDateUTCTo": "28/06/2023",
      "depTimeUTCTo": "23:59",
      "depDateLTFr": null,
      "depTimeLTFr": "",
      "depDateLTTo": null,
      "depTimeLTTo": "",
      "depPort": null,
      "arrPort": null,
      "creDateLTFr": null,
      "creTimeLTFr": "",
      "creDateLTTo": null,
      "creTimeLTTo": "",
      "fltNo": null,
      "fltCode": null,
      "asmStatus": null,
      "linePerPage": 10,
      "checkMaxExceed": true,
      "pageIndex": 0,
      "headerSorts": [
        {
          "columnName": "2",
          "order": "ASC"
        }
      ]
  }
  switch (context) {
    case 'i':
        // this.serviceInitAirport.searchPageMockUser().pipe(takeUntil(this.destroy$)).subscribe((resp) => {
        //   console.log(resp);
        // });
      break;
    case 's':
      break;
    case 'c':
      break;
    }
  }











}
