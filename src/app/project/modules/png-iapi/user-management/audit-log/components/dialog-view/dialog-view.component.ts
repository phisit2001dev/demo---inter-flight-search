import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view',
  templateUrl: './dialog-view.component.html',
  styleUrls: ['./dialog-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogViewComponent {


  constructor(public dialogRef: MatDialogRef<DialogViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){ // ปิด dialog โดยกดนอกจาก dialog

  }
  closeDialog(): void {
    this.dialogRef.close("555")
   
  }



}
