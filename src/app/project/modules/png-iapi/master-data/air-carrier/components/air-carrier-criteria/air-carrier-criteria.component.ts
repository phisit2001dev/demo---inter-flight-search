import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { SitValidatorInputService } from '@app/project/shared/service/validator-input.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { AirCarrierService } from '../../service/air-carrier.service';
import { environment } from '@evn/environment';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';

@Component({
  selector: 'app-air-carrier-criteria',
  templateUrl: './air-carrier-criteria.component.html',
  styleUrls: ['./air-carrier-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirCarrierCriteriaComponent extends AbstractComponent implements OnInit,OnDestroy{
 @Input() form:FormGroup
 @Input() initialData:any

 countryNameList = []
 countryNameAutocomplete$ = new Subject()

 carrierTypeSelectItem =[]
 activationSelectItem = []
  llp = []

  constructor(
    private spinner:SpinnerService,
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    private cdf: ChangeDetectorRef,
    private service:AirCarrierService,
    private mds :ManualDetectionService
  
  ){
    super(snackbarService, dialog, spinner, mds, translate, authQuery)
  }
  ngOnInit(): void {
    super.onInitial();
    this.initAutocomplete()
    this.carrierTypeSelectItem = this.initialData?.listCarrierType??[];
    this.activationSelectItem = this.initialData?.listActiveStatus??[];
    this.llp = this.initialData?.listLinePerPage ?? [];
  
  }
  ngOnDestroy(): void {
    super.onDestroy();
  }
  
  initAutocomplete(){

    this.countryNameAutocomplete$.pipe(takeUntil(this.destroy$),switchMap((term:string) =>{
      if(term&&term.trim().length >= environment.autocomplete.fillAtLeast){
        return  this.service.searchCountry(term)
      }
      else{
        this.countryNameList =[]
        this.cdf.markForCheck();
        return []
      }
    })).subscribe(value=>{
      console.log(value)
      this.countryNameList = value.data;
      this.cdf.markForCheck();
    })
  }


  
}
