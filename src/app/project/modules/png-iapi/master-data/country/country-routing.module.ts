import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/project/core/guards/auth.guard';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';
import { CountryAddEditResolver } from './guards/country-add-edit.resolver';
import { CountryResolver } from './guards/country.resolver';
import { CountryAddComponent } from './pages/country-add/country-add.component';
import { CountryEditComponent } from './pages/country-edit/country-edit.component';
import { CountrySearchComponent } from './pages/country-search/country-search.component';

const rootPath = '/iapi/master-data/country';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: {init: CountryResolver},
    component: CountrySearchComponent,
    data: {
      paths: [`${rootPath}/add`, `${rootPath}/edit`],
    },
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    resolve: {init: CountryAddEditResolver},
    component: CountryAddComponent,
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    resolve: {init: CountryAddEditResolver},
    component: CountryEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CountryRoutingModule { }
