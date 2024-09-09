import { AirCarrierResovlerGuard } from './guard/air-carrirer.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirCarrierSearchComponent } from './pages/air-carrier-search/air-carrier-search.component';
import { AuthGuard } from '@app/project/core/guards/auth.guard';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';
import { AirCarrirerAddEditResolver } from './guard/air-carrirer-add-edit.resolver';
import { AirCarrirerAddEditComponent } from './pages/air-carrirer-add-edit/air-carrirer-add-edit.component';

const rootPath = '/iapi/master-data/airCarrier';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate:[CriteriaDeactivateGuard],
    resolve:{init:AirCarrierResovlerGuard},
    component: AirCarrierSearchComponent,
    data: {
      paths: [`${rootPath}/add`, `${rootPath}/edit`],
    },
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    resolve:{init:AirCarrirerAddEditResolver},
    component:AirCarrirerAddEditComponent
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    resolve:{init:AirCarrirerAddEditResolver},
    component:AirCarrirerAddEditComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirCarrierRoutingModule { }
