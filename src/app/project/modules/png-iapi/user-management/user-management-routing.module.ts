import { AuthGuard } from './../../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./user/user.module').then(
        (m) => m.UserModule
      ),
  },
  {
    path: 'user-group',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./user-group/user-group.module').then(
        (m) => m.UserGroupModule
      ),
  },
  {
    path: 'audit-log',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./audit-log/audit-log.module').then(
        (m) => m.AuditLogModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
