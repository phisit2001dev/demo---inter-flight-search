import { ActivatedRoute, Router, Routes } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Pipe } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthQuery } from '@app/project/core/state';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { TranslateService } from '@ngx-translate/core';
import { Permission } from '@app/common/models/permission';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { environment } from '@evn/environment';
import { AirCarrierService } from '../../service/air-carrier.service';
import { SITValidators } from '@app/project/core/validators/sit.validator';


@Component({
  selector: 'app-air-carrirer-add-edit',
  templateUrl: './air-carrirer-add-edit.component.html',
  styleUrls: ['./air-carrirer-add-edit.component.scss'],
  providers:[ManualDetectionService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirCarrirerAddEditComponent extends AbstractComponent implements OnInit ,OnDestroy,AfterViewInit {


constructor(protected dialog: MatDialog,
  protected snackbarService: SnackbarService,
  protected translate: TranslateService,
  protected authQuery: AuthQuery,
  protected mds$:ManualDetectionService,
  protected spinner:SpinnerService,
  private route: ActivatedRoute,
  private cdf: ChangeDetectorRef,
  private service:AirCarrierService,
  private formBuilder: FormBuilder,
  private router: Router,
){
super(snackbarService, dialog, spinner, mds$, translate, authQuery)
}
  form: FormGroup;
  initialData: any;
  airCarrier:any;
  permission: Permission;
  countryNameList = [];
  countryNameAutocomplete$ = new Subject();
  transaction:any
  page:any
  listCarrierTypeRadio=[]
  ngOnInit(): void {
    super.onInitial();
    
    this.initialData = this.route.snapshot.data.init.payload;
    this.permission = this.initialData?.permission;
    this.airCarrier = this.initialData?.airCarrier;
    this.transaction = this.airCarrier.transaction;
    this.page =  this.route.snapshot.data.init.page;
    this.listCarrierTypeRadio = this.initialData?.listCarrierType??[];
    this.countryNameAutocomplete();
    this.initialForm();
  }
  ngOnDestroy(): void {
    super.onDestroy();
    this.mds$.destroy();
  }

  ngAfterViewInit(): void {
    this.spinner.hide()
  }

  countryNameAutocomplete(){
    this.countryNameAutocomplete$.pipe(takeUntil(this.destroy$),switchMap((term:string) =>{
      if(term && term.trim().length >= environment.autocomplete.fillAtLeast){
        return this.service.searchCountry(term)
      }
      else{
        this.countryNameList =[]
        this.cdf.markForCheck();
        return [];
      }
    })).subscribe(value=>{
      this.countryNameList = value.data;
      this.cdf.markForCheck();
    })
  }



  initialForm(){
    const validate = { updateOn: 'blur', validators: SITValidators.isRequire };
    this.form = this.formBuilder.group({
      carrierCodeIata:[this.airCarrier?.carrierCodeIata??'',validate],
      carrierCodeIcao:[this.airCarrier?.carrierCodeIcao??''],
      carrierName:[this.airCarrier?.carrierName??'',validate],
      carrierType:[this.airCarrier?.carrierType],
      activeStatus:[this.airCarrier?.activeStatus == "Y" ? true : false],
      countryName:[this.airCarrier?.countryName??'',validate],
      countryCode:[this.airCarrier?.countryCode??'',validate],
      remark:[this.airCarrier?.remark??'',validate],
      hiddenToken:[this.airCarrier?.hiddenToken],
    })
    if(this.page =='add'){
      this.form.get('remark').disable()
      this.form.get('hiddenToken').disable()
    }
  }

  save(){
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
      this.service.addAirCarrier(this.prepareFormData()).pipe(takeUntil(this.destroy$)).subscribe((resp) => {
        this.handleResponse(resp); // Show snackbar and clear validat.

        if (resp?.displayStatus === 'S') {
          this.form.reset(); //แก้ไขการรับ 
        }

        this.spinner.hide();  // Hide spinner.
      
      });
    }
  });
}
  edit() {
    if (this.form.invalid) {  /// Check invalid
      this.form.markAllAsTouched();
      this.mds$.getNext();
      this.snackbarService.open(this.translate.instant('10002'), "W");
      return;
    }

    /// Open confirm dialog
    this.openConfirm('50004').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((confirm) => {
      if (confirm) {
        this.spinner.show();  // Show spinner.

        /// Call API.
        this.service.editAirCarrier(this.prepareFormData()).pipe(takeUntil(this.destroy$)).subscribe((resp) => {
          this.handleResponse(resp);  // Show snackbar.

          if (resp?.displayStatus === 'S') {
            this.router.navigate(['/iapi/master-data/airCarrier/search'],{relativeTo: this.route});

          } else {
            
            this.spinner.hide();  // Hide spinner.
        
          }
        });
      }
    });
  }


  private prepareFormData() {
    let formData:any = this.form.value
    return formData
  }

  cancel() {
    this.openConfirm('50010').afterClosed().pipe(takeUntil(this.destroy$)).subscribe((confirm) => {
      if (confirm) {
        this.router.navigate(['/iapi/master-data/airCarrier/search'],{relativeTo: this.route});
      }
    });
  }

}
