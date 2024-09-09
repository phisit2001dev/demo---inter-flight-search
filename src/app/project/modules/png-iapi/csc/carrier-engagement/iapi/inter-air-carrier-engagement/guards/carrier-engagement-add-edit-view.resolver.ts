import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable, of, take, map,EMPTY  } from 'rxjs';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';
import { InterAirCarrierEngagementService } from '../service/inter-air-carrier-engagement.service';
import { SnackbarService } from '@app/project/core/services/snackbar.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { CommonResponse } from '@app/common/models/common-response';
import { MainNavService } from '@app/project/core/services/main-nav.service';

@Injectable({
  providedIn: 'root'
})
export class CarrierEngagementAddEditViewResolver extends AbstractCriteriaResolver implements Resolve<boolean> {
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private service: InterAirCarrierEngagementService,
    private snackBarService: SnackbarService,
    private sessionStorageService: SessionStorageService,
    private navService: MainNavService,
  ) {
    super(router, sessionStorageService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<any> | Promise<any> | any {
    const page = route.paramMap.get('page');
    const hiddenToken = route.paramMap.get('hiddenToken');

    switch (page) {
      case 'add':
        this.navService.currentSys = `${route.data.currentSys} > Add`;
        return this.getData(page, hiddenToken, 'gotoAdd');
      case 'edit':
        this.navService.currentSys = `${route.data.currentSys} > Edit`;
        return this.getData(page, hiddenToken, 'gotoEdit');
      case 'view':
        this.navService.currentSys = `${route.data.currentSys} > View`;
        return this.getData(page, hiddenToken, 'gotoView');
    }
  }

  private getData(page: string, id: string, funcName: string) {
    return this.service[`${funcName}`](id).pipe(
      take(1),
      map((value: CommonResponse) => {
        setTimeout(() => {}, 1000);
        if (!value.error) {
          return {
            initdata: value.data,
            page,
            hiddenToken: id,
            message: {
              messageCode: value.messageCode,
              messageDesc: value.messageDesc,
              messageStatus: value.displayStatus
            }
          };
        } else {
          this.snackBarService.open(value.messageDesc, value.displayStatus);
          this.router.navigate(['carrier-engagement/iapi/inter-air-engagement/search'], {
            relativeTo: this.route,
          });
          return EMPTY;
        }
      })
    );
  }
}
