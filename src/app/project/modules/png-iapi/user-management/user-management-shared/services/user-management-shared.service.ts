import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonResponse } from '@app/common/models/common-response';
import { PermissionAirportSearchCriteria } from '../model/permission-ariport-search-criteria';
import { PermissionUserSearchCriteria } from '../model/permission-user-search-criteria';
import { PermissionGroupSearchCriteria } from '../model/permission-group-search-criteria';
import { environment } from '@evn/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementSharedService {

  constructor(private http: HttpClient) {}

  initPermission(permissionType: string, systemType: string): Observable<any> {
    if (permissionType === 'P') {
      return this.http.post(`${environment.serverUrl}user-management/permissiondialog/${systemType}/initProgramPermission`, {  });
    } else if (permissionType === 'R') {
      return this.http.post(`${environment.serverUrl}user-management/permissiondialog/${systemType}/initReportPermission`, {  });
    } else {
      return;
    }
  }

  initAirport() : Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/airportdialog/initAirportDialog`, {  });
  }

  searchAirport(criteria: PermissionAirportSearchCriteria) : Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/airportdialog/searchListAirport`, criteria);
  }

  initUser() : Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/userdialog/initUserDialog`, {  });
  }

  searchUser(criteria: PermissionUserSearchCriteria) : Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/userdialog/searchListUserDialog`, criteria);
  }

  initGroup() : Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroupdialog/initUserGroupDialog`, {  });
  }

  searchGroup(criteria: PermissionGroupSearchCriteria) : Observable<any> {
    return this.http.post(`${environment.serverUrl}user-management/usergroupdialog/searchListUserGroupDialog`, criteria);
  }

  viewLog(hiddenToken: string) {
    return this.http.get<CommonResponse>('assets/mockjson/user-management/audit-log/audit-log-view-success.json');
  }
}
