import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@evn/environment';
import { Observable } from 'rxjs';
import { InterFlightSearchExportRequest } from '../model/inter-flight-search-export-request';
import { InterFlightSearchCriteria } from '../model/inter-flight-search-criteria';

@Injectable({
    providedIn:'root'
})

export class InterFlightSearchService {
  constructor(private http:HttpClient){

  }

  initSearchPage():Observable<any>{
    return this.http.post(`${environment.serverUrl}csc/travellerinformation/flightsearch/initFlightSearch`, { });
  }

  carrierCodeAutocomplete(term:string):Observable<any>{
    return this.http.post(`${environment.serverUrl}selectitem/searchCarrierCode`,{'term':term})
  }

  flightAutocomplete(term:string,caarrierCode:string):Observable<any>{
    return this.http.post(`${environment.serverUrl}selectitem/searchFlightCarrier`,{'term':term,'carrier':caarrierCode})
  }

  departurePortAutocomplete(term: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}selectitem/searchAirportWorld`, {'term' : term} )
  }

  arrivalPortAutocomplete(term:string):Observable<any>{
    return this.http.post(`${environment.serverUrl}selectitem/searchAirportWorld`,{'term':term})
  }

  search(criteria: InterFlightSearchCriteria): Observable<any> {
    return this.http.post(`${environment.serverUrl}csc/travellerinformation/flightsearch/searchFlight`,criteria);
  }

  export(jsonReq: InterFlightSearchExportRequest): Observable<any> {
    return this.http.post(`${environment.serverUrl}csc/travellerinformation/flightsearch/export`,jsonReq, { observe: 'response', responseType: 'arraybuffer' });
  }
}