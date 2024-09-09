import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@evn/environment';
import { AuditLogSearch } from '../models/audit-log-search';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {

  constructor(private http:HttpClient) { }

  initSearch():Observable<any>{
    return this.http.post(`${environment.serverUrl}user-management/auditlog/initAuditLog`,{})
  }

  functionSelect(hiddenToken:any):Observable<any>{
    return this.http.post(`${environment.serverUrl}selectitem/searchFunction`,{'hiddenToken': hiddenToken})
  }

  gotoViewAuditLog(hiddenToken:any):Observable<any>{
    return this.http.post(`${environment.serverUrl}user-management/auditlog/gotoViewAuditLog`,{'hiddenToken': hiddenToken})
  }

  search(criteria:AuditLogSearch):Observable<any>{
    
    return this.http.post(`${environment.serverUrl}user-management/auditlog/searchAuditLog`,criteria)
   }

}
