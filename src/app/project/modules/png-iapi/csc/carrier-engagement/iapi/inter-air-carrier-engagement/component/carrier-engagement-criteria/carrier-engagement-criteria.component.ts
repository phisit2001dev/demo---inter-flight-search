import { Component, ChangeDetectionStrategy, OnInit, AfterViewInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { AuthQuery } from '@app/project/core/state';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { Permission } from '@app/common/models/permission';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { environment } from '@evn/environment';
import { InterAirCarrierEngagementService } from '../../service/inter-air-carrier-engagement.service';

@Component({
  selector: 'app-carrier-engagement-criteria',
  templateUrl: './carrier-engagement-criteria.component.html',
  styleUrls: ['./carrier-engagement-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarrierEngagementCriteriaComponent extends AbstractComponent  implements OnInit, AfterViewInit, OnDestroy{

  carrierCodeList = [];
  carrierCodeAutocomplete$ = new Subject();

  @Input() form: FormGroup;
  @Input() payload: any;
  @Input() permission: Permission;
  @Input() hiddenToken: string;
  @Output() btnSearch = new EventEmitter();
  @Output() btnClear = new EventEmitter();
  @Output() btnAdd = new EventEmitter();

  constructor(
    protected dialog: MatDialog,
    protected snackbarService: SnackbarService,
    protected translate: TranslateService,
    protected authQuery: AuthQuery,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    private service: InterAirCarrierEngagementService,
    private cdf: ChangeDetectorRef,
  ) {
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);
  }

  ngOnInit(): void {
    super.onInitial();
    this.initAutocomplete();
  }
  

  ngAfterViewInit(): void {
    this.spinner.hide();
  }

  ngOnDestroy(): void {
    super.onDestroy();
  }

  initAutocomplete() {
    // Nationality Autocomplete
    this.carrierCodeAutocomplete$.pipe(
     takeUntil(this.destroy$),
     switchMap((term: string) => {
       // FIX fillAtLeast = 1
       if (term && term.length >= environment.autocomplete.fillAtLeast) {
         return this.service.mockCarrierCodeSelectItem()
       }
       this.carrierCodeList = [];
       this.cdf.markForCheck();
       return [];
     })
     ).subscribe((value:any) => {
       this.carrierCodeList = value;
       this.cdf.markForCheck();
     }
   );
 }

  search() {
    this.btnSearch.emit();
  }

  clear(): void {
    this.btnClear.emit();
  }

  gotoAdd(): void {
    this.btnAdd.emit();
  }
}
