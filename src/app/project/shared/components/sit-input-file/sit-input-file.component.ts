import { SnackbarService } from '@app/project/core/services/snackbar.service';

import { HttpEventType } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_FORM_FIELD } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonResponse } from '@app/common/models/common-response';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { FileData } from '../../models/file-data';
import { InputFilesService } from '../../service/input-files.service';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { AlertDialogData } from '../alert-dialog/models/alert-dialog-data';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ConfirmDialog } from '../confirm-dialog/models/confirm-dialog';
@Component({
  selector: 'sit-input-files',
  templateUrl: './sit-input-file.component.html',
  styleUrls: ['./sit-input-file.component.scss'],
})
export class SitInputFileComponent implements OnInit, OnChanges {
  // tslint:disable-next-line: no-input-rename
  fileTemp: any;
  fileData: FileData = {};
  destroySub$: Subject<any> = new Subject();
  @Input('acceptFileType') acceptFileType: string;
  upLoadResp;
  // tslint:disable-next-line: no-input-rename
  @Input('ControlFileName') ControlFileName: FormControl = new FormControl();
  // tslint:disable-next-line:no-input-rename
  @Input('ControlFilePath') ControlFilePath: FormControl = new FormControl();
  @Input() disableBtn = false;
  @Input() hideBtn = false;
  @Input() clear = false;
  @Input() fileName: string;
  @Input() filePath: string;
  @Input() view = false;
  // route for upload
  @Input() route: string;
  // route for ViewFile
  @Input() routeView: string;
  form: FormGroup;
  newWindow;
  sameFileSkip = false;
  progress = 0;
  error = false;
  // IMAGE_MAXSIZE = 1048576;  // 1 MB
  IMAGE_MAXSIZE = 10485760;  // 10 MB
  showProgress = false;
  isNewUpload = false;
  @Output() fileChange = new EventEmitter<FileData>();
  @ViewChild('file') input: ElementRef;
  @ViewChild(MAT_FORM_FIELD, {static: false, read: ElementRef}) formElement: ElementRef;
  constructor(
    private service: InputFilesService,
    public translate: TranslateService,
    public formBuilder: FormBuilder,
    private snackbar: SnackbarService,
    private dialog: MatDialog,
    private matSnackBar: MatSnackBar,
    private abstractSpinner: SpinnerService,

  ) {
  }

  ngOnInit(): void {
    this.initData();
    this.ControlFileName.valueChanges.pipe(takeUntil(this.destroySub$)).subscribe(change => {
      if (!change) {
        this.isNewUpload = false;
        this.input.nativeElement.value = ''
        this.fileData = {};
        this.fileTemp = null;
      }
    })
  }
  initData() {
    if (this.fileName && this.filePath) {
      this.fileData.fileName = this.fileName;
      this.fileData.filePath = this.filePath;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.fileName && changes.filePath) {
      if (!changes.fileName.firstChange && !changes.filePath.firstChange ) {
        this.fileData.fileName = this.fileName;
        this.fileData.filePath = this.filePath;
      }
    }
    if (this.clear) {
      this.resetTemp();
      this.clear = false;
    }
  }
  onFileChange(event: any) {
    // console.log(event.target.files && event.target.files[0]);
    if (event.target.files && event.target.files[0]) {
      if (
        this.fileTemp &&
        event.target.files[0].lastModified === this.fileTemp.lastModified &&
        event.target.files[0].name === this.fileTemp.name &&
        event.target.files[0].size === this.fileTemp.size &&
        event.target.files[0].type === this.fileTemp.type
      ) {
          // console.log('same file');
          // FIXME
          return;
      }
      // หา Type file
      const typeFile = this.checkTypeFile(event.target.files[0].name);
      if (
        this.acceptFileType
          .toUpperCase()
          .indexOf('.' + typeFile.toUpperCase()) === -1
      ) {
        // "10055": "The file types allowed for upload are xxx",
        // const filetypeApv = this.acceptFileType.split(',');
        const filetypeApv = this.acceptFileType.replace(/[,]/g, ', ');
        const msg = this.translate.instant('10055').replace('xxx', filetypeApv);
        this.snackbar.open(msg, 'W');
        this.resetTemp();
        return;
      }
      if (event.target.files[0].size < this.IMAGE_MAXSIZE) {
        // if (event.target.files[0].type !== 'application/pdf') {
        const reader = new FileReader();
        let blob;
        if (event.target.files[0].type !== 'application/pdf') {
          blob = new Blob([event.target.files[0]], {
            type: event.target.files[0].type,
          });
        } else {
          blob = new Blob([event.target.files[0]], {
            type: 'application/pdf',
          });
        }
        const fileSize = event.target.files[0].size;
        reader.readAsArrayBuffer(event.target.files[0]);
        this.fileTemp = event.target.files[0];
        this.fileData.fileName = event.target.files[0].name; // set ชื่อไฟล์ ใหม่
        this.fileData.fileSize = fileSize; // filesize size
        this.fileData.blobFileEdit = blob;
        this.isNewUpload = true;

      } else {
        // over 10MB
        // "10054": "Maximum allowed size for upload is xxx"
        this.resetTemp();
        const msg = this.translate.instant('10054').replace('xxx', '1 MB');
        this.snackbar.open(msg, 'W');
        return null;
      }
      const input = new FormData();
      input.append('jsonReq', '{}');
      input.append(
        'fileAtt',
        this.fileData.blobFileEdit,
        this.fileData.fileName
      );
      // tslint:disable-next-line:no-shadowed-variable
      this.service.upload(input, this.route).subscribe((event) => {
        switch (event.type) {
          case HttpEventType.Sent:
            this.showProgress = true;
            break;
          case HttpEventType.ResponseHeader:
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;
          case HttpEventType.Response:
            if (event.body) {
              //console.log(event.body);
              if (event.body.displayStatus === 'S') {
                const rep = event.body.data.rep;
                const id = event.body.data.id;
                this.fileData.filePath = rep;
                this.fileData.fileId = id;
                this.fileChange.emit(this.fileData);
                this.error = false;
                // console.log(this.fileData);
              }else{
                this.service.handleResponse(event.body);
                this.resetTemp();
                this.error = true;
              }
            }
            this.progress = 0;
            this.showProgress = false;
        }
      }
      , (err) => {
        this.progress = 0;
        this.showProgress = false;
        this.resetTemp();
        // กรณีไม่มี originalError จะเอา err.message มาแสดง
        this.matSnackBar.open(err.originalError ? err.originalError.message : err.message
          , 'X', this.addPanelClass('errUpload-snackBar', this.snackbar.getErrorConfig()));
        // ห้ามลบ แสดง err เพื่อการตรวจสอบแก้ไขปัญหา
        console.log(err);
      }
      );
    }
  }
  /**
   * // add PanelClass custom in getErrorConfig()
   * @param className
   * @param snackBarConfig
   * @returns MatSnackBarConfig
   */
  addPanelClass(className: string, snackBarConfig: MatSnackBarConfig){
    const config: any = snackBarConfig;
    // check type string
    if (typeof(config.panelClass) === 'string') {
      config.panelClass = [config.panelClass, className];
    } else {
    // check type array
      config.panelClass ? config.panelClass.push(className) :
      config.panelClass = className;
    }
    return (config as MatSnackBarConfig);
  }

  resetTemp(){
    this.fileData = {};
    this.fileTemp = null;
    this.isNewUpload = false;
    this.ControlFileName.setValue(null);
    this.ControlFilePath.setValue(null);
    if (this.input.nativeElement.value) {
      this.input.nativeElement.value = null;
    }
  }

  viewFile(file) {
    if (file) {
      if (this.isNewUpload) {
        this.service.openBlobFile(this.fileTemp);
      }else {
        this.service
          .viewFile(this.fileData.filePath, this.routeView)
          .pipe(take(1))
          .subscribe((resp) => {
            this.service.openFile(resp);
          });
      }
    }
  }

  valueProgress() {
    if (!this.showProgress && !this.error) {
      return this.fileData.fileName;
    }
  }
  checkTypeFile(fileName: string) {
    return fileName.split('.').pop();
  }


  createBlobViewFile(file){
    let blob;
    if (file.type !== 'application/pdf') {
      blob = new Blob([file], {
        type: file.type,
      });
    } else {
      blob = new Blob([file], {
        type: 'application/pdf',
      });
    }
    return blob;
  }

}
