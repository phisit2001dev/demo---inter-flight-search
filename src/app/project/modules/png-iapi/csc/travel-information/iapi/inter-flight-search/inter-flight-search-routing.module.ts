import { InterFlightSearchResolverGuard } from './guard/inter-flight-search-resolver.guard';
import { CriteriaDeactivateGuard } from './../../../../../../core/guards/search-page-deactivate.guard';
import { AuthGuard } from './../../../../../../core/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterFlightSearchComponent } from './pages/inter-flight-search/inter-flight-search.component';

const routes: Routes = [
  {path:'',redirectTo:'search',pathMatch:'full'},
  {
    path:'search',
    canActivate:[AuthGuard],
    // canDeactivate:[CriteriaDeactivateGuard],
    resolve:{init:InterFlightSearchResolverGuard},
    component:InterFlightSearchComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterFlightSearchRoutingModule { }
