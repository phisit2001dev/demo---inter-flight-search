import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, Pipe, SimpleChanges } from '@angular/core';
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
import { InterFlightSearchService } from '../../service/inter-flight-search.service';
import { environment } from '@evn/environment';
import { DateService } from '@app/project/core/services/date.service';


@Component({
  selector: 'app-inter-flight-search-criteria',
  templateUrl: './inter-flight-search-criteria.component.html',
  styleUrls: ['./inter-flight-search-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  

})
export class InterFlightSearchCriteriaComponent extends AbstractComponent implements OnInit,OnDestroy {

 @Input() form: FormGroup;
 @Input() initialData:any;

 directionSelectItem:[]
 scheduleTypeSelectItem:[]
 lpp:[]

 carrierCodeList = [];
  carrierCodeAutocomplete$ = new Subject();

  flightList = [];
  flightAutocomplete$ = new Subject();

  departurePortList = [];
  departurePortAutocomplete$ = new Subject();

  arrivalPortList = [];
  arrivalPortAutocomplete$ = new Subject();

  constructor(protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected sitValidate:  SitValidatorInputService,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private cdf: ChangeDetectorRef,
    private service:InterFlightSearchService,
    private dateService: DateService){
      super(snackbarService, dialog, spinner, mds$, translate, authQuery)
  }

  ngOnInit(): void {
    super.onInitial()
    this.initailSelectItem();
    this.initAutocomplete();
    this.mds$.doMarkForCheck(this.cdf);
  
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  checkChangeDeparture(){
    if(this.dateService.checkOverMaxDay((this.form.get('departureDateFrom').value),(this.form.get('departureDateTo').value),31)){
      alert(this.translate.instant('10036'))
    }
    
  }
  checkChangearrival(){
    if(this.dateService.checkOverMaxDay((this.form.get('arrivalDateFrom').value),(this.form.get('arrivalDateTo').value),31)){
      alert(this.translate.instant('10036'))
    }

  }
  
 initailSelectItem(){
  this.directionSelectItem = this.initialData.directionSelectItem ? this.initialData.directionSelectItem : []
  this.scheduleTypeSelectItem = this.initialData.scheduleTypeSelectItem ? this.initialData.scheduleTypeSelectItem:[]
  this.lpp = this.initialData.listLinePerPage ? this.initialData.listLinePerPage:[]
 }
 
//ต่อ
initAutocomplete(){
  
this.departurePortAutocomplete$.pipe(
  takeUntil(this.destroy$),
  switchMap((term:string) =>{
    if(term && term.length >= environment.autocomplete.fillAtLeast){
     return this.service.departurePortAutocomplete(term)
    }
    this.departurePortList = []
    this.cdf.markForCheck()
   return []
  })
).subscribe((value:any) => {
  this.departurePortList = value.data;
  this.cdf.markForCheck();
});

this.flightAutocomplete$.pipe(
  takeUntil(this.destroy$),
  switchMap((term:string)=>{
    if(term && term.length >= 2 ){
      let carriercode = this.form.get('carrierNameKey').value
      return this.service.flightAutocomplete(term,carriercode)
    }
    this.flightList = []
    this.cdf.markForCheck()
    return []
  })
).subscribe((value:any)=>{
  this.flightList = value.data
  this.cdf.markForCheck()
}) 

this.carrierCodeAutocomplete$.pipe(
  takeUntil(this.destroy$),
  switchMap((term:string)=>{
    if(term && term.length >= 2){
      return this.service.carrierCodeAutocomplete(term)
    }
    this.carrierCodeList = []
    this.cdf.markForCheck()
    return []
  })
).subscribe((value:any)=>{
  this.carrierCodeList = value.data
  this.cdf.markForCheck()

})

this.arrivalPortAutocomplete$.pipe(
  takeUntil(this.destroy$),
  switchMap((term:string)=>{
    if(term && term.length >= environment.autocomplete.fillAtLeast){
      return this.service.arrivalPortAutocomplete(term)
    }
    this.arrivalPortList =[]
    this.cdf.markForCheck()
    return []
  })
).subscribe((value:any)=>{
  this.arrivalPortList = value.data
  this.cdf.markForCheck()
})

}
 
carrierselectValue(e){
this.carrierCodeList = [];
  
}

arrivalselectValue(e){
  this.arrivalPortList =[];
}

flightselectValue(e){
  this.flightList = [];
}

departureselectValue(e){
  this.departurePortList = [];
}


}
  


