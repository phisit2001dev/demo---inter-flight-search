import { MainNavService } from '@app/project/core/services/main-nav.service';
import { UserGroupService } from '../services/user-group.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';

@Injectable({
  providedIn: 'root'
})
export class UserGroupResolver 
  extends AbstractCriteriaResolver
  implements Resolve<Observable<any>> {

  constructor(
    public router: Router,
    private service: UserGroupService,
    private navService: MainNavService,
    private sessionStorageService: SessionStorageService
  ) {
    super(router, sessionStorageService);
  }

  resolve(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
    let criteria: any = this.getCriteria(
      this.router,
      route,
      state
    );
      
    return this.service.initSearchPage().pipe(take(1),
      map((payload) => {
        if (payload) {
          if (!payload.error) {
            if (criteria) {
              payload.data.criteriaTemp = criteria;
              payload.data.hasCriteriaKey = true;
            }

            this.navService.currentSys = payload.data.currentSys;

          } else {
            this.router.navigate(['home']); /// Goto home
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
