import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { InterAirCarrierEngagementService } from '../service/inter-air-carrier-engagement.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';
import { take, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterAirCarrierEngagementResolver  extends AbstractCriteriaResolver implements Resolve<boolean>  {
  constructor(
    public router: Router,
    private navService: MainNavService,
    private service: InterAirCarrierEngagementService,
    private sessionStorageService: SessionStorageService
  ) {
      super(router, sessionStorageService);
  } 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<any> | Promise<any> | any {
    const criteria = this.getCriteria(this.router, route, state);
    return this.service.initialSearch().pipe(
      take(1),
      map((payload) => {
        this.navService.currentSys = route.data.currentSys;
        
        if (payload) {
          if (!payload.error) {
            if (criteria) {
              payload.data.criteriaTemp = criteria;
              payload.data.hasCriteriaKey = true;
            }
          } else {
            this.router.navigate(['/home']);
          }
        }
        return {
          payload: payload.data,
          first: !criteria,
        };
      }
    )
  );
}
}