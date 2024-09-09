import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonResponse } from '@app/common/models/common-response';
import { environment } from '@evn/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private http: HttpClient) { }

  forgotPwd(email): Observable<CommonResponse> {
    return this.http.post<CommonResponse>(
      `${environment.serverUrl}user-management/user/forgotPassword`,
      {email : email}
    );
  }
}
