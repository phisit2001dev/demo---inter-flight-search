import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, take, map  } from 'rxjs';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { ResetPasswordService } from '../service/reset-password.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordResolver extends AbstractCriteriaResolver implements Resolve<boolean>  {
  constructor(
    public router: Router,
    private navService: MainNavService,
    private service: ResetPasswordService,
    private sessionStorageService: SessionStorageService
  ) {
      super(router, sessionStorageService);
  } 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<any> | Promise<any> | any {
    const criteria = this.getCriteria(this.router, route, state);
    return this.service.initResetPwd().pipe(
      take(1),
      map((payload) => {
        this.navService.currentSys = route.data.currentSys;
        
        if (payload.error) {
          this.router.navigate(['/home']);
        }
        return {
          payload: payload.data,
          first: !criteria,
        };
      })
    );
  }
}