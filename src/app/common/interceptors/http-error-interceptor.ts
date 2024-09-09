import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SpinnerService } from '@app/project/core/services/spinner.service';
import { AuthStateService } from '@app/project/core/state';
import { Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AuthService } from '../../project/core/services/auth.service';
import { SnackbarService } from '../../project/core/services/snackbar.service';
import { AppError } from '../errors/app-error';
import { BadInput } from '../errors/bad-input';
import { NotFoundError } from '../errors/not-found-error';
import { CommonResponse } from './../models/common-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { ForbiddenError } from '../errors/forbidden-error';

@Injectable()
export class ErrorHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private autheStateService: AuthStateService,
    private snackBarService: SnackbarService,
    private navService: MainNavService,
    private spinnerService: SpinnerService,
    private sessionStorageService: SessionStorageService,
    private snackBar: MatSnackBar

  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((httpError) => {
        // ปิด spinner
        this.spinnerService.hide();
        // ไม่แสดง process not complete
        this.navService.isLogout = true;
        if (httpError instanceof HttpErrorResponse) {
          // เพิ่มเงื่อนไขสำหรับกรณีฟังก์ชัน Export จะมีการกำหนด responseType เป็น arraybuffer จึงต้องทำการ Convert ให้เป็น JSON เพื่อดึงค่าใช้งาน
          const commonResp: CommonResponse = req.responseType == 'arraybuffer' ? JSON.parse(new TextDecoder().decode(httpError.error)) : httpError.error ;

          if (httpError.status === 400) {
            this.snackBarService.open(
              commonResp.messageDesc,
              commonResp.displayStatus
            );

            this.router.navigateByUrl('/login');
            return throwError(new BadInput(httpError));
          }

          if (httpError.status === 401) {
            this.sessionStorageService.clearBrowserStorage();
            this.router.navigateByUrl('/login');
            return throwError(new UnauthorizedError(httpError));
          }

          // Authentication failed
          if (httpError.status === 403) {
              this.router.navigateByUrl('/home').finally(() => {
                this.snackBarService.open(
                  commonResp.messageDesc,
                  commonResp.displayStatus
                );
              }
            );
          }

          // Authorization failed
          if (httpError.status === 404) {
            // Module กลาง > กรณี HTTP 404 Snackbar เป็นสีดำ ไม่มี Message แสดง
            // this.snackBarService.open(
            //   commonResp.messageDesc,
            //   httpError.error.displayStatus
            // );
            this.router.navigateByUrl('/home');
            return throwError(new NotFoundError(httpError));
          }

          // แสดง snackbar โดยใช้ message ที่ได้จาก httpError และ เพิ่ม class err-wordbreak-snackBar เพื่อให้ตัดบรรทัดให้ message
          this.snackBarService.openSnackBarErrorWithClass(this.manageMessageError(req, httpError), 'err-wordbreak-snackBar');

          return throwError(new AppError(httpError));
        }
      })
    );
  }

  // ลบ url ของ request ออก
  private manageMessageError(req: HttpRequest<any>,httpError: HttpErrorResponse){
    // ตรวจสอบ url จาก req.urlWithParams เนื่องจากมี query param อยู่
    if(req.urlWithParams.indexOf("submitId") !== -1){
      return httpError.message.replace(httpError.url , req.urlWithParams.substring(req.urlWithParams.indexOf("submitId")));
    } else {
      return httpError.message.replace(httpError.url , "");
    }
  }
}
