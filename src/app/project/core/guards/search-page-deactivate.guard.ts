import { AbstractComponent } from '@app/abstracts/abstract-component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { AbstractSearchComponent } from '@app/abstracts/abstract-search-component';
import { SessionStorageService } from '../services/session-storage.service';

@Injectable({
  providedIn: 'root',
})
// export class CriteriaDeactivateGuard extends AbstractGuard implements CanDeactivate<AbstractSearchComponent> {

  export class CriteriaDeactivateGuard  implements CanDeactivate<AbstractSearchComponent> {
  constructor(private sessionStorageService: SessionStorageService){
    // super();
  }

  canDeactivate(
    component: AbstractSearchComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): boolean {

    // console.log(currentRoute);

    const paths: string[] = currentRoute.data['paths'];
    const correctPath = paths?.some((value) => {
      return nextState.url.startsWith(`${value}`);
    });

    // console.log(correctPath);
    if (component?.criteria && correctPath) {
      if (component?.isSearched) {
        this.sessionStorageService.setCriteriaByUrl(currentState.url, component?.criteria);
      }
    }

    return true;
  }
}
