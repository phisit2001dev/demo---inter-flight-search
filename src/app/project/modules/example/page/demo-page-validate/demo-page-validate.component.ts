import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { InputPasswordValidationService } from '@app/project/core/services/input-password-validation.service';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { CUSTOMS_DATE_FORMATS, CustomNativeDateAdapter } from '@app/project/shared/directives/date-picker.directive';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { take, takeUntil } from 'rxjs/operators';
import { InitAirportService } from '../../service/init-airport.service';

@Component({
  selector: 'app-demo-page-validate',
  templateUrl: './demo-page-validate.component.html',
  styleUrls: ['./demo-page-validate.component.scss'],
  providers: [ ManualDetectionService,
    {
      provide: DateAdapter,
      useClass: CustomNativeDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOMS_DATE_FORMATS,
    },
    InputPasswordValidationService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class DemoPageValidateComponent extends AbstractSearchComponent implements OnInit,OnDestroy,AfterViewInit {

  form: FormGroup;
  formFieldset: FormGroup;
  formtitle: FormGroup;
  formTab: FormGroup;
  formCheckboxConfig: FormGroup;
  formUpload: FormGroup;
  controlRadioEvent = new FormControl(false);
  formControlPassword: FormControl = new FormControl('',{updateOn: this.controlRadioEvent.value ? 'change' : 'blur',validators: SITValidators.isRequire});
  @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
  titleInvalidMsg;
  hide = true;
  mockPasswordValidation;
  initPasswordValidation;
  routeUpload: string = '/cp/batchtransaction/submit/upload';
  routeView: string = 'assets/mockjson/csc/carrier-engagement/mockUploadSuccess.json'

  constructor(
    private formBuilder: FormBuilder,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private passwordService : InputPasswordValidationService,
    private service:InitAirportService,
    private cdf: ChangeDetectorRef,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
  }

  ngOnInit(): void {
    super.onInitial();

    let mockConfig = []
    for (let index = 0; index < 5; index++) {
      if (!index) {
        mockConfig.push({index: 0,value: 5});
      }else {
        mockConfig.push({index: index});
      }
    }

    // initconfig
    this.initPasswordValidation = this.passwordService.getConfigPassword(mockConfig);
    this.mockPasswordValidation = this.initPasswordValidation;
    //add form formCheckboxConfig
    this.formCheckboxConfig = this.formBuilder.group({});
    this.mockPasswordValidation.forEach((element,index) => {
      this.formCheckboxConfig.addControl(index,new FormControl(true));
    });
    // ----------------------------------
    this.form = this.formBuilder.group({
      textbox: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
      combobox: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
      datepicker: ['',{updateOn: 'blur',validators: [SITValidators.isRequire,SITValidators.is_DatePicker()]}],
      time: ['',{updateOn: 'blur',validators: [SITValidators.isRequire,SITValidators.isTime()]}],
      autocompleteVal: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
      autocompleteKey: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
      radioForm: [''],

      checkbox1: [''],
      checkbox2: [''],
      checkbox3: [''],
      checkBorderless1: [''],
      checkBorderless2: [''],
      radioBorderless1: [''],
      radioBorderless2: [''],
    });

    this.formFieldset = this.formBuilder.group({
      fdDateForm: ['',{updateOn: 'blur',validators: [SITValidators.is_DatePicker()]}],
      fdTimeForm: ['',{updateOn: 'blur',validators: [SITValidators.isTime()]}],
      fdDateTo: ['',{updateOn: 'blur',validators: [SITValidators.is_DatePicker()]}],
      fdTimeTo: ['',{updateOn: 'blur',validators: [SITValidators.isTime()]}],
    });

    this.formtitle = this.formBuilder.group({
      titleDateForm: ['',{updateOn: 'blur',validators: [SITValidators.is_DatePicker()]}],
      titleTimeForm: ['',{updateOn: 'blur',validators: [SITValidators.isTime()]}],
      titleDateTo: ['',{updateOn: 'blur',validators: [SITValidators.is_DatePicker()]}],
      titleTimeTo: ['',{updateOn: 'blur',validators: [SITValidators.isTime()]}],
    });

    this.formTab = this.formBuilder.group({
      tabInput1: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
      tabInput2: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
    });

    this.controlRadioEvent.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(change => {
      this.formControlPassword = new FormControl('',{updateOn: this.controlRadioEvent.value ? 'change' : 'blur'});
    })

    this.formUpload = this.formBuilder.group({
      // fileName: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
      // filePath: ['',{updateOn: 'blur',validators: SITValidators.isRequire}],
      fileName: ['',{updateOn: 'blur'}],
      filePath: ['',{updateOn: 'blur'}],
    });
  }

  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  configChange(e){
    let config = []
    for (const key in this.formCheckboxConfig.controls) {
      if (this.formCheckboxConfig.value[key]) {
        if (key === '0') {
          config.push({index: key, value: 5})
        }else {
          config.push({index: key})
        }
      }
    }
    this.mockPasswordValidation = this.passwordService.getConfigPassword(config);
    this.formControlPassword  = new FormControl('',{updateOn: this.controlRadioEvent.value ? 'change' : 'blur'});
  }


  validateClick(){
    this.mds$.clearValidate();
    this.snackbarService.getSnackbar().dismiss();
    if (this.form.invalid) {
      this.snackbarService.open("Invalid Data","W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      // return;
    }

    if (!this.form.get('checkbox1').value
      && !this.form.get('checkbox2').value
      && !this.form.get('checkbox3').value ) {
      this.mds$.setValidateManual([{element: 'group-checkbox', msg: 'This field is required.'}]);
    }else{
      this.mds$.setValidateManual([{element: 'group-checkbox', msg: null}]);
    }

    if (!this.form.get('radioForm').value) {
      this.mds$.setValidateManual([{element: 'radioForm', msg: 'This field is required.'}]);
    }else{
      this.mds$.setValidateManual([{element: 'radioForm', msg: null}]);
    }

    this.mds$.setValidateManual([{element: 'checkBorderless', msg: 'This field is required.'}]);
    this.mds$.setValidateManual([{element: 'radioBorderless', msg: 'This field is required.'}]);

    this.validateFieldset();
    if (this.formFieldset.invalid) {
      this.snackbarService.open("Invalid Data","W");
      this.formFieldset.markAllAsTouched();
    }

    this.validateTitle();
    if (this.formtitle.invalid) {
      this.snackbarService.open("Invalid Data","W");
      this.titleInvalidMsg = 'Invalid Data.';
      this.formtitle.markAllAsTouched();
    }

    // validate tab
    if (this.formTab.invalid) {
      this.snackbarService.open("Invalid Data","W");
      this.matTabGroup.selectedIndex = 1;
      this.formTab.markAllAsTouched();
    }

    // validate auto
    if (this.formUpload.invalid) {
      this.snackbarService.open("Invalid Data","W");
      this.formUpload.markAllAsTouched();
    }
  }



  clearClick(){
    this.snackbarService.getSnackbar().dismiss();
    this.isSearched = false;
    this.mds$.clearValidate();
    this.form.reset(this.criteria);

    // reset fieldset
    this.clearValidatorsFieldsetAll();
    this.formFieldset.reset();

    // reset title
    this.clearValidatorsTitleAll();
    this.formtitle.reset();

    // reset tab
    this.matTabGroup.selectedIndex = 0;
    this.formTab.reset();

    this.formUpload.reset();
  }




  // ------------------------------------ code form Fieldset --------------------------------
  validateFieldset(){
    this.clearValidatorsFieldsetAll();
    let form = this.formFieldset.value;
    // At least one vlaidate
    if (!form.fdDateForm && !form.fdTimeForm && !form.fdDateTo && !form.fdTimeTo || this.formFieldset.invalid) {
      this.mds$.setValidateManual([{element: 'fieldsetDate', msg: ''}]);
    }

    if (form.fdDateForm || form.fdTimeForm) {
      // add validater
      this.formFieldset.get('fdDateForm').addValidators([SITValidators.isRequire, SITValidators.is_DatePicker()]);
      this.formFieldset.get('fdDateForm').updateValueAndValidity();

      this.formFieldset.get('fdTimeForm').addValidators([SITValidators.isRequire, SITValidators.isTime()]);
      this.formFieldset.get('fdTimeForm').updateValueAndValidity();
    }

    if (form.fdDateTo || form.fdTimeTo) {
      // add validater
      this.formFieldset.get('fdDateTo').addValidators([SITValidators.isRequire, SITValidators.is_DatePicker()]);
      this.formFieldset.get('fdDateTo').updateValueAndValidity();

      this.formFieldset.get('fdTimeTo').addValidators([SITValidators.isRequire, SITValidators.isTime()]);
      this.formFieldset.get('fdTimeTo').updateValueAndValidity();
    }
  }

  clearValidatorsFieldsetAll(){
    this.mds$.setValidateManual([{element: 'fieldsetDate', msg: null}]);
    this.formFieldset.get('fdDateForm').removeValidators(SITValidators.isRequire);
    this.formFieldset.get('fdDateForm').updateValueAndValidity();

    this.formFieldset.get('fdTimeForm').removeValidators(SITValidators.isRequire);
    this.formFieldset.get('fdTimeForm').updateValueAndValidity();

    this.formFieldset.get('fdDateTo').removeValidators(SITValidators.isRequire);
    this.formFieldset.get('fdDateTo').updateValueAndValidity();

    this.formFieldset.get('fdTimeTo').removeValidators(SITValidators.isRequire);
    this.formFieldset.get('fdTimeTo').updateValueAndValidity();
  }


  // ------------------------------------ code form title --------------------------------
  validateTitle(){
    this.clearValidatorsTitleAll();
    let form = this.formtitle.value;
    // At least one vlaidate
    if (!form.titleDateForm && !form.titleTimeForm && !form.titleDateTo && !form.titleTimeTo) {
      this.titleInvalidMsg = 'This field is required.';
    }

    if (form.titleDateForm || form.titleTimeForm) {
      // add validater
      this.formtitle.get('titleDateForm').addValidators([SITValidators.isRequire, SITValidators.is_DatePicker()]);
      this.formtitle.get('titleDateForm').updateValueAndValidity();

      this.formtitle.get('titleTimeForm').addValidators([SITValidators.isRequire, SITValidators.isTime()]);
      this.formtitle.get('titleTimeForm').updateValueAndValidity();
    }

    if (form.titleDateTo || form.titleTimeTo) {
      // add validater
      this.formtitle.get('titleDateTo').addValidators([SITValidators.isRequire, SITValidators.is_DatePicker()]);
      this.formtitle.get('titleDateTo').updateValueAndValidity();

      this.formtitle.get('titleTimeTo').addValidators([SITValidators.isRequire, SITValidators.isTime()]);
      this.formtitle.get('titleTimeTo').updateValueAndValidity();
    }
  }

  clearValidatorsTitleAll(){
    this.titleInvalidMsg = null;
    this.formtitle.get('titleDateForm').removeValidators(SITValidators.isRequire);
    this.formtitle.get('titleDateForm').updateValueAndValidity();

    this.formtitle.get('titleTimeForm').removeValidators(SITValidators.isRequire);
    this.formtitle.get('titleTimeForm').updateValueAndValidity();

    this.formtitle.get('titleDateTo').removeValidators(SITValidators.isRequire);
    this.formtitle.get('titleDateTo').updateValueAndValidity();

    this.formtitle.get('titleTimeTo').removeValidators(SITValidators.isRequire);
    this.formtitle.get('titleTimeTo').updateValueAndValidity();
  }

  getFileChange(e){
    this.formUpload.get('fileName').setValue(e.fileName);
    this.formUpload.get('filePath').setValue(e.filePath);
  }

  resetFileupload(){
    this.formUpload.reset();
    // console.log(this.formUpload);

  }

  apiValidate(){
    // mock
    this.service.mockRespErrorJson().pipe(takeUntil(this.destroy$)).subscribe(resp => {
      this.handleResponse(resp);
      // custom error
      if (resp.error && resp.invalid) {
        let title = resp?.invalid.find(v => v.element === 'titleValidate');
        if (title) {
          this.titleInvalidMsg = resp.error.errorDesc;
          // this.cdf.markForCheck();
        }
      }
    })
  }

  enterSearch(e){
    console.log('enterSearch');
  }
}
