import { BehaviorSubject, Observable, Subject, interval, switchMap, takeUntil } from 'rxjs';
import { CommonResponse } from '@app/common/models/common-response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private httpClient: HttpClient) {}

  logout() {
    return this.httpClient.post<CommonResponse>(
      `${environment.serverUrl}user-management/profile/logout`,
      {}
    );
  }

  // getAccessToken(authCode: string, codeVerify: string){
  //   return this.httpClient.post(
  //     `${environment.serverUrl}oauth/token`,
  //     {
  //       grantType : "authorization_code",
  //       authCode : authCode,
  //       codeVerifier : codeVerify,
  //       clientId : environment.clientId,
  //       redirectUrl : environment.redirectUri
  //     },
  //     {
  //       observe: 'response'
  //     }
  //   )
  // }

  getAccessToken(authCode: string, codeVerify: string){

    let headers = new HttpHeaders(
      {
        'Content-Type': 'application/x-www-form-urlencoded'
        , 'Authorization': 'Basic ' + btoa(`${environment.authen.clientId}:${environment.authen.secret}`)
      }
    );
    let params = new URLSearchParams();
    params.append('grant_type','authorization_code');
    params.append('code', authCode);
    params.append('redirect_uri', environment.authen.redirectUri);
    params.append('code_verifier', codeVerify);
    return this.httpClient.post(
      environment.authen.tokenUrl,
      params.toString()
      ,
      {
        headers: headers,
        observe: 'response'
      }
    )
  }

  getProfile(){
    return this.httpClient.post(
      `${environment.serverUrl}user-management/profile/init`,null
    );
  }

  getDialogUpdateVersion(){
    return this.httpClient.post(
      `${environment.serverUrl}user-management/profile/changelog`,null,{responseType : 'text'}
    );
  }
  
}
