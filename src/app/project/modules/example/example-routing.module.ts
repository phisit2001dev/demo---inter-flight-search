import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/project/core/guards/auth.guard';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';
import { initAirportSearchResolverGuard } from './guard/pnrpush-monitoring-resolver.guard';
import { DemoPageAddAirportComponent } from './page/demo-page-add-airport/demo-page-add-airport.component';
import { DemoPageInitAirportComponent } from './page/demo-page-init-airport/demo-page-init-airport.component';
import { DemoPageValidateComponent } from './page/demo-page-validate/demo-page-validate.component';
import { TestComponentComponent } from './page/test-component/test-component.component';
import { AddViewAirportResolverGuard } from './guard/demo-airport-add-view-resolver.guard';

const rootPath = '/ex';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: { init: initAirportSearchResolverGuard },
    component: DemoPageInitAirportComponent,
    data: {
      paths: [rootPath],
      currentSys: "project > example > search",
    },
  },
  {
    path: ':page/:hiddenToken',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: { init: AddViewAirportResolverGuard },
    component: DemoPageAddAirportComponent,
    data: {
      paths: [rootPath],
      currentSys: "project > example > ",
    },
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: { init: AddViewAirportResolverGuard },
    component: DemoPageAddAirportComponent,
    data: {
      paths: [rootPath],
      currentSys: "project > example > ",
    },
  },
  {
    path: 'test',
    component: TestComponentComponent,
  },
  {
    path: 'validate',
    component: DemoPageValidateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleRoutingModule {}
