import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Component, ChangeDetectionStrategy, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { environment } from '@evn/environment';
import { takeUntil, switchMap, Subject } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { InitAirportService } from '../../service/init-airport.service';

@Component({
  selector: 'app-airport-criteria-add-view',
  templateUrl: './airport-criteria-add-view.component.html',
  styleUrls: ['./airport-criteria-add-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AirportCriteriaAddViewComponent extends AbstractComponent implements OnInit {

  @Input() form: FormGroup;
  countryList;
  countryAutocomplete$ = new Subject();

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
    private service:InitAirportService,
    private cdf: ChangeDetectorRef,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
    this.mds$.doMarkForCheck(this.cdf);
  }

  ngOnInit(): void {
    super.onInitial();
    this.initAutocomplete();

  }

  initAutocomplete(){
    this.countryAutocomplete$.pipe(
      takeUntil(this.destroy$),
      switchMap((term: string) => {
        // FIX fillAtLeast = 1
        if (term && term.length >= environment.autocomplete.fillAtLeast) {
          return this.service.mockAutoJson()
        }
        this.countryList = [];
        this.cdf.markForCheck();
        return [];
      })
      ).subscribe((value:any) => {
        this.countryList = value;
        this.cdf.markForCheck();
      });
  }

  selectValue(e){

  }
}
