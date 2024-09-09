import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSearchComponent } from './pages/user-search/user-search.component';
import { UserResolver } from './guards/user.resolver';
import { AuthGuard } from '@app/project/core/guards/auth.guard';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';
import { UserAddEditViewResolver } from './guards/user-add-edit-view.resolver';
import { UserAddEditViewComponent } from './pages/user-add-edit-view/user-add-edit-view.component';
const rootPath = '/iapi/user-management/user';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: { init: UserResolver },
    component: UserSearchComponent,
    data: {
      paths: [`${rootPath}/add`, `${rootPath}/edit`, `${rootPath}/view`]
    }
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    resolve: { init: UserAddEditViewResolver },
    component: UserAddEditViewComponent
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    resolve: { init: UserAddEditViewResolver },
    component: UserAddEditViewComponent
  },
  {
    path: 'view',
    canActivate: [AuthGuard],
    resolve: { init: UserAddEditViewResolver },
    component: UserAddEditViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
