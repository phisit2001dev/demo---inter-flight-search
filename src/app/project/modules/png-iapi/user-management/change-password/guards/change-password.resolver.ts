import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { Observable, map, take } from 'rxjs';
import { ChangePasswordService } from '../services/change-password.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordResolver implements Resolve<boolean> {
  constructor(
    public router: Router,
    private navService: MainNavService,
    private service: ChangePasswordService,
  ) {  } 
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<any> | Promise<any> | any {
    const hiddenToken = route.queryParamMap.get('v')
    return this.service.initChangePwd(hiddenToken).pipe(
      take(1),
      map((payload) => {
        this.navService.currentSys = route.data.currentSys;
        
        if (payload.error) {
          this.router.navigate(['/user/pageNotFound']);
        }
        return {
          payload: payload.data,
          reNewKey: hiddenToken
        };
      })
    )
  }
}
