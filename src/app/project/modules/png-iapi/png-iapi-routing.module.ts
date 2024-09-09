import { AuthGuard } from './../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
      path: 'master-data',
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('./master-data/master-data.module').then(
          (m) => m.MasterDataModule
        ),
    },
    {
      path: 'user-management',
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('./user-management/user-management.module').then(
          (m) => m.UserManagementModule
        ),
    },
    {
      path: 'csc',
      canActivate: [AuthGuard],
      loadChildren: () =>
        import('./csc/csc.module').then(
          (m) => m.CscModule
        ),
    },
  ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PngIapiRoutingModule { }
