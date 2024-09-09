import { Component, ChangeDetectionStrategy, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { ConfirmDialog } from '@app/project/shared/components/confirm-dialog/models/confirm-dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { ConfirmDialogComponent } from '@app/project/shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { AuthQuery } from '@app/project/core/state';
import { Router } from '@angular/router';
import { ManualDetectionService } from '@app/project/shared/service/manual-detection.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { SITValidators } from '@app/project/core/validators/sit.validator';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CustomNativeDateAdapter, CUSTOMS_DATE_FORMATS } from '@app/project/shared/directives/date-picker.directive';

@Component({
  selector: 'app-add-remark-dialog',
  templateUrl: './add-remark-dialog.component.html',
  styleUrls: ['./add-remark-dialog.component.scss'],
  providers: [ManualDetectionService,
    {
      provide: DateAdapter,
      useClass: CustomNativeDateAdapter,
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: CUSTOMS_DATE_FORMATS,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddRemarkDialogComponent extends AbstractComponent implements OnDestroy {

  form: FormGroup;
  translateSub: Subscription;
  
  constructor(
    protected snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    protected mds$: ManualDetectionService,
    private spinner: SpinnerService,
    protected authQuery: AuthQuery,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    super(snackbarService, dialog, spinner, mds$, translate, authQuery);

    this.form = this.formBuilder.group({
      updateDate: ['' , {updateOn: 'blur', validators: SITValidators.isRequire}],
      remark: ['' , {updateOn: 'blur'}]
    });
  }

  ngOnDestroy() {
    if (this.translateSub) { this.translateSub.unsubscribe(); }
  }

  save() {
    if (this.form.invalid) {
      this.snackbarService.open(this.translate.instant('10004'), "W");
      this.form.markAllAsTouched();
      this.mds$.getNext();
      return;
    }

    this.dialogRef.close(this.form);
  }

  close(): void {
    this.dialogRef.close();
  }
}