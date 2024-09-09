// import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from '@evn/environment';
// import { BehaviorSubject } from 'rxjs';

// export enum KeyStorage {
//   CODE_VERIFY = 'cvy',
//   STATE = 'state',
//   TOKEN_TYPE = 'Bearer',
//   ACCESS_TOKEN = 'tk',
//   REFRESH_TOKEN = 'rtk',
// }

// interface tokenStorage {
//   token: string,
//   token_type: string,
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class StorageService {
//   /**
//    * @description localStorage is a synchronous API
//    * @private
//    * @memberof StorageService
//    */
//   private storage = localStorage;
//   private isLogin$ = new BehaviorSubject<boolean>(false);

//   constructor(private httpClient: HttpClient) { }

//   /**
//    * @description set browser storage
//    * @param key
//    * @param value
//    * @returns void
//    */
//   setStorage(key: string, value: string){
//     this.storage.setItem(key, value);
//   }

//   /**
//    * @description get browser storage
//    * @param key
//    * @returns string
//    */
//   getStorage(key: string){
//     return this.storage.getItem(key);
//   }

//   /**
//    * @description clearStorage optional Target clear
//    * @param key
//    * @returns void
//    */
//   clearStorage(keyTarget?: string){
//     keyTarget ? this.storage.removeItem(keyTarget) : this.storage.clear();
//   }

//   clearBrowserALLStorage() {
//     localStorage.clear();
//     sessionStorage.clear();
//   }

//   ///////////////////////////// Profile /////////////////////////////

//   setProfile(jsonString: any){
//     this.storage.setItem(environment.keyProfile, JSON.stringify(jsonString));
//   }

//   getProfile(): string{
//       return this.storage.getItem(environment.keyProfile);
//   }

//   removeProfile(){
//     this.storage.removeItem(environment.keyProfile);
//   }

//   ///////////////////////////// generate code /////////////////////////////

//   setCodeVerify(value: string){
//     this.storage.setItem(KeyStorage.CODE_VERIFY, value);
//   }

//   getCodeVerify(){
//     return this.storage.getItem(KeyStorage.CODE_VERIFY);
//   }

//   setState(value: string){
//     this.storage.setItem(KeyStorage.STATE, value);
//   }

//   getState(){
//     return this.storage.getItem(KeyStorage.STATE);
//   }

//   ///////////////////////////// token /////////////////////////////

//   setAccessToken(access_token: string, type?: string) {
//     this.storage.setItem(KeyStorage.ACCESS_TOKEN, access_token);
//     this.storage.setItem('type', type);
//   }

//   getAccessToken(type?: string): tokenStorage {
//     return {
//       token: this.storage.getItem(KeyStorage.ACCESS_TOKEN),
//       token_type: this.storage.getItem(type ? type : 'type')
//     };
//   }

//   setRefreshToken(token: string){
//     this.storage.setItem(KeyStorage.REFRESH_TOKEN, token);
//   }

//   getRefreshToken(){
//     return this.storage.getItem(KeyStorage.REFRESH_TOKEN);
//   }

//   useRefreshToken(req: HttpRequest<any>, token?: string){
//     let retoken = token ? token : this.getRefreshToken()
//     let headers = new HttpHeaders(
//       {
//         'Content-Type': 'application/x-www-form-urlencoded'
//         , 'Authorization': 'Basic ' + btoa('client-test-2:TMBOFn0NGwc')
//       }
//     );
//     let params = new URLSearchParams();
//     params.append('grant_type','refresh_token');
//     params.append('refresh_token', retoken);
//     return this.httpClient.post(
//       `${environment.authen.tokenUrl}`,params.toString()
//       ,{headers: headers}
//     )
//     // const newReq = req.clone({headers: req.headers.set('Authorization', `${this.storage.getItem('type')} ${retoken}`)})
//   }

//   ///////////////////////////// login /////////////////////////////

//   getIsLogin(): boolean{
//     return sessionStorage.getItem(environment.keyProfile)? true : false;
//   }

//   setLoginObservable(){
//       this.isLogin$.next(true);
//   }

//   getLoginObservable(){
//     return this.isLogin$.asObservable();
//   }

// }
