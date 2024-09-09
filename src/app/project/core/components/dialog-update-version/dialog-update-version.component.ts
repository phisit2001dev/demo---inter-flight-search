import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { environment } from '@evn/environment';

@Component({
  selector: 'app-dialog-update-version',
  templateUrl: './dialog-update-version.component.html',
  styleUrls: ['./dialog-update-version.component.scss'],
})
export class DialogUpdateVersionComponent implements OnInit {
  // html: SafeStyle = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogUpdateVersionComponent>,
    public dialog: MatDialog
  ) // public sanitizer: DomSanitizer,
  {
    this.dialogRef.disableClose = true;
    this.dialogRef._containerInstance._config.autoFocus = false;
    this.dialogRef.addPanelClass('dialogUpdateVersion');
  }

  ngOnInit(): void {
    // console.log(this.data);
    // this.html = this.sanitizer.bypassSecurityTrustHtml(this.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openLink() {
    window.open(environment.historyUrl, '_blank');
  }
}
