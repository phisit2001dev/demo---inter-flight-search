import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonResponse } from '@app/common/models/common-response';
import { InterAirCarrierEngagementCriteria } from '../model/inter-air-carrier-engagement-criteria';

@Injectable({
  providedIn: 'root'
})
export class InterAirCarrierEngagementService {

  constructor(private http: HttpClient) { }

  initialSearch() {
    return this.http.get<CommonResponse>('assets/mockjson/csc/carrier-engagement/initial.json');
  }

  searchPage(criteria: InterAirCarrierEngagementCriteria) {
    return this.http.get<CommonResponse>('assets/mockjson/csc/carrier-engagement/searchPage.json');
  }

  gotoAdd() {
    return this.http.get<CommonResponse>('assets/mockjson/csc/carrier-engagement/initialAdd.json');
  }

  gotoEdit() {
    return this.http.get<CommonResponse>('assets/mockjson/csc/carrier-engagement/initialEdit.json');
  }

  gotoView() {
    return this.http.get<CommonResponse>('assets/mockjson/csc/carrier-engagement/initialEdit.json');
  }

  mockCarrierCodeSelectItem() {
    return this.http.get<CommonResponse>('assets/mockjson/csc/carrier-engagement/carrierCodeAutoComplete.json');
  }
  
}
