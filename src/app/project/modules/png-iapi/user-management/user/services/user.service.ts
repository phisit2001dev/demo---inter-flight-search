import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonResponse } from '@app/common/models/common-response';
import { UsersSearchCriteria } from '../model/users-search-criteria';
import { UsersAddEdit } from '../model/users-add-edit';
import { environment } from '@evn/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  initSearchPage(): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/initUser`, { });
  }

  search(criteria: UsersSearchCriteria) {
    return this.http.post(`${environment.serverUrl}user-management/user/searchUser`, criteria);
  }

  gotoAdd(): Observable<any>  {
    return this.http.post(`${environment.serverUrl}user-management/user/gotoAddUser`, {  });
  }

  gotoEdit(hiddenToken: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/gotoEditUser`, {'hiddenToken': hiddenToken});
  }

  gotoView(hiddenToken: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/gotoViewUser`, {'hiddenToken': hiddenToken});
  }

  searchPrefix(term: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}selectitem/searchPrefix`, {'term': term});
  }

  add(data: UsersAddEdit): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/addUser`, data);
  }

  edit(data: UsersAddEdit): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/editUser`, data);
  }

  updateActive(hiddenTokens: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/activeUser`, {'hiddenToken': hiddenTokens});
  }

  updateInactive(hiddenTokens: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/inactiveUser`, {'hiddenToken': hiddenTokens});
  }

  updateReady(hiddenTokens: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/readyUser`, {'hiddenToken': hiddenTokens});
  }

  updateLocked(hiddenTokens: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/lockUser`, {'hiddenToken': hiddenTokens});
  }

  /**
   * Export
   * @param critetria
   * @returns
   */
  export(criteria: UsersSearchCriteria): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/user/export`, criteria, { observe: 'response', responseType: 'arraybuffer' });
  }
}
