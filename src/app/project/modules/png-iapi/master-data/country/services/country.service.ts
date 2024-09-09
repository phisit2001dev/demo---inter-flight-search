import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@evn/environment';
import { Observable } from 'rxjs';
import { Country } from '../models/country';
import { CountrySearchCriteria } from '../models/country-criteria';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  carrierCodeAutoComplete(term: string): any {
    throw new Error('Method not implemented.');
  }
  flightAutoComplete(term: string, carrier: any): any {
    throw new Error('Method not implemented.');
  }
  depPortAutoComplete(term: string): any {
    throw new Error('Method not implemented.');
  }
  arrPortAutoComplete(term: string): any {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) { }

  /**
   * Continent name auto complete
   */
  continentNameAutoComplete(term: any): Observable<any> {
    return this.http.post(`${environment.serverUrl}selectitem/searchContinent`, { term: term });
  }

  /**
   * Init search
   */
  init(): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/country/initSearch`, null);
  }

  /**
   * Goto add
   */
  initAdd(): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/country/gotoAddCountry`, null);
  }

  /**
   * Search
   * @param critetria
   */
  search(critetria: CountrySearchCriteria): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/country/search`, critetria);
  }

  /**
   * Search by id
   */
  searchById(id: string): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/country/gotoEditCountry`, { hiddenToken: id  });
  }

  /**
   * Set active
   * @param ids
   * @returns
   */
  setActive(ids: []): Observable<any>  {
    return this.http.post(`${environment.serverUrl}master-data/country/changeActiveCountry`, { hiddenToken: ids.toString() });
  }

  /**
   * Set inactive
   * @param ids
   * @returns
   */
  setInactive(ids: []): Observable<any>  {
    return this.http.post(`${environment.serverUrl}master-data/country/changeInactiveCountry`, { hiddenToken: ids.toString() });
  }

  /**
   * Export
   * @param critetria
   * @returns
   */
  export(critetria: CountrySearchCriteria): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/country/export`, critetria, { observe: 'response', responseType: 'arraybuffer' });
  }

  /**
   * Insert country
   * @param country
   * @returns
   */
  insertCountry(country: Country): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/country/addCountry`, country);
  }

  /**
   * Update country
   * @param country
   * @returns
  */
 updateCountry(country: Country): Observable<any> {
    return this.http.post(`${environment.serverUrl}master-data/country/editCountry`, country);
  }
}
