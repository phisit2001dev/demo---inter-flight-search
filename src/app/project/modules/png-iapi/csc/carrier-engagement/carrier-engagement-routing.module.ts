import { AuthGuard } from './../../../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'iapi',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./iapi/iapi.module').then(
        (m) => m.IapiModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarrierEngagementRoutingModule { }
