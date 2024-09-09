import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditLogSearchComponent } from './pages/audit-log-search/audit-log-search.component';
import { AuthGuard } from '@app/project/core/guards/auth.guard';
import { AuditLogSearchResolver } from './guards/audit-log-search.resolver';
import { CriteriaDeactivateGuard } from '@app/project/core/guards/search-page-deactivate.guard';
const rootPath = '/iapi/user-management/user';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [AuthGuard],
    canDeactivate: [CriteriaDeactivateGuard],
    resolve:{init:AuditLogSearchResolver},
    component: AuditLogSearchComponent,
    data: {
      paths: [`${rootPath}/search`]
    }
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditLogRoutingModule { }
