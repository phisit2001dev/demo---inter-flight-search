import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/project/core/guards/auth.guard';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';
import { PrefixAddEditResolver } from './guards/prefix-add-edit.resolver';
import { PrefixResolver } from './guards/prefix.resolver';
import { PrefixAddComponent } from './pages/prefix-add/prefix-add.component';
import { PrefixEditComponent } from './pages/prefix-edit/prefix-edit.component';
import { PrefixSearchComponent } from './pages/prefix-search/prefix-search.component';

const rootPath = '/iapi/master-data/prefix';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: {init: PrefixResolver},
    component: PrefixSearchComponent,
    data: {
      paths: [`${rootPath}/add`, `${rootPath}/edit`],
    },
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    resolve: {init: PrefixAddEditResolver},
    component: PrefixAddComponent,
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    resolve: {init: PrefixAddEditResolver},
    component: PrefixEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrefixRoutingModule { }
