import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { environment } from '@evn/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-country-criteria',
  templateUrl: './country-criteria.component.html',
  styleUrls: ['./country-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryCriteriaComponent extends AbstractComponent implements OnInit, OnDestroy {

  @Input() initialData: any;
  @Input() form: FormGroup;

  continentList = [];
  continentAutocomplete$ = new Subject();

  /// SelectItem
  activationSelectItem = [];
  llp = [];

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private cdf: ChangeDetectorRef,
    private service: CountryService,
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
    this.mds$.doMarkForCheck(this.cdf);
  }

  ngOnInit(): void {
    super.onInitial();
    this.initAutocomplete();

    /// Initial selectItem.
    this.activationSelectItem = this.initialData?.listActiveStatus ?? [];
    this.llp = this.initialData?.listLinePerPage ?? [];
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  initAutocomplete() {
    this.continentAutocomplete$.pipe(takeUntil(this.destroy$), switchMap((term: string) => {
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

  selectValue(e){
    this.continentList = [];  // Clear list after selected.
  }
}
