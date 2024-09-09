import { AuthGuard } from './../../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'port',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./airport/airport.module').then(
        (m) => m.AirportModule
      ),
  },
  {
    path: 'airCarrier',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./air-carrier/air-carrier.module').then(
        (m) => m.AirCarrierModule
      ),
  },
  {
    path: 'country',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./country/country.module').then(
        (m) => m.CountryModule
      ),
  },
  {
    path: 'prefix',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./prefix/prefix.module').then(
        (m) => m.PrefixModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterDataRoutingModule { }
