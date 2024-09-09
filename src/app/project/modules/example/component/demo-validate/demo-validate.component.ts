import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { environment } from '@evn/environment';
import { TranslateService } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { InitAirportService } from '../../service/init-airport.service';

@Component({
  selector: 'app-demo-validate',
  templateUrl: './demo-validate.component.html',
  styleUrls: ['./demo-validate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoValidateComponent extends AbstractComponent implements OnInit,OnDestroy,AfterViewInit {

  @Input() form: FormGroup
  autocomplete = [];
  autocomplete$ = new Subject();
  @Input() disable = false;


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

  ngOnDestroy(): void {
    super.onDestroy();
  }

  ngOnInit(): void {
    super.onInitial();
    this.initAutocomplete();
  }

  ngAfterViewInit(): void {
  }

  selectValue(e){

  }


  initAutocomplete(){
    this.autocomplete$.pipe(
      takeUntil(this.destroy$),
      switchMap((term: string) => {
        // FIX fillAtLeast = 1
        if (term && term.length >= environment.autocomplete.fillAtLeast) {
          return this.service.mockAutoJson()
        }
        this.autocomplete = [];
        this.cdf.markForCheck();
        return [];
      })
      ).subscribe((value:any) => {
        this.autocomplete = value;
        this.cdf.markForCheck();
      });
  }
}
