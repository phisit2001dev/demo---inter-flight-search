import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonResponse } from '@app/common/models/common-response';
import { environment } from '@evn/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(
    private http: HttpClient
  ) { }

  initForgotPwd(): Observable<CommonResponse> {
    return this.http.get<CommonResponse>('assets/mockjson/ioc/change-password/init.json');
  }

  initResetPwd(): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${environment.serverUrl}user-management/profile/initSetting`,
      {}
    );
  }

  forgotPwd(email): Observable<CommonResponse> {
    return this.http.get<CommonResponse>('assets/mockjson/ioc/change-password/resetPasswordSuccess.json', {});
  }

  changePwd(password): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${environment.serverUrl}user-management/profile/savePassword`,
      {'password' : password}
    );
  }

  changeTimeZone(timeZone) : Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${environment.serverUrl}user-management/profile/saveTimezone`,
      {'timezone' : timeZone}
    );
  }

  logout() {
    return this.http.post<CommonResponse>(
      `${environment.serverUrl}user-management/profile/logout`,
      {}
    );
  }
}
