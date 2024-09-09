import { Component, Inject, OnInit } from '@angular/core';
import { AlertDialogData } from '@app/project/shared/components/alert-dialog/models/alert-dialog-data';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss'],
})
export class AlertDialogComponent implements OnInit {
  constructor(
    private _dialogRef: MatDialogRef<AlertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {}

  data: AlertDialogData;

  ngOnInit() {

    this.dialogRef.disableClose = true;
    this.data = { ...this._data };

    if (!this.data.closeLabel) {
      this.data.closeLabel = 'Close';
    }
    if (!this.data.description) {
      this.data.description = 'undefined';
    }
  }

  get dialogRef() {
    return this._dialogRef;
  }
}
