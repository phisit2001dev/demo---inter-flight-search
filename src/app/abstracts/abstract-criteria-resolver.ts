import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SessionStorageService } from '@app/project/core/services/session-storage.service';

export abstract class AbstractCriteriaResolver {
  constructor(private abstRouter: Router, public absSessionStorageService: SessionStorageService) {}

  getCriteria(router: Router, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const related = router.getCurrentNavigation().extras.relativeTo;
    const criteria = !related ? null : this.absSessionStorageService.getCriteriaByUrl(state.url);
    // console.log(criteria);
    if (criteria) {
      const paths: string[] = route.data['paths'];
      const canRetrieve = paths.some((value) => {
        // console.log(`${this.router.url}.startsWith(${value})`);
        return this.abstRouter.url.startsWith(`${value}`);
      });
      // console.log(canRetrieve);

      if (canRetrieve) {
        this.absSessionStorageService.removeCriteriaByUrl(state.url);
        return JSON.parse(criteria);
      }
    }

    return undefined;
  }
}
