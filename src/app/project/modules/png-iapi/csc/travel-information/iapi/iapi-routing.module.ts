import { AuthGuard } from './../../../../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'inter-flight',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./inter-flight-search/inter-flight-search.module').then(
        (m) => m.InterFlightSearchModule
      ),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IapiRoutingModule { }
