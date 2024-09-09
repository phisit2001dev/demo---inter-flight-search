import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Permission } from '@app/common/models/permission';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { environment } from '@evn/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-country-add',
  templateUrl: './country-add.component.html',
  styleUrls: ['./country-add.component.scss'],
  providers: [ ManualDetectionService ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryAddComponent extends AbstractComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  initialData: any;
  permission: Permission;
  continentList = [];
  continentNameAutocomplete$ = new Subject();

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected validatorInput:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    public spinner: SpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cdf: ChangeDetectorRef,
    private service: CountryService,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
    this.initialData = this.route.snapshot.data.init.payload;
    this.permission = this.initialData?.permission;
    this.initAutocomplete();
    this.initialForm();
  }

  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  ngAfterViewInit(): void {
    this.spinner.hide();
  }

  initialForm() {
    const option = { updateOn: 'blur', validators: SITValidators.isRequire };
    this.form = this.formBuilder.group({
      countryCodeAlp2: [this.initialData?.country?.countryCodeAlp2 ?? ''],            // Text input
      countryCodeAlp3: [this.initialData?.country?.countryCodeAlp3 ?? '', option],    // Text input
      countryName: [this.initialData?.country?.countryName ?? '', option],            // Text input
      nationalityCode: [this.initialData?.country?.nationalityCode ?? '', option],    // Text input
      nationalityName: [this.initialData?.country?.nationalityName ?? '', option],    // Text input
      continentCode: [this.initialData?.country?.continentCode ?? '', option],        // Auto complete
      continentName: [this.initialData?.country?.continentName ?? '', option],        // Auto complete
      activeStatus: [this.initialData?.country?.activeStatus == "Y" ? true : false],  // Checkbox
    });
  }

  initAutocomplete() {
    this.continentNameAutocomplete$.pipe(takeUntil(this.destroy$), switchMap((term: string) => {
        if (term && term.length >= environment.autocomplete.fillAtLeast) {
          return this.service.continentNameAutoComplete(term);
        }
        this.continentList = [];
        this.cdf.markForCheck();
        return [];

      })).subscribe((value) => {
        if (value) {
          this.continentList = value.data;
          this.cdf.markForCheck();
        }
    });
  }

  selectValue(e) {
    this.continentList = [];  // Clear list after selected.
  }

  save() {
    if (this.form.invalid) {   /// Check invalid
      this.form.markAllAsTouched();
      this.mds$.getNext();
      this.snackbarService.open(this.translate.instant('10002'), "W");  // Show snackbar.
      return;
    }

    /// Open confirm dialog
    this.openConfirm('50003').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((confirm) => {
      if (confirm) {
        this.spinner.show();  // Show spinner.

        /// Call API.
        this.service.insertCountry(this.prepareFormData()).pipe(takeUntil(this.destroy$)).subscribe((resp) => {
          this.handleResponse(resp); // Show snackbar and clear validat.

          if (resp?.displayStatus === 'S') {
            this.form.reset({
              activeStatus: this.initialData?.country?.activeStatus == "Y" ? true : false, // Set default.
            });
          }

          this.spinner.hide();  // Hide spinner.
        });
      }
    });
  }

  private prepareFormData() {
    let {...formData}: any = { ...this.form.value };
    formData.activeStatus = formData.activeStatus ? "Y" : "N";
    return formData;
  }

  cancel() {
    /// Open confirm dialog
    this.openConfirm('50009').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((confirm) => {
      if (confirm) {
        this.spinner.show();  // Show spinner.
        this.router.navigate(['/iapi/master-data/country', 'search'], {relativeTo: this.route});
      }
    });
  }
}
