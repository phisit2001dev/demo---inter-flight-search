import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AuditLogService } from '../services/audit-log.service';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';

@Injectable({
  providedIn: 'root'
})
export class AuditLogSearchResolver extends AbstractCriteriaResolver implements Resolve<Observable<any>> {
  constructor(private service: AuditLogService,
    public router: Router,
    private navService: MainNavService,
    protected sessionStorageService: SessionStorageService) {
    super(router, sessionStorageService)
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
    let criteria: any = this.getCriteria(this.router,route,state);
    return this.service.initSearch().pipe(take(1), map((payload) => {
      if (payload && !payload.error) {
        this.navService.currentSys = payload.data.currentSys;
        if (criteria) {
          payload.data.criteriaTemp = criteria;
          payload.data.hasCriteriaKey = true;
        }
        return { payload: payload.data }
      }
      else {
        this.router.navigate(['home']) //ให้ไปยังหน้า home
      }

    }
    )
    )
  }
}


