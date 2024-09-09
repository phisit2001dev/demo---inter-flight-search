import { AbstractComponent } from '@app/abstracts/abstract-component';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { TranslateService } from '@ngx-translate/core';
import { InitAirportService } from '../../service/init-airport.service';

@Component({
  selector: 'app-theme-disable',
  templateUrl: './theme-disable.component.html',
  styleUrls: ['./theme-disable.component.scss'],
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

export class ThemeDisableComponent extends AbstractComponent {

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

  formDisable: FormGroup;
  formClassDisable: FormGroup;

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    super.onInitial();
    this.formDisable = this.formBuilder.group({

      textbox: ['test',{updateOn: 'blur',validators: SITValidators.isRequire}],
      combobox: ['test',{updateOn: 'blur',validators: SITValidators.isRequire}],
      datepicker: [new Date(),{updateOn: 'blur',validators: [SITValidators.isRequire,SITValidators.is_DatePicker()]}],
      time: ['11:11',{updateOn: 'blur',validators: [SITValidators.isRequire,SITValidators.isTime()]}],
      autocompleteVal: ['test',{updateOn: 'blur',validators: SITValidators.isRequire}],
      autocompleteKey: ['test',{updateOn: 'blur',validators: SITValidators.isRequire}],
      radioForm: ['vanilla',{validators: SITValidators.isRequire}],

      checkbox1: ['true',{updateOn: 'blur'}],
      checkbox2: ['',{updateOn: 'blur'}],
      checkbox3: ['',{updateOn: 'blur'}],
      checkBorderless1: [''],
      checkBorderless2: [''],
      radioBorderless1: [''],
      radioBorderless2: [''],
    });

    this.formClassDisable = this.formBuilder.group({

      textbox: ['test',{updateOn: 'blur',validators: SITValidators.isRequire}],
      combobox: [{value: '1', disabled: true},{updateOn: 'blur',validators: SITValidators.isRequire}],
      datepicker: [new Date(),{updateOn: 'blur',validators: [SITValidators.isRequire,SITValidators.is_DatePicker()]}],
      time: ['11:11',{updateOn: 'blur',validators: [SITValidators.isRequire,SITValidators.isTime()]}],
      autocompleteVal: ['test',{updateOn: 'blur',validators: SITValidators.isRequire}],
      autocompleteKey: ['test',{updateOn: 'blur',validators: SITValidators.isRequire}],
      radioForm: [{value: 'vanilla', disabled: true},{validators: SITValidators.isRequire}],

      checkbox1: [{value: 'true', disabled: true},{updateOn: 'blur'}],
      checkbox2: [{value: '', disabled: true},{updateOn: 'blur'}],
      checkbox3: [{value: '', disabled: true},{updateOn: 'blur'}],
      checkBorderless1: [{value: '', disabled: true}],
      checkBorderless2: [{value: '', disabled: true}],
      radioBorderless1: [{value: '', disabled: true}],
      radioBorderless2: [{value: '', disabled: true}],
    });

    this.formDisable.disable();

  }




}
