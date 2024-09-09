import { CommonSelectItem } from '@app/common/models/common-select-item';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { InitAirportService } from '../../service/init-airport.service';
import { environment } from './../../../../../../environments/environment';

@Component({
  selector: 'app-airport-criteria',
  templateUrl: './airport-criteria.component.html',
  styleUrls: ['./airport-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirportCriteriaComponent extends AbstractComponent implements OnInit {

  @Input() form: FormGroup
  @Input() listlinePerPage;
  @Input() listActiveStatus: CommonSelectItem;
  countryList = [];
  countryAutocomplete$ = new Subject();
  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private cdf: ChangeDetectorRef,
    private service:InitAirportService,
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
    // this.countryList = [];
    console.log(e);
  }
}
