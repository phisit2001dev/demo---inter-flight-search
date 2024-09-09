import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@evn/environment';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';

export class HttpReqInterceptor implements HttpInterceptor {
  constructor(private sessionStorageService: SessionStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // tslint:disable-next-line: curly
    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json'),
      });
    } else if (
      req.headers.get('Content-Type').indexOf('multipart/form-data') !== -1
    ) {
      req = req.clone({ headers: req.headers.delete('Content-Type') });
    }

    // if (this.sessionStorageService.getCrossCheckKey()) {
    //   req = req.clone({
    //     headers: req.headers.set(
    //       environment.crossCheckKey,
    //       this.sessionStorageService.getCrossCheckKey()
    //     ),
    //   });
    // }
    // case escape characters autocomplete
    if (req.method === 'GET') {
      const paramsKeys = req.params;
      if (paramsKeys.keys().length > 0) {
        // tslint:disable-next-line:prefer-const
        let param = new HttpParams();
        paramsKeys.keys().forEach((key, index) => {
          param = param.set(key, encodeURIComponent(paramsKeys.get(key)));
        });
        req = req.clone({ params: param });
      }
    }

    // เพิ่ม param submitId สำหรับหรับทุก Reques
    let params = req.params;
    const randomFac = Math.random().toString(36); // แปลงเป็นฐาน 36
    params = params.set(
      'submitId',
      (+new Date()).toString(36) + randomFac.substr(2) // แปลง date มาบวกกับตัวเลขที่ random มาโดยตัด position แรกอออก
    );
    req = req.clone({ params });

    req = req.clone({ withCredentials: true });

    return next.handle(req);
  }
}
