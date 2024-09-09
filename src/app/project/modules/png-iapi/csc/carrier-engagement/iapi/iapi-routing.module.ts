import { AuthGuard } from './../../../../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'inter-air-engagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./inter-air-carrier-engagement/inter-air-carrier-engagement.module').then(
        (m) => m.InterAirCarrierEngagementModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IapiRoutingModule { }
