import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@evn/environment';
import { Observable } from 'rxjs';
import { AirCarrierCriteria } from '../models/air-carrier-search-criteria';
import { AirCarrierCriteriaSearch } from '../models/air-carrier-search';
import { Carrier } from '../models/air-carrier';

@Injectable({
  providedIn: 'root'
})
export class AirCarrierService {


  constructor(private http:HttpClient) {

   }

   initSearchPage():Observable<any>{
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/initSearch`,{})
   }

   searchCountry(term:string):Observable<any>{
    return this.http.post(`${environment.serverUrl}selectitem/searchCountry`,{"term":term})
   }

   search(criteria:AirCarrierCriteria):Observable<any>{
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/search`,criteria)
   }

   export(criteria:AirCarrierCriteriaSearch):Observable<any>{
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/export`,criteria, { observe: 'response', responseType: 'arraybuffer' })
   }

   active(ids: []):Observable<any>{
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/changeActiveAirCarrier`,{ hiddenToken: ids.toString() })
   }

   inactive(ids: []):Observable<any>{
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/changeInactiveAirCarrier`,{ hiddenToken: ids.toString() })
   }

   gotoAdd():Observable<any>{
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/gotoAddAirCarrier`,null)
   }

   gotoEdit(hiddenToken: any): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/gotoEditAirCarrier`, {'hiddenToken': hiddenToken});
  }

  addAirCarrier(carrier:AirCarrierCriteria):Observable<any> {
    if(carrier.activeStatus == true){
      carrier.activeStatus = "Y"
    }
    else{
      carrier.activeStatus = "N"
    }
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/addAirCarrier`,carrier)
  }

  editAirCarrier(carrier:Carrier):Observable<any>{
    return this.http.post(`${environment.serverUrl}master-data/aircarrier/editAirCarrier`,carrier)
  }

}
