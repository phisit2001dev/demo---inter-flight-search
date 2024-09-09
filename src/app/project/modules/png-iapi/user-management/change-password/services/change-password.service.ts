import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonResponse } from '@app/common/models/common-response';
import { environment } from '@evn/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private http: HttpClient) { }

  initChangePwd(renewPwdKey): Observable<any> {
    return this.http.post<CommonResponse>(
      `${environment.serverUrl}user-management/changepassword/initChangePassword`,
      {renewPwdKey: renewPwdKey}
    );
  }

  changePwd(reNewKey,password): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${environment.serverUrl}user-management/changepassword/changePassword`,
      {
        renewPwdKey : reNewKey,
        password : password
      }
    );
  }
}
