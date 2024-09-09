import {
  HttpClient, HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { AbstractComponent } from '@app/abstracts/abstract-component';
import { CommonResponse } from '@app/common/models/common-response';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { environment } from '@evn/environment';
import { Observable, delay } from 'rxjs';
import { AlertDialogComponent } from '../components/alert-dialog/alert-dialog.component';
import { AlertDialogData } from '../components/alert-dialog/models/alert-dialog-data';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialog } from '../components/confirm-dialog/models/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class InputFilesService{
  constructor(
    private http: HttpClient,
    protected snackbar: SnackbarService,
    protected dialog: MatDialog,
    protected spinner: SpinnerService,
  ) {}

  headers = {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  };
  upload(file: FormData, route: string): Observable<any> {
    // if have new path
    // const Route = route ? route : 'api/attachment/upload';
    //this.http.get('assets/mockjson/mockTestAutoComplete.json')

    return this.http.post(
      environment.serverUrl + route,
      file,
      { reportProgress: true, observe: 'events', headers: this.headers }
    );

    // return this.http.get(route);
  }
  uploadCustom(file: FormData, route: string): Observable<any> {
    return this.http.post(environment.serverUrl + route, file, {
      reportProgress: true,
      observe: 'events',
      headers: this.headers,
    });
  }
  viewFile(url, route?: string) {
    const param = new HttpParams().append('rep', url);
    // if have new path
    return this.http.get(environment.serverUrl + route, {
      params: param,
      observe: 'response',
      responseType: 'arraybuffer',
    });
  }
  viewFileCustom(url, route: string) {
    const param = new HttpParams().append('rep', url);
    return this.http.get(environment.serverUrl + route, {
      params: param,
      observe: 'response',
      responseType: 'arraybuffer',
    });
  }
  openFile(resp, component?) {
    const getType = resp.headers.getAll('content-type')[0];
    // error
    if (getType === 'application/json') {
      const obj = JSON.parse(new TextDecoder().decode(resp.body));

      // เพิ่มเงื่อนไขกรณีส่ง Component เพื่อต้องการ Handle response เอง
      component ? component.handleResponse(obj) : this.handleResponse(obj);

      return false;
      // if server cant get MIME type
    } else if (getType === 'application/octet-stream') {
      // Decode resp.headers from UTF-8 to String
      const fileName = decodeURIComponent(this.getFileName(resp.headers));
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      a.download = fileName;
      const file = new Blob([resp.body], { type: getType });
      a.href = URL.createObjectURL(file);
      a.target = '_blank';
      a.click();
      document.body.removeChild(a);
    } else {
      const file = new Blob([resp.body], { type: getType });
      const fileURL = window.URL.createObjectURL(file);
      const newWindow = window.open(fileURL);
    }
  }

  openBlobFile(blob) {
    if (blob.type?.startsWith('application')) {
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none;');
      a.setAttribute('style', 'display:none;');
      document.body.appendChild(a);
      const fileName = blob.name;
      a.download = fileName;
      a.href = URL.createObjectURL(blob);
      a.target = '_blank';
      a.click();
      document.body.removeChild(a);
    } else {
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL);
    }

    // const getType = resp.headers.getAll('content-type')[0];
    // // error
    // if (getType === 'application/json') {
    //   const obj = JSON.parse(new TextDecoder().decode(resp.body));
    //   this.handleResponse(obj);
    //   return false;
    //   // if server cant get MIME type
    // } else if (getType === 'application/octet-stream') {
    //   // Decode resp.headers from UTF-8 to String
    //   const fileName = decodeURIComponent(this.getFileName(resp.headers));
    //   const a = document.createElement('a');
    //   a.setAttribute('style', 'display:none;');
    //   document.body.appendChild(a);
    //   a.download = fileName;
    //   const file = new Blob([resp.body], { type: getType });
    //   a.href = URL.createObjectURL(file);
    //   a.target = '_blank';
    //   a.click();
    //   document.body.removeChild(a);
    // } else {
    //   const file = new Blob([resp.body], { type: getType });
    //   const fileURL = window.URL.createObjectURL(file);
    //   const newWindow = window.open(fileURL);
    // }
  }

  private getFileName(headers: HttpHeaders) {
    const disposition = headers.get('content-disposition');
    if (disposition && disposition.indexOf('attachment') !== -1) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return 'null';
  }

  checkTypeFile(fileName: string) {
    return fileName.split('.').pop();
  }

    handleResponse(
    payload: CommonResponse,
    byPassSpinner?: boolean
  ): MatSnackBarRef<any> | MatDialogRef<any, any> {
    const title = payload.messageDesc;
    let status = payload.error ? 'E' : payload.displayStatus;
    // add check if warning status set fromdisplayStatus
    if (payload.displayStatus !== 'E') {
      status = payload.displayStatus;
    }
    // Alert Dialog
    if (payload.componentType === 'A') {
      const data: AlertDialogData = {
        title,
        description: payload.messageDesc ? payload.messageDesc : '',
        closeLabel: 'Close',
        type: status,
      };

      return this.dialog.open<AlertDialogComponent, AlertDialogData, void>(
        AlertDialogComponent,
        {
          disableClose: false,
          data,
        }
      );

      // Confirm Dialog
    } else if (payload.componentType === 'C') {
      // console.log('type CCC');
      const data: ConfirmDialog = {
        // header: title,
        description: title,
        cancelText: 'No',
        confirmText: 'Yes',
      };

      return this.dialog.open<ConfirmDialogComponent, ConfirmDialog, boolean>(
        ConfirmDialogComponent,
        {
          disableClose: false,
          data,
        }
      );

      // SnackBar
    } else {
      if (payload.messageCode === 'X00000') {
        return;
      } else {
        return this.snackbar.open(title, status, byPassSpinner);
      }
    }
  }
}
