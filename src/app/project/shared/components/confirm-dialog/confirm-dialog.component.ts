import { ConfirmDialog } from '@app/project/shared/components/confirm-dialog/models/confirm-dialog';
import { Component, Inject, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnDestroy {

  option: ConfirmDialog = {
    header: 'Confirm Message',
    description: 'Default content',
    cancelText: 'cancel',
    confirmText: 'confirm',
    actionColor: 'primary',
  };
  translateSub: Subscription;
  language$;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialog
  ) {
    this.dialogRef.disableClose = true;
    this.dialogRef.addPanelClass('sit-dialog');
    if (data) {
      this.option = { ...this.option, ...data };
    }
    this.translate.get('cancel').subscribe((value) => {
      this.option.cancelText = value;
    });
    this.translate.get('ok').subscribe((value) => {
      this.option.confirmText = value;
    });
  }
  ngOnDestroy() {
    if (this.translateSub) { this.translateSub.unsubscribe(); }
  }
}
