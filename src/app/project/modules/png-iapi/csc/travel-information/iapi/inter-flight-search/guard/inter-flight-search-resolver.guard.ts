import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { AbstractCriteriaResolver } from '@app/abstracts/abstract-criteria-resolver';
import { MainNavService } from '@app/project/core/services/main-nav.service';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';
import { map, Observable, take } from 'rxjs';
import { InterFlightSearchService } from '../service/inter-flight-search.service';

@Injectable({ providedIn: 'root' })
export class InterFlightSearchResolverGuard extends AbstractCriteriaResolver implements Resolve<Observable<any>> {

    constructor(
        public router: Router,
        private service: InterFlightSearchService,
        private navService: MainNavService,
        private sessionStorageService: SessionStorageService) {
        super(router, sessionStorageService);
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Observable<Observable<any>> | Promise<Observable<any>> {
        let criteria: any = this.getCriteria(this.router, route, state)//ตัวแปรเก็บค่าจาก getCriteria()
        return this.service.initSearchPage().pipe(
            take(1),
            map((payload) => {
                if (payload) {
                    if (!payload.error) {
                        if (criteria) {//เพิ่ม property criteriaTemp และ hasCriteriaKey
                            payload.data.criteriaTemp = criteria
                            payload.data.hasCriteriaKey = true;
                        }
                        this.navService.currentSys = payload.data.currentSys;
                    }
                    else {
                        this.router.navigate(['home']) //ให้ไปยังหน้า home
                    }
                }
                return {
                    payload: payload.data,
                };
            })
        );
    }
}