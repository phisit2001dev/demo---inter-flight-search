import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { map, Observable, of, take } from 'rxjs';
import { PrefixSearchCriteria } from '../models/prefix-criteria';
import { PrefixService } from '../services/prefix.service';

@Injectable({
  providedIn: 'root'
})
export class PrefixResolver
  extends AbstractCriteriaResolver
  implements Resolve<Observable<any>>
{
  constructor(
    public router: Router,
    private service: PrefixService,
    private navService: MainNavService,
    private sessionStorageService: SessionStorageService
  ) {
    super(router, sessionStorageService);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
    let criteria: PrefixSearchCriteria = this.getCriteria(
      this.router,
      route,
      state
    );

    /// Call API inital
    return this.service.init().pipe(take(1),
      map((payload) => {
        /// Have response
        if (payload) {
          /// Not error
          if (!payload.error) {
            /// Have criteria
            if (criteria) {
              payload.data.criteriaTemp = criteria;
              payload.data.hasCriteriaKey = true;
            }

            /// Set system header
            this.navService.currentSys = payload.data.currentSys;

          } else {
            this.router.navigate(['/home']); /// Goto home
          }
        }

        return {
          payload: payload.data,
          acToken: payload.actionToken,
          first: !criteria,
        };
      })
    );
  }
}
