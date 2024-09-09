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
import { CountryService } from '../services/country.service';

@Injectable({
  providedIn: 'root'
})
export class CountryAddEditResolver
  extends AbstractCriteriaResolver
  implements Resolve<Observable<any>>
{

  constructor(
    public router: Router,
    private service: CountryService,
    private navService: MainNavService,
    private sessionStorageService: SessionStorageService
  ) {
    super(router, sessionStorageService);
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
    const id = route.queryParamMap.get('hiddenToken');
    const page = route.queryParamMap.get('page');

    switch (page) {
      /// --------------------- Add --------------------------
      case 'add':
        return this.service.initAdd().pipe(take(1),
          map((payload) => {
            if (payload) {
              if (payload.error) {
                this.router.navigate(['/home']); /// Goto home
              }

              /// Set system header
              this.navService.currentSys = payload.data.currentSys;
            }

            return {
              payload: payload.data,
              acToken: payload.actionToken,
            };
          })
        );

      /// --------------------- Edit --------------------------
      case 'edit':
        return this.service.searchById(id).pipe(take(1),
          map((payload) => {
            if (payload) {
              if (payload.error) {
                this.router.navigate(['/home']); /// Goto home
              }

              /// Set system header
              this.navService.currentSys = payload.data.currentSys;
            }

            return {
              payload: payload.data,
              acToken: payload.actionToken,
            };
          })
        );

      default:
        this.router.navigate(['/home']);
        return;
    }
  }
}
