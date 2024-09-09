import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonResponse } from '@app/common/models/common-response';
import { Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InitAirportService {
  fixDelayForTest = 400;
  constructor(private http: HttpClient) {}


  initSearchPage(criteria?): Observable<any> {
    return this.http.get('assets/mockjson/example/init.json');
  }
  mockErrorJson(criteria?): Observable<any> {
    return this.http.get('assets/mockjson/validate-api/mock-resp-error-ele.json');
  }
  mocksuccessJson(criteria?): Observable<any> {
    return this.http.get('assets/mockjson/validate-api/mock-resp-compl-ele.json');
  }
  mockAutoJson(criteria?): Observable<any> {
    return this.http.get('assets/mockjson/mockTestAutoComplete.json');
  }
  mockSaveSuccess(criteria?): Observable<any> {
    return this.http.get('assets/mockjson/example/insertSuccess.json');
  }

  initAdd(): Observable<any> {
    return this.http.get('assets/mockjson/example/init.json');
  }

  searchById(id: string): Observable<any> {
    return this.http.get('assets/mockjson/example/searchAirportById.json');
  }
  mockRespErrorJson(criteria?): Observable<any> {
    return this.http.get('assets/mockjson/example/mock-resp-error-ele-demo.json');
  }
  // fixmocktg
  mock = {
    "depDateUTCFr": "01/06/2023",
    "depTimeUTCFr": "00:00",
    "depDateUTCTo": "28/06/2023",
    "depTimeUTCTo": "23:59",
    "depDateLTFr": null,
    "depTimeLTFr": "",
    "depDateLTTo": null,
    "depTimeLTTo": "",
    "depPort": null,
    "arrPort": null,
    "creDateLTFr": null,
    "creTimeLTFr": "",
    "creDateLTTo": null,
    "creTimeLTTo": "",
    "fltNo": null,
    "fltCode": null,
    "asmStatus": null,
    "linePerPage": 10,
    "checkMaxExceed": true,
    "pageIndex": 0,
    "headerSorts": [
      {
        "columnName": "2",
        "order": "ASC"
      }
    ]
  }

  searchPage(criteria?): Observable<any> {
    // return this.http.post<CommonResponse>(`${environment.serverUrl}api/datainterface/flightschedule/searchData`, {criteria: this.mock});
    return this.http.get<CommonResponse>(`assets/mockjson/example/searchAirport.json`).pipe(delay(this.fixDelayForTest));
  }

  headers = new HttpHeaders().set('Authorization', 'Basic dXNlcjoxMjM0NTY=').set('content-type', 'application/json');
  data = {
    "linePerPage": 1000,
    "pageIndex": 11,
    "checkMaxExceed": false
  }
  searchPageMockUser(criteria?): Observable<any> {
    return this.http.post<CommonResponse>(`http://localhost:8080/api/v1/user-management/usergroup/searchGroup`, this.data,{'headers': this.headers});
    // return this.http.post<CommonResponse>(`http://localhost:8080/api/v1/user-management/usergroup/searchGroup`, this.data);
  }


  initHeaderSort(criteria?){
    // D:\project\e-border\ui\e-border\src\assets\mockjson\headerSorts\init_HeaderSorts.json
    return this.http.get<CommonResponse>(`assets/mockjson/headerSorts/init_HeaderSorts.json`).pipe(delay(this.fixDelayForTest));

  }

  mockMaxExceed(criteria?){
    return this.http.get<CommonResponse>(`assets/mockjson/example/mockMaxExceed.json`).pipe(delay(this.fixDelayForTest));
  }
}
