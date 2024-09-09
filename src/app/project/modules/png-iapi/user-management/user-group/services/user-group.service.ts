import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserGroupSearchCriteria } from '../models/user-group-search-criteria';
import { CommonResponse } from '@app/common/models/common-response';
import { UserGroupAddEdit } from '../models/user-group-add-edit';
import { environment } from '@evn/environment';

@Injectable({
  providedIn: 'root'
})
export class UserGroupService {

  constructor(private http: HttpClient) {}

  initSearchPage(): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/initGroup`, { });
  }

  search(criteria: UserGroupSearchCriteria) {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/searchGroup`, criteria);
  }
  
  gotoAdd(): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/gotoAddGroup`, { });
  }

  gotoEdit(hiddenToken: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/gotoEditGroup`, {'hiddenToken': hiddenToken});
  }

  gotoView(hiddenToken: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/gotoViewGroup`, {'hiddenToken': hiddenToken});
  }

  add(data: UserGroupAddEdit): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/addGroup`, data);
  }

  edit(data: UserGroupAddEdit): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/editGroup`, data);
  }

  updateActive(hiddenTokens: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/activeGroup`, {'hiddenToken': hiddenTokens});
  }

  updateInactive(hiddenTokens: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroup/inactiveGroup`, {'hiddenToken': hiddenTokens});
  }

  mockErrorJson(): Observable<any> {
    return this.http.get('assets/mockjson/validate-api/mock-resp-error-ele.json');
  }
  mocksuccessJson(): Observable<any> {
    return this.http.get('assets/mockjson/validate-api/mock-resp-compl-ele.json');
  }
  mockAutoJson(): Observable<any> {
    return this.http.get('assets/mockjson/mockTestAutoComplete.json');
  }
}
