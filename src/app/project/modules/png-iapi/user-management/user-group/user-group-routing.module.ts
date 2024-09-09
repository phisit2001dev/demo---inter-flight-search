import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/project/core/guards/auth.guard';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';
import { UserGroupSearchComponent } from './pages/user-group-search/user-group-search.component';
import { UserGroupResolver } from './guards/user-group.resolver';
import { UserGroupAddEditViewResolver } from './guards/user-group-add-edit-view.resolver';
import { UserGroupAddEditViewComponent } from './pages/user-group-add-edit-view/user-group-add-edit-view.component';
const rootPath = '/iapi/user-management/user-group';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve: { init: UserGroupResolver },
    component: UserGroupSearchComponent,
    data: {
      paths: [`${rootPath}/add`, `${rootPath}/edit`, `${rootPath}/view`]
    }
  },
  {
    path: 'add',
    canActivate: [AuthGuard],
    resolve: { init: UserGroupAddEditViewResolver },
    component: UserGroupAddEditViewComponent
  },
  {
    path: 'edit',
    canActivate: [AuthGuard],
    resolve: { init: UserGroupAddEditViewResolver },
    component: UserGroupAddEditViewComponent
  },
  {
    path: 'view',
    canActivate: [AuthGuard],
    resolve: { init: UserGroupAddEditViewResolver },
    component: UserGroupAddEditViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupRoutingModule { }
