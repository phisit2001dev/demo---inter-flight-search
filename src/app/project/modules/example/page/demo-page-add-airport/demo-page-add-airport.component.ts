import { ConfirmDialogComponent } from './../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AfterViewInit, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { environment } from '@evn/environment';
import { InitAirportService } from '../../service/init-airport.service';

@Component({
  selector: 'app-demo-page-add-airport',
  templateUrl: './demo-page-add-airport.component.html',
  providers: [ ManualDetectionService ],
  styleUrls: ['./demo-page-add-airport.component.scss']
})
export class DemoPageAddAirportComponent extends AbstractComponent implements OnInit,OnDestroy,AfterViewInit {

  form: FormGroup;
  countryList;
  page;
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
  }

  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  ngAfterViewInit(): void {
    this.spinner.hide();

  }

  ngOnInit(): void {
    super.onInitial();
    const initdata = this.route.snapshot.data.init;
    const result  = initdata.payload?.airport;

    this.form = this.formBuilder.group({
      airportName: [result?.airportName,{updateOn: 'blur',validators: SITValidators.isRequire}],
      iata: [result?.airportCodeIata,{updateOn: 'blur',validators: SITValidators.isRequire}],
      icao: [result?.airportCodeIcao,{updateOn: 'blur',validators: SITValidators.isRequire}],
      local: [result?.location,{updateOn: 'blur',validators: SITValidators.isRequire}],
      countryNameKey: [result?.countryNameValue],
      countryNameVal: [result?.countryNameKey,{updateOn: 'blur',validators: SITValidators.isRequire}],
      airportNameTh: [''],
      localTh: [''],
      lat: [''],
      long: [''],
    })

    switch (initdata.page) {
      case 'view':
        this.form.disable();
        this.page = 'V';
        break;
      case 'edit':
        this.page = 'E';
        break;
      case 'add':
        this.page = 'A';
        break;
    }
  }

  save(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbarService.open("Invalid Data","W");
      this.mds$.getNext();
      return;
    }
    this.dialog.open(ConfirmDialogComponent,{
      data: {
        description: this.translate.instant('50003'),
      },
    }).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(close => {
      if (close) {
        this.service.mockSaveSuccess().pipe(takeUntil(this.destroy$)).subscribe((res)=> {
          this.handleResponse(res);
          if (res.displayStatus === 'S') {
            this.router.navigate(['/ex/','search'],{
              relativeTo: this.route,
            });
          }
        })
      }
    });
  }

  cancel(){
    this.dialog.open(ConfirmDialogComponent,{
      data: {
        description: this.translate.instant(this.page === 'A' ? '50009' : '50010'),
      },
    }).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(close => {
      if (close) {
        this.router.navigate(['/ex/','search'],{
          relativeTo: this.route,
        });
      }
    });
  }

  selectValue(e){

  }

  close(){
    this.router.navigate(['/ex/','search'],{
      relativeTo: this.route,
    });
  }

  edit(){
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbarService.open("Invalid Data","W");
      this.mds$.getNext();
      return;
    }
    this.dialog.open(ConfirmDialogComponent,{
      data: {
        description: this.translate.instant('50004'),
      },
    }).afterClosed().pipe(takeUntil(this.destroy$)).subscribe(close => {
      if (close) {
        this.service.mockSaveSuccess().pipe(takeUntil(this.destroy$)).subscribe((res)=> {
          this.handleResponse(res);
          if (res.displayStatus === 'S') {
            this.router.navigate(['/ex/','search'],{
              relativeTo: this.route,
            });
          }
        })
      }
    });
  }

}
