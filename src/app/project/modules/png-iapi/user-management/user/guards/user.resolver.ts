import { Injectable } from '@angular/core';
import { Resolve, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';

@Injectable({
  providedIn: 'root'
})
export class UserResolver 
  extends AbstractCriteriaResolver
  implements Resolve<Observable<any>> {

    constructor(
      public router: Router,
      private service: UserService,
      private navService: MainNavService,
      protected sessionStorageService: SessionStorageService
    ) {
      super(router, sessionStorageService);
    }

    resolve(
      route: ActivatedRouteSnapshot, 
      state: RouterStateSnapshot
    ): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
      let criteria: any = this.getCriteria(this.router, route, state);
      const userName = route.queryParamMap.get('element'); // ดึงค่าจาก URL
      const code = route.queryParamMap.get('code')
      // const productId = route.params['id'];
      return this.service.initSearchPage().pipe(
        take(1),
        map((payload) => {
          if (payload && !payload.error) {
            if (criteria) {
              payload.data.criteriaTemp = criteria;
              payload.data.hasCriteriaKey = true;
            }
            if (userName) {//check  username 
              payload.data.criteriaTemp = {...payload.data.criteria} //สร้าง criteriaTemp
              payload.data.criteriaTemp.username = userName;
              payload.data.criteriaTemp.employeeCode = code;
              payload.data.hasCriteriaKey = true;
            }

            this.navService.currentSys = payload.data.currentSys;

            return {
              payload: payload.data,
              acToken: payload.actionToken,
              first: !criteria,
              userName: userName,
              // idid:productId
            };
          } else {
            this.router.navigate(['home']); // ไปที่หน้า Home
            return
          }
        })
      );
    }
}
