import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { FormGroup } from '@angular/forms';
import { Permission } from '@app/common/models/permission';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { environment } from '@evn/environment';
import { InterAirCarrierEngagementService } from '../../service/inter-air-carrier-engagement.service';
import { FileData } from '@app/project/shared/models/file-data';

@Component({
  selector: 'app-carrier-engagement-add-edit-view-criteria',
  templateUrl: './carrier-engagement-add-edit-view-criteria.component.html',
  styleUrls: ['./carrier-engagement-add-edit-view-criteria.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarrierEngagementAddEditViewCriteriaComponent extends AbstractComponent implements OnInit, AfterViewInit, OnDestroy{

  carrierCodeList = [];
  carrierCodeAutocomplete$ = new Subject();

  disableCutoverDate = false;

  fileData: any;

  readOnlyView = false;
  routeUpload: string = 'assets/mockjson/csc/carrier-engagement/mockUploadSuccess.json'
  routeView: string = 'assets/mockjson/csc/carrier-engagement/mockUploadSuccess.json'
  
  @Input() form: FormGroup;
  @Input() payload: any;
  @Input() permission: Permission;
  @Input() disabledPage: boolean;
  @Input() page: string;
  
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

  ngOnInit() {
    super.onInitial();
    this.initAutocomplete();

    // set defaule radio
    if(this.page=='A'){
      this.form.get('status').setValue('In-process');
    }
    this.disableCutoverDate = this.form.get('status').value == 'In-process';
  }

  ngAfterViewInit() {
    /// Searched
    this.spinner.hide();
  }

  ngOnDestroy() {
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

  statusChange(){
    this.disableCutoverDate = this.form.get('status').value == 'Completed';
  }

  getFileChange(e: FileData) {
    this.form.get('serviceFormFileName').setValue(e.fileName);
    this.form.get('serviceFormFilePath').setValue(e.filePath);
    this.form.get('transMasId').setValue(e.fileId);
  }
}
