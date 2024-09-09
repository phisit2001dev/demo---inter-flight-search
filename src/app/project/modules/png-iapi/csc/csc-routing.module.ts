import { AuthGuard } from './../../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'travel-info',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./travel-information/travel-information.module').then(
        (m) => m.TravelInformationModule
      ),
  },
  {
    path: 'carrier-engagement',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./carrier-engagement/carrier-engagement.module').then(
        (m) => m.CarrierEngagementModule
      ),
  },
  {
    path: 'reset-password',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CscRoutingModule {}
