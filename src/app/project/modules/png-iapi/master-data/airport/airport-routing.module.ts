import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirportSearchComponent } from './pages/airport-search/airport-search.component';

const rootPath = '/iapi/master-data/port';
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    component: AirportSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AirportRoutingModule { }
