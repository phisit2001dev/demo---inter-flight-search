import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { map, Observable, take } from 'rxjs';
import { AirCarrierService } from '../service/air-carrier.service';

@Injectable({
  providedIn: 'root'
})
export class AirCarrirerAddEditResolver  extends AbstractCriteriaResolver implements Resolve<Observable<any>> {
  constructor(public router: Router,
    private service: AirCarrierService,
    private navService: MainNavService,
    private sessionStorageService: SessionStorageService){
      super(router,sessionStorageService)
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
    const hiddenToken = route.queryParamMap.get('hiddenToken');
    const page = route.queryParamMap.get('page');
    
    if (page === 'edit'){
      // edit
      return this.service.gotoEdit(hiddenToken).pipe(take(1),
        map((payload) => {
          if (payload?.error) {
            //ดัก null เพิ่ม
            this.router.navigate(['home']);    
          }
          else{
            this.navService.currentSys = payload.data.currentSys;
          }
          
          return {
            payload: payload.data,
            page:page
          };
        })
      );
    } else if(page === 'add') {
      return this.service.gotoAdd().pipe(take(1),
        map((payload) => {
          if (payload?.error) {
            this.router.navigate(['home']);
          }
          else{
            this.navService.currentSys = payload.data.currentSys;
          }
          return {
            payload: payload.data,
            page:page
          };
        })
      );
    }

  }
}
