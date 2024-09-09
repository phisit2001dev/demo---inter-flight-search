import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AirportRoutingModule } from './airport-routing.module';
import { AirportSearchComponent } from './pages/airport-search/airport-search.component';


@NgModule({
  declarations: [
    AirportSearchComponent
  ],
  imports: [
    CommonModule,
    AirportRoutingModule
  ]
})
export class AirportModule { }
