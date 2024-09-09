import { MainNavService } from '@app/project/core/services/main-nav.service';
import { InitAirportService } from './../service/init-airport.service';
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


@Injectable({ providedIn: 'root' })
export class initAirportSearchResolverGuard
  extends AbstractCriteriaResolver
  implements Resolve<Observable<any>>
{
  constructor(
    public router: Router,
    private service: InitAirportService,
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

    return this.service.initHeaderSort().pipe(take(1),
      map((payload) => {
        if (payload) {
          if (!payload.error) {
            if (criteria) {
              payload.data.criteriaTemp = criteria;
              payload.data.hasCriteriaKey = true;
            }
          } else {
            this.router.navigate(['/ex/search']);
          }
        }

        this.navService.currentSys = route.data.currentSys;

        return {
          payload: payload.data,
          acToken: payload.actionToken,
          first: !criteria,
        };
      })
    );
  }
}
