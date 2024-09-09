import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@evn/environment';
import { Observable } from 'rxjs';
import { Prefix } from '../models/prefix';
import { PrefixSearchCriteria } from '../models/prefix-criteria';

@Injectable({
  providedIn: 'root'
})
export class PrefixService {

  constructor(private http: HttpClient) { }

  /**
   * Init search
   */
  init(): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/prefix/initSearch`, null);
  }

  /**
   * Goto add
   */
  initAdd(): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/prefix/gotoAddPrefix`, null);
  }

  /**
   * Search
   * @param critetria
   */
  search(critetria: PrefixSearchCriteria): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/prefix/search`, critetria);
  }

  /**
   * Search by id
   */
  searchById(id: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/prefix/gotoEditPrefix`, { hiddenToken: id });
  }

  /**
   * Set active
   * @param ids
   * @returns
   */
  setActive(ids: []): Observable<any>  {
    return this.http.post(`${environment.serverUrl}master-data/prefix/changeActivePrefix`, { hiddenToken: ids.toString() });
  }

  /**
   * Set inactive
   * @param ids
   * @returns
   */
  setInactive(ids: []): Observable<any>  {
    return this.http.post(`${environment.serverUrl}master-data/prefix/changeInactivePrefix`, { hiddenToken: ids.toString() });
  }

  /**
   * Export
   * @param critetria
   * @returns
   */
  export(critetria: PrefixSearchCriteria): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/prefix/export`, critetria, { observe: 'response', responseType: 'arraybuffer' });
  }

  /**
   * Insert prefix
   * @param prefix
   * @returns
   */
  insertPrefix(prefix: Prefix): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/prefix/addPrefix`, prefix);
  }

  /**
   * Update prefix
   * @param prefix
   * @returns
  */
  updatePrefix(prefix: Prefix): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/prefix/editPrefix`, prefix);
  }
}
