import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { map, Observable, take } from 'rxjs';
import { AirCarrierService } from '../service/air-carrier.service';


@Injectable({
  providedIn: 'root'
})
export class AirCarrierResovlerGuard extends AbstractCriteriaResolver
implements Resolve<Observable<any>> {

  constructor(
    public router: Router,
    private service:AirCarrierService,
    private navService: MainNavService,
    protected sessionStorageService: SessionStorageService
  ) {
    super(router, sessionStorageService);
  }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
    let criteria: any = this.getCriteria(this.router, route, state);

    return this.service.initSearchPage().pipe(
      take(1),
      map((payload) => {
          if (payload &&!payload.error){
            if (criteria) {
              payload.data.criteriaTemp = criteria;
              payload.data.hasCriteriaKey = true;
            }
            this.navService.currentSys = payload.data.currentSys;
          }
           else {
            this.router.navigate(['home']);
        }
        return {
          payload: payload.data,

        };
      })
    );
  }
}