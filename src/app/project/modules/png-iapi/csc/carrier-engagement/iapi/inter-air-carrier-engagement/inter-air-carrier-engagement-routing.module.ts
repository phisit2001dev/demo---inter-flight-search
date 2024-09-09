import { AuthGuard } from './../../../../../../core/guards/auth.guard';
import { InterAirCarrierEngagementSearchComponent } from './pages/inter-air-carrier-engagement-search/inter-air-carrier-engagement-search.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterAirCarrierEngagementResolver } from './guards/inter-air-carrier-engagement.resolver';
import { CarrierEngagementAddEditViewResolver } from './guards/carrier-engagement-add-edit-view.resolver';
import { InterAirCarrierEngagementAddEditViewComponent } from './pages/inter-air-carrier-engagement-add-edit-view/inter-air-carrier-engagement-add-edit-view.component';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';

const systemName = 'Carrier Engagement System > Carrier Engagement ';
const rootPath = '/iapi/csc/carrier-engagement/iapi/inter-air-engagement';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: { init: InterAirCarrierEngagementResolver },
    component: InterAirCarrierEngagementSearchComponent,
    data: {
      paths: [`${rootPath}/add`, `${rootPath}/edit`, `${rootPath}/view`],
      currentSys: `${systemName} > Search`,
    },
  },
  {
    path: ':page',
    canActivate: [AuthGuard],
    resolve: { init: CarrierEngagementAddEditViewResolver },
    component: InterAirCarrierEngagementAddEditViewComponent,
    data: {
      currentSys: `${systemName}`,
    },
  },
  {
    path: ':page/:hiddenToken',
    canActivate: [AuthGuard],
    resolve: { init: CarrierEngagementAddEditViewResolver },
    component: InterAirCarrierEngagementAddEditViewComponent,
    data: {
      currentSys: `${systemName}`,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterAirCarrierEngagementRoutingModule { }
