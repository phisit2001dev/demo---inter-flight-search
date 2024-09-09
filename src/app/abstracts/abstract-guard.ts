// import { ActivatedRouteSnapshot } from '@angular/router';

// export abstract class AbstractGuard {
//   protected getCurrentPath(route: ActivatedRouteSnapshot): string[] {
//     if (route.url.length === 0) return [];

//     const paths: string[] = [];
//     const hasParent = route.parent.url.length > 0;

//     if (hasParent) {
//       paths.push(route.url[0].path);
//       const parentPaths = this.getCurrentPath(route.parent);
//       return [...parentPaths, ...paths];
//     } else return [route.url[0].path];
//   }
// }
